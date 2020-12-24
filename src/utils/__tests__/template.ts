import Handlebars from 'handlebars';
import { renderTemplate, TEMPLATE_HELPERS } from '../template';
import { readFile } from '../fs-async';

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
    const templateFn = jest.fn((_: any, __: any) => templateOut);
    const context = { foo: 'bar' };

    readFileMock.mockImplementation(async () => template);
    hbsCompileMock.mockImplementation(() => templateFn);

    expect(await renderTemplate(filename, context)).toBe(templateOut);

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(readFileMock).toHaveBeenCalledWith(
      '/root/project/my-template.hbs',
      'utf8'
    );

    expect(hbsCompileMock).toHaveBeenCalledTimes(1);
    expect(hbsCompileMock).toHaveBeenCalledWith(template);

    expect(templateFn).toHaveBeenCalledTimes(1);
    expect(templateFn).toHaveBeenCalledWith(context, expect.any(Object));
  });

  test('`renderTemplate` combines given options Object with default helpers', async () => {
    const templateFn = jest.fn();
    const userHelpers = { bar: jest.fn() };
    const options = { some: 'option', helpers: userHelpers };

    hbsCompileMock.mockImplementation(() => templateFn);

    await renderTemplate('foo-bar.hbs', {}, options);

    expect(templateFn).toHaveBeenCalledTimes(1);
    expect(templateFn).toHaveBeenCalledWith(expect.any(Object), {
      some: 'option',
      helpers: { ...TEMPLATE_HELPERS, ...userHelpers }
    });
  });
});
