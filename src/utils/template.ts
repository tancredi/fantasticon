import Handlebars from 'handlebars';
import { resolve } from 'path';
import { readFile } from './fs-async';
import { slashJoin } from './path';

export type CompileOptions = {
  helpers?: { [key: string]: (...args: any[]) => string };
};

const TEMPLATES_PATH = resolve(__dirname, '../../templates');

export const renderTemplate = async (
  filename: string,
  context: object,
  options?: CompileOptions
) => {
  const filepath = slashJoin(TEMPLATES_PATH, filename);
  const template = await readFile(filepath, 'utf8');

  return Handlebars.compile(template)(context, options);
};
