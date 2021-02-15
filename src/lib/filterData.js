const moment = require('moment');

const plugin = () => {
  return (files, metalsmith, done) => {
    
    for (const [filePath, fileData] of Object.entries(files)) {
      if(fileData.sections){
        for (const [section, sectionData] of Object.entries(fileData.sections)) {

          // if has draft and draft is yes/YES/true remove
          filteredPosts = sectionData.posts.filter(
            post => 'draft' in post 
            ? (post.draft === 'yes' || post.draft === 'Yes' || post.draft === true ) ? false : true
            : true
          )
          
          filteredPosts = filteredPosts.filter(post => 'publish_date' in post ? moment(post.publish_date, 'YYYY-MM-DD').isSameOrBefore() : true);
          filteredPosts = filteredPosts.filter(post => 'expire_date' in post ? moment(post.expire_date, 'YYYY-MM-DD').isSameOrAfter(moment().format('YYYY-MM-DD')) : true);        
          sectionData.posts = filteredPosts;
        }
      }
    }

    done();
  };
};

module.exports = plugin