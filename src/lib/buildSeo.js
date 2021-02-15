const messages = require('./messages/messages.json');
const chalk = require('chalk');

const parseArray = (array, type, fileName) => {

  let object = {};
  let errors = [];

  array.forEach((el, index) => {
    
    try {
      let elSplited = el.split(', "');

      if (elSplited.length !== 2) {
        throw 'err'
      }

      object[elSplited[0]] = elSplited[1].slice(0, -1);

    } catch (e) {
      errors.push({type, fileName})
    }

  });

  if (errors.length > 0 ) {
    errors.forEach( err => {
      console.log( chalk.red(`Error: ${messages.parsing.error.SEO_META}`.replace('{%=%}', err.type).replace('{%#%}', chalk.bold(err.fileName)) ) );
    });
    process.exit(1);
  };

  return object

}

const plugin = () => {
  return (files, metalsmith, done) => {

    for (const [filePath, fileData] of Object.entries(files)) {
      const hasMetaTitle = fileData.hasOwnProperty("meta_title");
      const hasMetaDescription = fileData.hasOwnProperty("meta_description");
      const hasMetaKeywords = fileData.hasOwnProperty("meta_keywords");
      
      if(hasMetaTitle){
        fileData.meta_title = parseArray(fileData.meta_title, "title", fileData.fileName);
      }

      if(hasMetaDescription){
        fileData.meta_description = parseArray(fileData.meta_description, "description", fileData.fileName);
      }

      if(hasMetaKeywords){
        fileData.meta_keywords = parseArray(fileData.meta_keywords, "keywords", fileData.fileName);
      }
    };

    done();
  };
}

module.exports = plugin