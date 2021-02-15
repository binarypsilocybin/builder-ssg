const getOptions = require('./util/getOptions');

const buildUnclaimedPosts = (postList, pageLocale) => {
  // Filter by locale
  postList = postList[pageLocale];
  let unclaimedPosts = {};

  postList.map( post => {
    !('taxonomy' in post)
      ? unclaimedPosts = { ...unclaimedPosts, ...{[post.name]: post} } 
      : null;
  })

  return unclaimedPosts;

}

const plugin = (dataOptions) => {
  let optionsOverrides = dataOptions || {};
  dataOptions = getOptions(optionsOverrides);

  return (files, metalsmith, done) => {
    let metadata = metalsmith.metadata();

    // Build Posts
    let posts = getGeneric(dataOptions.posts_path, metadata.languages, 'post');
    
    // Build Unclaimed Posts
    for (const [filePath, fileData] of Object.entries(files)) {
      let data = fileData;
      let pageLocale = data.locale;
      let unclaimedPosts = buildUnclaimedPosts(posts, pageLocale);
      unclaimedPosts ? data.unclaimedPosts = unclaimedPosts : data.unclaimedPosts = {};
      files[filePath] = data;
    }

    done();
  };
};

module.exports = plugin