import { FontGenerator } from '../../types/generator';

const generator: FontGenerator = {
  generate: async ({ formatOptions: { json } = {}, codepoints }) =>
    JSON.stringify(codepoints, null, json?.indent)
};

export default generator;
