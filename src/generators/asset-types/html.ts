import { FontGenerator } from '../../types/generator';
import { renderTemplate } from '../../utils/template';

const generator: FontGenerator = {
  async generate(options) {
    return renderTemplate(options.templates.html, options);
  }
};

export default generator;
