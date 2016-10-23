
var state = {
  loaded: false,
  ready: false,
  active: false,
  timeout: null,
  selection: null
}

chrome.extension.onMessage.addListener((req, sender, res) => {
  action[req.message](req, sender, res)
  return true
})

$(window).on('load', () => {
  state.loaded = true
})

var action = {
  toggle: (req, sender, res) => {
    if (!state.loaded) return
    init(() => {
      state.active = !state.active
      $('.jcrop-holder')[state.active ? 'show' : 'hide']()
      clearTimeout(state.timeout)

      if (!state.active) return
      c.storage((sync) => {
        if (sync.action !== 'full') return
        c.send('capture', {}, (res) => {
          save(res.image)
        })
      })
    })
  },
  save: (req, sender, res) => {
    if (state.selection) capture()
  }
}

// chrome
var c = {
  send: (message, data, done) => {
    data.message = message
    chrome.extension.sendMessage(data, done)
  },
  url: (path) => {
    return chrome.extension.getURL(path)
  },
  storage: (done) => {
    chrome.storage.sync.get(done)
  }
}

function init (done) {
  if (state.ready) return done()

  // add fake image
  var pixel = c.url('/images/pixel.png')
  $('body').append('<img id="fake-image" src="' + pixel + '">')

  setTimeout(() => {
    // init jcrop
    $('#fake-image').Jcrop({
      bgColor: 'none',
      onSelect: (e) => {
        state.selection = e
        c.storage((sync) => {
          if (sync.action === 'crop') capture()
        })
      },
      onChange: (e) => {
        state.selection = e
      },
      onRelease: (e) => {
        state.selection = null
      }
    })

    var timeout = setInterval(() => {
      if ($('.jcrop-holder').length) clearInterval(timeout)

      // fix styles
      $('.jcrop-holder').css({
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%', zIndex: 10000
      })
      $('.jcrop-hline, .jcrop-vline').css({
        backgroundImage: 'url(' + c.url('/images/Jcrop.gif') + ')'
      })
      // hide jcrop holder by default
      $('.jcrop-holder').hide()

      state.ready = true
      done()
    }, 100)
  }, 100)
}

function capture () {
  $('.jcrop-holder > div:eq(0)').hide()
  setTimeout(() => {
    c.send('capture', {crop: state.selection}, (res) => {
      state.active = false
      $('.jcrop-holder > div:eq(0)').show()
      $('.jcrop-holder').hide()
      save(res.image)
    })
  }, 100)
}

function save (image) {
  document.location.href = image.replace('image/png', 'image/octet-stream')
}
