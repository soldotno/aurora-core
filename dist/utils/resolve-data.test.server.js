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
describe('resolveData()', function () {
  it('should resolve data recursively', function (done) {
    /**
     * Create a mock for the getModule method
     */
    var getModuleMock = function getModuleMock(type) {
      return Promise.resolve({
        getData: function getData(options) {
          return Promise.resolve(options);
        }
      });
    };

    /**
     * Import the unit we want to test
     */
    var resolveData = require('./resolve-data')(getModuleMock);

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
                  _dataOptions: {
                    dataA: 5
                  },
                  a: 5
                }
              }, {
                type: 'demo-module',
                options: {
                  _dataOptions: {
                    dataB: 10
                  },
                  b: 10
                }
              }, {
                type: 'demo-module',
                options: {
                  _dataOptions: {
                    dataC: 15
                  },
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
    resolveData({ ip: '127.0.0.1' }, dummyConfig).then(function (configWithDataResolved) {
      /**
       * Do assertations/expectations
       */
      (0, _expect2.default)(configWithDataResolved).toEqual({
        app: {
          type: 'demo-app',
          options: {
            _data: {
              __settings: { ip: '127.0.0.1' }
            },
            modules: [{
              type: 'demo-hom',
              options: {
                _data: {
                  __settings: { ip: '127.0.0.1' }
                },
                modules: [{
                  type: 'demo-module',
                  options: {
                    _dataOptions: {
                      dataA: 5
                    },
                    _data: {
                      __settings: { ip: '127.0.0.1' },
                      dataA: 5
                    },
                    a: 5
                  }
                }, {
                  type: 'demo-module',
                  options: {
                    _dataOptions: {
                      dataB: 10
                    },
                    _data: {
                      __settings: { ip: '127.0.0.1' },
                      dataB: 10
                    },
                    b: 10
                  }
                }, {
                  type: 'demo-module',
                  options: {
                    _dataOptions: {
                      dataC: 15
                    },
                    _data: {
                      __settings: { ip: '127.0.0.1' },
                      dataC: 15
                    },
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