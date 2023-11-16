
var state = {
  shortcut: {},
  method: [
    {id: 'crop', icon: '◩', title: 'Crop and Save'},
    {id: 'wait', icon: '◪', title: 'Crop and Wait'},
    {id: 'view', icon: '⬒', title: 'Capture Viewport'},
    {id: 'page', icon: '◼', title: 'Capture Document'},
  ],
  format: [
    {id: 'png', title: 'PNG'},
    {id: 'jpeg', title: 'JPG'}
  ],
  save: [
    {id: 'file', title: 'To File'},
    {id: 'clipboard', title: 'To Clipboard'},
  ],
  clipboard: [
    {id: 'url', title: 'Data URL String'},
    {id: 'binary', title: 'Binary Image'}
  ],
  dpr: [
    {id: true, title: 'Preserve original DPI size'},
    {id: false, title: 'Adjust to actual size'}
  ],
  icon: [
    {id: 'default', title: 'Default Icon'},
    {id: 'light', title: 'Light Icon'},
    {id: 'dark', title: 'Dark Icon'}
  ],
  delay: 500,
  quality: 100,
  dialog: true,
}

chrome.storage.sync.get((config) => {
  state.method.forEach((item) => item.checked = item.id === config.method)
  state.format.forEach((item) => item.checked = item.id === config.format)
  state.save.forEach((item) => item.checked = config.save.includes(item.id))
  state.clipboard.forEach((item) => item.checked = item.id === config.clipboard)
  state.dpr.forEach((item) => item.checked = item.id === config.dpr)
  state.icon.forEach((item) => item.checked = item.id === config.icon)
  state.delay = config.delay
  state.quality = config.quality
  state.dialog = config.dialog
  m.redraw()
})

chrome.commands.getAll((commands) => {
  var command = commands.find((command) => command.name === 'take-screenshot')
  state.shortcut = command.shortcut
  m.redraw()
})

