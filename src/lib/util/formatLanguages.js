const messages = require('../messages/messages.json');
const chalk = require('chalk');

module.exports = langFormat = (langs, baseKey, env) => {

  let langFormatted = {};
  let errors = [];

  langs.forEach((el, index) => {
    
    try {
      let langSplited = el.split(', ');

      if (langSplited.length !== 4) {
        throw 'err'
      }

      langObj = {};
      langObj['locale'] = langSplited[0]
      langObj['path'] = langSplited[1]
      langObj['output'] = langSplited[2]
      langObj['url'] = langSplited[3].endsWith('/') ? langSplited[3] : langSplited[3] += '/'
      langFormatted[langSplited[baseKey]] = langObj;
    } catch (e) {
      errors.push({index, env})
    }

  });

  if (errors.length > 0 ) {
    errors.forEach( err => {
      console.log( chalk.red(`Error: ${messages.parsing.error.LANGUAGE}`.replace('{%=%}', chalk.bold(err.index)).replace('{%#%}', chalk.bold(err.env)) ) );
    });
    process.exit(1);
  };

  return langFormatted;
}