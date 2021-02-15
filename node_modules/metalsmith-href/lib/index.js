/* eslint-env node */
"use strict";

require("pkginfo")(module, "name");
const pkgname = /metalsmith-.*/.test(module.exports.name) ? module.exports.name.match(/metalsmith-(.*)/)[1] : module.exports.name;
const debug = require("debug")(`metalsmith:${pkgname}`);
const path = require("path");
const url = require("url");

module.exports = ({ property = "href", basehref = "/", index = "index.html" } = {}) => (files, metalsmith, done) => {
    debug(`inserting url at "${property}" in ${Object.keys(files).length} file(s)...`);

    for (const [filepath, metadata] of Object.entries(files)) {
        const parts = path.parse(path.posix.normalize(filepath));

        if (parts.base === index) { // it's a directory index, so the filename can be removed to look nicer
            // if 'base' is not present, path.format() will use 'name' and 'ext': https://nodejs.org/api/path.html#path_path_format_pathobject
            delete parts.base;
            delete parts.name;
            delete parts.ext;
        }

        metadata[property] = url.resolve(basehref, path.format(parts));

        debug(`  ${metadata[property]}`);
    }

    setImmediate(done);
};
