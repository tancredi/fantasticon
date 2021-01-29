import { resolve, relative } from 'path';
import slug from 'slugify';
import { removeExtension } from './path';

export const getIconId = (filepath: string, root: string) => {
  let iconId = removeExtension(relative(resolve(root), resolve(filepath))).replace(/(\/|\\|\.)+/g, '-');
  let matches = iconId.match(/^\d{3}\-/);
  if(matches) {
    iconId = iconId.substr(4);
  }
  return slug(iconId, { replacement: '-' });
}
