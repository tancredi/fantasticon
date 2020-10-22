import tsGen from '../ts';

const mockCodepoints = { foo: 'oof', bar: 'baz' };

const mockOptions = { codepoints: mockCodepoints } as any;

describe('`TS` asset generator', () => {
  test('renders expected TypeScript module content', async () => {
    expect(await tsGen.generate(mockOptions).toEqual(''));
  });
});
