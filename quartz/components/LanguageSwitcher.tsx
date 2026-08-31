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
  const ZHTITLES_URL = "static/languageTitles.json"

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

  /* ---------------------------------------------------------------- *
   * UI chrome localization. When the selected language is Chinese,
   * everything except the site title and the footer is translated.
   * ---------------------------------------------------------------- */

  const UI = {
    "Search": "搜索",
    "Search for something...": "搜索些什么",
    "Recent Notes": "最近的笔记",
    "Explorer": "探索",
    "Graph View": "关系图谱",
    "Home": "首页",
    "Dark mode": "暗色模式",
    "Light mode": "亮色模式",
  }

  // Per-note titles loaded from static/languageTitles.json
  let noteTitles = { bySlug: {}, byPath: {} }
  let titlesLoaded = false
  const titleFns = []

  function basePath() {
    const body = document.body
    const bp = body && body.getAttribute("data-basepath")
    return (bp && bp !== "/" ? bp : "").replace(/\\/$/, "")
  }

  function loadNoteTitles() {
    if (titlesLoaded) return
    titlesLoaded = true
    const url = (basePath() ? basePath() + "/" : "") + ZHTITLES_URL
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.bySlug) noteTitles = data
        for (const fn of titleFns) fn()
      })
      .catch(() => {})
  }

  function zhTitleForHref(href) {
    if (!href) return undefined
    const bp = basePath()
    let p = String(href)
    if (bp && p.indexOf(bp) === 0) p = p.slice(bp.length)
    p = p.split(String.fromCharCode(92)).join("/")
    while (p.startsWith("./")) p = p.slice(2)
    while (p.startsWith("/")) p = p.slice(1)
    if (p.slice(-3).toLowerCase() === ".md") p = p.slice(0, -3)
    if (p.slice(-6) === "/index") p = p.slice(0, -6)
    while (p.slice(-1) === "/") p = p.slice(0, -1)
    if (p === "" || p === "index") p = "index"

    const bySlug = noteTitles.bySlug || {}
    const byPath = noteTitles.byPath || {}
    if (bySlug[p]) {
      const t = titleForLanguage(bySlug[p], "zh")
      if (t) return t
    }
    if (byPath[p]) {
      const t = titleForLanguage(byPath[p], "zh")
      if (t) return t
    }
    const lower = Object.keys(bySlug).find((k) => k.toLowerCase() === p.toLowerCase())
    if (lower) {
      const t = titleForLanguage(bySlug[lower], "zh")
      if (t) return t
    }
    return undefined
  }

  // Swap exact visible text of an element from EN to ZH. The original English
  // value is remembered so switching back restores it exactly.
  function swapText(el, zhValue) {
    if (!el) return
    const current = el.getAttribute("data-ls-orig") ?? el.textContent
    if (zhValue !== undefined && zhValue !== el.textContent) {
      el.setAttribute("data-ls-orig", current)
      el.textContent = zhValue
    }
  }

  function swapAttribute(el, attr, zhValue) {
    if (!el) return
    const orig = el.getAttribute("data-ls-orig-" + attr) ?? el.getAttribute(attr)
    el.setAttribute("data-ls-orig-" + attr, orig)
    if (zhValue !== undefined && zhValue !== el.getAttribute(attr)) {
      el.setAttribute(attr, zhValue)
    }
  }

  function localizeNoteLinks() {
    const links = document.querySelectorAll(
      ".explorer a.nav-file-title, .recent-notes ul.recent-ul a.internal",
    )
    for (const a of links) {
      const zh = zhTitleForHref(a.getAttribute("href") || "")
      if (zh) swapText(a, zh)
    }
  }

  function localizeDates() {
    const times = document.querySelectorAll(
      "time, .content-meta time",
    )
    for (const t of times) {
      const dt = t.getAttribute("datetime")
      if (!dt) continue
      try {
        const zh = new Date(dt).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        swapText(t, zh)
      } catch {}
    }
  }

  function localizeReadTime() {
    const span = document.querySelector(".content-meta span:not([show-comma])")
    if (!span || span.closest("time")) return
    const orig = span.getAttribute("data-ls-orig") ?? span.textContent
    span.setAttribute("data-ls-orig", orig)
    const m = /^(\\d+)\\s*(min|minute)s?/.exec(orig)
    if (m) span.textContent = m[1] + "分钟阅读"
  }

  function localizeChrome() {
    const zh = familyOf("zh")
    // Search button (aria-label + svg <title>)
    const searchBtn = document.querySelector(".search-button")
    if (searchBtn) {
      swapAttribute(searchBtn, "aria-label", UI["Search"])
      const svgTitle = searchBtn.querySelector("svg title")
      if (svgTitle) swapText(svgTitle, UI["Search"])
    }
    // Search input placeholder
    const input = document.querySelector("input.search-bar")
    if (input) swapAttribute(input, "placeholder", UI["Search for something..."])
    // Section titles
    const headings = document.querySelectorAll("h3, h2")
    for (const h of headings) {
      const txt = h.textContent.trim()
      if (txt === "Recent Notes") swapText(h, UI["Recent Notes"])
      else if (txt === "Explorer" && h.closest(".explorer")) swapText(h, UI["Explorer"])
      else if (txt === "Graph View") swapText(h, UI["Graph View"])
    }
    // Dark mode / light mode aria labels
    for (const el of document.querySelectorAll("[aria-label], [title]")) {
      const al = el.getAttribute("aria-label")
      const ti = el.getAttribute("title")
      if (al === "Dark mode" || al === "Light mode") swapAttribute(el, "aria-label", UI[al])
      if (ti === "Dark mode" || ti === "Light mode") swapAttribute(el, "title", UI[ti])
    }
    // Breadcrumb "Home" root crumb
    document.querySelectorAll(".breadcrumb-container .breadcrumb-element a[href]").forEach((a) => {
      if (a.textContent.trim() === "Home") swapText(a, UI["Home"])
    })
    localizeReadTime()
    localizeDates()
    localizeNoteLinks()
  }

  // Undo chart of localization when returning to EN. We restore every touched
  // element from its remembered original value.
  function restoreChrome() {
    for (const el of document.querySelectorAll("[data-ls-orig]")) {
      el.textContent = el.getAttribute("data-ls-orig")
      el.removeAttribute("data-ls-orig")
    }
    for (const el of document.querySelectorAll("[data-ls-orig-aria-label]")) {
      el.setAttribute("aria-label", el.getAttribute("data-ls-orig-aria-label"))
      el.removeAttribute("data-ls-orig-aria-label")
    }
    for (const el of document.querySelectorAll("[data-ls-orig-title]")) {
      el.setAttribute("title", el.getAttribute("data-ls-orig-title"))
      el.removeAttribute("data-ls-orig-title")
    }
    for (const el of document.querySelectorAll("[data-ls-orig-placeholder]")) {
      el.setAttribute("placeholder", el.getAttribute("data-ls-orig-placeholder"))
      el.removeAttribute("data-ls-orig-placeholder")
    }
  }

  function applyChrome(lang) {
    if (familyOf(lang) === "zh") {
      if (!titlesLoaded) loadNoteTitles()
      localizeChrome()
    } else {
      restoreChrome()
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
    applyChrome(selected)
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

  // The Explorer tree and Recent Notes render client-side after the initial
  // render, so re-apply chrome title swaps when new nodes appear.
  const observer = new MutationObserver(() => {
    const selected = getButton()?.getAttribute("data-selected-lang")
    if (familyOf(selected) === "zh") {
      localizeNoteLinks()
      localizeDates()
    }
  })
  if (typeof MutationObserver !== "undefined") {
    observer.observe(document.body, { childList: true, subtree: true })
  }
  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => observer.disconnect())
  }
  titleFns.push(() => {
    if (familyOf(getButton()?.getAttribute("data-selected-lang")) === "zh") localizeNoteLinks()
  })

  setup()
  document.addEventListener("nav", setup)
  document.addEventListener("render", setup)
})()
`

export default (() => LanguageSwitcher) satisfies QuartzComponentConstructor
