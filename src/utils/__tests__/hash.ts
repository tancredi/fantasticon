import { getHash } from '../hash';

describe('Hash utilities', () => {
  describe('getHash', () => {
    it('outputs a unique string depending on the content it’s given', () => {
      expect(getHash('a', 'b')).toEqual(getHash('a', 'b'));
      expect(getHash(Buffer.from('a'), 'b')).toEqual(getHash('a', 'b'));

      expect(getHash('a', 'b', 'c')).not.toEqual(getHash('a', 'b'));
      expect(getHash('a', 'c')).not.toEqual(getHash('a', 'b'));
    });

    it.each([[['foo']], [['foo', 'bar', Buffer.from('it')]], [['--']]])(
      'always returns a 32 character string - input arguments: %s',
      values => {
        const hash = getHash(...(values as any[]));

        expect(hash).toHaveLength(32);
        expect(typeof hash).toBe('string');
      }
    );
  });
});
