const getOptions = require('./util/getOptions');
const getGeneric = require('./util/getGeneric');

const buildSections = (sectionsDef) => {

  // Filter sections by locale
  let sectionsObject;

  // Loop over section definition and create an object
  sectionsDef.forEach(sectionName => {
    sectionsObject = {
      ...sectionsObject, ...{[sectionName]: {posts:[]}}
    }
  })

  return sectionsObject;
}

const buildPosts = (fileData, postList, pageLocale) => {
  // Filter by locale
  postList = postList[pageLocale];

  postList.map( post => {
    if (post.taxonomy){

      // Posts can have multiple taxonomies
      post.taxonomy.map(tax => {

        // Add tag order to post
        post['order'] = 1;
        if (tax.order) {post['order'] = tax.order};

        // If taxonomy.page matches page of iteration
        if(tax.page === fileData.name) {

          // If taxonomy.section exists on page.sections of iteration
          if(fileData.sections[tax.section]){
            fileData.sections[tax.section].posts.push(post);
          };

        };

      })

    }
  })

  return fileData;

}

const plugin = (dataOptions) => {
  let optionsOverrides = dataOptions || {};
  dataOptions = getOptions(optionsOverrides);

  return (files, metalsmith, done) => {
    let metadata = metalsmith.metadata();
    
    // Build Sections
    for (const [filePath, fileData] of Object.entries(files)) {
      let data = fileData;
      let builtSections = data.sections && data.sections.length ? buildSections(data.sections) : null;
      builtSections ? data.sections = builtSections : data.sections = {};
      files[filePath] = data;
    }

    // Build Posts
    let posts = getGeneric(dataOptions.posts_path, metadata.languages, 'post');
    for (const [filePath, fileData] of Object.entries(files)) {
      let data = fileData;
      let pageLocale = data.locale;
      let newFileData = buildPosts(data, posts, pageLocale);
      files[filePath] = newFileData;
    }

    done();
  };
};

module.exports = plugin