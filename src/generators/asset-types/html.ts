import { FontGenerator } from '../../types/generator.js';
import { renderTemplate } from '../../utils/template.js';

const generator: FontGenerator = {
  generate: options => renderTemplate(options.templates.html, options)
};

export default generator;
