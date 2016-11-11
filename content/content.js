
var jcrop
var state = {
  active: false,
  selection: null
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'init') {
    res({}) // prevent re-injecting

    if (!jcrop) {
      init(() => {
        state.active = !state.active
        $('.jcrop-holder')[state.active ? 'show' : 'hide']()
        chrome.runtime.sendMessage({message: 'active', active: state.active})
        capture()
      })
    }
    else {
      state.active = !state.active
      $('.jcrop-holder')[state.active ? 'show' : 'hide']()
      chrome.runtime.sendMessage({message: 'active', active: state.active})
      capture(true)
    }
  }
  return true
})

function init (done) {
  // add fake image
  $('body').append('<div id="fake-image">')

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
      setTimeout(() => {
        state.selection = null
      }, 100)
    }
  }, function ready () {
    jcrop = this

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

    done()
  })
}

function capture (force) {
  chrome.storage.sync.get((res) => {
    if (state.selection && (res.action === 'crop' || (res.action === 'wait' && force))) {
      jcrop.release()
      setTimeout(() => {
        chrome.runtime.sendMessage({message: 'capture', crop: state.selection, dpr: devicePixelRatio}, (res) => {
          state.active = false
          state.selection = null
          $('.jcrop-holder').hide()
          chrome.runtime.sendMessage({message: 'active', active: state.active})
          save(res.image)
        })
      }, 50)
    }
    else if (res.action === 'view') {
      chrome.runtime.sendMessage({message: 'capture'}, (res) => {
        state.active = false
        $('.jcrop-holder').hide()
        chrome.runtime.sendMessage({message: 'active', active: state.active})
        save(res.image)
      })
    }
  })
}

function save (image) {
  document.location.href = image.replace('image/png', 'image/octet-stream')
}
