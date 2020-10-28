import { getIconId } from '../icon-id';

describe('Icon ID utilities', () => {
  test('`getIconId` produces correcty icon IDs from given filepaths', () => {
    expect(getIconId('./foo/bar/icon.svg', 'foo/bar')).toBe('icon');
    expect(getIconId('foo/bar/icon.svg', './foo')).toBe('bar-icon');
    expect(getIconId('foo/icon.SVG', 'foo')).toBe('icon');
    expect(getIconId('foo/icon-test_1_a', 'foo')).toBe('icon-test_1_a');
    expect(getIconId('foo/ICON-test', 'foo')).toBe('ICON-test');
    expect(getIconId('foo/test/icon-test.foo.Sv g', 'foo')).toBe(
      'test-icon-test-foo'
    );
  });

  test('`getIconId` support backslashes as well as forward slashes', () => {
    expect(getIconId('./foo/bar\\icon.svg', 'foo')).toBe('bar-icon');
  });
});
