const chalk = require('chalk');
const path = require('path');
const basename = path.basename;
const extname = path.extname;
const formatLanguages = require('./util/formatLanguages');
const buildPath = require('./util/buildPath');
const buildHref = require('./util/buildHref');
const messages = require('./messages/messages.json');

module.exports = plugin = (languages, env) => {

  return (files, metalsmith, done) => {

    let metadata = metalsmith.metadata();
    metadata['languages'] = formatLanguages(languages, 0, env);
    
    // Copy file to new key
    for (const [filePath, fileData] of Object.entries(files)) {
      files[`old/${filePath}`] = {...fileData};
      delete files[filePath];
    };

    // Format files to use language options and add language tags
    useLanguages(languages, files);
    done();

  };

};

const useLanguages = (languages, files) => {

  let formatedLanguages = formatLanguages(languages, 0);
  let errors = [];

  for (const [filePath, fileData] of Object.entries(files)) {

    if (fileData.slug_list){

      // Create slugObject from array item { locale: {locale, slug, layout} }
      let slugObjects = {}
      fileData.slug_list.forEach( (slugInfo, index) => {
        try{
          let slugInfoSplited = slugInfo.split(', ');
          if (slugInfoSplited.length !== 3) {
            throw 'formatLength'
          };
          let slugObject = {
            'locale': slugInfoSplited[0],
            'slug': slugInfoSplited[1],
            'layout': slugInfoSplited[2]
          };

          if(!formatedLanguages[slugObject.locale]) {
            throw 'wrongLang'
          }

          slugObjects = { ...slugObjects, [slugObject.locale]: slugObject};

           // Loop over slug objects and find a match in languages
          for (const [locale, slugData] of Object.entries(slugObjects)) {

            // Save fileData
            let cacheFileData = {...fileData};
            const fileName = basename(filePath, extname(filePath));

            // If lang matches slugObject lang
            if (formatedLanguages[locale]){
              cacheFileData['fileName'] = fileName
              cacheFileData['layout'] = slugData.layout
              cacheFileData['slug'] = slugData.slug
              cacheFileData['locale'] = formatedLanguages[locale].locale;
              cacheFileData['localePath'] = formatedLanguages[locale].path;
              cacheFileData['url'] = formatedLanguages[locale].url;
              // Remove if no erros v1.3.9
              // cacheFileData['basePath'] = `${ formatedLanguages[locale].output.replace(/^\//, '') }/${ slugData.slug.replace(/^\//, '') }/index.html`.replace(/^\//, '');
              cacheFileData['basePath'] = buildPath( [ formatedLanguages[locale].output, slugData.slug ] );
              // Remove if no erros v1.3.9
              // cacheFileData['href'] = `${ formatedLanguages[locale].url.replace(/\/$/, '') }/${ slugData.slug.replace(/^\//, '') }`;
              cacheFileData['href'] = buildHref( formatedLanguages[locale].url, cacheFileData['basePath'] );
            }

            // Get all languages that don't match 
            const diferentLangs = Object.keys(formatedLanguages).filter( key => key !== slugData.locale);

            // Create urls for diferent langs
            diferentLangs.forEach( locale => {
              if (slugObjects[locale]) {
                cacheFileData['slug_lang'] = {
                  // Remove if no erros v1.3.9
                  // ...cacheFileData['slug_lang'], [locale]: `${formatedLanguages[locale].url.replace(/\/$/, '')}/${slugObjects[locale].slug.replace(/^\//, '')}`
                  ...cacheFileData['slug_lang'], [locale]: buildHref( formatedLanguages[locale].url, slugObjects[locale].slug )
                };
              }
            })

            // Add new file and delete old version
            files[cacheFileData.basePath] = cacheFileData;
            delete files[filePath]
          };
        } catch (e) {
          const fileName = basename(filePath, extname(filePath));
          e === 'formatLength' ? errors.push({type: 'format', index, fileName}) : null;
          e === 'wrongLang' ? errors.push({type: 'lang', index, fileName, }) : null;
        };
      });

    };

    if (!fileData.slug_list){

      for (const [locale, languageObject] of Object.entries(formatedLanguages)) {

        // Save fileData and fileName
        let cacheFileData = {...fileData};
        const fileName = basename(filePath, extname(filePath));
        
        // Remove if no errors v1.3.9
        // fileData.slug 
        // ? finalFilePath = `${ languageObject.output.replace(/^\//, '') }/${ fileData.slug.replace(/^\//, '') }/index.html`
        // : finalFilePath = `${ languageObject.output.replace(/^\//, '') }/${ fileName }.html`
        
        // Create new filePath based on lang.output
        fileData.slug 
        ? finalFilePath = buildPath( [ languageObject.output, fileData.slug ] )
        : finalFilePath = buildPath( [ languageObject.output, `${fileName}.html` ] )

        // Remove if no errors v1.3.9
        // Replace / if first in string because of root lang.output
        // finalFilePath = finalFilePath.replace(/^\//, '');

        // Add language properties
        cacheFileData['fileName'] = fileName
        cacheFileData['locale'] = formatedLanguages[locale].locale;
        cacheFileData['localePath'] = formatedLanguages[locale].path;
        cacheFileData['url'] = formatedLanguages[locale].url;
        cacheFileData['basePath'] = finalFilePath;

        // Remove if no errors v1.3.9
        // if( fileData.slug ){
        //   cacheFileData['href'] = `${ languageObject.url.replace(/\/$/, '') }/${ fileData.slug.replace(/^\//, '') }`
        // } else {
        //   fileName === 'index' 
        //   ? cacheFileData['href'] = `${ languageObject.url.replace(/\/$/, '') }/`
        //   : cacheFileData['href'] = `${ languageObject.url.replace(/\/$/, '') }/${ fileName }.html`
        // };

        // Build href from lang.url
        if( fileData.slug ){
          cacheFileData['href'] = buildHref(languageObject.url, fileData.slug)
        } else {
          fileName === 'index' 
          ? cacheFileData['href'] = buildHref(languageObject.url, '')
          : cacheFileData['href'] = buildHref(languageObject.url, `${fileName}.html`)
        };

        // Get all languages that don't match 
        const diferentLangs = Object.keys(formatedLanguages).filter( key => key !== locale);

        // Create urls for diferent langs
        diferentLangs.forEach( difLocale => {
          
          if( fileData.slug ){
            cacheFileData['slug_lang'] = {
              // Remove if no erros v1.3.9
              // ...cacheFileData['slug_lang'], [difLocale]: `${formatedLanguages[difLocale].url.replace(/\/$/, '')}/${fileData.slug.replace(/^\//, '')}`
              ...cacheFileData['slug_lang'], [difLocale]: buildHref(formatedLanguages[difLocale].url, fileData.slug)
            };
          } else {
            if( fileName === 'index' ){
              cacheFileData['slug_lang'] = {
                // Remove if no erros v1.3.9
                // ...cacheFileData['slug_lang'], [difLocale]: `${formatedLanguages[difLocale].url.replace(/\/$/, '')}`
                ...cacheFileData['slug_lang'], [difLocale]: buildHref(formatedLanguages[difLocale].url, '')
              };
            }else{
              cacheFileData['slug_lang'] = {
                // Remove if no erros v1.3.9
                // ...cacheFileData['slug_lang'], [difLocale]: `${formatedLanguages[difLocale].url.replace(/\/$/, '')}/${ fileName }.html`
                ...cacheFileData['slug_lang'], [difLocale]: buildHref(formatedLanguages[difLocale].url, `${fileName}.html`)
              };
            }
          };

        })

        // Add new file and delete old version
        delete files[filePath]
        files[finalFilePath] = cacheFileData;
      }

    };

  };

  if (errors.length > 0 ) {
    errors.forEach( err => {
      err.type === 'format' 
        ? console.log( chalk.red(`Error: ${messages.parsing.error.SLUG_LIST}`.replace('{%=%}', chalk.bold(err.index)).replace('{%#%}', chalk.bold(err.fileName + ".md")) ) )
        : null
      err.type === 'lang' 
        ? console.log( chalk.red(`Error: ${messages.parsing.error.SLUG_LIST_LANG}`.replace('{%=%}', chalk.bold(err.index)).replace('{%#%}', chalk.bold(err.fileName + ".md")) ) )
        : null
    });
    process.exit(1);
  };

};