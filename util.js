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
    tags: [['url', path]],
    content: ''
  }
  const signedEvent = await window.nostr.signEvent(event)
  console.log(signedEvent)
  console.log(JSON.stringify(signedEvent))
  console.log(btoa(JSON.stringify(signedEvent)))

  return `Nostr ${btoa(JSON.stringify(signedEvent))}`
}
