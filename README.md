
# Screenshot Capture / Browser Extension

**Install: [Chrome]** / **[Edge]** / **[Opera]**  / **[Brave]** / **[Chromium]** / **[Vivaldi]**

# Features

- Secure by design
- Capture Viewport
- Crop and Save (automatic save)
- Crop and Wait (manual save)
- Configurable Keyboard Shortcut
- Save screenshot as PNG or JPG image file
- Copy screenshot to clipboard as Data URL String or Binary Image
- Preserve or downscale screenshot size on HDPI displays like Retina
- Unique screenshot date/time file name
- No special permissions required
- Free and Open Source

# Options

1. Pin the extension to your browser toolbar
2. Click on the extension button using your **Right** Mouse Button
3. Select `Options` from the context menu

# Table of Contents

- **[Capture Method](#capture-method)**
- **[Image Format](#image-format)**
- **[Screenshot Scaling](#screenshot-scaling)**
- **[Save Format](#save-format)**
- **[Keyboard Shortcut](#keyboard-shortcut)**
- **[Save Location](#save-location)**
- **[Caveats](#caveats)**

# Capture Method

#### **`Crop and Save`**

1. Activate the extension by using the [keyboard shortcut](#keyboard-shortcut) or by clicking on the extension button
2. Hold down your left mouse button anywhere on the page and drag your mouse in any direction
3. Release the mouse button when you are ready, the selected area will be cropped

#### **`Crop and Wait`**

1. Activate the extension by using the [keyboard shortcut](#keyboard-shortcut) or by clicking on the extension button
2. Hold down your left mouse button anywhere on the page and drag your mouse in any direction
3. Adjust the selected are to crop and/or move it around
4. When you are ready activate the extension again by using the [keyboard shortcut](#keyboard-shortcut) or by clicking on the extension button, the selected area will be cropped

#### **`Capture Viewport`**

1. Activate the extension by using the [keyboard shortcut](#keyboard-shortcut) or by clicking on the extension button
2. The visible area of the screen will be captured

# Image Format

- **`PNG`** - better image quality but larger file size. Best suited for cropping and capturing simple web pages

- **`JPG`** - smaller file size with slightly lower image quality. Useful when capturing the entire screen area especially with lots of images on screen or when capturing still shots of videos. The quality of the JPEG can be adjusted from 100 to 0 (highest to lowest)

# Screenshot Scaling

- **`Preserve scaling`** - the screenshot will be saved with the page scaling that you are seeing on the screen

- **`Downscale to actual size`** - on HDPI displays like Retina or zoomed pages the screenshot will be downscaled to the original page size

# Save Format

- **`To File`** - save the screenshot to a file. Depending on your [download preferences](#save-location) you will be either prompted to save the file or the file will be saved automatically in your download folder

- **`To Clipboard`** - copy the screenshot to your clipboard:
  - **`Data URL String`** - the screenshot will be copied to the clipboard as Data URL String
  - **`Binary Image`** - the screenshot will be copied to the clipboard as raw Binary Image
  - **`Confirmation Dialog`** - toggle the confirmation dialog on copy to clipboard

# Keyboard Shortcut

1. Navigate to `chrome://extensions/shortcuts`
2. Find the Screenshot Capture extension and set key combination for the `Take Screenshot` action

# Save Location

1. Navigate to `chrome://settings/downloads`
2. Change the default download `Location`
3. Use the `Ask where to save each file before downloading` switch to toggle the **autosaving**

# Caveats

The extension won't work on the following origins:

- chrome and extension settings pages - `chrome://` and `chrome-extension://`
- the official chrome web store - `https://chromewebstore.google.com/`
- your home page

To enable the extension on local `file:///` URLs:

1. Navigate to `chrome://extensions`
2. Locate the Screenshot Capture extension and click on the `Details` button
3. Make sure that the `Allow access to file URLs` switch is turned on

Copy to clipboard:

- it won't work on domains served on insecure `http://` protocol, but it will work on `http://localhost`
- when using `Capture Viewport` you will be asked by the browser to grant read access to the clipboard
- `Capture Viewport` won't work on PDF documents, use `Crop and Save` instead and select the entire screen area

# Manual Install

The following instructions applies for: Chrome, Edge, Opera, Brave, Chromium and Vivaldi.

Note that in any of the following cases you won't receive any future updates automatically!

## Load packed .crx

1. Go to [releases] and pick a release that you want to install
2. Download the `screenshot-capture.crx` file
3. Navigate to `chrome://extensions`
4. Drag and drop the `markdown-viewer.crx` file into the `chrome://extensions` page

## Load unpacked .zip

1. Go to [releases] and pick a release that you want to install
2. Download the `screenshot-capture.zip` file and extract it
3. Navigate to `chrome://extensions`
4. Make sure that the `Developer mode` switch is enabled
5. Click on the `Load unpacked` button and select the extracted directory

## Build

1. Clone this repository
2. Execute `sh build/package.sh chrome`
3. Navigate to `chrome://extensions`
4. Make sure that the `Developer mode` switch is enabled
5. Click on the `Load unpacked` button and select the cloned directory

## Manifest v2

1. Clone the [mv2] branch (Screenshot Capture v2.0)
2. Navigate to `chrome://extensions`
3. Make sure that the `Developer mode` switch is enabled
4. Click on the `Load unpacked` button and select the cloned directory

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


  [chrome]: https://chromewebstore.google.com/detail/screenshot-capture/giabbpobpebjfegnpcclkocepcgockkc
  [edge]: https://microsoftedge.microsoft.com/addons/detail/screenshot-capture/fjmanmejbodljeaicnkgdgibdbeheela
  [opera]: https://chromewebstore.google.com/detail/screenshot-capture/giabbpobpebjfegnpcclkocepcgockkc
  [brave]: https://chromewebstore.google.com/detail/screenshot-capture/giabbpobpebjfegnpcclkocepcgockkc
  [chromium]: https://chromewebstore.google.com/detail/screenshot-capture/giabbpobpebjfegnpcclkocepcgockkc
  [vivaldi]: https://chromewebstore.google.com/detail/screenshot-capture/giabbpobpebjfegnpcclkocepcgockkc

  [releases]: https://github.com/simov/screenshot-capture/releases
  [mv2]: https://github.com/simov/screenshot-capture/tree/mv2
