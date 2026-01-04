import sassGen from '../sass';
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
    sass: resolve(__dirname, '../../../../templates/sass.hbs')
  }
} as any;

vi.mock('../../../utils/css', () => ({
  renderSrcAttribute: vi.fn(() => '"::src-attr::"')
}));

describe('`SASS` asset generator', () => {
  beforeEach(() => {
    renderSrcMock.mockClear();
  });

  it('renders SASS correctly with prefix and tag name options', async () => {
    expect(
      await sassGen.generate(mockOptions, Buffer.from(''))
    ).toMatchSnapshot();
  });

  it('renders SASS correctly with `selector` option', async () => {
    expect(
      await sassGen.generate(
        { ...mockOptions, selector: '.my-selector' },
        Buffer.from('')
      )
    ).toMatchSnapshot();
  });

  it('calls renderSrcAttribute correctly and includes its return value in the rendered template', async () => {
    const fontBuffer = Buffer.from('::svg-content::');

    const result = await sassGen.generate(mockOptions, fontBuffer);

    expect(renderSrcMock).toHaveBeenCalledTimes(1);
    expect(renderSrcMock).toHaveBeenCalledWith(mockOptions, fontBuffer);
    expect(result).toContain('::src-attr::');
  });

  it('renders expected selector blocks', async () => {
    const sass = await sassGen.generate(mockOptions, Buffer.from(''));

    expect(sass).toContain('b[class^="tf-"]:before, b[class*=" tf-"]:before');
    expect(sass).toContain('.tf-#{$name}:before');
  });

  it('renders expected variables', async () => {
    const sass = await sassGen.generate(mockOptions, Buffer.from(''));

    expect(sass).toContain('$test-font:');
    expect(sass).toContain('$test-map:');
  });

  it('renders expected selector blocks with `selector` option', async () => {
    const sass = await sassGen.generate(
      { ...mockOptions, selector: '.my-selector' },
      Buffer.from('')
    );

    expect(sass).toContain('.my-selector:before');
    expect(sass).toContain('.my-selector.tf-#{$name}:before');
  });
});
