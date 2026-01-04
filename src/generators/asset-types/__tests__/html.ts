import htmlGen from '../html';
import { resolve } from 'path';
import { it, describe, expect } from 'vitest';

const mockOptions = {
  name: 'test-font',
  prefix: 'tf',
  tag: 'b',
  assets: { 'my-icon': null },
  templates: {
    html: resolve(__dirname, '../../../../templates/html.hbs')
  }
} as any;

describe('`HTML` asset generator', () => {
  it('renders HTML correctly with prefix and tag name options', async () => {
    expect(await htmlGen.generate(mockOptions, null)).toMatchSnapshot();
  });

  it('rendered HTML contains expected CSS path', async () => {
    expect(await htmlGen.generate(mockOptions, null)).toContain(
      '"test-font.css"'
    );
  });

  it('rendered HTML contains expected tag and class name', async () => {
    expect(await htmlGen.generate(mockOptions, null)).toContain(
      '<b class="tf tf-my-icon"></b>'
    );
  });

  it('rendered HTML contains expected title', async () => {
    expect(await htmlGen.generate(mockOptions, null)).toContain(
      `<h1>test-font</h1>`
    );
  });
});
