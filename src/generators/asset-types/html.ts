import { TEMPLATE_PATHS } from '../../constants';
import { FontGenerator } from '../../types/generator';
import { renderTemplate } from '../../utils/template';

const generator: FontGenerator = {
  generate: async ({ customTemplate, ...context }) =>
    renderTemplate({
      path: customTemplate?.html || TEMPLATE_PATHS.html,
      context
    })
};

export default generator;
