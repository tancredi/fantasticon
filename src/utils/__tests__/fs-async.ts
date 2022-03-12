import { readFile, writeFile, stat } from 'fs/promises';
import { checkPath } from '../fs-async';

const readFileMock = readFile as any as jest.Mock;
const writeFileMock = writeFile as any as jest.Mock;
const statMock = stat as any as jest.Mock;

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

  describe('checkPath', () => {
    it('calls `stat` correctly and correctly check the existance of a path', async () => {
      const mockPath = '/dev/null';

      statMock.mockImplementationOnce((_, cb) => cb());

      expect(await checkPath(mockPath)).toBe(true);
      expect(statMock).toHaveBeenCalledTimes(1);
      expect(statMock).toHaveBeenCalledWith(mockPath, expect.any(Function));

      statMock.mockClear();
      statMock.mockImplementationOnce((_, cb) => cb(new Error('Fail')));

      expect(await checkPath(mockPath)).toBe(false);
      expect(statMock).toHaveBeenCalledTimes(1);
      expect(statMock).toHaveBeenCalledWith(mockPath, expect.any(Function));
    });

    it('checks if given path is a directory when given as check type', async () => {
      const mockPath = '/dev/null';
      const isDirectory = jest.fn(() => false);

      statMock.mockImplementation((_, cb) => cb(null, { isDirectory }));

      expect(await checkPath(mockPath, 'directory')).toBe(false);
      expect(statMock).toHaveBeenCalledTimes(1);
      expect(statMock).toHaveBeenCalledWith(mockPath, expect.any(Function));
      expect(isDirectory).toHaveBeenCalledTimes(1);

      isDirectory.mockImplementation(() => true);

      expect(await checkPath(mockPath, 'directory')).toBe(true);
    });

    it('checks if given path is a file when given as check type', async () => {
      const mockPath = '/dev/null';
      const isFile = jest.fn(() => false);

      statMock.mockImplementation((_, cb) => cb(null, { isFile }));

      expect(await checkPath(mockPath, 'file')).toBe(false);
      expect(statMock).toHaveBeenCalledTimes(1);
      expect(statMock).toHaveBeenCalledWith(mockPath, expect.any(Function));
      expect(isFile).toHaveBeenCalledTimes(1);

      isFile.mockImplementation(() => true);

      expect(await checkPath(mockPath, 'file')).toBe(true);
    });
  });
});
