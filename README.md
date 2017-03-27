[![Dependency Status](https://david-dm.org/soldotno/aurora-core.svg)](https://david-dm.org/soldotno/aurora-core) [![Build Status](https://codeship.com/projects/15c95c20-24cd-0134-cd6d-7a46f2e0a594/status?branch=master)](https://codeship.com/projects/161548)

<a href="https://codeclimate.com/github/soldotno/aurora-core"><img src="https://codeclimate.com/github/soldotno/aurora-core/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/soldotno/aurora-core/coverage"><img src="https://codeclimate.com/github/soldotno/aurora-core/badges/coverage.svg" /></a>
<a href="https://codeclimate.com/github/soldotno/aurora-core"><img src="https://codeclimate.com/github/soldotno/aurora-core/badges/issue_count.svg" /></a>


Aurora Core (development)
=========================

[![Greenkeeper badge](https://badges.greenkeeper.io/soldotno/aurora-core.svg)](https://greenkeeper.io/)

![aurora](http://s21.postimg.org/obm72lwuv/aurora.png)

Demo implementations
--------------------

- [aurora-demo-frontend](https://github.com/soldotno/aurora-demo-frontend)
- [aurora-demo-api](https://github.com/soldotno/aurora-demo-api)

Notes
-----

 * To read more about the process of resolving a configuration - see [resolving.md](https://github.com/soldotno/aurora-core/blob/master/resolving.md)
 * The application is filled with comments/annotations throughout. Keep these in sync - and always state your intentions (they might be clear to you - but not to the next person looking at your code)

Writing tests
-------------

#### In this application we have these 3 different cases:

 * functionality that runs both on __server (node.js) and client (browser)__
 * functionality that runs ONLY on the __client__ _(i.e - needs browser only features like `window`)_
 * functionality that runs ONLY on the __server__ _(i.e - needs node.js only features like `fs`)_

__NOTE:__ That means we have to specify which environment to run tests in.

#### The following then applies

 * Tests that run both on __server and client__ can be suffixed with either `*.test.client.js` or `*.test.server.js`
  * For React component tests default to `*.test.client.js` (better to test those in the browser with a DOM)
  * For non-React tests default to `*.test.server.js` (it's a lot faster and less hassle)
 * Tests that run ONLY on the __client__ should be suffixed with `*.test.client.js`
 * Tests that run ONLY on the __server__ should be suffixed with `*.test.server.js`

#### You can place tests pretty much anywhere you want:

 * As a neighbor to the file/unit/functionality you are testing - Example: `reducer.js` and `reducer.test.client.js`
 * In a folder somewhere - Example: `./src/reducers/tests/**.test.client.js`
 * __NOTE:__ Only files/folders under `./src` are searched for tests (not the root `./` - as that would include all tests from `node_modules/**` as well)

#### Notes about the testing setup/process

 * Client-side tests are run with Karma using the Mocha framework. The whole process is kicked of with the `npm run test:client` script and bootstraped with the `karma.tests.js` file.
 * Server-side tests are run with Mocha, and the process is kicked off with the `npm run test:server` script.

#### Notes about mocking:

 * For __client__ and __universal (client and server)__ tests we use webpack with [inject-loader](https://github.com/plasticine/inject-loader) for mocking
 * For __server__ tests we use [mockery](https://github.com/mfncooper/mockery) and/or [sinon](https://github.com/sinonjs/sinon)
 * Look at existing tests for examples of usage, and also take a look at [react-karma-boilerplate](https://github.com/eiriklv/react-karma-boilerplate) for examples of testing React components

Running test
-----------------

 * All tests - `npm test`
 * Client only - `npm run test:client` or with watching - `npm run watch:test`
 * Server only - `npm run test:server`

Install dependencies:
---------------------

 * [Install node.js (5.x)](https://nodejs.org/)
 * `npm install`
 * If you get the yet to be explained "esprima error" ([see issue](https://github.com/soldotno/aurora-frontend/issues/45)) - do another `npm install`

Publishing / committing:
---------------------

There is a build step (babel, so you'll have to do the following before committing/publishing

 * `npm run build`

Utilities:
----------

There's also some utilities built specifically for Aurora:

 - [aurora-sass-loader](https://github.com/soldotno/aurora-sass-loader) - for handling the server-side loading of styles in the modules.
 - [aurora-deep-slice-merge](https://github.com/soldotno/aurora-deep-slice-merge) - for handling the slicing, merging and appending of Aurora configuration objects
 - [match-when-es5](https://github.com/soldotno/match-when) - for doing pattern matching

Using Aurora
=============

__NOTE:__ This is still in the experimental stage (!)

Aurora is a application assembly framework, where you can compose pages using configurations (in JSON). You as the consumer can define your own building blocks and let the framework assemble them together dynamically on the fly.

Aurora uses React as the rendering engine, as it fits very well with the composition mindset.

The framework consists of the following parts:

- A default webpack config
- A default karma config
- An express server route handler factory (for rendering on the server)
- A client rendering handler factory (for rendering on the client)
- A development server (based on webpack-dev-server)
- React component decorators (for various functionality and convenience)
- React component mixins (for various functionality and convenience)

Default webpack config
----------------------

Aurora Core provides a default webpack config that you can use in your project.

__NOTE:__ This is optional to use, but makes it faster to get something up and running if the default setup provides what you need.

```js
/**
 * Import and use the default webpack config
 */
module.exports = require('aurora-core/webpack.config.js');
```

You can also extend this webpack config to fit you own needs, by just extending the object using `Object.assign` (or equivalent). It's just a plain webpack config (JavaScript object).

```js
/**
 * Import dependencies
 */
const auroraWebpackConfig = require('aurora-core/webpack.config.js');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

/**
 * Environment
 */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Export a webpack plugin that extends the one from aurora-core
 */
module.exports = Object.assign({}, auroraWebpackConfig, {
  /**
   * Replace the entry file name
   */
  entry: auroraWebpackConfig.entry.slice().reverse().slice(1).reverse().concat([
    './src/client-bootstrap'
  ]),
  /**
   * Extend the plugin array
   */
  plugins: (auroraWebpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    }),
  ]),
  /**
   * Extend the output to make it work with the dev-server
   */
  output: isProduction ? Object.assign({}, auroraWebpackConfig.output, {
    path: path.join(__dirname, '/public/custom-assets-folder/'),
    publicPath: '/custom-assets-folder/',
  }) : Object.assign({}, auroraWebpackConfig.output, {
    path: path.join(__dirname, '/public/custom-assets-folder/'),
    publicPath: '/custom-assets-folder/',
  }),
  /**
   * Add resolver aliases that
   * we want to ignore in our
   * webpack bundle
   *
   * NOTE: We just replace any
   * server specific modules
   * with a no-op (from npm)
   */
  resolve: Object.assign({}, auroraWebpackConfig.resolve, {
    alias: Object.assign({}, (auroraWebpackConfig.resolve || {}).alias, {
      'redis': 'no-op'
    })
  }),
  /**
   * Override PostCSS defaults
   */
  postcss: [
    autoprefixer({
      browsers: ['last 3 versions']
    })
  ],
});
```

Default karma config
--------------------

Aurora Core provides a default webpack config that you can use in your project.

__NOTE:__ This is optional to use, but makes it faster to get something up and running if the default setup provides what you need.

```js
/**
 * Import and use the default karma config
 */
module.exports = require('aurora-core/karma.conf.js')
```

If you have extended the webpack config, you'll have to inject this into the karma config.

```js
/**
 * Import your extended webpack config
 */
var webpackConfig = require('./webpack.config.js');

/**
 * Export the karma config (with the webpack config injected)
 */
module.exports = require('aurora-core/karma.conf.js').extend(webpackConfig);
```

Express server route handler factory
------------------------------------

A factory function that creates a route handler for you to use on the server.

```js
/**
 * Import the server-rendering function
 * from aurora core and create an instance
 */
const renderServer = require('aurora-core/dist/render/server')({
  createHTML: () => { ... },
  getRoute: () => { ... },
  getUserSettings: () => { ... },
  getPaginationSettings: () => { ... },
  getModule: () => { ... },
  isVisible: () => { ... },
});
```

You'll need to provide the following functions to the factory function

#### createHTML

A function that returns an HTML representation of the page rendered.

This function will receive an object containing the following properties

- `appMarkup` String: (the markup generated for the React app)
- `criticalStyles` String: (critical styles extracted from the server rendered app)
- `pagination` Object: (pagination data)
- `settings` Object: (user settings)
- `flags` Object: (feature flags)
- `version` String: (rendered page configuration version)
- `latestVersion` String: (latest available page configuration version)
- `hash` String: (webpack bundle hash)
- `config` Object: (page configuration)

Example implementation:

```js
/**
 * Export a function that creates
 * the initial HTML markup for the application
 */
module.exports = function createHTML({
  appMarkup = '<div>missing</div>',
  criticalStyles = '',
  pagination = {},
  settings = {},
  flags = {},
  version = '',
  latestVersion = '',
  hash = '',
  config = {},
}) {
  /**
   * Pull out the page information
   * from the configuration
   */
  const {
    pageInfo: {
      title = 'Default Page Title',
    } = {},
  } = config;

  /**
   * Create and return the actual HTML
   */
  return `
    <!DOCTYPE html>
    <html lang="no">
    <head>
      <!-- Meta -->
      <title>${title}</title>
      <meta charset="UTF-8">

      <!-- Server-side included styles (REQUIRED) -->
      <style type="text/css">${criticalStyles}</style>
    </head>

    <body>
      <!-- Markup from server (REQUIRED) -->
      <div id="app">${appMarkup}</div>

      <!-- Dehydrated data from server (REQUIRED) -->
      <script>window.__version = ${JSON.stringify(version)};</script>
      <script>window.__latestVersion = ${JSON.stringify(latestVersion)};</script>
      <script>window.__settings = ${JSON.stringify(settings)};</script>
      <script>window.__flags = ${JSON.stringify(flags)};</script>
      <script>window.__config = ${JSON.stringify(config)};</script>
      <script>window.__pagination = ${JSON.stringify(pagination)};</script>

      <!-- Script bundles (REQUIRED) -->
      <script type="text/javascript" src="/static/app.${hash}.js" async></script>
    </body>

    </html>
  `;
};
```

#### getRoute

A function that returns a Promise of a page/route configuration (JSON)

This function will receive an object containing the following properties

- `path` String: (the path/route requested)
- `query` Object: (the parsed query string object)
- `page` Number: (the current page/pagination requested)
- `skip` Number: (the current skip count requested)
- `limit` Number: (the current limit count requested)
- `version` String: (the current version requested)
- `settings` Object: (user settings for the request - see `getUserSettings` below)

Example implementation (static routes):

```js
/**
 * Import dependencies
 */
const clone = require('stringify-clone');
const deepEqual = require('deep-equal');

/**
 * Import Aurora specific dependency for slicing and merging Aurora configuration objects
 */
const { slice, merge } = require('aurora-deep-slice-merge');

/**
 * Example route/configuration
 */
const demo = {
  pageInfo: {
    title: 'Demo Aurora config',
  },
  app: {
    type: 'demo-app',
    options: {
      modules: [{
        type: 'demo-hom',
        options: {
          modules: [{
            type: 'demo-module-with-data',
            visibility: ['small'],
            options: {
              _dataOptions: {
                name: 'A',
                age: 1
              }
            }
          }, {
            type: 'demo-module-with-data',
            visibility: ['medium'],
            options: {
              _dataOptions: {
                name: 'B',
                age: 2
              }
            }
          }, {
            type: 'demo-module-with-data',
            visibility: ['large'],
            options: {
              _dataOptions: {
                name: 'C',
                age: 3
              }
            }
          }, {
            type: 'demo-module-with-data',
            options: {
              _dataOptions: {
                name: 'D',
                age: 4
              }
            }
          }, {
            type: 'demo-hom',
            options: {
              modules: [{
                type: 'demo-module-with-data',
                visibility: ['small'],
                options: {
                  _dataOptions: {
                    name: 'E',
                    age: 5
                  }
                }
              }, {
                type: 'demo-module-with-data',
                visibility: ['medium'],
                options: {
                  _dataOptions: {
                    name: 'F',
                    age: 6
                  }
                }
              }, {
                type: 'demo-module-with-data',
                visibility: ['large'],
                options: {
                  _dataOptions: {
                    name: 'G',
                    age: 7
                  }
                }
              }, {
                type: 'demo-module-with-data',
                options: {
                  _dataOptions: {
                    name: 'H',
                    age: 8
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  }
};

/**
 * Routes
 */
const routes = {
  '/demo': demo,
};

module.exports = function({
  path,
  query,
  skip,
  limit,
  page,
  version,
  settings,
}) {
  if (!routes[path]) {
    return Promise.reject(new Error('Route requested not found'));
  }

  let config = slice(routes[path], skip, limit);

  let hasMore = !deepEqual(
    slice(routes[path], skip, limit),
    slice(routes[path], skip, limit + 1)
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        meta: {
          pagination: { hasMore },
          version: 123
        },
        data: { config }
      });
    }, 1000);
  });
};
```

Example implementation where the route resolving is outsourced to an external API/service (dynamic routes):

```js
/**
 * Dependencies
 */
const axios = require('axios');
const qs = require('qs');
const urlJoin = require('url-join');

/**
 * Environment
 */
const apiUrl = process.env.API_URL;

/**
 * Create request module
 * that stringifies nested
 * objects as query strings
 * that the qs module can
 * parse into valid objects
 * on the other end
 */
const request = axios.create({
  paramsSerializer(params) {
    return qs.stringify(params);
  },
});

/**
 * Export a function that fetches
 * a page config based on input parameters
 */
module.exports = function ({
  path = '/',
  query = {},
  page = 0,
  skip = 0,
  limit = Infinity,
  version = '',
  settings = {},
}) {
  /**
   * Set up the query we want to
   * supply to the API endpoint
   */
  const apiQuery = {
    params: {
      options: { ...query },
      page,
      skip,
      limit,
      version,
      settings,
    }
  };

  /**
   * Create a closure for returning
   * the requested path from the API
   */
  const requestFromApi = () => {
    return request
    .get(urlJoin(apiUrl, 'routes', path), apiQuery)
    .then(response => response.data);
  };

  /**
   * Use either the cache or the API directly
   */
  return requestFromApi();
};
```

Take a look at `RESOLVING.MD` for more information about the configuration object.

#### getUserSettings

A function that returns an object containing any user specific settings.

This function will get passed the following arguments

- `req` (the express request object)
- `res` (the express response object)

Example implementation:

```js
/**
 * Export a function that returns the user settings
 * we want to include in our application
 */
module.exports = function getUserSettings(req, res) {
  /**
   * Create some global settings
   *
   * - seed for deterministic random randomization
   * - user identification
   * - request ip address
   * - etc..
   */
  return {
    seed: JSON.stringify(Date.now()),
    user: req.get('user') || 'not-logged-in',
    ip: ip || '127.0.0.1',
    ua: req.useragent || '',
  };
};
```

#### getPaginationSettings

A function that returns an object overriding the default pagination settings in Aurora

This function will get passed the following arguments

- `req` (the express request object)

Example implementation:

```js
/**
 * Export a function that extends the
 * default pagination settings with
 * user defined ones
 */
module.exports = function getPaginationSettings(req) {
  /**
   * Set user defined pagination settings
   */
  return {
    perPage: 8,
    initialLimit: 15,
  };
};
```

#### getModule

A function that returns a Promise of a React component

This function will get passed the following arguments

- `type` String: (the name of the component you want to get)

Example implementation (using webpack `require.ensure` for async loading):

```js
/**
 * Shim require.ensure in node.js
 * (check the webpack docs - async chunking)
 */
if (typeof require.ensure !== 'function') {
  require.ensure = require('isomorphic-ensure')({
    dirname: __dirname,
  });
}

/**
 * The map of modules available to resolve to
 */
const moduleMap = {
  'demo-app': (callback) => {
    callback(null, require('./DemoAppModule/DemoAppModule.jsx'));
  },
  'demo-hom': (callback) => {
    callback(null, require('./DemoHigherOrderModule/DemoHigherOrderModule.jsx'));
  },
  'demo-module': (callback) => {
    callback(null, require('./DemoModule/DemoModule.jsx'));
  },
  'demo-module-with-data': (callback) => {
    callback(null, require('./DemoModuleWithData/DemoModuleWithData.jsx'));
  },
  'does-not-exist': (callback) => {
    callback(null, require('./DoesNotExist/DoesNotExist.jsx'));
  },
};

/**
 * Export a function that can resolve
 * a module from a string representation
 * to a React component / Aurora module
 * (asynchronously)
 */
module.exports = (type) => {
  /**
   * Return a Promise of the React component
   * resolved from the string type definition
   */
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      if (!moduleMap[type]) {
        debug(`You are trying to render a module with type *${type}* which does not exist`);
      }

      /**
       * Pull out the specified component getter function
       * (or default gracefully)
       */
      const getModule = moduleMap[type] || moduleMap['does-not-exist'];

      /**
       * Fetch the specified component and the promise to it
       */
      getModule((err, module) => {
        return err ? reject(err) : resolve(module);
      });
    });
  });
};
```

Example implementation (using webpack `require.ensure` for async loading):

```js
/**
 * Shim require.ensure in node.js
 * (check the webpack docs - async chunking)
 */
if (typeof require.ensure !== 'function') {
  require.ensure = require('isomorphic-ensure')({
    dirname: __dirname,
  });
}

/**
 * The map of modules available to resolve to
 */
const moduleMap = {
  'demo-app': (callback) => {
    require.ensure([], (require) => {
      callback(null, require('./DemoAppModule/DemoAppModule.jsx'));
    });
  },
  'demo-hom': (callback) => {
    require.ensure([], (require) => {
      callback(null, require('./DemoHigherOrderModule/DemoHigherOrderModule.jsx'));
    });
  },
  'demo-module': (callback) => {
    require.ensure([], (require) => {
      callback(null, require('./DemoModule/DemoModule.jsx'));
    });
  },
  'demo-module-with-data': (callback) => {
    require.ensure([], (require) => {
      callback(null, require('./DemoModuleWithData/DemoModuleWithData.jsx'));
    });
  },
  'does-not-exist': (callback) => {
    require.ensure([], (require) => {
      callback(null, require('./DoesNotExist/DoesNotExist.jsx'));
    });
  },
};

/**
 * Export a function that can resolve
 * a module from a string representation
 * to a React component / Aurora module
 * (asynchronously)
 */
module.exports = (type) => {
  /**
   * Return a Promise of the React component
   * resolved from the string type definition
   */
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      if (!moduleMap[type]) {
        debug(`You are trying to render a module with type *${type}* which does not exist`);
      }

      /**
       * Pull out the specified component getter function
       * (or default gracefully)
       */
      const getModule = moduleMap[type] || moduleMap['does-not-exist'];

      /**
       * Fetch the specified component and the promise to it
       */
      getModule((err, module) => {
        return err ? reject(err) : resolve(module);
      });
    });
  });
};
```

#### isVisible

A function that returns either `true` or `false`, deciding if the module should be visible on current platform or not.

This function will get passed an object containing the following properties

- `settings` Object: (the current user settings)
- `query` Object: (the current parsed query string)
- `visibility` Array: (An array of string representing where this module should be visible)

Example implementation:

```js
/**
 * Function for determining the visibility
 * of a module given a visibility object in the form of:
 *
 * ['small', 'medium', 'large', 'app']
 *
 * ..returning either true or false
 */
module.exports = function isVisible(
  settings = {},
  query = {},
  visibility = []
) {
  /**
   * Destructure settings
   *
   * NOTE: Could include
   * user agent, etc..
   * It's up to you really!
   */
  const {
    ua = {},
  } = settings;

  /**
   * EXAMPLE:
   *
   * Default browser size/device
   */
  let size = 'large';

  /**
   * Handle medium size browsers
   */
  if (window.innerWidth < 768) {
    size = 'medium';
  }

  /**
   * Handle small size browsers
   */
  if (window.innerWidth < 480) {
    size = 'small';
  }

  /**
   * Handle request query
   */
  if (
    query.device === 'android' ||
    query.device === 'ios'
  ) {
    size = 'app';
  }

  /**
   * Handle includes (precedence)
   */
  return !!~visibility.indexOf(size);
};
```

Client rendering factory
------------------------

A factory function that creates a rendering handler for you to use on the client.

```js
/**
 * Initialize and render the client app
 */
require('aurora-core/dist/render/client')({
  getRoute: () => { ... },
  getModule: () => { ... },
  isVisible: () => { ... },
});
```
This factory function requires the following functions to be passed as properties:

#### getRoute

(See server route handler documentation for info)

#### getModule

(See server route handler documentation for info)

#### isVisible

(See server route handler documentation for info)

Changelog
---------

**2.0.0** - Migrate to webpack 2
**1.5.0** - Remove built files from source control
