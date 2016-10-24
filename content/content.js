
var state = {
  loaded: false,
  ready: false,
  active: false,
  selection: null
}

if (document.readyState === 'complete') {
  state.loaded = true
}
else {
  window.addEventListener('DOMContentLoaded', mount)
  window.addEventListener('load', () => {
    state.loaded = true
  })
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'inject') {
    if (!state.selection) {
      res({message: 'loaded'})
      toggle()
    }
    else {
      capture(true)
    }
  }
  return true
})

function toggle () {
  if (!state.loaded) {
    return
  }

  init(() => {
    state.active = !state.active
    $('.jcrop-holder')[state.active ? 'show' : 'hide']()

    if (!state.active) {
      return
    }

    capture()
  })
}

function init (done) {
  if (state.ready) {
    done()
    return
  }

  // add fake image
  var pixel = chrome.runtime.getURL('/images/pixel.png')
  $('body').append('<img id="fake-image" src="' + pixel + '">')

  setTimeout(() => {
    // init jcrop
    $('#fake-image').Jcrop({
      bgColor: 'none',
      onSelect: (e) => {
        state.selection = e
        capture()
      },
      onChange: (e) => {
        state.selection = e
      },
      onRelease: (e) => {
        state.selection = null
      }
    })

    var timeout = setInterval(() => {
      if ($('.jcrop-holder').length) {
        clearInterval(timeout)
      }

      // fix styles
      $('.jcrop-holder').css({
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%', zIndex: 10000
      })
      $('.jcrop-hline, .jcrop-vline').css({
        backgroundImage: 'url(' + chrome.runtime.getURL('/images/Jcrop.gif') + ')'
      })
      // hide jcrop holder by default
      $('.jcrop-holder').hide()

      state.ready = true
      done()
    }, 100)
  }, 100)
}

function capture (force) {
  chrome.storage.sync.get((res) => {
    if (res.action === 'crop' || (res.action === 'wait' && force)) {
      $('.jcrop-holder > div:eq(0)').hide()
      setTimeout(() => {
        chrome.runtime.sendMessage({message: 'capture', crop: state.selection}, (res) => {
          state.active = false
          $('.jcrop-holder > div:eq(0)').show()
          $('.jcrop-holder').hide()
          save(res.image)
        })
      }, 100)
    }
    else if (res.action === 'full') {
      chrome.runtime.sendMessage({message: 'capture'}, (res) => {
        state.active = false
        $('.jcrop-holder > div:eq(0)').show()
        $('.jcrop-holder').hide()
        save(res.image)
      })
    }
  })
}

function save (image) {
  document.location.href = image.replace('image/png', 'image/octet-stream')
}
