const MOCK_GLOBS = {
  './valid/**/*.svg': [
    '/project/valid/foo.svg',
    '/project/valid/bar.svg',
    '/project/valid/sub/nested.svg',
    '/project/valid/sub/sub/nested.svg'
  ],
  './empty/**/*.svg': []
};

module.exports = {
  glob: async (glob: string, _: {}) => {
    const paths = MOCK_GLOBS[glob];

    if (!paths) {
      throw new Error(`Invalid glob: ${glob}`);
    }

    return paths;
  }
};
