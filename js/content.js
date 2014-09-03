
chrome.extension.onMessage.addListener(function (req, sender, res) {
    jcrop[req.message](req, sender, res);
    return true;
});


var jcrop = {
    ready: false,
    active: false,
    init: function (done) {
        if (this.ready) return done();

        // add fake image
        var pixel = chrome.extension.getURL('/images/pixel.png');
        $('body').append('<img id="fake-image" src="'+pixel+'">');

        // init jcrop
        $('#fake-image').Jcrop({
            bgColor:'none',
            onSelect: jcrop.onSelect,
            onChange: function (e) {
                // selection moved
            },
            onRelese: function (e) {
                // selection removed
            }
        });

        var timeout = setInterval(function () {
            if ($('.jcrop-holder').length) clearInterval(timeout);

            // fix styles
            $('.jcrop-holder').css({
                position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:10000
            });
            $('.jcrop-hline, .jcrop-vline').css({
                backgroundImage: 'url('+chrome.extension.getURL('/images/Jcrop.gif')+')'
            });
            // hide jcrop hodler by default
            $('.jcrop-holder').hide();

            jcrop.ready = true;
            done();
        },10);
    },
    toggle: function (req, sender, res) {
        this.init(function () {
            jcrop.active = !jcrop.active;
            $('.jcrop-holder')[jcrop.active?'show':'hide']();
            res({message:'toggle', state:jcrop.active});
        });
    },
    onSelect: function (e) {
        chrome.extension.sendMessage({message:'crop', crop:e}, function (res) {
            jcrop.active = false;
            $('.jcrop-holder').hide();
            jcrop.saveAs(res.image);
        });
    },
    saveAs: function (image) {
        document.location.href = image.replace('image/png', 'image/octet-stream');
    }
    // append: function (image) {
    // 	$('body').append('<img src="'+image+'" />');
    // }
};
