import scssGen from '../scss';
import { renderSrcAttribute } from '../../../utils/css';
import { resolve } from 'path';

const renderSrcMock = (renderSrcAttribute as any) as jest.Mock;

const mockOptions = {
  name: 'test',
  prefix: 'tf',
  tag: 'b',
  codepoints: { 'my-icon': 0xf101 },
  assets: { 'my-icon': null },
  templates: {
    scss: resolve(__dirname, '../../../../templates/scss.hbs')
  }
} as any;

jest.mock('../../../utils/css', () => ({
  renderSrcAttribute: jest.fn(() => '"::src-attr::"')
}));

describe('`SCSS` asset generator', () => {
  beforeEach(() => {
    renderSrcMock.mockClear();
  });

  test('renders SCSS correctly with prefix and tag name options', async () => {
    expect(
      await scssGen.generate(mockOptions, Buffer.from(''))
    ).toMatchSnapshot();
  });

  test('renders SCSS correctly with `selector` option', async () => {
    expect(
      await scssGen.generate(
        { ...mockOptions, selector: '.my-selector' },
        Buffer.from('')
      )
    ).toMatchSnapshot();
  });

  test('calls renderSrcAttribute correctly and includes its return value in the rendered template', async () => {
    const fontBuffer = Buffer.from('::svg-content::');

    const result = await scssGen.generate(mockOptions, fontBuffer);

    expect(renderSrcMock).toHaveBeenCalledTimes(1);
    expect(renderSrcMock).toHaveBeenCalledWith(mockOptions, fontBuffer);
    expect(result).toContain('::src-attr::');
  });

  test('renders expected selector blocks', async () => {
    const scss = await scssGen.generate(mockOptions, Buffer.from(''));

    expect(scss).toContain('b[class^="tf-"]:before, b[class*=" tf-"]:before {');
    expect(scss).toContain('.tf-my-icon:before {');
  });

  test('renders expected variables', async () => {
    const scss = await scssGen.generate(mockOptions, Buffer.from(''));

    expect(scss).toContain('$test-font:');
    expect(scss).toContain('$test-map:');
  });

  test('renders expected selector blocks with `selector` option', async () => {
    const scss = await scssGen.generate(
      { ...mockOptions, selector: '.my-selector' },
      Buffer.from('')
    );

    expect(scss).toContain('.my-selector:before {');
    expect(scss).toContain('.my-selector.tf-my-icon:before {');
  });
});
