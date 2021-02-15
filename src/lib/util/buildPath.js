const path = require('path');

module.exports = buildPath = (paths = []) => {       

  let normalizedPaths = paths.map( x => path.normalize(x) );
  let builtPath = path.join(...normalizedPaths)

  let builtPathExt = path.extname(builtPath);

  builtPathExt ? null : builtPath = path.join(builtPath, 'index.html')
  
  return path.normalize(builtPath).replace(/^\//, '')
}