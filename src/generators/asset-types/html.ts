import { FontGenerator } from '../../types/generator';
import { getHexCodepoint } from '../../utils/codepoints';
import { renderTemplate } from '../../utils/template';

const generator: FontGenerator = {
  generate: async options => {
    return renderTemplate(
      options.templates.html,
      options,
      { helpers: { codepoint: getHexCodepoint } }
    );
  }
};

export default generator;
