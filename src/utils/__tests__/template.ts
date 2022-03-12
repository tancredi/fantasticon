import fs from 'fs/promises';
import * as Handlebars from 'handlebars';
import { renderTemplate, TEMPLATE_HELPERS } from '../template';

const compile = jest.spyOn(Handlebars, 'compile').mockImplementation(jest.fn());
const readFile = jest.spyOn(fs, 'readFile').mockImplementation(jest.fn());

jest.mock('path');

describe('Template utilities', () => {
  beforeEach(() => {
    readFile.mockClear();
    compile.mockClear();
  });

  describe('renderTemplate', () => {
    it('correctly reads the expected template content from the filesystem and passes it to `Handlebars.compile`', async () => {
      const filename = 'my-template.hbs';
      const template = '::template::';
      const templateOut = '::rendered::';
      const templateFn = jest.fn((_: any, __: any) => templateOut);
      const context = { foo: 'bar' };

      readFile.mockImplementation(async () => template);
      compile.mockImplementation(() => templateFn);

      expect(await renderTemplate(filename, context)).toBe(templateOut);

      expect(readFile).toHaveBeenCalledTimes(1);
      expect(readFile).toHaveBeenCalledWith(
        '/root/project/my-template.hbs',
        'utf8'
      );

      expect(compile).toHaveBeenCalledTimes(1);
      expect(compile).toHaveBeenCalledWith(template);

      expect(templateFn).toHaveBeenCalledTimes(1);
      expect(templateFn).toHaveBeenCalledWith(context, expect.any(Object));
    });

    it('combines given options Object with default helpers', async () => {
      const templateFn = jest.fn();
      const userHelpers = { bar: jest.fn() };
      const options = { some: 'option', helpers: userHelpers };

      compile.mockImplementation(() => templateFn);

      await renderTemplate('foo-bar.hbs', {}, options);

      expect(templateFn).toHaveBeenCalledTimes(1);
      expect(templateFn).toHaveBeenCalledWith(expect.any(Object), {
        some: 'option',
        helpers: { ...TEMPLATE_HELPERS, ...userHelpers }
      });
    });
  });
});
