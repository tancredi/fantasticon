import { getHash } from '../hash';

describe('Hash utilities', () => {
  test('`getHash` outputs a unique string depending on the content it’s given', () => {
    expect(getHash('a', 'b')).toEqual(getHash('a', 'b'));
    expect(getHash(Buffer.from('a'), 'b')).toEqual(getHash('a', 'b'));

    expect(getHash('a', 'b', 'c')).not.toEqual(getHash('a', 'b'));
    expect(getHash('a', 'c')).not.toEqual(getHash('a', 'b'));
  });

  test('`getHash` always returns a 32 character string', () => {
    for (const values of [
      ['foo'],
      ['foo', 'bar', Buffer.from('test')],
      ['--']
    ]) {
      const hash = getHash(...(values as any[]));

      expect(hash).toHaveLength(32);
      expect(typeof hash).toBe('string');
    }
  });
});
