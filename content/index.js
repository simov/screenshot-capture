
var jcrop, selection

var overlay = ((active) => (state) => {
  active = typeof state === 'boolean' ? state : state === null ? active : !active
  $('.jcrop-holder')[active ? 'show' : 'hide']()
  chrome.runtime.sendMessage({message: 'active', active})
})(false)

var image = (done) => {
  var image = new Image()
  image.id = 'fake-image'
  image.src = chrome.runtime.getURL('/content/pixel.png')
  image.onload = () => {
    $('body').append(image)
    done()
  }
}

var init = (done) => {
  $('#fake-image').Jcrop({
    bgColor: 'none',
    onSelect: (e) => {
      selection = e
      capture()
    },
    onChange: (e) => {
      selection = e
    },
    onRelease: (e) => {
      setTimeout(() => {
        selection = null
      }, 100)
    }
  }, function ready () {
    jcrop = this

    $('.jcrop-hline, .jcrop-vline').css({
      backgroundImage: `url(${chrome.runtime.getURL('/vendor/Jcrop.gif')})`
    })

    if (selection) {
      jcrop.setSelect([
        selection.x, selection.y,
        selection.x2, selection.y2
      ])
    }

    done && done()
  })
}

var capture = (force) => {
  chrome.storage.sync.get((config) => {
    if (selection && (config.method === 'crop' || (config.method === 'wait' && force))) {
      jcrop.release()
      setTimeout(() => {
        var _selection = selection
        chrome.runtime.sendMessage({
          message: 'capture', format: config.format, quality: config.quality
        }, (res) => {
          overlay(false)
          crop(res.image, _selection, devicePixelRatio, config.dpr, config.format, (image) => {
            save(image, config.format, config.save, config.clipboard, config.dialog)
            selection = null
          })
        })
      }, 50)
    }
    else if (config.method === 'view') {
      chrome.runtime.sendMessage({
        message: 'capture', format: config.format, quality: config.quality
      }, (res) => {
        overlay(false)
        if (devicePixelRatio !== 1 && !config.dpr) {
          var area = {x: 0, y: 0, w: innerWidth, h: innerHeight}
          crop(res.image, area, devicePixelRatio, config.dpr, config.format, (image) => {
            save(image, config.format, config.save, config.clipboard, config.dialog)
          })
        }
        else {
          save(res.image, config.format, config.save, config.clipboard, config.dialog)
        }
      })
    }
    else if (config.method === 'page') {
      var container = ((html = document.querySelector('html')) => (
        html.scrollTop = 1,
        html.scrollTop ? (html.scrollTop = 0, html) : document.querySelector('body')
      ))()
      container.scrollTop = 0
      document.querySelector('html').style.overflow = 'hidden'
      document.querySelector('body').style.overflow = 'hidden'
      setTimeout(() => {
        var images = []
        var count = 0
        ;(function scroll (done) {
          chrome.runtime.sendMessage({
            message: 'capture', format: config.format, quality: config.quality
          }, (res) => {
            var height = innerHeight
            if (count * innerHeight > container.scrollTop) {
              height = container.scrollTop - (count - 1) * innerHeight
            }
            images.push({height, offset: container.scrollTop, image: res.image})

            if (
              (count * innerHeight === container.scrollTop &&
              (count - 1) * innerHeight === container.scrollTop) ||
              count * innerHeight > container.scrollTop
              ) {
              done()
              return
            }

            count += 1
            container.scrollTop = count * innerHeight
            setTimeout(() => {
              if (count * innerHeight !== container.scrollTop) {
                container.scrollTop = count * innerHeight
              }
              scroll(done)
            }, config.delay)
          })
        })(() => {
          overlay(false)
          var area = {x: 0, y: 0, w: innerWidth, h: images.reduce((all, {height}) => all += height, 0)}
          crop(images, area, devicePixelRatio, config.dpr, config.format, (image) => {
            document.querySelector('html').style.overflow = ''
            document.querySelector('body').style.overflow = ''
            save(image, config.format, config.save, config.clipboard, config.dialog)
          })
        })
      }, config.delay)
    }
  })
}

var filename = (format) => {
  var pad = (n) => (n = n + '', n.length >= 2 ? n : `0${n}`)
  var ext = (format) => format === 'jpeg' ? 'jpg' : format === 'png' ? 'png' : 'png'
  var timestamp = (now) =>
    [pad(now.getFullYear()), pad(now.getMonth() + 1), pad(now.getDate())].join('-')
    + ' - ' +
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('-')
  return `Screenshot Capture - ${timestamp(new Date())}.${ext(format)}`
}

var save = (image, format, save, clipboard, dialog) => {
  if (save.includes('file')) {
    var link = document.createElement('a')
    link.download = filename(format)
    link.href = image
    link.click()
  }
  if (save.includes('clipboard')) {
    if (clipboard === 'url') {
      navigator.clipboard.writeText(image).then(() => {
        if (dialog) {
          alert([
            'Screenshot Capture:',
            'Data URL String',
            'Saved to Clipboard!'
          ].join('\n'))
        }
      })
    }
    else if (clipboard === 'binary') {
      var [header, base64] = image.split(',')
      var [_, type] = /data:(.*);base64/.exec(header)
      var binary = atob(base64)
      var array = Array.from({length: binary.length})
        .map((_, index) => binary.charCodeAt(index))
      navigator.clipboard.write([
        new ClipboardItem({
          // jpeg is not supported on write, though the encoding is preserved
          'image/png': new Blob([new Uint8Array(array)], {type: 'image/png'})
        })
      ]).then(() => {
        if (dialog) {
          alert([
            'Screenshot Capture:',
            'Binary Image',
            'Saved to Clipboard!'
          ].join('\n'))
        }
      })
    }
  }
}

window.addEventListener('resize', ((timeout) => () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    jcrop.destroy()
    init(() => overlay(null))
  }, 100)
})())

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'init') {
    res({}) // prevent re-injecting

    if (!jcrop) {
      image(() => init(() => {
        overlay()
        capture()
      }))
    }
    else {
      overlay()
      capture(true)
    }
  }
  return true
})
