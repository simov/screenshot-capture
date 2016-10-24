
// chrome.storage.sync.clear()

chrome.storage.sync.get((res) => {
  if (!res.action) {
    chrome.storage.sync.set({action: 'crop'})
  }
})

function inject (tab) {
  chrome.tabs.sendMessage(tab.id, {message: 'inject'}, (res) => {
    if (res) {
      clearTimeout(timeout)
    }
  })

  var timeout = setTimeout(() => {
    chrome.tabs.insertCSS(tab.id, {file: 'vendor/jquery.Jcrop.min.css', runAt: 'document_start'})
    chrome.tabs.insertCSS(tab.id, {file: 'css/content.css', runAt: 'document_start'})

    chrome.tabs.executeScript(tab.id, {file: 'vendor/jquery.min.js', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'vendor/jquery.Jcrop.min.js', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'content/content.js', runAt: 'document_start'})

    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, {message: 'toggle'})
    }, 100)
  }, 100)
}

chrome.browserAction.onClicked.addListener((tab) => {
  inject(tab)
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'take-screenshot') {
    chrome.tabs.getSelected(null, (tab) => {
      inject(tab)
    })
  }
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'capture') {
    chrome.tabs.getSelected(null, (tab) => {

      chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, (image) => {
        // image is base64

        chrome.storage.sync.get((_res) => {
          if (_res.action === 'full') {
            res({message: 'image', image: image})
          }
          else {
            crop(req.crop, image, (cropped) => {
              res({message: 'image', image: cropped})
            })
          }
        })
      })
    })
  }
  return true
})

function crop (area, image, done) {
  var canvas = null
  if (!canvas) {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
  }

  var top = area.y, left = area.x
  var width = area.w, height = area.h

  var img = new Image()
  img.onload = () => {
    canvas.width = width
    canvas.height = height
    var context = canvas.getContext('2d')
    context.drawImage(img,
      left, top,
      width, height,
      0, 0,
      width, height
    )

    var cropped = canvas.toDataURL('image/png')
    done(cropped)
  }
  img.src = image
}
