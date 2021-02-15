const getGeneric = require('./util/getGeneric');
const buildPath = require('./util/buildPath');
const buildHref = require('./util/buildHref');

const plugin = (dataOptions) => {
  let optionsOverrides = dataOptions || {};
  dataOptions = getOptions(optionsOverrides);
  
  return (files, metalsmith, done) => {
    let metadata = metalsmith.metadata();
    
    let posts = getGeneric(dataOptions.posts_path, metadata.languages, 'post');

    for (const [locale, postArray] of Object.entries(posts)) {

      let filteredPosts = postArray.filter(post => 'slug' in post);
      let slugList = [];

      // Get all slugs form already existing pages
      for (const [filePath, fileData] of Object.entries(files)) {
        fileData.basePath && fileData.locale === locale ? slugList.push(fileData.slug) : null
      };

      // Clean slug array
      slugList = slugList.filter(el => el != null);

      filteredPosts.map( post => {

        // Check for matching slugs and return correct slug
        let correctSlug = checkSlug(slugList, post.slug);
        slugList.push(correctSlug);
        
        // Remove if no erros v1.3.9
        // fileKey = `${ metalsmith.metadata().languages[locale].output.replace(/^\//, '') }/${correctSlug}/index.html`.replace(/^\//, '');

        // Creating key for page
        fileKey = buildPath( [ metalsmith.metadata().languages[locale].output, correctSlug ] )
        
        // Changing contents from string to buffer in post object
        post.contents = Buffer.hasOwnProperty('from') ? Buffer.from(post.contents, 'utf8') : new Buffer(post.contents, 'utf8');
        
        const nonCurrentLocalePosts = Object.keys(posts).filter(el => el != locale);
        let localesToUse = [];

        nonCurrentLocalePosts.forEach(nonLocale => {
          posts[nonLocale].filter(el => 'slug' in el && el.slug === post.slug).length > 0 ? localesToUse.push(nonLocale) : null;
        })

        if(localesToUse && localesToUse.length > 0){

          localesToUse.forEach( localeToUse => {
            // Get all languages that don't match 
            const diferentLangs = Object.keys(metadata.languages).filter( key => key === localeToUse);

            // Create urls for diferent langs
            diferentLangs.forEach( difLocale => {
              
              if( post.slug ){
                post['slug_lang'] = {
                  // Remove if no errors v1.3.9
                  // ...post['slug_lang'], [difLocale]: `${metadata.languages[difLocale].url.replace(/\/$/, '')}/${post.slug.replace(/^\//, '')}`
                  ...post['slug_lang'], [difLocale]: buildHref(metadata.languages[difLocale].url, post.slug)
                };
              };

            });
          })
        }

        // Adding properties to post object to use as page
        post.mode = '0644';
        post['locale'] = locale;
        post['localePath'] = `${metalsmith.metadata().languages[locale].path}`;
        post['url'] = `${metalsmith.metadata().languages[locale].url}`;
        // Remove if no errors v1.3.9
        // post['href'] = metalsmith.metadata().languages[locale].url + correctSlug.replace("/", "");
        post['href'] = buildHref(metalsmith.metadata().languages[locale].url, correctSlug)
        files[fileKey] = post;

      });
    };

    done();
  };
};

const checkSlug = (slugList, slug) => {
  let num = 1;
  while(slugList.includes(slug)) {
    slug = slug.concat(num++);
  }
  return slug;
}

module.exports = plugin