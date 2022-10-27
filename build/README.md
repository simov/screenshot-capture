
# Build

Build the `vendor` folder, and create the `screenshot-capture.zip` package:

```bash
# pick a release tag
git clone --depth 1 --branch 3.0 https://github.com/simov/screenshot-capture.git
cd screenshot-capture/
# build
sh build/package.sh
```

## Build Dependencies

- Node.js >= 14
- git
- curl
- zip

## Screenshot Capture Dependencies

| Module              | Version
| :-                  | :-
| @material/button    | ^0.40.1
| @material/elevation | ^0.40.1
| @material/radio     | ^0.40.1
| @material/theme     | ^0.40.1
| @material/toolbar   | ^0.40.1
| @material/typography| ^0.40.1
| mithril             |  1.1.6
| jquery              |  3.1.1
| jquery-jcrop        |  0.9.12
