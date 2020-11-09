import Handlebars from 'handlebars';
import { resolve } from 'path';
import { readFile } from './fs-async';

export type CompileOptions = {
  helpers?: { [key: string]: (...args: any[]) => string };
};

export const renderTemplate = async (
  filePath: string,
  context: object,
  options?: CompileOptions
) => {
  const template = await readFile(resolve(filePath), 'utf8');

  return Handlebars.compile(template)(context, options);
};
