#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');

const generate = require('../src/generate.js');
const getConfig = require('../src/lib/getConfig.js')
const messages = require('../src/lib/messages/messages.json')
const folderPath = process.cwd();

// Get Config to match environments
const config = getConfig(folderPath)

program
  .option('-e, --environment <environment>', 'Choose build environment')
  .parse(process.argv);

let allowedEnvs = config.environments ? Object.keys(config.environments) : [];

if(program.environment){
  allowedEnvs.includes(program.environment) 
    ? generate(folderPath, config, program.environment)
    : console.log( chalk.red(`Error: ${messages.options.error.PROVIDED_ENV}`.replace('{%=%}', chalk.bold(program.environment))) ) && process.exit(1);
}else{
  allowedEnvs.includes('unstable')
    ? generate(folderPath, config, 'unstable')
    : generate(folderPath, config, allowedEnvs[0])
}

