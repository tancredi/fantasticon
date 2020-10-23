![Logo](assets/logo.png)

## Iconfont tool

![Screenshot](assets/screenshot.png)

> Easy-to-use, pre-configured cli tool to generate web-font icon kits from .svg files

### Intro

Icon-font generation, easy to use and highly configurable.

It also generates TypeScript types, JSON maps of the generated code-points, allowing for a great deal of different usages, e.g. integrating with React type-safe icon components or integration on mobile apps by just combining TTF and JSON generation.

### Install

```
npm install -g iconfont-tool
```

## Use

### Quick usage

```
iconfont-tool my-icons/*.svg -o icon-dist
```

### Command-line

```bash
Usage: iconfont-tool [options] [input-dir]

Options:
  -V, --version                output the version number
  -c, --config <value>         custom config path (default: .iconfontrc | iconfontrc | .iconfontrc.json | iconfontrc.json | .iconfontrc.js | iconfontrc.js)
  -o, --output <value>         specify output directory
  -t, --font-types <value...>  specify font formats to generate (default: eot, woff2, woff, available: eot, woff2, woff, ttf, svg)
  -g --asset-types <value...>  specify other asset types to generate (default: css, html, json, ts, available: css, html, json, ts)
  -h, --font-height <value>    the output font height (icons will be scaled so the highest has this height) (default: 300)
  --descent <value>            the font descent
  -n, --normalize              normalize icons by scaling them to the height of the highest icon
  -r, --round                  setup the SVG path rounding [10e12]
  --selector <value>           use a CSS selector instead of 'tag + prefix' (default: null)
  -t, --tag <value>            CSS base tag for icons (default: "i")
  -u, --fonts-url <value>      public url to the fonts directory (used in the generated CSS) (default: "icon")
  --debug                      display errors stack trace (default: false)
  --silent                     run with no logs (default: false)
  --help                       display help for command
```

### Configuration file

Some options (specifically, `formatOptions` and `pathOptions`) cannot be passed to the cli directly.

To have more control and better readability, you can create a simple configuration file.

By default, `iconfont-tool` will look for one of following files in the working directory:

```
.iconfontrc | iconfontrc | .iconfontrc.json | iconfontrc.json | .iconfontrc.js | iconfontrc.js
```

You can specify a custom --config option with your configuration file path.

Here's an example `.iconfontrc.js`:

```js
module.exports = {
  inputDir: './icons',
  outputDir: './dist',
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['ts', 'css', 'json', 'html'],
  fontsUrl: '/static/fonts',
  fontTypes: ['ttf'],
  formatOptions: {
    // Pass options directly to `svgicons2svgfont`
    svg: { metadata: { foo: 'bar' }, ascent: 0.5 },
    json: { indent: 2 }
  },
  pathOptions: {
    ts: './src/types/icon-types.ts',
    json: './misc/icon-codepoints.json'
  }
};
```

### API

```js
import { generateFonts } from 'iconfont-tool';

// Default options
generateFonts({
  name: 'icons',
  fontTypes: [FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF],
  assetTypes: [
    OtherAssetType.CSS,
    OtherAssetType.HTML,
    OtherAssetType.JSON,
    OtherAssetType.TS
  ],
  formatOptions: {},
  pathOptions: {},
  codepoints: {},
  fontHeight: 300,
  round: undefined, // --
  descent: undefined, // Will use `svgicons2svgfont` defaults
  normalize: undefined, // --
  selector: null,
  tag: 'i',
  prefix: 'icon',
  fontsUrl: null
}).then(results => console.log(results));
```

### License

Copyright (c) 2020 Tancredi Trugenberger. - Released under the [MIT license](https://github.com/tancredi/iconfont-tool/blob/master/LICENSE)
