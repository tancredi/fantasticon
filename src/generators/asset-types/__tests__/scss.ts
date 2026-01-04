import scssGen from '../scss';
import { renderSrcAttribute } from '../../../utils/css';
import { resolve } from 'path';
import { vi, it, describe, beforeEach, expect, Mock } from 'vitest';

const renderSrcMock = renderSrcAttribute as any as Mock;

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

vi.mock('../../../utils/css', () => ({
  renderSrcAttribute: vi.fn(() => '"::src-attr::"')
}));

describe('`SCSS` asset generator', () => {
  beforeEach(() => {
    renderSrcMock.mockClear();
  });

  it('renders SCSS correctly with prefix and tag name options', async () => {
    expect(
      await scssGen.generate(mockOptions, Buffer.from(''))
    ).toMatchSnapshot();
  });

  it('renders SCSS correctly with `selector` option', async () => {
    expect(
      await scssGen.generate(
        { ...mockOptions, selector: '.my-selector' },
        Buffer.from('')
      )
    ).toMatchSnapshot();
  });

  it('calls renderSrcAttribute correctly and includes its return value in the rendered template', async () => {
    const fontBuffer = Buffer.from('::svg-content::');

    const result = await scssGen.generate(mockOptions, fontBuffer);

    expect(renderSrcMock).toHaveBeenCalledTimes(1);
    expect(renderSrcMock).toHaveBeenCalledWith(mockOptions, fontBuffer);
    expect(result).toContain('::src-attr::');
  });

  it('renders expected selector blocks', async () => {
    const scss = await scssGen.generate(mockOptions, Buffer.from(''));

    expect(scss).toContain('b[class^="tf-"]:before, b[class*=" tf-"]:before {');
    expect(scss).toContain('.tf-#{$name}:before {');
  });

  it('renders expected variables', async () => {
    const scss = await scssGen.generate(mockOptions, Buffer.from(''));

    expect(scss).toContain('$test-font:');
    expect(scss).toContain('$test-map:');
  });

  it('renders expected selector blocks with `selector` option', async () => {
    const scss = await scssGen.generate(
      { ...mockOptions, selector: '.my-selector' },
      Buffer.from('')
    );

    expect(scss).toContain('.my-selector:before {');
    expect(scss).toContain('.my-selector.tf-#{$name}:before {');
  });
});
