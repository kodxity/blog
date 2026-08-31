import { PluggableList } from "unified"
import { Root, RootContent, ElementContent, Element } from "hast"
import { VFile } from "vfile"
import { QuartzTransformerPlugin } from "../types"

/**
 * In-file language separator, e.g.:
 *
 *   <!--LANG:zh-->
 *
 * A single content file can hold multiple language sections. The part before
 * the first marker is the primary-language section; each marker starts a new
 * section for the given language. All sections are wrapped in
 * `<div data-lang="..." class="lang-section">` containers so a single note
 * remains one page (one graph node, one recent notes entry, one comment
 * thread) while the reader can switch languages.
 */
const LANG_MARKER = /^[\t ]*<!--\s*LANG:\s*([A-Za-z]{2}(?:-[A-Za-z0-9]+)?)\s*-->[\t ]*$/

function sectionLang(node: RootContent): string | undefined {
  const raw = node as RootContent & { type?: string; value?: unknown }
  if (raw.type !== "raw") return undefined
  const value = typeof raw.value === "string" ? raw.value : ""
  const match = LANG_MARKER.exec(value.trim())
  return match ? match[1].toLowerCase() : undefined
}

function frontmatterLanguage(file: VFile): string | undefined {
  const fm = file.data.frontmatter as Record<string, unknown> | undefined
  const fromData = fm?.lang ?? fm?.language
  if (typeof fromData === "string" && fromData.trim() !== "") return fromData.trim().toLowerCase()

  const raw = typeof file.value === "string" ? file.value : file.toString()
  const block = /^---\r?\n([\s\S]*?)^---[ \t]*\r?\n?/m.exec(raw)
  if (!block) return undefined
  const keyMatch = /^(?:lang|language):\s*(?:"([^"]+)"|'([^']+)'|([^#\r\n]+?))\s*$/m.exec(block[1])
  const parsed = keyMatch?.[1] ?? keyMatch?.[2] ?? keyMatch?.[3]
  return parsed?.trim().toLowerCase()
}

function langSection(lang: string, children: RootContent[]): RootContent {
  return {
    type: "element",
    tagName: "div",
    properties: { "data-lang": lang, class: ["lang-section"] },
    children: children as ElementContent[],
  }
}

interface Section {
  lang: string
  children: RootContent[]
}

function elementText(node: Element): string {
  let out = ""
  const walk = (n: ElementContent) => {
    if (n.type === "text") {
      if (typeof (n as { value: unknown }).value === "string") {
        out += (n as { value: string }).value
      }
    } else if (n.type === "element") {
      for (const c of (n as Element).children ?? []) walk(c)
    }
  }
  for (const c of node.children ?? []) walk(c)
  return out.trim()
}

function sectionHeadingTitle(children: RootContent[]): string | undefined {
  for (const child of children) {
    if (child.type !== "element") continue
    const tag = (child as Element).tagName
    if (/^h[1-6]$/.test(tag)) {
      const text = elementText(child as Element)
      if (text !== "") return text
    }
  }
  return undefined
}

export const Languages: QuartzTransformerPlugin = () => {
  return {
    name: "Languages",
    htmlPlugins(): PluggableList {
      return [
        () => {
          return (tree: Root, file: VFile) => {
            // Content before the first marker belongs to the primary language
            // (frontmatter `lang`/`language`, defaulting to "en").
            const prelude: RootContent[] = []
            const sections: Section[] = []

            let currentLang: string | undefined
            let current: RootContent[] = []

            const flush = () => {
              if (currentLang && current.length > 0) {
                sections.push({ lang: currentLang, children: current })
              }
              current = []
            }

            for (const child of tree.children) {
              const lang = sectionLang(child)
              if (lang) {
                flush()
                currentLang = lang
                continue
              }
              if (currentLang) {
                current.push(child)
              } else {
                prelude.push(child)
              }
            }
            flush()

            const fmLang = frontmatterLanguage(file)
            const preludeLang = fmLang ?? "en"
            const preludeSection: Section[] =
              prelude.length > 0 ? [{ lang: preludeLang, children: prelude }] : []
            const allSections = [...preludeSection, ...sections]

            const primaryLanguage = allSections[0]?.lang ?? preludeLang

            if (allSections.length === 0) {
              tree.children = [langSection(primaryLanguage, [])]
            } else {
              tree.children = allSections.map((s) => langSection(s.lang, s.children))
            }

            const seen = new Set<string>()
            const availableLanguages: string[] = []
            for (const s of allSections) {
              if (!seen.has(s.lang)) {
                seen.add(s.lang)
                availableLanguages.push(s.lang)
              }
            }

            file.data.availableLanguages = availableLanguages
            file.data.primaryLanguage = primaryLanguage

            // Per-language page titles. Derived from each section's first
            // heading, overridable via `title-<lang>` frontmatter; the
            // primary language falls back to the plain `title` field.
            const frontmatterData = file.data.frontmatter as Record<string, unknown> | undefined
            const languageTitles: Record<string, string> = {}
            for (const s of allSections) {
              const derived = sectionHeadingTitle(s.children)
              if (derived) languageTitles[s.lang] = derived
            }
            if (typeof frontmatterData?.title === "string" && frontmatterData.title !== "") {
              languageTitles[primaryLanguage] ??= frontmatterData.title
            }
            for (const [key, value] of Object.entries(frontmatterData ?? {})) {
              if (typeof value !== "string") continue
              const match = /^title-(.+)$/i.exec(key)
              if (match) {
                const code = match[1].toLowerCase()
                if (code !== "") languageTitles[code] = value
              }
            }
            file.data.languageTitles = languageTitles
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    availableLanguages: string[]
    primaryLanguage: string
    languageTitles: Record<string, string>
  }
}
