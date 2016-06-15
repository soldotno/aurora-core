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
describe('extractStyles()', function () {
  it('should extract styles recursively', function () {
    /**
     * Create a mock for the clean-css npm module
     */
    var cleanCssMock = function cleanCssMock() {
      this.minify = function (styles) {
        return { styles: styles };
      };
    };

    /**
     * Register the mock
     */
    _mockery2.default.registerMock('clean-css', cleanCssMock);

    /**
     * Create a dummy config to extract styles from
     */
    var dummyConfig = {
      app: {
        type: {
          getStyles: function getStyles() {
            return '.style { background: red; }';
          }
        },
        options: {
          modules: [{
            type: {
              getStyles: function getStyles() {
                return '.style { background: blue; }';
              }
            },
            options: {
              modules: [{
                type: {
                  getStyles: function getStyles() {
                    return '.style { background: green; }';
                  }
                },
                options: {
                  a: 5
                }
              }, {
                type: {
                  getStyles: function getStyles() {
                    return '.style { background: yellow; }';
                  }
                },
                options: {
                  b: 10
                }
              }, {
                type: {
                  getStyles: function getStyles() {
                    return '.style { background: orange; }';
                  }
                },
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
    var extractStyles = require('./extract-styles');

    /**
     * Extract the styles
     */
    var criticalStyles = extractStyles(dummyConfig.app);

    /**
     * Do assertations/expectations
     */
    (0, _expect2.default)(criticalStyles).toEqual(['.style { background: red; }', '.style { background: blue; }', '.style { background: green; }', '.style { background: yellow; }', '.style { background: orange; }'].join(''));
  });
});