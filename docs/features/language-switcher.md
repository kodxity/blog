---
title: Language Switcher
---

Universal **EN ↔ 中文** button in the left toolbar of every page. It replaces
the reader-mode button slot: click it to switch the current note between
English and Chinese.

## Behavior

- Button next to the dark mode toggle.
- The button shows the language you have currently **selected**, and that selection is
  persistent across pages (`localStorage`):
  - When English is selected it reads **EN**.
  - When Chinese is selected it reads **中文**.
- Clicking the button switches the note to the other language. Sections of the
  same note are shown/hidden in place — nothing navigates, so the URL, graph
  node, recent-notes entry, and comment thread all stay the same.
- The selection is persistent: it survives page changes. If the note is not available
  in the selected language, the note will display **"Not available in this language."**
  at the top, and the content stays in its original/fallback language.
  - `lang` denotes the default/fallback language.
- There is exactly **one title** per page, and it is always in the currently
  selected language. The header title swaps together with the body sections.

## Whole-interface localization

When Chinese is selected, the whole interface switches to Chinese:
- The search button, its placeholder, and labels
- Section titles: **Graph View → 关系图谱**, **Recent Notes → 最近的笔记**,
  **Explorer → 探索**
- The **note titles** in the Explorer tree and the Recent Notes list (using each
  note's `title-zh`)
- The breadcrumb root (**Home → 首页**)
- The reading time (**1 min read → 1分钟阅读**) and dates (Chinese format)
- The dark/light mode accessibility labels

Two things intentionally stay in English: the site title (`kodxity/blog`) and
the footer. Notes with no Chinese content keep their English title in the
sidebar, consistent with the "Not available in this language." behavior.

## How a bilingual note is structured

A marker line starts each additional language section:

```markdown
---
title: "Getting Started"
title-zh: "快速上手"
lang: en
---

English content lives here.

<!--LANG:zh-->

中文内容写在这里。
```

- The marker must be on its own line: `<!--LANG:zh-->`.
- Only the first (unmarked) section needs frontmatter, the two languages are
  one note, one page.

### Per-language title

The page title follows the selected language. An explicit title frontmatter overrides: e.g. `title-zh: "快速上手"`.

## Message when a language is missing

Selecting a language that is not in the file displays the inline notice (**"Not available in this language."**)
at the top of the note, while the language button continues to show what you selected.

## Implementation

- `quartz/plugins/transformers/languages.ts`: built-in transformer that splits
  the file at `<!--LANG:...-->` markers into `<div data-lang="..." class="lang-section">`
  sections and records `availableLanguages` / `primaryLanguage` and the
  per-language `languageTitles` on the file.
- `quartz/components/LanguageSwitcher.tsx`: the component button showing the selected
  language, styles, and the script that toggles sections, persists the preference,
  swaps the page title, and shows the "Not available in this language." message.
- `quartz/components/LanguageTitle.tsx`: replaces the stock `article-title`
  plugin (disabled in `quartz.config.yaml`). Renders the single page title with
  per-language titles in a `data-lang-titles` attribute so the switcher script
  can swap it.
- `quartz/plugins/loader/config-loader.ts`: registers the components and
  injects them into the layout: the switcher into the left toolbar
  (priority 35, group `toolbar`), replacing the reader-mode plugin, and the
  title into `beforeBody` (priority 10), replacing the article-title plugin.
- `quartz/plugins/emitters/languageTitles.ts`: emits `static/languageTitles.json`,
  an aggregate of every note's per-language `languageTitles` keyed by slug, so
  the switcher script can translate note titles in the sidebars.
- `quartz/components/LanguageSwitcher.test.ts` and
  `quartz/components/LanguageTitle.test.ts`: unit tests for the transformer
  and the component rendering.

To change the button behavior or styling, edit `LanguageSwitcher.tsx`. The
button markup uses the `.language-switcher-button` class, the language sections
use `.lang-section`, and the note-level message uses `.language-notice`.
