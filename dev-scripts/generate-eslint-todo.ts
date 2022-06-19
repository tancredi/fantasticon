#!/usr/bin/env -S TS_NODE_PROJECT="dev-scripts/tsconfig.json" npx ts-node --transpile-only --files -r tsconfig-paths/register
import { existsSync } from 'fs';
import { rm, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

import { ESLint } from 'eslint';

const PATH_ROOT = resolve(__dirname, '../');
const PATH_SRC = join(PATH_ROOT, 'src');
const PATH_DEV_SCRIPTS = join(PATH_ROOT, 'dev-scripts');
const PATH_TODO_FILE = join(PATH_ROOT, '.eslint-todo.json');

const GLOB_SRC = `${PATH_SRC}/**/*.{ts,js}`;
const GLOB_DEV_SCRIPTS = `${PATH_DEV_SCRIPTS}/**/*.{ts,js}`;

interface TodoExcludes {
  rules: string[];
  files: string[];
}
export interface EslintTodoConfig {
  typeScript: TodoExcludes;
  javaScript: TodoExcludes;
  /**
   * The time the generator has generated the todo file
   */
  generatedAt: string;
}

export const getErrorResults = async (): Promise<ESLint.LintResult[]> => {
  process.env.NO_ESLINT_TODO = '1';
  const eslint = new ESLint({ useEslintrc: true, cwd: PATH_ROOT });
  const results = await eslint.lintFiles([GLOB_DEV_SCRIPTS, GLOB_SRC]);
  return results.filter(({ errorCount }) => errorCount > 0);
};

const getExcludePaths = (results: ESLint.LintResult[]): string[] =>
  results.map(({ filePath }) => filePath.replace(`${PATH_ROOT}/`, ''));

const getUniqueRuleIds = (results: ESLint.LintResult[]): string[] =>
  [
    ...new Set(
      results
        .map(result => result.messages.map(message => message.ruleId))
        .reduce((acc, msg) => acc.concat(msg), [])
    ),
  ].sort();

const createTodoExcludes = (
  results: ESLint.LintResult[],
  type: 'ts' | 'js'
): TodoExcludes => {
  const typeResults = results.filter(res => res.filePath.endsWith(`.${type}`));
  return {
    rules: getUniqueRuleIds(typeResults),
    files: getExcludePaths(typeResults),
  };
};

export const createTodoConfig = async (): Promise<EslintTodoConfig> => {
  const errorResults = await getErrorResults();
  return {
    typeScript: createTodoExcludes(errorResults, 'ts'),
    javaScript: createTodoExcludes(errorResults, 'js'),
    generatedAt: new Date().toISOString(),
  };
};

const run = async (): Promise<void> => {
  const config = await createTodoConfig();
  if (existsSync(PATH_TODO_FILE)) {
    await rm(PATH_TODO_FILE);
  }
  await writeFile(PATH_TODO_FILE, JSON.stringify(config, null, 2));
};

run();
