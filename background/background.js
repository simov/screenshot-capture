
// chrome.storage.sync.clear()

chrome.storage.sync.get((sync) => {
  if (!sync.action) {
    chrome.storage.sync.set({action: 'crop'})
  }
})

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'take-screenshot') return
  chrome.tabs.getSelected(null, (tab) => {
    chrome.tabs.sendMessage(tab.id, {message: 'toggle'}, (res) => {})
  })
})

chrome.extension.onMessage.addListener((req, sender, res) => {
  action[req.message](req, res)
  return true
})

var action = {
  capture: (req, res) => {
    chrome.tabs.getSelected(null, (tab) => {

      chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, (image) => {
        // image is base64

        chrome.storage.sync.get((sync) => {
          if (sync.action === 'full') {
            res({message: 'image', image: image})
          }
          else {
            crop(req, image, (cropped) => {
              res({message: 'image', image: cropped})
            })
          }
        })
      })
    })
  },
  save: (req, res) => {
    chrome.tabs.getSelected(null, (tab) => {
      chrome.tabs.sendMessage(tab.id, {message: 'save'}, (res) => {})
    })
  }
}

function crop (req, image, done) {
  var canvas = null
  if (!canvas) {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
  }

  var top = req.crop.y, left = req.crop.x,
    width = req.crop.w, height = req.crop.h

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
