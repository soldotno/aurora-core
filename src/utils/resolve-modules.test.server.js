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
describe('resolveModules()', () => {
  it('should resolve modules recursively', (done) => {
    /**
     * Create a mock for the getModule method
     */
    const getModuleMock = function(type) {
      return Promise.resolve({ type });
    };

    /**
     * Import the unit we want to test
     */
    const resolveModules = require('./resolve-modules')(getModuleMock);

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
    resolveModules(dummyConfig)
    .then((configWithModulesResolved) => {
      /**
       * Do assertations/expectations
       */
      expect(configWithModulesResolved).toEqual({
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
})
