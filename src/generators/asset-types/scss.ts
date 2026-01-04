import { FontGenerator } from '../../types/generator.js';
import { FontAssetType } from '../../types/misc.js';
import { renderTemplate } from '../../utils/template.js';
import { renderSrcAttribute } from '../../utils/css.js';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.SVG,

  generate: (options, svg: Buffer) =>
    renderTemplate(
      options.templates.scss,
      { ...options, fontSrc: renderSrcAttribute(options, svg) },
      { helpers: { codepoint: str => str.toString(16) } }
    )
};

export default generator;
