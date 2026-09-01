import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  function Footer(_props: QuartzComponentProps) {
    const year = new Date().getFullYear()
    const links = opts?.links ?? {}
    return (
      <footer>
        <p class="footer-credit" data-lang="en">
          Created by Kevin Xu using <a href="https://quartz.jzhao.xyz/">Quartz</a>, © {year}
        </p>
        <p class="footer-credit" data-lang="zh">
          由 Kevin Xu 使用 <a href="https://quartz.jzhao.xyz/">Quartz</a> 创建，© {year}
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor