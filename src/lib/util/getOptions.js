module.exports = getOptions = (overrides = {}) => {
  const default_options = {
    posts_path: './content/posts',
    sections_path: './content/sections',
    pages_path: './pages'
  }
  return Object.assign(
    {},
    default_options,
    overrides
  );
};