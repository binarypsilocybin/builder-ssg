const fs = require( 'fs-extra' );
const chalk = require('chalk');
const messages = require('./messages/messages');

module.exports = plugin = (options) => {

  return function( files, metalsmith, done ) {
      // Set the next function to run once we are done
      setImmediate( done );

      // Default paths, relative to Metalsmith working directory
      let defaults = {
          src: 'assets',
          dest: ['.']
      };

      // Merge options and resolve src path
      let config = { ...defaults, ...options};
      config.src = metalsmith.path( config.src );

      // Set options for `fs-extra` copy operation--options set to default are marked
      let copyOptions = {
        overwrite: true,                // default
        errorOnExist: false,            // default
        dereference: false,             // default
        preserveTimestamps: true
    };

    
    // Check if config.dest is array
    if ( !Array.isArray(config.dest) ){
      console.log( chalk.red(`Error: ${messages.config.error.ASSETS_DEST}`) )
      process.exit(1)
    }

    // Check if config.dest elements are not strings
    config.dest.map( el => {
      if(typeof el !== "string"){
        console.log( chalk.red(`Error: ${messages.config.error.ASSETS_DEST_STRING}`) )
        process.exit(1)
      }
    });

    // Loop over dest resolve dest paths and copy
    config.dest.map(dest => {
      let resolvedDest = metalsmith.path( metalsmith.destination(), dest.replace(/^\//, '') );
      fs.copySync( config.src, resolvedDest, copyOptions );
    });
  }

}