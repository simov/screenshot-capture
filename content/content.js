
var state = {
  ready: false,
  active: false,
  selection: null
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'init') {
    // prevent re-injecting
    res({})

    if (!state.ready) {
      init(() => {
        state.active = !state.active
        $('.jcrop-holder')[state.active ? 'show' : 'hide']()
        capture()
      })
    }
    else {
      // toggle
      state.active = !state.active
      $('.jcrop-holder')[state.active ? 'show' : 'hide']()
      capture()
    }
  }
  return true
})

function init (done) {
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

function capture () {
  chrome.storage.sync.get((res) => {
    if (/crop|wait/.test(res.action) && state.selection) {
      $('.jcrop-holder > div:eq(0)').hide()
      setTimeout(() => {
        chrome.runtime.sendMessage({message: 'capture', crop: state.selection}, (res) => {
          state.active = false
          state.selection = null
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
