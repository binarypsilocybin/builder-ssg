const fs = require('fs');
const matter = require('gray-matter');
const marked = require('marked');
const chalk = require('chalk');

const getFiles = require('./getFiles');
const formatTaxonomy = require('./formatTaxonomy');
const messages = require('../messages/messages.json');

// Set marked options to remove header Ids
marked.setOptions({
  headerIds: false
});

const separateFiles = (path, fileList, languages) => {
  
  // Separate files by locale if locale
  let filesObject = {};
  if(languages){
    for (const [locale, data] of Object.entries(languages)) {
      filesObject[locale] = [];
      fileList.map(file => {  
        file.includes(`${path}/${data.path.replace(/^\//, '')}`) ? filesObject[locale].push(file) : null;
      })
    };
  };

  // Remove files that have locale from files without locale
  let filesWithoutLocale = fileList;
  for (const [locale, filesArray] of Object.entries(filesObject)) {
    filesWithoutLocale = filesWithoutLocale.filter( file => !filesArray.includes(file) );
  } 

  return filesObject;

};

module.exports = getGeneric = (pathToFiles, multilanguage = null, type) => {
  let data = {};
  let fileList = getFiles(pathToFiles);
  let filteredFiles = separateFiles(pathToFiles, fileList, multilanguage);

  for (const [locale, filesArray] of Object.entries(filteredFiles)) {
    data[locale] = [];
    filesArray.map(file => {
      let fileBuffer = fs.readFileSync(file);
      let parsedMatter;

      // Cleaning gray-matter cache manually.
      matter.cache = {};

      // Parse Frontmatter
      try {
        parsedMatter = Object.assign({}, matter(fileBuffer.toString()));
      } catch (e) {
        console.log(chalk.red(`Error: ${messages.parsing.error.INVALID_FRONTMATTER}`.replace('{%=%}', file)));
        process.exit(1);
      };

      // Format taxonomy
      try {
        if (parsedMatter.data.taxonomy){
          parsedMatter.data.taxonomy = formatTaxonomy(parsedMatter.data.taxonomy);
        };
      } catch (e) {
        console.log(chalk.red(`Error: ${messages.parsing.error.INVALID_TAXONOMY}`.replace('{%=%}', file)));
        process.exit(1);
      };
    
      contentObject = parsedMatter.data;
      contentObject['contents'] = (Buffer.hasOwnProperty('from'))
        ? marked(Buffer.from(parsedMatter.content).toString()) 
        : marked(new Buffer(parsedMatter.content).toString())

      data[locale].push(contentObject);
    })
  }
  
  return data
};