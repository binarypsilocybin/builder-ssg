# metalsmith-href

> A Metalsmith plugin to insert files URL in metadata

[![CircleCI](https://circleci.com/gh/pierresenechal/metalsmith-href.svg?style=shield)](https://circleci.com/gh/pierresenechal/metalsmith-href) [![Codecov](https://codecov.io/gh/pierresenechal/metalsmith-href/branch/master/graph/badge.svg)](https://codecov.io/gh/pierresenechal/metalsmith-href) [![NPM](https://img.shields.io/npm/v/metalsmith-href.svg)](https://npmjs.com/metalsmith-href) [![Latest](https://img.shields.io/github/tag/pierresenechal/metalsmith-href.svg)](https://github.com/pierresenechal/metalsmith-href/tags) [![Master](https://img.shields.io/github/package-json/v/pierresenechal/metalsmith-href.svg)](https://github.com/pierresenechal/metalsmith-href)

This plugin inserts absolute URLs to files in the metadata. This is useful to fill `href` attributes in templates. Used with [metalsmith-link](https://github.com/pierresenechal/metalsmith-link), it is possible to create links between files without having to worry about their location in the destination folder.


## Getting started

1. Install this plugin (see [Installing](#installing))
2. Add it to your Metalsmith build file _or_ configuration
3. Use the `href` property in your templates (see examples below)
4. (optional) customize the name of the `href` property (see [Configuring](#configuring))


### Example layout

_See [metalsmith-link](https://github.com/pierresenechal/metalsmith-link) to fill the `links` property._

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    <header>
      <h1>{{ title }}</h1>
    </header>
    <nav>
      <ul>
        <li><a href="{{ href }}">Useless link to this page</a></li>
        {% for link in links %}
        <li><a href="{{ link.href }}">{{ link.title }}</a></li>
        {% endfor %}
      </ul>
    </nav>
    <main>
      {{ contents | safe }}
    </main>
    <footer>
      <hr />
      Licensed under CC-BY-SA
    </footer>
  </body>
</html>
```


## Installing

With [npm](https://npmjs.org/) installed, run

```
$ npm install metalsmith-href
```

For static websites, some prefer to specificy `--save-dev` to `npm install` as the distributed website does not actually require this plugin as a dependency.


## Configuring

Since Metalsmith follows a [Pipeline pattern](https://en.wikipedia.org/wiki/Pipeline_%28software%29), the step at which plugins run is important. This plugin should ideally run just before the layout step.

There are a few options:

name | default | description
---- | ------- | -----------
property | href | name of the metadata property to create/replace
basehref | _empty_ | base URL to preprend (e.g. https://my-site.tld)
index | index.html | name of the directory index file to strip (e.g. for links like `/` instead of `/index.html`)


### Example build file with options

```js
// ...
Metalsmith(__dirname)
    .use(link())
    .use(markdown())
    .use(href({ property: "url", basehref: "https://my-site.tld", index: "index.htm" }))
    .use(layouts())
    .build(function (err) {
        if (err) throw err;
    });
```


### Example configuration with options

```json
{
  "source": "src",
  "destination": "build",
  "plugins": [{
    "metalsmith-link": {},
    "metalsmith-markdown": {},
    "metalsmith-href": {
      "property": "url",
      "basehref": "https://my-site.tld",
      "index": "index.htm"
    },
    "metalsmith-layouts": {}
  }]
}
```


## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. [Issues](https://github.com/pierresenechal/metalsmith-href/issues) and [pull requests](https://github.com/pierresenechal/metalsmith-href/pulls) are warmly welcome.


## Links and references

* Source code: [`https://github.com/pierresenechal/metalsmith-href`](https://github.com/pierresenechal/metalsmith-href)
* Issue tracker: [`https://github.com/pierresenechal/metalsmith-href/issues`](https://github.com/pierresenechal/metalsmith-href/issues)

### Related

* Metalsmith Link: [`https://github.com/pierresenechal/metalsmith-link`](https://github.com/pierresenechal/metalsmith-link)


### Dependencies

* Metalsmith: [`https://github.com/segmentio/metalsmith`](https://github.com/segmentio/metalsmith)


## License

This software is free software licensed under the MIT License. See LICENSE.MD
