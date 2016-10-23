
$(function () {
  var map = ['full', 'crop', 'wait']

  chrome.storage.sync.get((sync) => {
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
    chrome.extension.sendMessage({message: 'save'})
  })
})
