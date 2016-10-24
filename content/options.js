
var state = {
  shortcut: {},
  types: [
    {id: 'full', title: 'Entire Screen'},
    {id: 'crop', title: 'Crop and Save'},
    {id: 'wait', title: 'Crop and Wait'}
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
      m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop', [
        m('h4', 'Capturing Method'),
      ]),
      m('.mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-desktop', [
        state.types.map((type) =>
          m('.mdl-cell',
            m('label.mdl-radio mdl-js-radio mdl-js-ripple-effect', {
              oncreate, onupdate: onupdate(type)}, [
              m('input[type=radio][name=action].mdl-radio__button', {
                checked: type.active ? 'checked' : null,
                onchange: events.change(type)
              }),
              m('span.mdl-radio__label', type.title)
            ])
          )
        )
      ]),

      (state.shortcut || null) &&
      m('.bs-callout',
        m('p', 'You can also use ', m('code', state.shortcut), ' to capture screenshot')
      ),

      (!state.shortcut || null) &&
      m('.bs-callout', [
        m('p', 'Navigate to ', m('code', 'chrome://extensions'),
          ' and scroll down to the bottom of the page.'),
        m('p', 'Click on ', m('code', 'Keyboard shortcuts'),
          ' and set a key combination for capturing a screenshot.')
      ])
    ])
})
