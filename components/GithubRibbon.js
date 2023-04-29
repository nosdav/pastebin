import { html } from '../js/spux.js'

export default function GithubRibbon ({ repo }) {
  return html`
    <a
      href="${repo}"
      class="github-fork"
      style="position: fixed; top: 0; right: 0; z-index: 1000;"
    >
      <img
        decoding="async"
        loading="lazy"
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_white_ffffff.png?resize=149%2C149"
        class="attachment-full size-full"
        alt="Fork me on GitHub"
        data-recalc-dims="1"
      />
    </a>
  `
}
