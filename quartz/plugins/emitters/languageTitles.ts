import { FilePath, FullSlug, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { QuartzPluginData } from "../vfile"
import fs from "fs"
import path from "path"

interface FileData extends QuartzPluginData {
  languageTitles?: Record<string, string>
}

/**
 * Aggregates the per-language page titles computed by the Languages
 * transformer into a single `static/languageTitles.json` file, keyed by
 * slug. The Language Switcher client script reads this map so that note
 * titles in the left sidebar (Explorer tree, Recent Notes) and other chrome
 * can switch language together with the page.
 */
export const LanguageTitles: QuartzEmitterPlugin = () => {
  return {
    name: "LanguageTitles",
    async *emit({ argv }, content) {
      const bySlug: Record<string, Record<string, string>> = {}
      const byPath: Record<string, Record<string, string>> = {}

      for (const [, file] of content) {
        const data = file.data as unknown as FileData
        const titles = data.languageTitles ?? {}
        if (Object.keys(titles).length === 0) continue

        const slug = data.slug as FullSlug | undefined
        if (slug) bySlug[slug] = titles

        const relativePath = data.relativePath
        if (relativePath) {
          const key = relativePath.replace(/\\/g, "/").replace(/\.md$/i, "")
          byPath[key] = titles
        }
      }

      const out = joinSegments(argv.output, "static", "languageTitles.json") as FilePath
      await fs.promises.mkdir(path.dirname(out), { recursive: true })
      await fs.promises.writeFile(out, JSON.stringify({ bySlug, byPath }))
      yield out
    },
    async *partialEmit() {},
  }
}
