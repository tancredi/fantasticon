import { renderTemplate } from '../template';
import { readFile } from '../fs-async';
import Handlebars from 'handlebars';

const readFileMock = (readFile as any) as jest.Mock;
const hbsCompileMock = (Handlebars.compile as any) as jest.Mock;

jest.mock('../fs-async', () => ({ readFile: jest.fn() }));
jest.mock('handlebars', () => ({ compile: jest.fn() }));
jest.mock('path');

describe('Template utilities', () => {
  beforeEach(() => {
    readFileMock.mockClear();
    hbsCompileMock.mockClear();
  });

  test('`renderTemplate` correctly reads the expected template content from the filesystem and passes it to `Handlebars.compile`', async () => {
    const filename = 'my-template.hbs';
    const template = '::template::';
    const templateOut = '::rendered::';
    const templateFn = jest.fn(() => templateOut);
    const context = { foo: 'bar' };
    const options = { helpers: { foo: () => 'bar' } };

    readFileMock.mockImplementation(async () => template);
    hbsCompileMock.mockImplementation(() => templateFn);

    expect(await renderTemplate(filename, context, options)).toBe(templateOut);

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(readFileMock).toHaveBeenCalledWith(
      '/root/project/templates/my-template.hbs',
      'utf8'
    );

    expect(hbsCompileMock).toHaveBeenCalledTimes(1);
    expect(hbsCompileMock).toHaveBeenCalledWith(template);

    expect(templateFn).toHaveBeenCalledTimes(1);
    expect(templateFn).toHaveBeenCalledWith(context, options);
  });
});
