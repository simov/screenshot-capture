
# Screenshot Capture / Browser Extension


**Install: [Chrome]**


# Features

- Capture Viewport
- Crop and Save (automatic save)
- Crop and Wait (manual save)
- Configurable Keyboard Shortcut
- Save screenshot as PNG or JPG file format
- Save screenshot as file
- Copy screenshot to clipboard as Data URL String or Binary Image
- Preserve or downscale screenshot size on HDPI displays like Retina
- Unique screenshot date/time file name
- No special permissions required
- Open Source


# Options

1. Click on the extension button using your **Right** Mouse Button
2. Select `Options` from the context menu


# Capture Method

- **`Capture Viewport`** - activate the extension (either using the toolbar button or the [keyboard shortcut](#keyboard-shortcut)) to capture the visible part of the screen. You will be either prompted to save the screenshot or the screenshot will be saved automatically (depending on your [download preferences](#save-location))

- **`Crop and Save`** - activate the extension (either using the toolbar button or the [keyboard shortcut](#keyboard-shortcut)) then hold down your left mouse button somewhere on the page and drag your mouse in any direction. When you release the mouse button the selected area will be cropped and you will be either prompted to save the screenshot or the screenshot will be saved automatically (depending on your [download preferences](#save-location))

- **`Crop and Wait`** - activate the extension (either using the toolbar button or the [keyboard shortcut](#keyboard-shortcut)) then hold down your left mouse button somewhere on the page and drag your mouse in any direction. When you are ready - activate the extension again (either through the toolbar button or the keyboard shortcut) to crop the selected area. You will be either prompted to save the screenshot or the screenshot will be saved automatically (depending on your [download preferences](#save-location))


# Image Format

- **`PNG`** - better image quality but larger file size. Best suited for cropping and capturing simple web pages
- **`JPG`** - smaller file size with slightly worse image quality. Useful when taking fullscreen screenshots of images and videos


# Save Format

- **`To File`** - you will be either prompted to save the screenshot or the screenshot will be saved automatically (depending on your [download preferences](#save-location))
- **`To Clipboard (Data URL String)`** - the screenshot will be copied to the clipboard as Data URL String
- **`To Clipboard (Binary Image)`** - the screenshot will be copied to the clipboard as raw Binary Image


# Screenshot Size

- **`Preserve original DPI size`** - the screenshot will be saved with the actual page size that you are seeing on screen
- **`Adjust to actual size`** - on HDPI displays like Retina or zoomed in pages, the screenshot will be downscaled to the original page size


# Keyboard Shortcut

1. Navigate to `chrome://extensions/shortcuts`
2. Find Screenshot Capture and set key combination for the `Take Screenshot` action


# Save Location

1. Navigate to `chrome://settings/downloads`
2. Change the default download `Location`
3. Use the `Ask where to save each file before downloading` switch to toggle the **autosaving**


# Origins

Note that the extension won't work on certain origins:

- chrome origins like: `chrome://...` and `chrome-extension://...`
- the official chrome web store: `https://chrome.google.com/webstore/category/extensions`


# License

The MIT License (MIT)

Copyright (c) 2014-present Simeon Velichkov <simeonvelichkov@gmail.com> (https://github.com/simov/screenshot-capture)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


  [chrome]: https://chrome.google.com/webstore/detail/screenshot-capture/giabbpobpebjfegnpcclkocepcgockkc
  [paypal]: https://www.paypal.me/simeonvelichkov
