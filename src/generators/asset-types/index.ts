import { AssetType, FontAssetType, OtherAssetType } from '../../types/misc';
import { FontGenerator } from '../../types/generator';
import svg from './svg';
import ttf from './ttf';
import woff from './woff';
import woff2 from './woff2';
import eot from './eot';
import css from './css';
import scss from './scss';
import html from './html';
import json from './json';
import ts from './ts';

const generators: { [key in AssetType]: FontGenerator<any> } = {
  [FontAssetType.SVG]: svg,
  [FontAssetType.TTF]: ttf,
  [FontAssetType.WOFF]: woff,
  [FontAssetType.WOFF2]: woff2,
  [FontAssetType.EOT]: eot,
  [OtherAssetType.CSS]: css,
  [OtherAssetType.SCSS]: scss,
  [OtherAssetType.HTML]: html,
  [OtherAssetType.JSON]: json,
  [OtherAssetType.TS]: ts
};

export default generators;
