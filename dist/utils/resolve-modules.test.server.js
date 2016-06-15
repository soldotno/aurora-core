'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _mockery = require('mockery');

var _mockery2 = _interopRequireDefault(_mockery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Test suite before hook
 * (this is run _once_ before running any of the tests)
 */
/**
 * Dependencies
 */
before(function () {
  /**
   * Enable mocking of requires
   * using mockery (suppress warning)
   */
  _mockery2.default.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  });
});

/**
 * Test suite after hook
 * (this is run _once_ after running all of the tests)
 */
after(function () {
  /**
   * Disable mocking of requires when done
   */
  _mockery2.default.disable();
});

/**
 * The actual test suit(s)
 */
describe('resolveModules()', function () {
  it('should resolve modules recursively', function (done) {
    /**
     * Create a mock for the getModule method
     */
    var getModuleMock = function getModuleMock(type) {
      return Promise.resolve({ type: type });
    };

    /**
     * Import the unit we want to test
     */
    var resolveModules = require('./resolve-modules')(getModuleMock);

    /**
     * Create a dummy config to extract styles from
     */
    var dummyConfig = {
      app: {
        type: 'demo-app',
        options: {
          modules: [{
            type: 'demo-hom',
            options: {
              modules: [{
                type: 'demo-module',
                options: {
                  a: 5
                }
              }, {
                type: 'demo-module',
                options: {
                  b: 10
                }
              }, {
                type: 'demo-module',
                options: {
                  c: 15
                }
              }]
            }
          }]
        }
      }
    };

    /**
     * Resolve the modules
     */
    resolveModules(dummyConfig).then(function (configWithModulesResolved) {
      /**
       * Do assertations/expectations
       */
      (0, _expect2.default)(configWithModulesResolved).toEqual({
        app: {
          type: { type: 'demo-app' },
          options: {
            modules: [{
              type: { type: 'demo-hom' },
              options: {
                modules: [{
                  type: { type: 'demo-module' },
                  options: {
                    a: 5
                  }
                }, {
                  type: { type: 'demo-module' },
                  options: {
                    b: 10
                  }
                }, {
                  type: { type: 'demo-module' },
                  options: {
                    c: 15
                  }
                }]
              }
            }]
          }
        }
      });

      /**
       * Tell mocha that we're done testing async
       */
      done();
    });
  });
});