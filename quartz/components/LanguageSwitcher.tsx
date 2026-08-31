import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"

const STORAGE_KEY = "quartz-language"
const NOTICE_CLASS = "language-notice"
const NOTICE_MESSAGE = "Not available in this language."

function languageLabel(lang: string): string {
  return lang.toLowerCase().startsWith("zh") ? "中文" : "EN"
}

const LanguageSwitcher: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const data = fileData as QuartzPluginData & {
    availableLanguages?: string[]
    primaryLanguage?: string
  }

  const available = data.availableLanguages ?? []
  const explicitPrimary = data.primaryLanguage
  const frontmatterLang = data.frontmatter?.lang ?? data.frontmatter?.language
  const fallback =
    typeof frontmatterLang === "string" && frontmatterLang.trim() !== ""
      ? frontmatterLang.trim().toLowerCase()
      : "en"
  const primary = (
    (explicitPrimary && available.includes(explicitPrimary) ? explicitPrimary : undefined) ??
    (available.includes(fallback) ? fallback : undefined) ??
    available[0] ??
    fallback
  ).toLowerCase()

  return (
    <button
      type="button"
      class={`language-switcher-button ${displayClass ?? ""}`}
      data-available-langs={available.join(",")}
      data-primary-lang={primary}
      data-selected-lang={primary}
      title="Switch language"
      aria-label="Switch language"
    >
      {languageLabel(primary)}
    </button>
  )
}

LanguageSwitcher.css = `
.language-switcher-button {
  border: 1px solid var(--lightgray);
  background: var(--highlight);
  color: var(--darkgray);
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.4;
  padding: 0.3rem;
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  width: 2.5rem;
  text-align: center;
  
  transition: color 0.15s ease, border-color 0.15s ease;

  
}

button.language-switcher-button:hover {
  color: var(--secondary);
  border-color: var(--secondary);
}

/* Without JS the first (primary) language section is shown. */
div[data-lang].lang-section {
  display: none;
}
div[data-lang].lang-section:first-child {
  display: block;
}

/* With JS active, visibility is driven by .lang-section-active. */
html.language-init div[data-lang].lang-section {
  display: none;
}
html.language-init div[data-lang].lang-section.lang-section-active {
  display: block;
}

/* Single title: the language-aware page title in the header is the one and
   only title, so hide the duplicate heading inside each language section. */
body:has(h1.article-title[data-lang-titles]) div[data-lang].lang-section > h1 {
  display: none;
}

div.language-notice {
  margin: 0 0 1rem 0;
  padding: 0.5rem 0.75rem;
  border: 1px dashed var(--lightgray);
  border-radius: 2px;
  background: var(--highlight);
  color: var(--black);
  font-size: 0.85rem;
}
`

LanguageSwitcher.afterDOMLoaded = `
(() => {
  const STORAGE_KEY = ${JSON.stringify(STORAGE_KEY)}
  const NOTICE_CLASS = ${JSON.stringify(NOTICE_CLASS)}
  const NOTICE_MESSAGE = ${JSON.stringify(NOTICE_MESSAGE)}
  const SECTION_SELECTOR = "div[data-lang].lang-section"

  const familyOf = (lang) => (lang && String(lang).toLowerCase().startsWith("zh") ? "zh" : "en")
  const labelFor = (lang) => (familyOf(lang) === "zh" ? "中文" : "EN")
  const targetLangFor = (current) => (familyOf(current) === "zh" ? "en" : "zh")

  function getButton() {
    return document.querySelector("button.language-switcher-button")
  }

  function getArticle() {
    return document.querySelector("article.popover-hint .markdown-preview-view")
  }

  function getSections() {
    const article = getArticle()
    const container = article || document
    return Array.from(container.querySelectorAll(SECTION_SELECTOR))
  }

  function showNotice(article) {
    if (!article) return
    let notice = article.querySelector("." + NOTICE_CLASS)
    if (!notice) {
      notice = document.createElement("div")
      notice.className = NOTICE_CLASS
      notice.textContent = NOTICE_MESSAGE
      article.prepend(notice)
    }
  }

  function clearNotice(article) {
    article?.querySelector("." + NOTICE_CLASS)?.remove()
  }

  function readTitles(attr) {
    try {
      return JSON.parse(attr || "") || {}
    } catch {
      return {}
    }
  }

  function titleForLanguage(titles, lang) {
    const wanted = familyOf(lang)
    for (const code of Object.keys(titles)) {
      if (familyOf(code) === wanted) return titles[code]
    }
    return undefined
  }

  function applyTitle(lang) {
    const heading = document.querySelector("h1.article-title[data-lang-titles]")
    if (!heading) return
    const title = titleForLanguage(readTitles(heading.getAttribute("data-lang-titles")), lang)
    if (title === undefined || title === heading.textContent) return

    heading.textContent = title
    if (document.title) document.title = title
    const crumbLinks = document.querySelectorAll(
      ".breadcrumb-container .breadcrumb-element:last-child a[href]",
    )
    if (crumbLinks.length > 0) {
      crumbLinks[crumbLinks.length - 1].textContent = title
    }
  }

  function applyLanguage(lang, { persist = false } = {}) {
    const button = getButton()
    if (!button) return
    const selected = familyOf(lang)
    const available = (button.getAttribute("data-available-langs") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const primary = familyOf(button.getAttribute("data-primary-lang") || available[0] || "en")

    // The selected language is what the button shows and what gets persisted,
    // even when this note does not provide that language.
    const hasSelected = available.some((a) => familyOf(a) === selected)
    const display = hasSelected ? selected : primary

    const article = getArticle()
    if (hasSelected) {
      clearNotice(article)
    } else {
      showNotice(article)
    }

    for (const section of getSections()) {
      section.classList.toggle(
        "lang-section-active",
        familyOf(section.getAttribute("data-lang")) === display,
      )
    }

    button.textContent = labelFor(selected)
    button.setAttribute("data-selected-lang", selected)
    document.documentElement.setAttribute("data-lang", selected)
    applyTitle(selected)
    if (persist) {
      localStorage.setItem(STORAGE_KEY, selected)
    }
  }

  let boundButton = null
  let boundHandler = null

  function setup() {
    document.documentElement.classList.add("language-init")

    const button = getButton()
    if (button && button !== boundButton) {
      if (boundButton && boundHandler) {
        boundButton.removeEventListener("click", boundHandler)
      }
      boundHandler = () => {
        const current =
          button.getAttribute("data-selected-lang") ||
          familyOf(button.getAttribute("data-primary-lang")) ||
          "en"
        applyLanguage(targetLangFor(current), { persist: true })
      }
      boundButton = button
      button.addEventListener("click", boundHandler)
      if (typeof window.addCleanup === "function") {
        window.addCleanup(() => button.removeEventListener("click", boundHandler))
      }
    }

    const pref = localStorage.getItem(STORAGE_KEY)
    applyLanguage(pref || (getButton()?.getAttribute("data-primary-lang") || "en"))
  }

  setup()
  document.addEventListener("nav", setup)
  document.addEventListener("render", setup)
})()
`

export default (() => LanguageSwitcher) satisfies QuartzComponentConstructor
