import test, { describe } from "node:test"
import assert from "node:assert"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { VFile } from "vfile"
import { Root, Element } from "hast"
import { render } from "preact-render-to-string"
import { Languages } from "../plugins/transformers/languages"
import LanguageSwitcherFactory from "./LanguageSwitcher"
import { QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

async function splitLanguages(
  input: string,
  frontmatter?: Record<string, unknown>,
): Promise<{ tree: Root; data: VFile["data"] }> {
  const instance = Languages()
  const htmlPlugins = (instance.htmlPlugins?.({} as never) ?? []) as unknown as Function[]
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(htmlPlugins[0] as never)
  const file = new VFile(input)
  if (frontmatter) (file.data as Record<string, unknown>).frontmatter = frontmatter
  const md = processor.parse(file)
  const tree = await processor.run(md, file)
  return { tree, data: file.data }
}

function sectionElements(tree: Root): Element[] {
  return tree.children.filter((n): n is Element => n.type === "element" && n.tagName === "div")
}

function sectionLang(el: Element): string {
  return (el.properties?.["data-lang"] as string) ?? ""
}

function sectionText(el: Element): string {
  const text: string[] = []
  const walk = (nodes: unknown[]) => {
    for (const n of nodes) {
      const node = n as { type?: string; value?: unknown; children?: unknown[] }
      if (node.type === "text") {
        if (typeof node.value === "string") text.push(node.value)
      } else if (node.children) {
        walk(node.children)
      }
    }
  }
  walk(el.children as unknown[])
  return text.join("")
}

describe("Languages transformer", () => {
  test("splits a bilingual note into data-lang sections", async () => {
    const input = `# Hello\n\nEnglish body.\n\n<!--LANG:zh-->\n\n# 你好\n\n中文正文。`
    const { tree, data } = await splitLanguages(input, { lang: "en" })
    const sections = sectionElements(tree)

    assert.deepEqual(sections.map(sectionLang), ["en", "zh"])
    assert.match(sectionText(sections[0]!), /Hello/)
    assert.match(sectionText(sections[0]!), /English body/)
    assert.match(sectionText(sections[1]!), /你好/)
    assert.match(sectionText(sections[1]!), /中文正文/)
    assert.deepEqual(data.availableLanguages, ["en", "zh"])
    assert.equal(data.primaryLanguage, "en")
  })

  test("wraps a single-language note in one section", async () => {
    const { tree, data } = await splitLanguages(`# Only English\n\nSome text.`, { lang: "en" })

    assert.deepEqual(sectionElements(tree).map(sectionLang), ["en"])
    assert.deepEqual(data.availableLanguages, ["en"])
    assert.equal(data.primaryLanguage, "en")
  })

  test("labels the unmarked primary section with the frontmatter language", async () => {
    const input = `# 主语言\n\n第一段。\n\n<!--LANG:en-->\n\n# English\n\nBody.`
    const { tree, data } = await splitLanguages(input, { lang: "zh" })

    assert.deepEqual(sectionElements(tree).map(sectionLang), ["zh", "en"])
    assert.equal(data.primaryLanguage, "zh")
    assert.deepEqual(data.availableLanguages, ["zh", "en"])
  })

  test("falls back to parsing lang from the raw frontmatter block", async () => {
    const input = `---\ntitle: T\nlang: "zh"\n---\n\n# 标题\n\n正文。`
    const { tree, data } = await splitLanguages(input)

    assert.deepEqual(sectionElements(tree).map(sectionLang), ["zh"])
    assert.equal(data.primaryLanguage, "zh")
  })

  test("derives per-language titles from section headings and title-<lang> frontmatter", async () => {
    const input = `# Hello\n\nBody.\n\n<!--LANG:zh-->\n\n# 你好\n\n正文。`
    const { data } = await splitLanguages(input, { lang: "en", "title-zh": "双语标题" })

    assert.deepEqual(data.languageTitles, { en: "Hello", zh: "双语标题" })
  })

  test("falls back to the frontmatter title when the primary section has no heading", async () => {
    const input = `Just a paragraph.\n\n<!--LANG:zh-->\n\n正文。`
    const { data } = await splitLanguages(input, { title: "Primary Title", lang: "en" })

    assert.deepEqual(data.languageTitles, { en: "Primary Title" })
  })
})

const cfg = { locale: "en-US" } as GlobalConfiguration
const Switcher = LanguageSwitcherFactory()

function renderSwitcher(fileData: QuartzComponentProps["fileData"]): string {
  const props = { fileData, cfg } as unknown as QuartzComponentProps
  return render(Switcher(props))
}

function fileDataWith(
  availableLanguages: string[],
  primaryLanguage: string,
): QuartzComponentProps["fileData"] {
  return {
    frontmatter: { title: "Note", lang: primaryLanguage },
    availableLanguages,
    primaryLanguage,
  } as unknown as QuartzComponentProps["fileData"]
}

describe("LanguageSwitcher", () => {
  test("renders a rectangular button showing the current language", () => {
    const html = renderSwitcher(fileDataWith(["en", "zh"], "en"))

    assert.match(html, /<button/)
    assert.doesNotMatch(html, /<a\b/)
    assert.match(html, /language-switcher-button/)
    assert.match(html, /data-available-langs="en,zh"/)
    assert.match(html, /data-primary-lang="en"/)
    assert.match(html, />EN<\/button>/)

    assert.ok(
      Switcher.css?.includes("border-radius: 2px"),
      "button should be rectangular, not pill-shaped",
    )
  })

  test("shows 中文 when the primary language is Chinese", () => {
    const html = renderSwitcher(fileDataWith(["zh", "en"], "zh"))
    assert.match(html, />中文<\/button>/)
    assert.match(html, /data-primary-lang="zh"/)
  })

  test("defaults to en for notes without language metadata", () => {
    const html = renderSwitcher({ frontmatter: { title: "Lonely" } } as never)
    assert.match(html, />EN<\/button>/)
  })

  test("includes the note-level not-available styles", () => {
    const script = String(Switcher.afterDOMLoaded ?? "")
    assert.ok(Switcher.css?.includes("language-notice"), "notice styles must exist")
    assert.match(script, /Not available in this language/)
    assert.match(script, /quartz-language/)
  })

  test("includes UI chrome localization for Chinese", () => {
    const script = String(Switcher.afterDOMLoaded ?? "")
    assert.match(script, /Recent Notes/)
    assert.match(script, /Graph View/)
    assert.match(script, /Explorer/)
    assert.match(script, /Search for something\.\.\./)
    assert.match(script, /最近的笔记/)
    assert.match(script, /关系图谱/)
    assert.match(script, /探索/)
    assert.match(script, /分钟阅读/)
    assert.match(script, /static\/languageTitles\.json/)
  })
})
