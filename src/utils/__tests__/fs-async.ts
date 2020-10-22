import { readFile, writeFile, stat } from '../fs-async';
import * as fs from 'fs';

const readFileMock = (fs.readFile as any) as jest.Mock;
const writeFileMock = (fs.writeFile as any) as jest.Mock;
const statMock = (fs.stat as any) as jest.Mock;

jest.mock('fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  stat: jest.fn()
}));

describe('Async FS utilities', () => {
  beforeEach(() => {
    readFileMock.mockClear();
    writeFileMock.mockClear();
    statMock.mockClear();
  });

  test('`readFile` is `fs.readFile` correctly promisified', async () => {
    const filepath = '/dev/null';
    const encoding = 'utf8';
    const result = '::result::';

    readFileMock.mockImplementation((_, __, cb) => cb(null, result));

    expect(await readFile(filepath, encoding)).toBe(result);
    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(readFileMock).toHaveBeenCalledWith(
      filepath,
      encoding,
      expect.any(Function)
    );
  });

  test('`writeFile` is `fs.writeFile` correctly promisified', async () => {
    const filepath = '/dev/null';
    const content = '::content::';

    writeFileMock.mockImplementation((_, __, cb) => cb(null));

    expect(await writeFile(filepath, content)).toBe(undefined);
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledWith(
      filepath,
      content,
      expect.any(Function)
    );
  });

  test('`stat` is `fs.stat` correctly promisified', async () => {
    const filepath = '/dev/null';

    statMock.mockImplementation((_, cb) => cb(null));

    expect(await stat(filepath)).toBe(undefined);
    expect(statMock).toHaveBeenCalledTimes(1);
    expect(statMock).toHaveBeenCalledWith(filepath, expect.any(Function));
  });
});
