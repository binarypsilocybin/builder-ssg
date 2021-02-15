#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const package = require('../package');

console.log(chalk.blue('Builder Static Site Generator'));

program
  .version(package.version)
  .usage('<command> [options]')
  .command('build', 'Build static site')
  .parse(process.argv);