// app.js
import { html, Component, render } from './js/spux.js'
import { getPath, getQueryStringValue, loadFile, saveFile } from './util.js'
import './js/dior.js'

export class App extends Component {
  constructor() {
    super()
    const serverUrl = getQueryStringValue('storage') || di.data.storage || 'https://nosdav.nostr.rocks'
    const mode = getQueryStringValue('mode') || di.data.m || 'm'
    const uri = getQueryStringValue('uri') || di.data.uri || 'paste.txt'
    this.state = {
      userPublicKey: null,
      filename: uri,
      contentType: null,
      fileContent: '',
      path: null,
      downloadLink: '',
      serverUrl: serverUrl,
      mode: mode
    }
  }

  updateFileContent = (event) => {
    this.setState({ fileContent: event.target.value })
  }

  updateDownloadLink = () => {
    const { filename, userPublicKey, serverUrl, mode } = this.state
    const path = getPath(serverUrl, userPublicKey, filename, mode)
    this.setState({ downloadLink: path })
  }

  updateFilename = (event) => {
    this.setState({ filename: event.target.value })
  }

  userLogin = async () => {
    const userPublicKey = await window.nostr.getPublicKey()
    console.log(`Logged in with public key: ${userPublicKey}`)
    await this.setState({ userPublicKey: userPublicKey })
    this.loadFile()
  }

  // Load the file content from the server
  loadFile = async () => {
    if (!this.state.userPublicKey) {
      alert('Please login first');
      return;
    }

    const { filename, userPublicKey, serverUrl, mode } = this.state;

    const fileContent = await loadFile(serverUrl, userPublicKey, filename, mode);

    if (fileContent) {
      this.setState({ fileContent: fileContent });
    }

    this.updateDownloadLink();
  };

  save = async () => {
    if (!this.state.userPublicKey) {
      alert('Please login first');
      return;
    }

    const { fileContent, filename, userPublicKey, serverUrl, mode } = this.state;

    const success = await saveFile(serverUrl, userPublicKey, filename, mode, fileContent);

    if (!success) {
      alert('Error saving file');
    }
  };

  render() {
    const { userPublicKey, filename, fileContent, downloadLink } = this.state

    return html`
      <div id="container">
        <h1>NosDAV</h1>
        <label for="file-name"
          >File${' '}
          <a href="${downloadLink}" id="download" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line></svg></a
        ></label>
        <input
          type="text"
          id="file-name"
          name="file-name"
          placeholder="Enter filename"
          value="${filename}"
          onInput="${event => {
        this.updateFilename(event)
        this.updateDownloadLink()
      }}"
        />
        <label for="content">Enter Text Below</label>

        <textarea
          id="file-content"
          placeholder="Login First"
          name="content"
          rows="10"
          value="${fileContent}"
          onInput="${this.updateFileContent}"
        ></textarea>
        <div>
          ${userPublicKey
        ? html`
                <button id="save" onClick="${this.save}">Save</button>
                <button id="login" onClick="${this.userLogin}">
                  Load
                </button>
              `
        : html` <button id="login" onClick="${this.userLogin}">
                Login
              </button>`}
        </div>
        <div></div>
      </div>
    `
  }
}

render(html` <${App} /> `, document.body)
