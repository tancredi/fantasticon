const MOCK_GLOBS: Record<string, string[]> = {
  './valid/**/*.svg': [
    '/project/valid/foo.svg',
    '/project/valid/bar.svg',
    '/project/valid/sub/nested.svg',
    '/project/valid/sub/sub/nested.svg'
  ],
  './empty/**/*.svg': []
};

const glob = async (glob: string, _: {}) => {
  const paths = MOCK_GLOBS[glob];

  if (!paths) {
    throw new Error(`Invalid glob: ${glob}`);
  }

  return paths;
};

export { glob };
