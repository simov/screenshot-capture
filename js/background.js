// chrome.storage.sync.clear();
chrome.storage.sync.get(function (sync) {
    if (!sync.options)
        chrome.storage.sync.set({options: {action:'crop'}});
});

chrome.commands.onCommand.addListener(function (command) {
    if (command == 'take-screenshot') {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, {message:'toggle'}, function (res) {
                chrome.pageAction[res.state?'show':'hide'](tab.id);
            });
        });
    }
});

chrome.extension.onMessage.addListener(function (req, sender, res) {
    scr[req.message](req, res);
    return true;
});

var scr = {
    crop: function (req, res) {
        chrome.tabs.getSelected(null, function (tab) {

            chrome.tabs.captureVisibleTab(tab.windowId, {format:'png'}, function (result) {
                // result is base64

                var canvas = null;
                if (!canvas) {
                    canvas = document.createElement('canvas');
                    document.body.appendChild(canvas);
                }

                var top = req.crop.y, left = req.crop.x,
                    width = req.crop.w, height = req.crop.h;

                var image = new Image();
                image.onload = function() {
                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext('2d');
                    context.drawImage(image,
                        left, top,
                        width, height,
                        0, 0,
                        width, height
                    );
                    var cropped = canvas.toDataURL('image/png');

                    res({message:'crop', image:cropped});
                }
                image.src = result;
            });
        });
    }
};
