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
 * Create a mock for the getModule method
 */
const isVisibleMockSmall = function(settings = {}, query = {}, visibility = {}) {
  /**
   * Destructure visibility
   */
  const {
    include,
    exclude,
  } = visibility;

  let size = 'small';

  if ((include || []).length) {
    return !!~include.indexOf(size);
  }

  if ((exclude || []).length) {
    return !~exclude.indexOf(size);
  }
};

/**
 * Create a mock for the getModule method
 */
const isVisibleMockLarge = function(settings = {}, query = {}, visibility = {}) {
  /**
   * Destructure visibility
   */
  const {
    include,
    exclude,
  } = visibility;

  let size = 'large';

  if ((include || []).length) {
    return !!~include.indexOf(size);
  }

  if ((exclude || []).length) {
    return !~exclude.indexOf(size);
  }
};

/**
 * The actual test suit(s)
 */
describe('resolveVisibility (include)', () => {
  describe('.onServer()', () => {
    it('should resolve visibility recursively on the server (hide every module with visibility set)', (done) => {
      /**
       * Import the unit we want to test
       */
      const resolveVisibility = require('./resolve-visibility').default(isVisibleMockSmall);

      /**
       * Create a dummy config to extract styles from
       */
      const dummyConfig = {
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
      resolveVisibility.onServer(dummyConfig)
      .then((configWithVisibilityResolved) => {
        /**
         * Do assertations/expectations
         */
        expect(configWithVisibilityResolved).toEqual({
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

  describe('.onClient()', () => {
    it('should resolve visibility recursively on the client', (done) => {
      /**
       * Import the unit we want to test
       */
      const resolveVisibility = require('./resolve-visibility').default(isVisibleMockSmall);

      /**
       * Create a dummy config to extract styles from
       */
      const dummyConfig = {
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
      resolveVisibility.onClient({}, {}, dummyConfig)
      .then((configWithVisibilityResolved) => {
        /**
         * Do assertations/expectations
         */
        expect(configWithVisibilityResolved).toEqual({
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
describe('resolveVisibility (exclude)', () => {
  describe('.onServer()', () => {
    it('should resolve visibility recursively on the server (hide every module with visibility set)', (done) => {
      /**
       * Import the unit we want to test
       */
      const resolveVisibility = require('./resolve-visibility').default(isVisibleMockSmall);

      /**
       * Create a dummy config to extract styles from
       */
      const dummyConfig = {
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
      resolveVisibility.onServer(dummyConfig)
      .then((configWithVisibilityResolved) => {
        /**
         * Do assertations/expectations
         */
        expect(configWithVisibilityResolved).toEqual({
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

  describe('.onClient()', () => {
    it('should resolve visibility recursively on the client', (done) => {
      /**
       * Import the unit we want to test
       */
      const resolveVisibility = require('./resolve-visibility').default(isVisibleMockSmall);

      /**
       * Create a dummy config to extract styles from
       */
      const dummyConfig = {
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
      resolveVisibility.onClient({}, {}, dummyConfig)
      .then((configWithVisibilityResolved) => {
        /**
         * Do assertations/expectations
         */
        expect(configWithVisibilityResolved).toEqual({
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
describe('resolveVisibility (exclude 2)', () => {
  describe('.onServer()', () => {
    it('should resolve visibility recursively on the server (hide every module with visibility set)', (done) => {
      /**
       * Import the unit we want to test
       */
      const resolveVisibility = require('./resolve-visibility').default(isVisibleMockLarge);

      /**
       * Create a dummy config to extract styles from
       */
      const dummyConfig = {
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
      resolveVisibility.onServer(dummyConfig)
      .then((configWithVisibilityResolved) => {
        /**
         * Do assertations/expectations
         */
        expect(configWithVisibilityResolved).toEqual({
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

  describe('.onClient()', () => {
    it('should resolve visibility recursively on the client', (done) => {
      /**
       * Import the unit we want to test
       */
      const resolveVisibility = require('./resolve-visibility').default(isVisibleMockLarge);

      /**
       * Create a dummy config to extract styles from
       */
      const dummyConfig = {
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
      resolveVisibility.onClient({}, {}, dummyConfig)
      .then((configWithVisibilityResolved) => {
        /**
         * Do assertations/expectations
         */
        expect(configWithVisibilityResolved).toEqual({
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
