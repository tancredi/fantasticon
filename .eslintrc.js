const { join } = require('path');

const { Linter } = require('eslint');

const eslintTodo = require('./.eslint-todo.json');

/**
 * @type {Linter.Config}
 */
const commonConfigTsAndJs = {
  env: {
    jest: true,
    es6: true,
    es2016: true,
    es2017: true,
    es2018: true,
    es2019: true,
    es2020: true,
    es2021: true,
    es2022: true,
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
      },
    ],
    'no-console': ['error', { allow: ['error'] }],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'array-bracket-spacing': [
      'error',
      'never',
      {
        objectsInArrays: false,
        arraysInArrays: false,
      },
    ],

    camelcase: [
      'error',
      {
        ignoreDestructuring: true,
        ignoreImports: true,
        ignoreGlobals: true,
        allow: [],
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: true },
    ],
    'no-restricted-imports': ['error', 'rxjs/Rx'],
    'arrow-parens': ['error', 'as-needed'],
    'linebreak-style': ['error', 'unix'],
    'no-trailing-spaces': ['error', { ignoreComments: true }],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'],
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
};

/**
 * @type {Linter.RulesRecord}
 */
const tsRules = {
  ...commonConfigTsAndJs.rules,
  'tsdoc/syntax': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'after-used',
      ignoreRestSiblings: true,
      destructuredArrayIgnorePattern: '^_',
      caughtErrors: 'none',
    },
  ],
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'variable',
      leadingUnderscore: 'allowSingleOrDouble',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
    },
  ],
  '@typescript-eslint/array-type': ['error'],
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/consistent-type-definitions': 'error',
  '@typescript-eslint/explicit-function-return-type': [
    'warn',
    {
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
      allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      allowedNames: [],
    },
  ],
  '@typescript-eslint/explicit-module-boundary-types': [
    'error',
    {
      allowDirectConstAssertionInArrowFunctions: true,
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true,
      allowedNames: [],
    },
  ],
  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    {
      accessibility: 'explicit',
      overrides: {
        constructors: 'no-public',
      },
      ignoredMethodNames: [],
    },
  ],
  '@typescript-eslint/member-delimiter-style': [
    'error',
    {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    },
  ],
  '@typescript-eslint/ban-types': [
    'error',
    {
      types: {
        /* add a custom message to help explain why not to use it */
        // Foo: "Don't use Foo because it is unsafe",

        /* add a custom message, AND tell the plugin how to fix it */
        // OldAPI: {
        //   message: 'Use NewAPI instead',
        //   fixWith: 'NewAPI'
        // },

        /* un-ban a type that's banned by default */
        '{}': false,
      },
      extendDefaults: true,
    },
  ],
};

/**
 * @type {Linter.RulesRecord}
 */
const jsRules = {
  ...commonConfigTsAndJs.rules,
  'no-unused-vars': [
    'error',
    {
      args: 'after-used',
      ignoreRestSiblings: true,
      destructuredArrayIgnorePattern: '^_',
      caughtErrors: 'none',
    },
  ],
};

/**
 * Create todo override config
 *
 * The override is basically the same as the original, but it only lints files
 * given, and turns the rules given from `'error'` (linter fail) to `'warn'`.
 * This allows to introduce eslint to the project, without the need to change
 * all the existing code base.
 *
 * @param {Linter.ConfigOverride} originalOverride
 * @param {object} todoConfig
 * @param {string[]} todoConfig.files
 * @param {string[]} todoConfig.rules
 * @returns {Linter.ConfigOverride}
 */
const createIgnoreOverride = (originalOverride, todoConfig) => {
  if (!todoConfig.files.length) {
    return;
  }
  const todoRulesAsWarn = todoConfig.rules.map(ruleId => {
    if (
      typeof originalOverride.rules[ruleId] === 'undefined' ||
      typeof originalOverride.rules[ruleId] === 'string'
    ) {
      return [ruleId, 'warn'];
    }
    return [ruleId, ['warn', ...originalOverride.rules[ruleId].slice(1)]];
  });
  return {
    ...originalOverride,
    files: todoConfig.files,
    excludedFiles: [],
    rules: {
      ...originalOverride.rules,
      ...Object.fromEntries(todoRulesAsWarn),
    },
  };
};

/**
 * @param {boolean} withIgnore use the ignore config
 * @returns {Linter.Config}
 */
const createEslintConfig = (withIgnore = true) => {
  /**
   * @type {Linter.ConfigOverride}
   */
  const tsOverride = {
    files: ['*.ts'],
    excludedFiles: withIgnore ? eslintTodo.typeScript.files : [],
    parserOptions: {
      // path.join() because IntelliJ needs absolut paths here.
      project: [join(__dirname, 'tsconfig.json')],
      createDefaultProgram: true,
    },
    env: commonConfigTsAndJs.env,
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },

      'import/resolver': {
        typescript: {
          project: [
            // path.join() because IntelliJ needs absolut paths here.
            join(__dirname, 'tsconfig.json'),
            join(__dirname, 'src/tsconfig.json'),
            join(__dirname, 'src/tsconfig.test.json'),
            join(__dirname, 'dev-scripts/tsconfig.json'),
          ],
          alwaysTryTypes: true,
        },
      },
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'prettier',
      'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint', 'import', 'tsdoc', 'prettier', 'jest'],
    rules: tsRules,
  };

  /**
   * @type {Linter.ConfigOverride}
   */
  const jsOverride = {
    files: ['*.js'],
    excludedFiles: withIgnore ? eslintTodo.javaScript.files : [],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    env: commonConfigTsAndJs.env,
    extends: [
      'eslint:recommended',
      'plugin:jsdoc/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'prettier',
      'plugin:prettier/recommended',
    ],
    plugins: ['import', 'jsdoc', 'prettier'],
    rules: jsRules,
  };

  return {
    root: true,
    ignorePatterns: [],
    overrides: [
      tsOverride,
      withIgnore && createIgnoreOverride(tsOverride, eslintTodo.typeScript),
      jsOverride,
      withIgnore && createIgnoreOverride(jsOverride, eslintTodo.javaScript),
    ].filter(Boolean),
  };
};

/**
 * The env variable NO_ESLINT_TODO disables the todo config
 *
 * @type {Linter.Config}
 */
module.exports = createEslintConfig(process.env.NO_ESLINT_TODO !== '1');
