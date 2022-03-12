const mockGlobs = {
  './valid/**/*.svg': [
    '/project/valid/foo.svg',
    '/project/valid/bar.svg',
    '/project/valid/sub/nested.svg',
    '/project/valid/sub/sub/nested.svg'
  ],
  './empty/**/*.svg': []
};

module.exports = (
  glob: string,
  _: {},
  callback: (err: Error | null, paths: string[] | null) => void
) => {
  setTimeout(() => {
    const paths = mockGlobs[glob];

    if (!paths) {
      callback(new Error(`Invalid glob: ${glob}`), null);
      return;
    }

    callback(null, paths);
  });
};
