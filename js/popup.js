
// chrome
var c = {
  send: function (message, data, done) {
    data = data||{}
    data.message = message
    chrome.extension.sendMessage(data, done)
  },
  storage: function (done) {
    chrome.storage.sync.get(done)
  }
}

$(function () {
  var map = ['full', 'crop', 'wait']

  c.storage(function (sync) {
    $('#options input')
      .eq(map.indexOf(sync.action))
      .attr('checked', true)

    if (sync.action != 'wait') return
    $('button').show()
  })

  $('#options label').on('click', function (e) {
    var idx = $('#options label').index(this)
    chrome.storage.sync.set({action:map[idx]})
  })

  $('button').on('click', function (e) {
    c.send('save')
  })
})
