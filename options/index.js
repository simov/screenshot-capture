
var state = {
  shortcut: {},
  method: [
    {id: 'view', icon: '⬒', title: 'Capture Viewport'},
    // {id: 'full', icon: '⬛', title: 'Capture Document'},
    {id: 'crop', icon: '◩', title: 'Crop and Save'},
    {id: 'wait', icon: '◪', title: 'Crop and Wait'}
  ],
  format: [
    {id: 'png', title: 'PNG'},
    {id: 'jpeg', title: 'JPG'}
  ],
  save: [
    {id: 'file', title: 'To File'},
    {id: 'url', title: 'To Clipboard (Data URL String)'},
    {id: 'binary', title: 'To Clipboard (Binary Image)'}
  ],
  dpr: [
    {id: true, title: 'Preserve original DPI size'},
    {id: false, title: 'Adjust to actual size'}
  ],
  icon: [
    {id: false, title: 'Dark Icon'},
    {id: true, title: 'Light Icon'}
  ]
}

chrome.storage.sync.get((config) => {
  state.method.forEach((item) => item.checked = item.id === config.method)
  state.format.forEach((item) => item.checked = item.id === config.format)
  state.save.forEach((item) => item.checked = item.id === config.save)
  state.dpr.forEach((item) => item.checked = item.id === config.dpr)
  state.icon.forEach((item) => item.checked = item.id === config.icon)
  m.redraw()
})

chrome.commands.getAll((commands) => {
  var command = commands.find((command) => command.name === 'take-screenshot')
  state.shortcut = command.shortcut
  m.redraw()
})

var events = {
  option: (name, item) => () => {
    state[name].forEach((item) => item.checked = false)
    item.checked = true
    chrome.storage.sync.set({[name]: item.id})
    if (name === 'icon') {
      chrome.action.setIcon({
        path: [16, 19, 38, 48, 128].reduce((all, size) => (
          color = item.id ? 'light' : 'dark',
          all[size] = `/icons/${color}/${size}x${size}.png`,
          all
        ), {})
      })
    }
  },
  button: (action) => () => {
    chrome.tabs.create({url: {
      shortcut: 'chrome://extensions/shortcuts',
      location: 'chrome://settings/downloads',
    }[action]})
  }
}

var oncreate = {
  ripple: (vnode) => {
    mdc.ripple.MDCRipple.attachTo(vnode.dom)
  }
}

var onupdate = (item) => (vnode) => {
  if (vnode.dom.classList.contains('active') !== item.checked) {
    vnode.dom.classList.toggle('active')
  }
}

m.mount(document.querySelector('main'), {
  view: () => [
    m('.bs-callout',
      m('h4.mdc-typography--headline5', 'Capture Method'),
      state.method.map((item) =>
        m('label.s-label', {onupdate: onupdate(item)},
          m('.mdc-radio',
            m('input.mdc-radio__native-control', {
              type: 'radio', name: 'method',
              checked: item.checked && 'checked',
              onchange: events.option('method', item)
            }),
            m('.mdc-radio__background',
              m('.mdc-radio__outer-circle'),
              m('.mdc-radio__inner-circle'),
            ),
          ),
          m('span', m('em', item.icon), item.title)
        )
      )
    ),

    m('.bs-callout',
      m('h4.mdc-typography--headline5', 'Image Format'),
      state.format.map((item) =>
        m('label.s-label', {onupdate: onupdate(item)},
          m('.mdc-radio',
            m('input.mdc-radio__native-control', {
              type: 'radio', name: 'format',
              checked: item.checked && 'checked',
              onchange: events.option('format', item)
            }),
            m('.mdc-radio__background',
              m('.mdc-radio__outer-circle'),
              m('.mdc-radio__inner-circle'),
            ),
          ),
          m('span', item.title)
        )
      )
    ),

    m('.bs-callout',
      m('h4.mdc-typography--headline5', 'Save Format'),
      state.save.map((item) =>
        m('label.s-label', {onupdate: onupdate(item)},
          m('.mdc-radio',
            m('input.mdc-radio__native-control', {
              type: 'radio', name: 'save',
              checked: item.checked && 'checked',
              onchange: events.option('save', item)
            }),
            m('.mdc-radio__background',
              m('.mdc-radio__outer-circle'),
              m('.mdc-radio__inner-circle'),
            ),
          ),
          m('span', item.title)
        )
      )
    ),

    m('.bs-callout',
      m('h4.mdc-typography--headline5', 'Screenshot Size'),
      state.dpr.map((item) =>
        m('label.s-label', {onupdate: onupdate(item)},
          m('.mdc-radio',
            m('input.mdc-radio__native-control', {
              type: 'radio', name: 'dpr',
              checked: item.checked && 'checked',
              onchange: events.option('dpr', item)
            }),
            m('.mdc-radio__background',
              m('.mdc-radio__outer-circle'),
              m('.mdc-radio__inner-circle'),
            ),
          ),
          m('span', item.title)
        )
      )
    ),

    m('.bs-callout',
      m('h4.mdc-typography--headline5', 'Keyboard Shortcut'),
      state.shortcut &&
      m('p', 'Current keyboard shortcut ', m('code', state.shortcut)),
      !state.shortcut &&
      m('p', 'No keyboard shortcut set'),
      m('button.mdc-button mdc-button--raised s-button', {
        oncreate: oncreate.ripple,
        onclick: events.button('shortcut')
        },
        'Update'
      )
    ),

    m('.bs-callout',
      m('h4.mdc-typography--headline5', 'Save Location'),
      m('button.mdc-button mdc-button--raised s-button', {
        oncreate: oncreate.ripple,
        onclick: events.button('location')
        },
        'Update'
      )
    ),

    m('.bs-callout',
      m('h4.mdc-typography--headline5', 'Extension Icon'),
      state.icon.map((item) =>
        m('label.s-label', {onupdate: onupdate(item)},
          m('.mdc-radio',
            m('input.mdc-radio__native-control', {
              type: 'radio', name: 'icon',
              checked: item.checked && 'checked',
              onchange: events.option('icon', item)
            }),
            m('.mdc-radio__background',
              m('.mdc-radio__outer-circle'),
              m('.mdc-radio__inner-circle'),
            ),
          ),
          m('span', item.title)
        )
      )
    ),
  ]
})
