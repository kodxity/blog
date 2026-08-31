import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"

const LanguageTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const data = fileData as QuartzPluginData & {
    languageTitles?: Record<string, string>
    primaryLanguage?: string
  }

  const titles = data.languageTitles ?? {}
  const primary = data.primaryLanguage ?? Object.keys(titles)[0] ?? "en"
  const title = titles[primary]
  if (!title) return null

  return (
    <h1
      class={`article-title ${displayClass ?? ""}`.trim()}
      data-lang-titles={JSON.stringify(titles)}
    >
      {title}
    </h1>
  )
}

export default (() => LanguageTitle) satisfies QuartzComponentConstructor
