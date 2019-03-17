import { FontType } from '../types/misc';
import { FontGenerator } from '../types/generator';
import svg from './svg';
import ttf from './ttf';
import woff from './woff';
import woff2 from './woff2';
import eot from './eot';

const generators: { [key in FontType]: FontGenerator<any> } = {
  [FontType.SVG]: svg,
  [FontType.TTF]: ttf,
  [FontType.WOFF]: woff,
  [FontType.WOFF2]: woff2,
  [FontType.EOT]: eot
};

export default generators;
