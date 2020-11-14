import Handlebars from 'handlebars';
import { resolve, isAbsolute } from 'path';
import { readFile } from './fs-async';

export type CompileOptions = {
  helpers?: { [key: string]: (...args: any[]) => string };
};

export const renderTemplate = async (
  templatePath: string,
  context: object,
  options?: CompileOptions
) => {
  const absoluteTemplatePath = isAbsolute(templatePath)
    ? templatePath
    : resolve(process.cwd(), templatePath);
  const template = await readFile(absoluteTemplatePath, 'utf8');

  return Handlebars.compile(template)(context, options);
};
