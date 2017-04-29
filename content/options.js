
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
    item.checked = (item.id === config.method)
  })
  state.dpr.forEach((item) => {
    item.checked = (item.id === config.dpr)
  })
  m.redraw()
})

chrome.commands.getAll((commands) => {
  var command = commands.filter((command) => command.name === 'take-screenshot')[0]
  state.shortcut = command.shortcut
  m.redraw()
})

var events = {
  method: (item) => (e) => {
    state.methods.forEach((item) => (item.checked = false))
    item.checked = true
    chrome.storage.sync.set({method: item.id})
  },
  dpr: (item) => (e) => {
    state.dpr.forEach((item) => (item.checked = false))
    item.checked = true
    chrome.storage.sync.set({dpr: item.id})
  }
}

function oncreate (vnode) {
  componentHandler.upgradeElements(vnode.dom)
}
var onupdate = (type) => (vnode) => {
  if (vnode.dom.classList.contains('is-checked') !== type.checked) {
    vnode.dom.classList.toggle('is-checked')
  }
}

m.mount(document.querySelector('main'), {
  view: () =>
    m('.mdl-grid',
      m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
        m('.bs-callout',
          m('h4', 'Capture Method',
            m('span', 'Saved in ', m('code', 'PNG'), ' file format')
          ),
          state.methods.map((item) =>
            m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
              m('label.mdl-radio mdl-js-radio mdl-js-ripple-effect', {
                oncreate, onupdate: onupdate(item)},
                m('input[type=radio][name=method].mdl-radio__button', {
                  checked: item.active ? 'checked' : null,
                  onchange: events.method(item)
                }),
                m('span.mdl-radio__label', m('em', item.icon), item.title)
              )
            )
          )
        )
      ),

      m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
        m('.bs-callout',
          m('h4', 'Screenshot Size',
            m('span', 'Only for ', m('code', 'HDPI'), ' displays like Retina')
          ),
          state.dpr.map((item) =>
            m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
              m('label.mdl-radio mdl-js-radio mdl-js-ripple-effect', {
                oncreate, onupdate: onupdate(item)},
                m('input[type=radio][name=method].mdl-radio__button', {
                  checked: item.active ? 'checked' : null,
                  onchange: events.dpr(item)
                }),
                m('span.mdl-radio__label', item.title)
              )
            )
          )
        )
      ),

      m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
        m('.bs-callout',
          m('h4', 'Keyboard Shortcut',
            (state.shortcut || null) &&
            m('span', 'Press ', m('code', state.shortcut), ' to capture screenshot'),
            (!state.shortcut || null) &&
            m('span', 'Currently there is no keyboard shortcut set')
          ),
          m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
            m('p', 'To set a keyboard shortcut:'),
            m('p', '1. Navigate to ', m('code', 'chrome://extensions'),
              ' and scroll down to the bottom of the page.'),
            m('p', '2. Click on ', m('code', 'Keyboard shortcuts'),
              ' and set a key combination for Screenshot Capture.')
          )
        )
      )
    )
})
