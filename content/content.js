
chrome.extension.onMessage.addListener((req, sender, res) => {
  a[req.message](req, sender, res)
  return true
})

$(window).on('load', (evt) => {
  e.loaded = true
})

// action
var a = {
  toggle: (req, sender, res) => {
    if (!e.loaded) return
    e.init(() => {
      e.active = !e.active
      $('.jcrop-holder')[e.active ? 'show' : 'hide']()
      clearTimeout(e.timeout)
      res({message: 'toggle', state: e.active})

      if (!e.active) return
      c.storage((sync) => {
        if (sync.action !== 'full') return
        c.send('capture', {}, (res) => {
          e.saveAs(res.image)
          e.timeout = setTimeout(() => {
            c.send('toggle', {state: e.active})
          }, 5000)
        })
      })
    })
  },
  save: (req, sender, res) => {
    if (e.selection) e.capture()
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

// extension
var e = {
  loaded: false,
  ready: false,
  active: false,
  timeout: null,
  selection: null,

  init: (done) => {
    if (e.ready) return done()

    // add fake image
    var pixel = c.url('/images/pixel.png')
    $('body').append('<img id="fake-image" src="' + pixel + '">')

    setTimeout(() => {
      // init jcrop
      $('#fake-image').Jcrop({
        bgColor: 'none',
        onSelect: (evt) => {
          e.selection = evt
          c.storage((sync) => {
            if (sync.action === 'crop') e.capture()
          })
        },
        onChange: (evt) => {
          e.selection = evt
        },
        onRelease: (evt) => {
          e.selection = null
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

        e.ready = true
        done()
      }, 100)
    }, 100)
  },
  capture: () => {
    $('.jcrop-holder > div:eq(0)').hide()
    setTimeout(() => {
      c.send('capture', {crop:e.selection}, (res) => {
        e.active = false
        $('.jcrop-holder > div:eq(0)').show()
        $('.jcrop-holder').hide()
        e.saveAs(res.image)
        c.send('toggle', {state: e.active})
      })
    }, 100)
  },
  saveAs: (image) => {
    document.location.href = image.replace('image/png', 'image/octet-stream')
  }
}
