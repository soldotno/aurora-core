/**
 * Dependencies
 */
import expect from 'expect';
import mockery from 'mockery';

/**
 * Test suite before hook
 * (this is run _once_ before running any of the tests)
 */
before(() => {
  /**
   * Enable mocking of requires
   * using mockery (suppress warning)
   */
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  });
});

/**
 * Test suite after hook
 * (this is run _once_ after running all of the tests)
 */
after(() => {
  /**
   * Disable mocking of requires when done
   */
  mockery.disable();
});

/**
 * The actual test suit(s)
 */
describe('resolveData()', () => {
  it('should resolve data recursively', (done) => {
    /**
     * Create a mock for the getModule method
     */
    const getModuleMock = function(type) {
      return Promise.resolve({
        getData(options) {
          return Promise.resolve(options)
        }
      });
    };

    /**
     * Import the unit we want to test
     */
    const resolveData = require('./resolve-data').default(getModuleMock);

    /**
     * Create a dummy config to extract styles from
     */
    const dummyConfig = {
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
    resolveData(
      { ip: '127.0.0.1' },
      dummyConfig,
    )
    .then((configWithDataResolved) => {
      /**
       * Do assertations/expectations
       */
      expect(configWithDataResolved).toEqual({
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
})
