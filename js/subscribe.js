export default subscribe

// var wss = 'wss://melvin.solid.live/'

// UPDATES
function subscribe (id) {
  var el = document.getElementById(id)
  var src = el.src
  function fetchSrc () {
    console.log('fetching', src)
    window
      .fetch(el.src, { headers: { Accept: el.type } })
      .then(response => response.json())
      .then(json => {
        if (di[id] && json && JSON.stringify(di[id]) !== JSON.stringify(json)) {
          console.log('updating di.' + id)
          di[id] = json
        }
      })
  }

  fetchSrc()
  let uri = el.src
  let wss = uri.replace('http', 'ws')
  let w = new WebSocket(wss)
  w.onmessage = function (m) {
    let data = m.data
    console.log(data)

    if (data.match(/pub .*/) || data.match(/ack .*/)) {
      fetchSrc()
    }
  }
  w.onopen = function () {
    console.log('websocket open')
    w.send('sub ' + src)
  }
  w.onerror = function () {
    console.log('websocket error')
  }
  w.onclose = function () {
    console.log('websocket closed')
  }
}
