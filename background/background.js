
// chrome.storage.sync.clear()

chrome.storage.sync.get((config) => {
  if (!config.method) {
    chrome.storage.sync.set({method: 'crop'})
  }
  if (config.dpr === undefined) {
    chrome.storage.sync.set({dpr: true})
  }
})

function inject (tab) {
  chrome.tabs.sendMessage(tab.id, {message: 'init'}, (res) => {
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
      chrome.tabs.sendMessage(tab.id, {message: 'init'})
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

        chrome.storage.sync.get((config) => {
          if (config.method === 'view') {
            if (req.dpr !== 1 && !config.dpr) {
              crop(image, req.area, req.dpr, config.dpr, (cropped) => {
                res({message: 'image', image: cropped})
              })
            }
            else {
              res({message: 'image', image: image})
            }
          }
          else {
            crop(image, req.area, req.dpr, config.dpr, (cropped) => {
              res({message: 'image', image: cropped})
            })
          }
        })
      })
    })
  }
  else if (req.message === 'active') {
    if (req.active) {
      chrome.storage.sync.get((config) => {
        if (config.method === 'view') {
          chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'Capture Viewport'})
          chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: '⬒'})
        }
        // else if (config.method === 'full') {
        //   chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'Capture Document'})
        //   chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: '⬛'})
        // }
        else if (config.method === 'crop') {
          chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'Crop and Save'})
          chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: '◩'})
        }
        else if (config.method === 'wait') {
          chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'Crop and Wait'})
          chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: '◪'})
        }
      })
    }
    else {
      chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'Screenshot Capture'})
      chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: ''})
    }
  }
  return true
})

function crop (image, area, dpr, preserve, done) {
  var top = area.y * dpr
  var left = area.x * dpr
  var width = area.w * dpr
  var height = area.h * dpr
  var w = (dpr !== 1 && preserve) ? width : area.w
  var h = (dpr !== 1 && preserve) ? height : area.h

  var canvas = null
  if (!canvas) {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
  }
  canvas.width = w
  canvas.height = h

  var img = new Image()
  img.onload = () => {
    var context = canvas.getContext('2d')
    context.drawImage(img,
      left, top,
      width, height,
      0, 0,
      w, h
    )

    var cropped = canvas.toDataURL('image/png')
    done(cropped)
  }
  img.src = image
}
