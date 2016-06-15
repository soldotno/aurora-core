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
describe('extractStyles()', () => {
  it('should extract styles recursively', () => {
    /**
     * Create a mock for the clean-css npm module
     */
    const cleanCssMock = function() {
      this.minify = (styles) => {
        return { styles }
      };
    };

    /**
     * Register the mock
     */
    mockery.registerMock('clean-css', cleanCssMock);

    /**
     * Create a dummy config to extract styles from
     */
    const dummyConfig = {
      app: {
        type: { getStyles() { return '.style { background: red; }' } },
        options: {
          modules: [{
            type: { getStyles() { return '.style { background: blue; }' } },
            options: {
              modules: [{
                type: { getStyles() { return '.style { background: green; }' } },
                options: {
                  a: 5
                }
              }, {
                type: { getStyles() { return '.style { background: yellow; }' } },
                options: {
                  b: 10
                }
              }, {
                type: { getStyles() { return '.style { background: orange; }' } },
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
     * Import the unit we want to test
     */
    const extractStyles = require('./extract-styles');

    /**
     * Extract the styles
     */
    const criticalStyles = extractStyles(dummyConfig.app);

    /**
     * Do assertations/expectations
     */
    expect(criticalStyles).toEqual([
      '.style { background: red; }',
      '.style { background: blue; }',
      '.style { background: green; }',
      '.style { background: yellow; }',
      '.style { background: orange; }',
    ].join(''))
  });
})
