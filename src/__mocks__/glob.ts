const mockGlobs = {
  './valid/**/*.svg': [
    '/root/valid/foo.svg',
    '/root/valid/bar.svg',
    '/root/valid/sub/nested.svg',
    '/root/valid/sub/sub/nested.svg'
  ],
  './empty/**/*.svg': []
};

module.exports = (
  glob: string,
  config: {},
  callback: (err: Error | null, paths: string[] | null) => void
) => {
  setTimeout(() => {
    const paths = mockGlobs[glob];

    if (!paths) {
      return callback(new Error(`Invalid glob: ${glob}`), null);
    }

    return callback(null, paths);
  });
};
