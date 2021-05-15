import { GetIconIdFn } from '../types/misc';
import { removeExtension } from './path';
import slug from 'slugify';

export const getIconId: GetIconIdFn = ({ relativeFilePath }) =>
  slug(removeExtension(relativeFilePath).replace(/(\/|\\|\.)+/g, '-'), {
    replacement: '-',
    remove: /['"`]/g
  });
