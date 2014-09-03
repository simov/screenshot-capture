
$(function () {
    var map = ['fullscreen', 'crop', 'wait'];

    var options = null;
    chrome.storage.sync.get(function (sync) {
        options = sync.options;
        $('#options input')
            .eq(map.indexOf(options.action))
            .attr('checked', true);
    });

    $('#options label').on('click', function (e) {
        var idx = $('#options label').index(this);
        chrome.storage.sync.set({options:{action:map[idx]}});
    });
});
