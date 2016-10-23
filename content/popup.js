
// chrome
var c = {
  send: (message, data, done) => {
    data = data || {}
    data.message = message
    chrome.extension.sendMessage(data, done)
  },
  storage: (done) => {
    chrome.storage.sync.get(done)
  }
}

$(function () {
  var map = ['full', 'crop', 'wait']

  c.storage((sync) => {
    $('#popup input')
      .eq(map.indexOf(sync.action))
      .attr('checked', true)

    if (sync.action !== 'wait') return
    $('button').show()
  })

  $('#popup label').on('click', function (e) {
    var idx = $('#popup label').index(this)
    chrome.storage.sync.set({action: map[idx]})
  })

  $('button').on('click', (e) => {
    c.send('save')
  })
})
