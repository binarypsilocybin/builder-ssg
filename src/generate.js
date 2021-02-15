const Metalsmith = require('metalsmith');
const inplace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const chalk = require('chalk');

const assets = require('./lib/copyAssets');
const buildData = require('./lib/buildData');
const buildUnclaimed = require('./lib/buildUnclaimed');
const buildPostPages = require('./lib/buildPostPages');
const filterData = require('./lib/filterData');
const buildSeo = require('./lib/buildSeo');
const logData = require('./lib/logData');
const multilanguage = require('./lib/multilanguage');
const checkLayouts = require('./lib/checkLayouts');
const messages = require('./lib/messages/messages.json');
const getFiles = require('./lib/util/getFiles');

module.exports = generate = (path, configData, env) => {

  let initialConfig = configData;

  let config = {...initialConfig, ...initialConfig.environments[env]}
  delete config.environments

  getFiles(config.source).length > 0
  ? null
  : console.log(chalk.red(`Error: ${messages.build.error.NO_FILES}`.replace('{%=%}', chalk.bold(config.source))));

  Metalsmith(path)
    .metadata(config.metadata)
    .source(config.source)
    .destination(config.destination)
    .clean(config.clean)
    .use(assets(config.assets))
    .use(inplace(config.inplace))
    .use(multilanguage(config.languages, env))
    .use(buildPostPages(config.data))
    .use(buildData(config.data))
    .use(buildUnclaimed(config.data))
    .use(buildSeo())
    .use(filterData())
    .use(checkLayouts(config.layouts))
    .use(layouts(config.layouts))
    .use(logData(config.log))
    .build(function(err, files) {
      if (err) {
        debugActive = config.debug ? config.debug : false;
        if(debugActive){
          throw err;
        };
        console.log(chalk.red(`Error: ${messages.build.error.BUILD_ERROR}`)); 
      }
      console.log(chalk.green("Build Finished"))
  });
}