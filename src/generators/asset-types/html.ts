import { FontGenerator } from '../../types/generator';
import { renderTemplate } from '../../utils/template';

const generator: FontGenerator = {
  generate: async options => {
    return renderTemplate(options.templates.html, options);
  }
};

export default generator;
