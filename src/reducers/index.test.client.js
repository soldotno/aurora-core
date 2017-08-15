import expect from 'expect';
import rootReducer from './index.js';

describe('rootReducer()', () => {
  describe('REFRESH_CONFIG', () => {
    it('should set loading state correctly', () => {
      const initialConfig = {
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

      const initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: false,
        },
      };

      const actions = [{
        type: 'REFRESH_CONFIG_PENDING',
      }];

      let finalState = actions.reduce(rootReducer, initialState);

      expect(finalState).toEqual({
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
          originalPath: '/context.html',
        },
      });
    });

    it('should refresh the config correctly and reset flags', () => {
      const initialConfig = {
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

      const nextConfig = {
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

      const initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      };

      const actions = [{
        type: 'REFRESH_CONFIG_SUCCESS',
        data: { config: nextConfig },
        meta: { version: '12345', pagination: { hasMore: true } }
      }];

      let finalState = actions.reduce(rootReducer, initialState);

      expect(finalState).toEqual({
        error: null,
        version: '12345',
        config: nextConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: false,
        },
      });
    });

    it('should handle an error of resetting the config correctly', () => {
      const initialConfig = {
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

      const initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      };

      const error = { message: 'Something bad happened!' }

      const actions = [{
        type: 'REFRESH_CONFIG_ERROR',
        error: error,
      }];

      let finalState = actions.reduce(rootReducer, initialState);

      expect(finalState).toEqual({
        error: error,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      });
    });
  });

  describe('POPULATE_NEXT_PAGE', () => {
    it('should set loading state correctly', () => {
      const initialConfig = {
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

      const initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: false,
        },
      };

      const actions = [{
        type: 'POPULATE_NEXT_PAGE_PENDING',
      }];

      let finalState = actions.reduce(rootReducer, initialState);

      expect(finalState).toEqual({
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 0,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      });
    });

    it('should populate the next page of the config correctly and reset flags (merge operation)', () => {
      const initialConfig = {
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

      const nextConfig = {
        app: {
          type: 'demo-app',
          options: {
            modules: [{
              type: 'demo-hom',
              options: {
                modules: [
                  null,
                  null,
                  null,
                {
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

      const initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 0,
          perPage: 3,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      };

      const actions = [{
        type: 'POPULATE_NEXT_PAGE_SUCCESS',
        data: { config: nextConfig },
        meta: { operation: 'merge', version: '12345', pagination: { hasMore: false } }
      }];

      let finalState = actions.reduce(rootReducer, initialState);

      expect(finalState).toEqual({
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
          seed: '1234',
        },
        pagination: {
          page: 1,
          perPage: 3,
          initialLimit: 3,
          hasMore: false,
          isLoading: false,
        },
      });
    });

    it('should populate the next page of the config correctly and reset flags (append operation)', () => {
      const initialConfig = {
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

      const nextModules = [{
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

      const initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 0,
          perPage: 3,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      };

      const actions = [{
        type: 'POPULATE_NEXT_PAGE_SUCCESS',
        data: { modules: nextModules },
        meta: { operation: 'append', version: '12345', pagination: { hasMore: false } }
      }];

      let finalState = actions.reduce(rootReducer, initialState);

      expect(finalState).toEqual({
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
          seed: '1234',
        },
        pagination: {
          page: 1,
          perPage: 3,
          initialLimit: 3,
          hasMore: false,
          isLoading: false,
        },
      });
    });

    it('should populate the next page of the config correctly and reset flags (undefined operation defaults to merge)', () => {
      const initialConfig = {
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

      const nextConfig = {
        app: {
          type: 'demo-app',
          options: {
            modules: [{
              type: 'demo-hom',
              options: {
                modules: [
                  null,
                  null,
                  null,
                {
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

      const initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 0,
          perPage: 3,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      };

      const actions = [{
        type: 'POPULATE_NEXT_PAGE_SUCCESS',
        data: { config: nextConfig },
        meta: { version: '12345', pagination: { hasMore: false } }
      }];

      let finalState = actions.reduce(rootReducer, initialState);

      expect(finalState).toEqual({
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
          seed: '1234',
        },
        pagination: {
          page: 1,
          perPage: 3,
          initialLimit: 3,
          hasMore: false,
          isLoading: false,
        },
      });
    });

    it('should handle an error of resetting the config correctly', () => {
      const initialConfig = {
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

      const initialState = {
        error: null,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      };

      const error = { message: 'Something bad happened!' }

      const actions = [{
        type: 'POPULATE_NEXT_PAGE_ERROR',
        error: error,
      }];

      let finalState = actions.reduce(rootReducer, initialState);

      expect(finalState).toEqual({
        error: error,
        version: 'latest',
        config: initialConfig,
        settings: {
          ip: '127.0.0.1',
          user: 'not-logged-in',
          seed: '1234',
        },
        pagination: {
          page: 2,
          perPage: 1,
          initialLimit: 3,
          hasMore: true,
          isLoading: true,
        },
      });
    });
  });
});
