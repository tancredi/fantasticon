import { FontGenerator } from '../../types/generator';
import { renderTemplate } from '../../utils/template';

const generator: FontGenerator = {
  generate: async options => renderTemplate('html.hbs', options)
};

export default generator;
