import { FontGenerator } from '../../types/generator';
import { FontAssetType } from '../../types/misc';
import { renderTemplate } from '../../utils/template';
import { renderSrcAttribute } from '../../utils/css';
import { getHexCodepoint } from '../../utils/codepoints';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.SVG,

  generate: (options, svg: Buffer) =>
    renderTemplate(
      options.templates.css,
      { ...options, fontSrc: renderSrcAttribute(options, svg) },
      { helpers: { codepoint: getHexCodepoint } }
    )
};

export default generator;
