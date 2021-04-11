import { resolve, relative } from 'path';
import slug from 'slugify';
import { removeExtension } from './path';

export const getIconId = (filepath: string, root: string) =>
  slug(
    removeExtension(relative(resolve(root), resolve(filepath))).replace(
      /(\/|\\|\.|\')+/g,
      '-'
    ),
    { replacement: '-' }
  );
