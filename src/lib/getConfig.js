const fs = require('fs');
const chalk = require('chalk');
const messages = require('./messages/messages');
const defaultConfig = require('./messages/defaultConfig')

module.exports = getConfig = (rootPath) => {

  const configPathRoot = `${rootPath}/site/config.json`
  const configPathFolder = `${rootPath}/site/config/config.json`
  let finalConfig = null;

  // Look for config in /site root
  if( fs.existsSync(configPathRoot) ) {
    finalConfig = buildConfig(configPathRoot, defaultConfig);
    return finalConfig
  };

  // Look for config in /site/config
  if( fs.existsSync(configPathFolder) ) {
    finalConfig = buildConfig(configPathFolder, defaultConfig);
    return finalConfig
  };

  // Use default if no config
  if( !finalConfig ) {
    console.log( chalk.yellow(`Warning: ${messages.config.warning.CONFIG}`));
    return defaultConfig
  }
  
};

// Create function to build config;
const buildConfig = (configPath, defaultConfig) => {

  let rawData = fs.readFileSync(configPath);
  let configData = JSON.parse(rawData);

  // Do checks on config data
  if ( configData.hasOwnProperty('environments') && Object.keys(configData.environments) ){
    Object.keys(configData.environments).forEach( environment => {
      configData.environments[environment].hasOwnProperty('languages') && configData.environments[environment].languages.length > 0 
        ? null 
        : console.log( chalk.yellow(`Warning: ${messages.config.warning.ENVIRONMENTS_LANG}`.replace('{%=%}', chalk.bold(environment)).replace('{%#%}', chalk.bold(defaultConfig.environments.default.languages[0]))) )
    })
  } else {
    console.log( chalk.yellow(`Warning: ${messages.config.warning.ENVIRONMENTS}`.replace('{%=%}', chalk.bold(JSON.stringify(defaultConfig.environments.default)))) );
  }
  configData.hasOwnProperty('source') ? null : console.log( chalk.yellow(`Warning: ${messages.config.warning.SOURCE}`.replace('{%=%}', chalk.bold(defaultConfig.source))) );
  configData.hasOwnProperty('destination') ? null : console.log( chalk.yellow(`Warning: ${messages.config.warning.DESTINATION}`.replace('{%=%}', chalk.bold(defaultConfig.destination))) );
  configData.hasOwnProperty('data') && configData.data.hasOwnProperty('posts_path') ? null : console.log( chalk.yellow(`Warning: ${messages.config.warning.DATA_POSTS_PATH}`.replace('{%=%}', chalk.bold(defaultConfig.data.posts_path))) );
  configData.hasOwnProperty('data') && configData.data.hasOwnProperty('pages_path') ? null : console.log( chalk.yellow(`Warning: ${messages.config.warning.DATA_PAGES_PATH}`.replace('{%=%}', chalk.bold(defaultConfig.data.pages_path))) );
  configData.hasOwnProperty('assets') && configData.assets.hasOwnProperty('src') ? null : console.log( chalk.yellow(`Warning: ${messages.config.warning.ASSETS_SRC}`.replace('{%=%}', chalk.bold(defaultConfig.assets.src))) );
  configData.hasOwnProperty('assets') && configData.assets.hasOwnProperty('dest') ? null : console.log( chalk.yellow(`Warning: ${messages.config.warning.ASSETS_DEST}`.replace('{%=%}', chalk.bold(defaultConfig.assets.dest))) );
  // Engine options should be the same as layouts directory if they are defined
  if ( configData.hasOwnProperty('layouts') && configData.layouts.hasOwnProperty('directory') ){
    const engineOptions = {
      "path": `./${ configData.layouts.directory }`
    }
    configData.layouts['engineOptions'] = engineOptions;
  }else{
    console.log(chalk.yellow(`Warning: ${messages.config.warning.LAYOUTS_DIRECTORY}`.replace('{%=%}', chalk.bold(defaultConfig.layouts.directory))) );
  };
  configData.hasOwnProperty('debug') ? null : console.log( chalk.yellow(`Warning: ${messages.config.warning.DEBUG}`.replace('{%=%}', chalk.bold(defaultConfig.debug))) );
  configData.hasOwnProperty('log') ? null : console.log( chalk.yellow(`Warning: ${messages.config.warning.LOG}`.replace('{%=%}', chalk.bold(defaultConfig.log))) );

  let config = {
    ...defaultConfig, 
    ...configData,
  };

  // Override absolute options
  config.layouts['engine'] = "nunjucks";
  config.inplace['engine'] = "nunjucks";
  config['clean'] = true;

  return config
}

  