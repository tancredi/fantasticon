import { GetIconIdFn } from '../types/misc.js';
import { removeExtension } from './path.js';
import slug from 'slugify';

export const getIconId: GetIconIdFn = ({ relativeFilePath }) =>
  slug(removeExtension(relativeFilePath).replace(/(\/|\\|\.)+/g, '-'), {
    replacement: '-',
    remove: /['"`]/g
  });
