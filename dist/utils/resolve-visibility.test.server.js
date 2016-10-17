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
 * Create a mock for the getModule method
 */
var isVisibleMockSmall = function isVisibleMockSmall() {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var visibility = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  /**
   * Destructure visibility
   */
  var include = visibility.include;
  var exclude = visibility.exclude;


  var size = 'small';

  if ((include || []).length) {
    return !!~include.indexOf(size);
  }

  if ((exclude || []).length) {
    return !~exclude.indexOf(size);
  }
};

/**
 * Create a mock for the getModule method
 */
var isVisibleMockLarge = function isVisibleMockLarge() {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var visibility = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  /**
   * Destructure visibility
   */
  var include = visibility.include;
  var exclude = visibility.exclude;


  var size = 'large';

  if ((include || []).length) {
    return !!~include.indexOf(size);
  }

  if ((exclude || []).length) {
    return !~exclude.indexOf(size);
  }
};

/**
 * The actual test suit(s)
 */
describe('resolveVisibility (include)', function () {
  describe('.onServer()', function () {
    it('should resolve visibility recursively on the server (hide every module with visibility set)', function (done) {
      /**
       * Import the unit we want to test
       */
      var resolveVisibility = require('./resolve-visibility')(isVisibleMockSmall);

      /**
       * Create a dummy config to extract styles from
       */
      var dummyConfig = {
        app: {
          type: 'demo-app',
          visibility: {
            include: ['small']
          },
          options: {
            modules: [{
              type: 'demo-hom',
              visibility: {
                include: ['small']
              },
              options: {
                modules: [{
                  type: 'demo-module',
                  visibility: {
                    include: ['small']
                  },
                  options: {
                    a: 5
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    include: ['large']
                  },
                  options: {
                    b: 10
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    include: ['small']
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
       * Resolve the modules
       */
      resolveVisibility.onServer(dummyConfig).then(function (configWithVisibilityResolved) {
        /**
         * Do assertations/expectations
         */
        (0, _expect2.default)(configWithVisibilityResolved).toEqual({
          app: {
            type: 'demo-app',
            visibility: {
              include: ['small']
            },
            options: {
              _hideOnServer: true,
              modules: [{
                type: 'demo-hom',
                visibility: {
                  include: ['small']
                },
                options: {
                  _hideOnServer: true,
                  modules: [{
                    type: 'demo-module',
                    visibility: {
                      include: ['small']
                    },
                    options: {
                      _hideOnServer: true,
                      a: 5
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      include: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      b: 10
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      include: ['small']
                    },
                    options: {
                      _hideOnServer: true,
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

  describe('.onClient()', function () {
    it('should resolve visibility recursively on the client', function (done) {
      /**
       * Import the unit we want to test
       */
      var resolveVisibility = require('./resolve-visibility')(isVisibleMockSmall);

      /**
       * Create a dummy config to extract styles from
       */
      var dummyConfig = {
        app: {
          type: 'demo-app',
          visibility: {
            include: ['small']
          },
          options: {
            _hideOnServer: true,
            modules: [{
              type: 'demo-hom',
              visibility: {
                include: ['small']
              },
              options: {
                _hideOnServer: true,
                modules: [{
                  type: 'demo-module',
                  visibility: {
                    include: ['small']
                  },
                  options: {
                    _hideOnServer: true,
                    a: 5
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    include: ['large']
                  },
                  options: {
                    _hideOnServer: true,
                    b: 10
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    include: ['small']
                  },
                  options: {
                    _hideOnServer: true,
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
      resolveVisibility.onClient({}, {}, dummyConfig).then(function (configWithVisibilityResolved) {
        /**
         * Do assertations/expectations
         */
        (0, _expect2.default)(configWithVisibilityResolved).toEqual({
          app: {
            type: 'demo-app',
            visibility: {
              include: ['small']
            },
            options: {
              _hideOnServer: true,
              _hideOnClient: false,
              modules: [{
                type: 'demo-hom',
                visibility: {
                  include: ['small']
                },
                options: {
                  _hideOnServer: true,
                  _hideOnClient: false,
                  modules: [{
                    type: 'demo-module',
                    visibility: {
                      include: ['small']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: false,
                      a: 5
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      include: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: true,
                      b: 10
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      include: ['small']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: false,
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
});

/**
 * The actual test suit(s)
 */
describe('resolveVisibility (exclude)', function () {
  describe('.onServer()', function () {
    it('should resolve visibility recursively on the server (hide every module with visibility set)', function (done) {
      /**
       * Import the unit we want to test
       */
      var resolveVisibility = require('./resolve-visibility')(isVisibleMockSmall);

      /**
       * Create a dummy config to extract styles from
       */
      var dummyConfig = {
        app: {
          type: 'demo-app',
          visibility: {
            exclude: ['large']
          },
          options: {
            modules: [{
              type: 'demo-hom',
              visibility: {
                exclude: ['large']
              },
              options: {
                modules: [{
                  type: 'demo-module',
                  visibility: {
                    exclude: ['large']
                  },
                  options: {
                    a: 5
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    include: ['large']
                  },
                  options: {
                    b: 10
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    exclude: ['large']
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
       * Resolve the modules
       */
      resolveVisibility.onServer(dummyConfig).then(function (configWithVisibilityResolved) {
        /**
         * Do assertations/expectations
         */
        (0, _expect2.default)(configWithVisibilityResolved).toEqual({
          app: {
            type: 'demo-app',
            visibility: {
              exclude: ['large']
            },
            options: {
              _hideOnServer: true,
              modules: [{
                type: 'demo-hom',
                visibility: {
                  exclude: ['large']
                },
                options: {
                  _hideOnServer: true,
                  modules: [{
                    type: 'demo-module',
                    visibility: {
                      exclude: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      a: 5
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      include: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      b: 10
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      exclude: ['large']
                    },
                    options: {
                      _hideOnServer: true,
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

  describe('.onClient()', function () {
    it('should resolve visibility recursively on the client', function (done) {
      /**
       * Import the unit we want to test
       */
      var resolveVisibility = require('./resolve-visibility')(isVisibleMockSmall);

      /**
       * Create a dummy config to extract styles from
       */
      var dummyConfig = {
        app: {
          type: 'demo-app',
          visibility: {
            exclude: ['large']
          },
          options: {
            _hideOnServer: true,
            modules: [{
              type: 'demo-hom',
              visibility: {
                exclude: ['large']
              },
              options: {
                _hideOnServer: true,
                modules: [{
                  type: 'demo-module',
                  visibility: {
                    exclude: ['large']
                  },
                  options: {
                    _hideOnServer: true,
                    a: 5
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    include: ['large']
                  },
                  options: {
                    _hideOnServer: true,
                    b: 10
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    exclude: ['large']
                  },
                  options: {
                    _hideOnServer: true,
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
      resolveVisibility.onClient({}, {}, dummyConfig).then(function (configWithVisibilityResolved) {
        /**
         * Do assertations/expectations
         */
        (0, _expect2.default)(configWithVisibilityResolved).toEqual({
          app: {
            type: 'demo-app',
            visibility: {
              exclude: ['large']
            },
            options: {
              _hideOnServer: true,
              _hideOnClient: false,
              modules: [{
                type: 'demo-hom',
                visibility: {
                  exclude: ['large']
                },
                options: {
                  _hideOnServer: true,
                  _hideOnClient: false,
                  modules: [{
                    type: 'demo-module',
                    visibility: {
                      exclude: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: false,
                      a: 5
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      include: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: true,
                      b: 10
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      exclude: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: false,
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
});

/**
 * The actual test suit(s)
 */
describe('resolveVisibility (exclude 2)', function () {
  describe('.onServer()', function () {
    it('should resolve visibility recursively on the server (hide every module with visibility set)', function (done) {
      /**
       * Import the unit we want to test
       */
      var resolveVisibility = require('./resolve-visibility')(isVisibleMockLarge);

      /**
       * Create a dummy config to extract styles from
       */
      var dummyConfig = {
        app: {
          type: 'demo-app',
          visibility: {
            exclude: ['large']
          },
          options: {
            modules: [{
              type: 'demo-hom',
              visibility: {
                exclude: ['large']
              },
              options: {
                modules: [{
                  type: 'demo-module',
                  visibility: {
                    exclude: ['large']
                  },
                  options: {
                    a: 5
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    include: ['large']
                  },
                  options: {
                    b: 10
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    exclude: ['large']
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
       * Resolve the modules
       */
      resolveVisibility.onServer(dummyConfig).then(function (configWithVisibilityResolved) {
        /**
         * Do assertations/expectations
         */
        (0, _expect2.default)(configWithVisibilityResolved).toEqual({
          app: {
            type: 'demo-app',
            visibility: {
              exclude: ['large']
            },
            options: {
              _hideOnServer: true,
              modules: [{
                type: 'demo-hom',
                visibility: {
                  exclude: ['large']
                },
                options: {
                  _hideOnServer: true,
                  modules: [{
                    type: 'demo-module',
                    visibility: {
                      exclude: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      a: 5
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      include: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      b: 10
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      exclude: ['large']
                    },
                    options: {
                      _hideOnServer: true,
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

  describe('.onClient()', function () {
    it('should resolve visibility recursively on the client', function (done) {
      /**
       * Import the unit we want to test
       */
      var resolveVisibility = require('./resolve-visibility')(isVisibleMockLarge);

      /**
       * Create a dummy config to extract styles from
       */
      var dummyConfig = {
        app: {
          type: 'demo-app',
          visibility: {
            exclude: ['large']
          },
          options: {
            _hideOnServer: true,
            modules: [{
              type: 'demo-hom',
              visibility: {
                exclude: ['large']
              },
              options: {
                _hideOnServer: true,
                modules: [{
                  type: 'demo-module',
                  visibility: {
                    exclude: ['large']
                  },
                  options: {
                    _hideOnServer: true,
                    a: 5
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    include: ['large']
                  },
                  options: {
                    _hideOnServer: true,
                    b: 10
                  }
                }, {
                  type: 'demo-module',
                  visibility: {
                    exclude: ['large']
                  },
                  options: {
                    _hideOnServer: true,
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
      resolveVisibility.onClient({}, {}, dummyConfig).then(function (configWithVisibilityResolved) {
        /**
         * Do assertations/expectations
         */
        (0, _expect2.default)(configWithVisibilityResolved).toEqual({
          app: {
            type: 'demo-app',
            visibility: {
              exclude: ['large']
            },
            options: {
              _hideOnServer: true,
              _hideOnClient: true,
              modules: [{
                type: 'demo-hom',
                visibility: {
                  exclude: ['large']
                },
                options: {
                  _hideOnServer: true,
                  _hideOnClient: true,
                  modules: [{
                    type: 'demo-module',
                    visibility: {
                      exclude: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: true,
                      a: 5
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      include: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: false,
                      b: 10
                    }
                  }, {
                    type: 'demo-module',
                    visibility: {
                      exclude: ['large']
                    },
                    options: {
                      _hideOnServer: true,
                      _hideOnClient: true,
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
});