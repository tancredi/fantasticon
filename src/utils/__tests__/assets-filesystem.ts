import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { loadAssets } from '../assets';
import { DEFAULT_OPTIONS } from '../../constants';

const SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>';

describe('loadAssets against the real filesystem', () => {
  let inputDir = '';

  beforeAll(() => {
    inputDir = mkdtempSync(join(tmpdir(), 'fantasticon-assets-'));
    writeFileSync(join(inputDir, 'alpha.svg'), SVG);
    writeFileSync(join(inputDir, 'beta-two.svg'), SVG);
  });

  afterAll(() => {
    rmSync(inputDir, { recursive: true, force: true });
  });

  it('derives icon ids from file names when `inputDir` is absolute', async () => {
    const assets = await loadAssets({
      ...DEFAULT_OPTIONS,
      inputDir,
      outputDir: inputDir
    });

    expect(Object.keys(assets).sort()).toEqual(['alpha', 'beta-two']);
    expect(assets.alpha.relativePath).toBe('alpha.svg');
  });
});
