import cssGen from '../css';
import { renderSrcAttribute } from '../../../utils/css';

const renderSrcMock = (renderSrcAttribute as any) as jest.Mock;

const mockOptions = {
  name: 'test-font',
  prefix: 'tf',
  tag: 'b',
  codepoints: { 'my-icon': 0xf101 },
  assets: { 'my-icon': null }
} as any;

jest.mock('../../../utils/css', () => ({
  renderSrcAttribute: jest.fn(() => '"::src-attr::"')
}));

describe('`CSS` asset generator', () => {
  beforeEach(() => {
    renderSrcMock.mockClear();
  });

  test('renders CSS correctly with prefix and tag name options', async () => {
    expect(
      await cssGen.generate(mockOptions, Buffer.from(''))
    ).toMatchSnapshot();
  });

  test('renders CSS correctly with selector option', async () => {
    expect(
      await cssGen.generate(
        { ...mockOptions, selector: '.my-custom-selector' },
        Buffer.from('')
      )
    ).toMatchSnapshot();
  });

  test('calls renderSrcAttribute correctly and includes its return value in the rendered template', async () => {
    const fontBuffer = Buffer.from('::svg-content::');

    const result = await cssGen.generate(mockOptions, fontBuffer);

    expect(renderSrcMock).toHaveBeenCalledTimes(1);
    expect(renderSrcMock).toHaveBeenCalledWith(mockOptions, fontBuffer);
    expect(result).toContain('::src-attr::');
  });
});
