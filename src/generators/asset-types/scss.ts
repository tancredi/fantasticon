import { FontGenerator } from '../../types/generator';
import { FontAssetType } from '../../types/misc';
import { renderTemplate } from '../../utils/template';
import { renderSrcAttribute } from '../../utils/css';
import { TEMPLATE_PATHS } from '../../constants';
import { buildHelpers, buildMainSelector } from '../../utils/scss';

const generator: FontGenerator<Buffer> = {
  dependsOn: FontAssetType.SVG,

  generate: (
    { customTemplate, selector, tag, prefix, ...options },
    svg: Buffer
  ) =>
    renderTemplate({
      path: customTemplate?.scss || TEMPLATE_PATHS.scss,
      context: {
        fontSrc: renderSrcAttribute({ ...options }, svg),
        ...buildMainSelector({
          name: options.name,
          selector,
          tag,
          prefix,
          scss: true
        }),
        ...options
      },
      compilerOptions: {
        helpers: buildHelpers({
          selector,
          tag,
          prefix,
          scss: true
        })
      }
    })
};

export default generator;
