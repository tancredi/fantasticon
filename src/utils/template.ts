import Handlebars from 'handlebars';
import { readFile } from './fs-async';

type BuiltinHelperName =
  | 'helperMissing'
  | 'blockHelperMissing'
  | 'each'
  | 'if'
  | 'unless'
  | 'with'
  | 'log'
  | 'lookup';

type CustomHelperName = string;

type KnownHelpers = {
  [name in BuiltinHelperName | CustomHelperName]: boolean;
};

export interface CompileOptions {
  data?: boolean;
  compat?: boolean;
  knownHelpers?: KnownHelpers;
  knownHelpersOnly?: boolean;
  noEscape?: boolean;
  strict?: boolean;
  assumeObjects?: boolean;
  preventIndent?: boolean;
  ignoreStandalone?: boolean;
  explicitPartialContext?: boolean;
  helpers?: {
    contentSelector?: (key: string) => string;
    codepoint?: (hexNumber: number) => string;
    foo?: () => string;
  };
}

export const renderTemplate = async ({
  path,
  context: { selector, tag, ...context },
  compilerOptions
}: {
  path: string;
  context: Record<string, any>;
  compilerOptions?: CompileOptions;
}) => {
  const template = await readFile(path, 'utf8');
  return Handlebars.compile(template)(
    { baseName: selector || tag, selector, tag, ...context },
    compilerOptions
  );
};