var events = {
  option: (name, item) => (e) => {
    if (name === 'save') {
      item.checked = !item.checked
      chrome.storage.sync.set({
        save: state.save
          .filter(({checked}) => checked)
          .map(({id}) => id)
      })
    }
    else if (/delay|quality/.test(name)) {
      state[name] = parseInt(e.currentTarget.value)
      chrome.storage.sync.set({[name]: state[name]})
    }
    else if (name === 'dialog') {
      state[name] = !state[name]
      chrome.storage.sync.set({[name]: state[name]})
    }
    else {
      state[name].forEach((item) => item.checked = false)
      item.checked = true
      chrome.storage.sync.set({[name]: item.id})
      if (name === 'icon') {
        chrome.action.setIcon({
          path: [16, 19, 38, 48, 128].reduce((all, size) => (
            all[size] = `/icons/${item.id}/${size}x${size}.png`,
            all
          ), {})
        })
      }
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
  },
  textfield: (vnode) => {
    mdc.textfield.MDCTextField.attachTo(vnode.dom)
  }
}

var onupdate = (item) => (vnode) => {
  if (vnode.dom.classList.contains('active') !== (typeof item === 'boolean' ? item : item.checked)) {
    vnode.dom.classList.toggle('active')
  }
}

m.mount(document.querySelector('main'), {
  view: () => [
    m('.row',
      m('.col-xxl-4.col-xl-4.col-lg-6.col-md-6.col-sm-12.s-col',
        m('h3', 'Capture Method'),
        m('.bs-callout',
          state.method.map((item) =>
            m('.row',
              m('.col-sm-12',
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
              ),
              item.id === 'page' &&
              m('.col-sm-12', {class: !item.checked && 'disabled'},
                m('span.s-text', 'Screenshot Delay'),
                m('.mdc-text-field s-textfield', {
                  oncreate: oncreate.textfield,
                  },
                  m('input.mdc-text-field__input', {
                    type: 'number',
                    value: state.delay,
                    onchange: events.option('delay', item),
                    disabled: !item.checked && 'disabled',
                    placeholder: '500-3k', min: 500, max: 3000
                  }),
                  m('.mdc-line-ripple')
                ),
                m('span.s-text', 'ms'),
              )
            )
          )
        ),

        m('h3', 'Keyboard Shortcut'),
        m('.bs-callout',
          m('.row',
            m('.col-sm-12',
              state.shortcut &&
              m('span.s-text', 'Current keyboard shortcut ', m('code', state.shortcut)),
              !state.shortcut &&
              m('span.s-text', 'No keyboard shortcut set'),
              m('button.mdc-button mdc-button--raised s-button', {
                oncreate: oncreate.ripple,
                onclick: events.button('shortcut')
                },
                'Update'
              )
            )
          )
        ),
      ),
      m('.col-xxl-4.col-xl-4.col-lg-6.col-md-6.col-sm-12',
        m('h3', 'Image Format'),
        m('.bs-callout',
          state.format.map((item) =>
            m('.row',
              m('.col-sm-12',
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
                ),
              ),
              item.id === 'jpeg' &&
              m('.col-sm-12', {class: !item.checked && 'disabled'},
                m('span.s-text', 'Quality'),
                m('.mdc-text-field s-textfield', {
                  oncreate: oncreate.textfield,
                  },
                  m('input.mdc-text-field__input', {
                    type: 'number',
                    value: state.quality,
                    onchange: events.option('quality', item),
                    disabled: !item.checked && 'disabled',
                    placeholder: '0-100', min: 0, max: 100
                  }),
                  m('.mdc-line-ripple')
                ),
              )
            )
          )
        ),

        m('h3', 'Screenshot Scaling'),
        m('.bs-callout.s-last',
          state.dpr.map((item) =>
            m('.row',
              m('.col-sm-12',
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
            )
          )
        ),
      ),
      m('.col-xxl-4.col-xl-4.col-lg-6.col-md-6.col-sm-12.s-col',
        m('h3', 'Save Format'),
        m('.bs-callout', {class: state.save.every(({checked}) => !checked) && 's-box-error'},
          state.save.map((item) =>
            m('.row',
              m('.col-sm-12',
                m('label.s-label.s-checkbox', {onupdate: onupdate(item)},
                  m('.mdc-checkbox',
                    m('input.mdc-checkbox__native-control', {
                      type: 'checkbox', name: 'save',
                      checked: item.checked && 'checked',
                      onchange: events.option('save', item)
                    }),
                    m('.mdc-checkbox__background',
                      m('svg.mdc-checkbox__checkmark', {viewBox: '0 0 24 24'},
                        m('path.mdc-checkbox__checkmark-path', {
                          fill: 'none', d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
                        })
                      ),
                    ),
                  ),
                  m('span', item.title)
                ),
              ),
              item.id === 'file' &&
              m('.col-sm-12', {class: !item.checked && 'disabled'},
                m('span.s-text', 'Save Location'),
                m('button.mdc-button mdc-button--raised s-button', {
                  oncreate: oncreate.ripple,
                  onclick: events.button('location'),
                  disabled: !state.save.find(({id, checked}) => id === 'file' && checked) && 'disabled',
                  },
                  'Update'
                )
              ),
              item.id === 'clipboard' && [
                state.clipboard.map((item) =>
                  m('.col-sm-12', {class: !state.save.find(({id, checked}) => id === 'clipboard' && checked) && 'disabled'},
                    m('label.s-label', {onupdate: onupdate(item)},
                      m('.mdc-radio',
                        m('input.mdc-radio__native-control', {
                          type: 'radio', name: 'save',
                          checked: item.checked && 'checked',
                          disabled: !state.save.find(({id, checked}) => id === 'clipboard' && checked) && 'disabled',
                          onchange: events.option('clipboard', item)
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
                m('.col-sm-12', {class: !state.save.find(({id, checked}) => id === 'clipboard' && checked) && 'disabled'},
                  m('label.s-label.s-checkbox', {onupdate: onupdate(state.dialog)},
                    m('.mdc-checkbox',
                      m('input.mdc-checkbox__native-control', {
                        type: 'checkbox', name: 'dialog',
                        checked: state.dialog && 'checked',
                        disabled: !state.save.find(({id, checked}) => id === 'clipboard' && checked) && 'disabled',
                        onchange: events.option('dialog')
                      }),
                      m('.mdc-checkbox__background',
                        m('svg.mdc-checkbox__checkmark', {viewBox: '0 0 24 24'},
                          m('path.mdc-checkbox__checkmark-path', {
                            fill: 'none', d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
                          })
                        ),
                      ),
                    ),
                    m('span', 'Confirmation Dialog')
                  ),
                )
              ]
            )
          ),
        ),

        m('h3', 'Extension Icon'),
        m('.bs-callout.s-last',
          state.icon.map((item) =>
            m('.row',
              m('.col-sm-12',
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
            )
          )
        ),
      ),
    ),
  ]
})
