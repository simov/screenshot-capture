
var state = {
  shortcut: {},
  types: [
    {id: 'view', icon: '⬒', title: 'Capture Viewport'},
    // {id: 'full', icon: '⬛', title: 'Capture Document'},
    {id: 'crop', icon: '◩', title: 'Crop and Save'},
    {id: 'wait', icon: '◪', title: 'Crop and Wait'}
  ]
}

chrome.storage.sync.get((res) => {
  state.types.forEach((type) => {
    type.checked = (type.id === res.action)
  })
  m.redraw()
})

chrome.commands.getAll((commands) => {
  var command = commands.filter((command) => command.name === 'take-screenshot')[0]
  state.shortcut = command.shortcut
  m.redraw()
})

var events = {
  change: (type) => (e) => {
    state.types.forEach((type) => {
      type.checked = false
    })
    type.checked = true
    chrome.storage.sync.set({action: type.id})
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
    m('.mdl-grid', [
      m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
        m('h4', 'Capture Method')
      ),
      state.types.map((item) =>
        m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
          m('label.mdl-radio mdl-js-radio mdl-js-ripple-effect', {
            oncreate, onupdate: onupdate(item)}, [
            m('input[type=radio][name=action].mdl-radio__button', {
              checked: item.active ? 'checked' : null,
              onchange: events.change(item)
            }),
            m('span.mdl-radio__label', m('em', item.icon), item.title)
          ])
        )
      ),

      m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop',
        m('h4', 'Keyboard Shortcut')
      ),
      m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop', [
        (state.shortcut || null) &&
        m('.bs-callout',
          m('p', 'You can use ', m('code', state.shortcut), ' to capture screenshot.')
        ),
        (!state.shortcut || null) &&
        m('.bs-callout',
          m('p', 'You can also use a keyboard shortcut to capture screenshot.')
        ),
        m('.bs-callout', [
          m('p', 'To set the keyboard shortcut:'),
          m('p', '1. Navigate to ', m('code', 'chrome://extensions'),
            ' and scroll down to the bottom of the page.'),
          m('p', '2. Click on ', m('code', 'Keyboard shortcuts'),
            ' and set a key combination for Screenshot Capture.')
        ])
      ])
    ])
})
