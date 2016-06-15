'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('rootReducer()', function () {
  describe('REFRESH_CONFIG', function () {
    it('should set loading state correctly', function () {
      var initialConfig = {
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

      var initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: false
        }
      };

      var actions = [{
        type: 'REFRESH_CONFIG_PENDING'
      }];

      var finalState = actions.reduce(_index2.default, initialState);

      (0, _expect2.default)(finalState).toEqual({
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      });
    });

    it('should refresh the config correctly and reset flags', function () {
      var initialConfig = {
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

      var nextConfig = {
        app: {
          type: 'demo-app',
          options: {
            modules: [{
              type: 'demo-hom',
              options: {
                modules: [{
                  type: 'demo-module',
                  options: {
                    aa: 5
                  }
                }, {
                  type: 'demo-module',
                  options: {
                    bb: 10
                  }
                }, {
                  type: 'demo-module',
                  options: {
                    cc: 15
                  }
                }]
              }
            }]
          }
        }
      };

      var initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      };

      var actions = [{
        type: 'REFRESH_CONFIG_SUCCESS',
        data: { config: nextConfig },
        meta: { version: '12345', pagination: { hasMore: true } }
      }];

      var finalState = actions.reduce(_index2.default, initialState);

      (0, _expect2.default)(finalState).toEqual({
        error: null,
        version: '12345',
        config: nextConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: false
        }
      });
    });

    it('should handle an error of resetting the config correctly', function () {
      var initialConfig = {
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

      var initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      };

      var error = { message: 'Something bad happened!' };

      var actions = [{
        type: 'REFRESH_CONFIG_ERROR',
        error: error
      }];

      var finalState = actions.reduce(_index2.default, initialState);

      (0, _expect2.default)(finalState).toEqual({
        error: error,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      });
    });
  });

  describe('POPULATE_NEXT_PAGE', function () {
    it('should set loading state correctly', function () {
      var initialConfig = {
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

      var initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: false
        }
      };

      var actions = [{
        type: 'POPULATE_NEXT_PAGE_PENDING'
      }];

      var finalState = actions.reduce(_index2.default, initialState);

      (0, _expect2.default)(finalState).toEqual({
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      });
    });

    it('should populate the next page of the config correctly and reset flags (merge operation)', function () {
      var initialConfig = {
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

      var nextConfig = {
        app: {
          type: 'demo-app',
          options: {
            modules: [{
              type: 'demo-hom',
              options: {
                modules: [null, null, null, {
                  type: 'demo-module',
                  options: {
                    d: 20
                  }
                }, {
                  type: 'demo-module',
                  options: {
                    e: 25
                  }
                }, {
                  type: 'demo-module',
                  options: {
                    f: 30
                  }
                }]
              }
            }]
          }
        }
      };

      var initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 0,
          perPage: 3,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      };

      var actions = [{
        type: 'POPULATE_NEXT_PAGE_SUCCESS',
        data: { config: nextConfig },
        meta: { operation: 'merge', version: '12345', pagination: { hasMore: false } }
      }];

      var finalState = actions.reduce(_index2.default, initialState);

      (0, _expect2.default)(finalState).toEqual({
        error: null,
        version: '12345',
        config: {
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
                  }, {
                    type: 'demo-module',
                    options: {
                      d: 20
                    }
                  }, {
                    type: 'demo-module',
                    options: {
                      e: 25
                    }
                  }, {
                    type: 'demo-module',
                    options: {
                      f: 30
                    }
                  }]
                }
              }]
            }
          }
        },
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 1,
          perPage: 3,
          initialLimit: 3,
          hasMore: false,
          isLoading: false
        }
      });
    });

    it('should populate the next page of the config correctly and reset flags (append operation)', function () {
      var initialConfig = {
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

      var nextModules = [{
        type: 'demo-module',
        options: {
          d: 20
        }
      }, {
        type: 'demo-module',
        options: {
          e: 25
        }
      }, {
        type: 'demo-module',
        options: {
          f: 30
        }
      }];

      var initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 0,
          perPage: 3,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      };

      var actions = [{
        type: 'POPULATE_NEXT_PAGE_SUCCESS',
        data: { modules: nextModules },
        meta: { operation: 'append', version: '12345', pagination: { hasMore: false } }
      }];

      var finalState = actions.reduce(_index2.default, initialState);

      (0, _expect2.default)(finalState).toEqual({
        error: null,
        version: '12345',
        config: {
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
              }, {
                type: 'demo-module',
                options: {
                  d: 20
                }
              }, {
                type: 'demo-module',
                options: {
                  e: 25
                }
              }, {
                type: 'demo-module',
                options: {
                  f: 30
                }
              }]
            }
          }
        },
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 1,
          perPage: 3,
          initialLimit: 3,
          hasMore: false,
          isLoading: false
        }
      });
    });

    it('should populate the next page of the config correctly and reset flags (undefined operation defaults to merge)', function () {
      var initialConfig = {
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

      var nextConfig = {
        app: {
          type: 'demo-app',
          options: {
            modules: [{
              type: 'demo-hom',
              options: {
                modules: [null, null, null, {
                  type: 'demo-module',
                  options: {
                    d: 20
                  }
                }, {
                  type: 'demo-module',
                  options: {
                    e: 25
                  }
                }, {
                  type: 'demo-module',
                  options: {
                    f: 30
                  }
                }]
              }
            }]
          }
        }
      };

      var initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 0,
          perPage: 3,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      };

      var actions = [{
        type: 'POPULATE_NEXT_PAGE_SUCCESS',
        data: { config: nextConfig },
        meta: { version: '12345', pagination: { hasMore: false } }
      }];

      var finalState = actions.reduce(_index2.default, initialState);

      (0, _expect2.default)(finalState).toEqual({
        error: null,
        version: '12345',
        config: {
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
                  }, {
                    type: 'demo-module',
                    options: {
                      d: 20
                    }
                  }, {
                    type: 'demo-module',
                    options: {
                      e: 25
                    }
                  }, {
                    type: 'demo-module',
                    options: {
                      f: 30
                    }
                  }]
                }
              }]
            }
          }
        },
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 1,
          perPage: 3,
          initialLimit: 3,
          hasMore: false,
          isLoading: false
        }
      });
    });

    it('should handle an error of resetting the config correctly', function () {
      var initialConfig = {
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

      var initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      };

      var error = { message: 'Something bad happened!' };

      var actions = [{
        type: 'POPULATE_NEXT_PAGE_ERROR',
        error: error
      }];

      var finalState = actions.reduce(_index2.default, initialState);

      (0, _expect2.default)(finalState).toEqual({
        error: error,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234'
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true
        }
      });
    });
  });
});