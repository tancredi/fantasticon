import cssGen from '../css';
import { renderSrcAttribute } from '../../../utils/css';
import { resolve } from 'path';
import { vi, it, describe, beforeEach, expect, Mock } from 'vitest';

const renderSrcMock = renderSrcAttribute as any as Mock;

const mockOptions = {
  name: 'test-font',
  prefix: 'tf',
  tag: 'b',
  codepoints: { 'my-icon': 0xf101 },
  assets: { 'my-icon': null },
  templates: {
    css: resolve(__dirname, '../../../../templates/css.hbs')
  }
} as any;

vi.mock('../../../utils/css', () => ({
  renderSrcAttribute: vi.fn(() => '"::src-attr::"')
}));

describe('`CSS` asset generator', () => {
  beforeEach(() => {
    renderSrcMock.mockClear();
  });

  it('renders CSS correctly with prefix and tag name options', async () => {
    expect(
      await cssGen.generate(mockOptions, Buffer.from(''))
    ).toMatchSnapshot();
  });

  it('renders CSS correctly with `selector` option', async () => {
    expect(
      await cssGen.generate(
        { ...mockOptions, selector: '.my-selector' },
        Buffer.from('')
      )
    ).toMatchSnapshot();
  });

  it('calls renderSrcAttribute correctly and includes its return value in the rendered template', async () => {
    const fontBuffer = Buffer.from('::svg-content::');

    const result = await cssGen.generate(mockOptions, fontBuffer);

    expect(renderSrcMock).toHaveBeenCalledTimes(1);
    expect(renderSrcMock).toHaveBeenCalledWith(mockOptions, fontBuffer);
    expect(result).toContain('::src-attr::');
  });

  it('renders expected selector blocks', async () => {
    const css = await cssGen.generate(mockOptions, Buffer.from(''));

    expect(css).toContain('b[class^="tf-"]:before, b[class*=" tf-"]:before {');
    expect(css).toContain('.tf-my-icon:before {');
  });

  it('renders expected selector blocks with `selector` option', async () => {
    const css = await cssGen.generate(
      { ...mockOptions, selector: '.my-selector' },
      Buffer.from('')
    );

    expect(css).toContain('.my-selector:before {');
    expect(css).toContain('.my-selector.tf-my-icon:before {');
  });
});
