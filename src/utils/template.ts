import Handlebars from 'handlebars';
import { resolve } from 'path';
import { readFile } from './fs-async';
import { slashJoin } from './path';

const TEMPLATES_PATH = resolve(__dirname, '../../templates');

export const renderTemplate = async (filename: string, context: any) => {
  const filepath = slashJoin(TEMPLATES_PATH, filename);
  const template = await readFile(filepath, 'utf8');

  return Handlebars.compile(template)(context);
};
