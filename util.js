export function getPath(serverUrl, userPublicKey, filename, mode) {
  if (isAbsoluteUrl(filename)) {
    return filename
  }

  if (mode !== 'm') {
    return `${serverUrl}/${filename}`
  } else {
    return `${serverUrl}/${userPublicKey}/${filename}`
  }
}

export function getMimeType(filename) {
  const extension = filename.split('.').pop().toLowerCase()
  switch (extension) {
    case 'txt':
      return 'text/plain'
    case 'ttl':
      return 'text/turtle'
    case 'json':
      return 'application/json'
    case 'jsonld':
      return 'application/ld+json'
    case 'md':
      return 'text/markdown' // Added Markdown support
    default:
      return 'text/plain'
  }
}

export function isAbsoluteUrl(url) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export function getQueryStringValue(key) {
  const queryString = window.location.search.substring(1)
  const queryParams = new URLSearchParams(queryString)
  return queryParams.get(key)
}

export async function generateAuthorizationHeader(path) {
  const event = {
    kind: 27235,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['u', path]],
    content: ''
  }
  const signedEvent = await window.nostr.signEvent(event)
  console.log(signedEvent)
  console.log(JSON.stringify(signedEvent))
  console.log(btoa(JSON.stringify(signedEvent)))

  return `Nostr ${btoa(JSON.stringify(signedEvent))}`
}

export async function loadFile(serverUrl, userPublicKey, filename, mode) {
  const path = getPath(serverUrl, userPublicKey, filename, mode)

  try {
    const response = await fetch(path, {
      headers: {
        Authorization: `Nostr ${userPublicKey}`
      }
    })

    if (response.status === 200) {
      return await response.text()
    } else {
      throw new Error('Failed to load file content')
    }
  } catch (error) {
    console.error(error)
  }
}

export async function saveFile(serverUrl, userPublicKey, filename, mode, fileContent) {
  const path = getPath(serverUrl, userPublicKey, filename, mode)
  const contentType = getMimeType(filename)
  const authorization = await generateAuthorizationHeader(path)

  try {
    const response = await fetch(path, {
      method: 'PUT',
      body: fileContent,
      headers: {
        Authorization: authorization,
        'Content-Type': contentType,
        'Content-Length': fileContent.length
      }
    })

    if (response.status === 201) {
      console.log('File saved successfully')
      return true
    } else {
      throw new Error('Failed to save file')
    }
  } catch (error) {
    console.error(error)
    return false
  }
}
