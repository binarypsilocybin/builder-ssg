const chalk = require('chalk');
const path = require('path');

const basename = path.basename;
const dirname = path.dirname;
const extname = path.extname;
const join = path.join;

const plugin = () => {

  const buildPath = (fileName, folder, slug, url) => slug 
    ? join(folder, slug, `index.html`).replace("//", "/") 
    : join(folder, `${fileName}.html`).replace("//", "/");

  const buildHref = (fileName, folder, slug, url) => slug 
    ? url + slug.replace("/", "")
    : fileName === 'index' 
      ? url 
      : url + fileName.replace("/", "");

  return (files, metalsmith, done) => {
    
    for (const [filePath, fileData] of Object.entries(files)) {

      let data = fileData;
      const folder = dirname(filePath);
      const fileName = basename(filePath, extname(filePath));
      let baseUrl = data.url;
      let slug

      slug = fileName === 'index' ? null : data.slug;
      
      const finalPath = buildPath(fileName, folder, slug, baseUrl)
      data['href'] = buildHref(fileName, folder, slug, baseUrl)

      // Add slug for multilanguage
      fileData.slug 
        ? null 
        : fileName === 'index' ? fileData.slug = null : fileData.slug = fileName;
      
      delete files[filePath];
      files[finalPath] = data;

    }

    done();
  };

};

module.exports = plugin