import { resolve, relative } from 'path';
import slug from 'slug';
import { removeExtension } from './path';

const SLUG_OPTIONS: Partial<typeof slug.defaults> = {
  charmap: { ...slug.charmap, '/': '-', '\\': '-', '.': '-' }
};

export const getIconId = (filepath: string, root: string) =>
  slug(
    removeExtension(relative(resolve(root), resolve(filepath))),
    SLUG_OPTIONS
  );
