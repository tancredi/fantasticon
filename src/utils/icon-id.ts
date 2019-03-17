import { removeExtension } from './path';
import { resolve, relative } from 'path';
import * as slug from 'slug';

const SLUG_OPTIONS: Partial<typeof slug.defaults> = {
  charmap: { ...slug.charmap, '/': '-', '.': '-' }
};

export const getIconId = (filepath, root) =>
  slug(
    removeExtension(relative(resolve(root), resolve(filepath))),
    SLUG_OPTIONS
  );
