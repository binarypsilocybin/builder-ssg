const plugin = (logData) => {
  return (files, metalsmith, done) => {
    
    logData ? console.log(files) : null
    done();
    
  };
};

module.exports = plugin