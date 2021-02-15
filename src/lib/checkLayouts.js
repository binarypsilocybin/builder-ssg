const chalk = require('chalk');
const messages = require('./messages/messages.json')
const getFiles = require('./util/getFiles');

module.exports = plugin = (configLayouts) => {

  return (files, metalsmith, done) => {

    let layoutsList = getFiles(configLayouts.directory).map( layout => layout.replace(`${configLayouts.directory}/`, ''));
    let errors = [];

    for (const [filePath, fileData] of Object.entries(files)) {
      
      if(!fileData.layout){
        errors.push({'fileName': `${fileData.fileName}.md`})
      }else{
        layoutsList.includes(fileData.layout.replace(/^\//, '')) 
          ? null
          : errors.push({'layout':fileData.layout, 'fileName': `${fileData.fileName}.md`})
      }
    };

    if (errors.length > 0 ) {
      errors.forEach( err => {
        err.layout 
        ? console.log( chalk.red(`Error: ${messages.layouts.error.LAYOUT_NOT_FOUND}`.replace('{%=%}', chalk.bold(err.layout)).replace('{%#%}', chalk.bold(err.fileName)) ) )
        : console.log( chalk.red(`Error: ${messages.layouts.error.NO_LAYOUT}`.replace('{%=%}', chalk.bold(err.fileName))) )
      });
      process.exit(1);
    };

    done();
  };

};