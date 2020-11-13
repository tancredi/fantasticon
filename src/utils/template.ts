import Handlebars from 'handlebars';
import { resolve, isAbsolute } from 'path';
import { AssetType } from '../types/misc';
import { readFile } from './fs-async';

const TEMPLATES_PATH = '../../templates';

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

export const getDefaultTemplatePath = (assetType: AssetType) =>
  resolve(__dirname, TEMPLATES_PATH, `${assetType}.hbs`);
