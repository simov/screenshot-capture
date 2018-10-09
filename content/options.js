
var state = {
  shortcut: {},
  methods: [
    {id: 'view', icon: '⬒', title: 'Capture Viewport'},
    // {id: 'full', icon: '⬛', title: 'Capture Document'},
    {id: 'crop', icon: '◩', title: 'Crop and Save'},
    {id: 'wait', icon: '◪', title: 'Crop and Wait'}
  ],
  dpr: [
    {id: true, title: 'Preserve original DPI size'},
    {id: false, title: 'Adjust to actual size'}
  ]
}

chrome.storage.sync.get((config) => {
  state.methods.forEach((item) => {
    item.checked = item.id === config.method
  })
  state.dpr.forEach((item) => {
    item.checked = item.id === config.dpr
  })
  m.redraw()
})

chrome.commands.getAll((commands) => {
  var command = commands.find((command) => command.name === 'take-screenshot')
  state.shortcut = command.shortcut
  m.redraw()
})

var events = {
  method: (item) => (e) => {
    state.methods.forEach((item) => item.checked = false)
    item.checked = true
    chrome.storage.sync.set({method: item.id})
  },
  dpr: (item) => (e) => {
    state.dpr.forEach((item) => item.checked = false)
    item.checked = true
    chrome.storage.sync.set({dpr: item.id})
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
      m('h4.mdc-typography--headline5', 'Capture Method',
        m('span', 'Saved in ', m('code', 'PNG'), ' file format')
      ),
      state.methods.map((item) =>
        m('label.s-label', {onupdate: onupdate(item)},
          m('.mdc-radio',
            m('input.mdc-radio__native-control', {
              type: 'radio', name: 'method',
              checked: item.checked ? 'checked' : null,
              onchange: events.method(item)
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
      m('h4.mdc-typography--headline5', 'Screenshot Size',
        m('span', 'Only for ', m('code', 'HDPI'), ' displays like Retina')
      ),
      state.dpr.map((item) =>
        m('label.s-label', {onupdate: onupdate(item)},
          m('.mdc-radio',
            m('input.mdc-radio__native-control', {
              type: 'radio', name: 'dpr',
              checked: item.checked ? 'checked' : null,
              onchange: events.dpr(item)
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
      m('h4.mdc-typography--headline5', 'Keyboard Shortcut',
        (state.shortcut || null) &&
        m('span', 'Press ', m('code', state.shortcut), ' to capture screenshot'),
        (!state.shortcut || null) &&
        m('span', 'Currently there is no keyboard shortcut set')
      ),
      m('p', 'To set a keyboard shortcut:'),
      m('p',
        '1. Navigate to ',
        m('code', 'chrome://extensions')
      ),
      m('p',
        '2. Click on the menu icon ',
        m('span.icon-menu'),
        ' in the top left corner, and choose ',
        m('code', 'Keyboard shortcuts'),
        ' from the menu'
      ),
      m('p',
        '3. Find Screenshot Capture and set key combination for the ',
        m('code', 'Take Screenshot'),
        ' action'
      )
    )
  ]
})
