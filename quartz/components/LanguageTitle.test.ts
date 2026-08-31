import test, { describe } from "node:test"
import assert from "node:assert"
import { render } from "preact-render-to-string"
import LanguageTitleFactory from "./LanguageTitle"
import { QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

const cfg = { locale: "en-US" } as GlobalConfiguration
const Title = LanguageTitleFactory()

function renderTitle(fileData: QuartzComponentProps["fileData"]): string {
  return render(Title({ fileData, cfg } as unknown as QuartzComponentProps))
}

describe("LanguageTitle", () => {
  test("renders an article-title h1 carrying per-language titles", () => {
    const html = renderTitle({
      frontmatter: { title: "Note", lang: "en" },
      availableLanguages: ["en", "zh"],
      primaryLanguage: "en",
      languageTitles: { en: "Note", zh: "笔记" },
    } as never)

    assert.match(html, /<h1 class="article-title"/)
    assert.match(html, />Note<\/h1>/)
    assert.match(html, /data-lang-titles="/)

    const encoded = html.match(/data-lang-titles="([^"]*)"/)?.[1] ?? ""
    const decoded = encoded
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
    assert.deepEqual(JSON.parse(decoded), { en: "Note", zh: "笔记" })
  })

  test("returns null when there is no title", () => {
    const html = renderTitle({ frontmatter: {} } as never)

    assert.equal(html, "")
  })
})
