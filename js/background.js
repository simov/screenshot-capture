// chrome.storage.sync.clear();
chrome.storage.sync.get(function (sync) {
    if (!sync.action)
        chrome.storage.sync.set({action:'crop'});
});

chrome.commands.onCommand.addListener(function (command) {
    if (command != 'take-screenshot') return;
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, {message:'toggle'}, function (res) {
            chrome.pageAction[res.state?'show':'hide'](tab.id);
        });
    });
});

chrome.extension.onMessage.addListener(function (req, sender, res) {
    a[req.message](req, res);
    return true;
});

// action
var a = {
    toggle: function (req, res) {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.pageAction[res.state?'show':'hide'](tab.id);
        });
    },
    capture: function (req, res) {
        chrome.tabs.getSelected(null, function (tab) {

            chrome.tabs.captureVisibleTab(tab.windowId, {format:'png'}, function (image) {
                // image is base64

                chrome.storage.sync.get(function (sync) {
                    (function (done) {
                        (sync.action == 'full')
                            ? done(image)
                            : e.crop(req, image, done);
                    }(function (image) {
                        res({message:'image', image:image});
                    }));
                });
            });
        });
    },
    save: function (req, res) {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, {message:'save'}, function (res) {
                
            });
        });
    }
};

// extension
var e = {
    crop: function (req, image, done) {
        var canvas = null;
        if (!canvas) {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
        }

        var top = req.crop.y, left = req.crop.x,
            width = req.crop.w, height = req.crop.h;

        var img = new Image();
        img.onload = function() {
            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext('2d');
            context.drawImage(img,
                left, top,
                width, height,
                0, 0,
                width, height
            );

            var cropped = canvas.toDataURL('image/png');
            done(cropped);
        }
        img.src = image;
    }
};
