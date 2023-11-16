
// chrome.storage.sync.clear()

chrome.storage.sync.get((config) => {
  if (config.method === undefined) {
    chrome.storage.sync.set({method: 'crop'})
  }
  if (config.format === undefined) {
    chrome.storage.sync.set({format: 'png'})
  }
  if (config.quality === undefined) {
    chrome.storage.sync.set({quality: 100})
  }
  if (config.save === undefined) {
    chrome.storage.sync.set({save: ['file']})
  }
  if (config.clipboard === undefined) {
    chrome.storage.sync.set({clipboard: 'url'})
  }
  if (config.dpr === undefined) {
    chrome.storage.sync.set({dpr: true})
  }
  if (config.delay === undefined) {
    chrome.storage.sync.set({delay: 500})
  }
  if (config.dialog === undefined) {
    chrome.storage.sync.set({dialog: true})
  }
  if (config.icon === undefined) {
    chrome.storage.sync.set({icon: 'default'})
  }
  // v3.0 -> v3.1
  if (typeof config.save === 'string') {
    config.clipboard = /url|binary/.test(config.save) ? config.save : 'url'
    config.save = /url|binary/.test(config.save) ? ['clipboard'] : ['file']
    chrome.storage.sync.set({save: config.save})
    chrome.storage.sync.set({clipboard: config.clipboard})
  }
  if (typeof config.icon === 'boolean') {
    config.icon = config.icon === false ? 'default' : 'light'
    chrome.storage.sync.set({icon: config.icon})
  }

  chrome.action.setIcon({
    path: [16, 19, 38, 48, 128].reduce((all, size) => (
      all[size] = `/icons/${config.icon}/${size}x${size}.png`,
      all
    ), {})
  })
})

function inject (tab) {
  chrome.tabs.sendMessage(tab.id, {message: 'init'}, (res) => {
    if (res) {
      clearTimeout(timeout)
    }
  })

  var timeout = setTimeout(() => {
    chrome.scripting.insertCSS({files: ['vendor/jquery.Jcrop.min.css'], target: {tabId: tab.id}})
    chrome.scripting.insertCSS({files: ['content/index.css'], target: {tabId: tab.id}})

    chrome.scripting.executeScript({files: ['vendor/jquery.min.js'], target: {tabId: tab.id}})
    chrome.scripting.executeScript({files: ['vendor/jquery.Jcrop.min.js'], target: {tabId: tab.id}})
    chrome.scripting.executeScript({files: ['content/crop.js'], target: {tabId: tab.id}})
    chrome.scripting.executeScript({files: ['content/index.js'], target: {tabId: tab.id}})

    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, {message: 'init'})
    }, 100)
  }, 100)
}

chrome.action.onClicked.addListener((tab) => {
  inject(tab)
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'take-screenshot') {
    chrome.tabs.query({active: true, currentWindow: true}, (tab) => {
      inject(tab[0])
    })
  }
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'capture') {
    chrome.tabs.query({active: true, currentWindow: true}, (tab) => {
      chrome.tabs.captureVisibleTab(tab.windowId, {format: req.format, quality: req.quality}, (image) => {
        // image is base64
        res({message: 'image', image})
      })
    })
  }
  else if (req.message === 'active') {
    if (req.active) {
      chrome.storage.sync.get((config) => {
        if (config.method === 'crop') {
          chrome.action.setTitle({tabId: sender.tab.id, title: 'Crop and Save'})
          chrome.action.setBadgeText({tabId: sender.tab.id, text: '◩'})
        }
        else if (config.method === 'wait') {
          chrome.action.setTitle({tabId: sender.tab.id, title: 'Crop and Wait'})
          chrome.action.setBadgeText({tabId: sender.tab.id, text: '◪'})
        }
        else if (config.method === 'view') {
          chrome.action.setTitle({tabId: sender.tab.id, title: 'Capture Viewport'})
          chrome.action.setBadgeText({tabId: sender.tab.id, text: '⬒'})
        }
        else if (config.method === 'page') {
          chrome.action.setTitle({tabId: sender.tab.id, title: 'Capture Document'})
          chrome.action.setBadgeText({tabId: sender.tab.id, text: '◼'})
        }
      })
    }
    else {
      chrome.action.setTitle({tabId: sender.tab.id, title: 'Screenshot Capture'})
      chrome.action.setBadgeText({tabId: sender.tab.id, text: ''})
    }
  }
  return true
})
