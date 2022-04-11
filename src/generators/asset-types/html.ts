import { FontGenerator } from '../../types/generator';
import { FontAssetType } from '../../types/misc';
import { renderTemplate } from '../../utils/template';
import { renderUrlsAttribute } from '../../utils/css';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.SVG,

  generate: async (options, svg: Buffer) => {
    return renderTemplate(options.templates.html, {
      ...options,
      fontUrls: renderUrlsAttribute(options, svg)
    });
  }
};

export default generator;
