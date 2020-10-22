import { FontGenerator } from '../../types/generator';
import { renderTemplate } from '../../utils/template';

const generator: FontGenerator = {
  generate: async options => renderTemplate('css.hbs', options)
};

export default generator;
