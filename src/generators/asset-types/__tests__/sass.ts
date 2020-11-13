import sassGen from '../sass';
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
    sass: resolve(__dirname, '../../../../templates/sass.hbs')
  }
} as any;

jest.mock('../../../utils/css', () => ({
  renderSrcAttribute: jest.fn(() => '"::src-attr::"')
}));

describe('`SASS` asset generator', () => {
  beforeEach(() => {
    renderSrcMock.mockClear();
  });

  test('renders SASS correctly with prefix and tag name options', async () => {
    expect(
      await sassGen.generate(mockOptions, Buffer.from(''))
    ).toMatchSnapshot();
  });

  test('renders SASS correctly with `selector` option', async () => {
    expect(
      await sassGen.generate(
        { ...mockOptions, selector: '.my-selector' },
        Buffer.from('')
      )
    ).toMatchSnapshot();
  });

  test('calls renderSrcAttribute correctly and includes its return value in the rendered template', async () => {
    const fontBuffer = Buffer.from('::svg-content::');

    const result = await sassGen.generate(mockOptions, fontBuffer);

    expect(renderSrcMock).toHaveBeenCalledTimes(1);
    expect(renderSrcMock).toHaveBeenCalledWith(mockOptions, fontBuffer);
    expect(result).toContain('::src-attr::');
  });

  test('renders expected selector blocks', async () => {
    const sass = await sassGen.generate(mockOptions, Buffer.from(''));

    expect(sass).toContain('b[class^="tf-"]:before, b[class*=" tf-"]:before');
    expect(sass).toContain('.tf-my-icon:before');
  });

  test('renders expected variables', async () => {
    const sass = await sassGen.generate(mockOptions, Buffer.from(''));

    expect(sass).toContain('$test-font:');
    expect(sass).toContain('$test-map:');
  });

  test('renders expected selector blocks with `selector` option', async () => {
    const sass = await sassGen.generate(
      { ...mockOptions, selector: '.my-selector' },
      Buffer.from('')
    );

    expect(sass).toContain('.my-selector:before');
    expect(sass).toContain('.my-selector.tf-my-icon:before');
  });
});
