import { generateFonts } from './src';

generateFonts({
  inputDir: '/Users/tancreditrugenberger/Desktop/Fantasticon/test/icons',
  outputDir: '/Users/tancreditrugenberger/Desktop/Fantasticon/test/dist'
}).then(results => console.log(results.codepoints));
