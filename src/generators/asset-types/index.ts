import { AssetType, FontAssetType, OtherAssetType } from '../../types/misc.js';
import { FontGenerator } from '../../types/generator.js';
import svg from './svg.js';
import ttf from './ttf.js';
import woff from './woff.js';
import woff2 from './woff2.js';
import eot from './eot.js';
import css from './css.js';
import html from './html.js';
import json from './json.js';
import ts from './ts.js';
import sass from './sass.js';
import scss from './scss.js';

const generators: { [key in AssetType]: FontGenerator<any> } = {
  [FontAssetType.SVG]: svg,
  [FontAssetType.TTF]: ttf,
  [FontAssetType.WOFF]: woff,
  [FontAssetType.WOFF2]: woff2,
  [FontAssetType.EOT]: eot,
  [OtherAssetType.CSS]: css,
  [OtherAssetType.HTML]: html,
  [OtherAssetType.JSON]: json,
  [OtherAssetType.TS]: ts,
  [OtherAssetType.SASS]: sass,
  [OtherAssetType.SCSS]: scss
};

export default generators;
