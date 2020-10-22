import htmlGen from '../html';

const mockOptions = {
  name: 'test-font',
  prefix: 'tf',
  tag: 'b',
  assets: { 'my-icon': null }
} as any;

describe('`HTML` asset generator', () => {
  test('renders HTML correctly with prefix and tag name options', async () => {
    expect(await htmlGen.generate(mockOptions, null)).toMatchSnapshot();
  });
});
