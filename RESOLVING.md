Resolving explanation
=====================

These are the different steps of resolving and rendering of the config

__Server:__

1. Visibility (server)
2. Data (pre-loading)
3. Modules (from string to React component)
4. Render

(The server attaches the config from step 2. as data to the client)

__Client:__

1. Visibility (client)
2. Modules (from string to React component)
3. Render

#### Server

__Original__:
```js
{
  pageInfo: {
    title: 'Awesome complete stuff',
  },
  app: {
    type: 'awesome-app',
    options: {
      modules: [{
        type: 'awesome-hom',
        options: {
          modules: [{
            type: 'awesome-module',
            visibility: ['small'],
            options: {
              _dataOptions: {
                name: 'A',
                age: 1
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['medium'],
            options: {
              _dataOptions: {
                name: 'B',
                age: 2
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['large'],
            options: {
              _dataOptions: {
                name: 'C',
                age: 3
              }
            }
          }, {
            type: 'awesome-module',
            options: {
              _dataOptions: {
                name: 'D',
                age: 4
              }
            }
          }, {
            type: 'awesome-hom',
            options: {
              modules: [{
                type: 'awesome-module',
                visibility: ['small'],
                options: {
                  _dataOptions: {
                    name: 'E',
                    age: 5
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['medium'],
                options: {
                  _dataOptions: {
                    name: 'F',
                    age: 6
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['large'],
                options: {
                  _dataOptions: {
                    name: 'G',
                    age: 7
                  }
                }
              }, {
                type: 'awesome-module',
                options: {
                  _dataOptions: {
                    name: 'H',
                    age: 8
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  }
};
```

__Visibility__:
```js
{
  pageInfo: {
    title: 'Awesome complete stuff',
  },
  app: {
    type: 'awesome-app',
    options: {
      modules: [{
        type: 'awesome-hom',
        options: {
          modules: [{
            type: 'awesome-module',
            visibility: ['small'],
            options: {
              _hideOnServer: true,
              _dataOptions: {
                name: 'A',
                age: 1
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['medium'],
            options: {
              _hideOnServer: true,
              _dataOptions: {
                name: 'B',
                age: 2
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['large'],
            options: {
              _hideOnServer: true,
              _dataOptions: {
                name: 'C',
                age: 3
              }
            }
          }, {
            type: 'awesome-module',
            options: {
              _dataOptions: {
                name: 'D',
                age: 4
              }
            }
          }, {
            type: 'awesome-hom',
            options: {
              modules: [{
                type: 'awesome-module',
                visibility: ['small'],
                options: {
                  _hideOnServer: true,
                  _dataOptions: {
                    name: 'E',
                    age: 5
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['medium'],
                options: {
                  _hideOnServer: true,
                  _dataOptions: {
                    name: 'F',
                    age: 6
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['large'],
                options: {
                  _hideOnServer: true,
                  _dataOptions: {
                    name: 'G',
                    age: 7
                  }
                }
              }, {
                type: 'awesome-module',
                options: {
                  _dataOptions: {
                    name: 'H',
                    age: 8
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  }
};
```

__Data__:
```js
{
  pageInfo: {
    title: 'Awesome complete stuff',
  },
  app: {
    type: 'awesome-app',
    options: {
      modules: [{
        type: 'awesome-hom',
        options: {
          modules: [{
            type: 'awesome-module',
            visibility: ['small'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'A',
                age: 1
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['medium'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'B',
                age: 2
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['large'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'C',
                age: 3
              }
            }
          }, {
            type: 'awesome-module',
            options: {
              _data: { .... },
              _dataOptions: {
                name: 'D',
                age: 4
              }
            }
          }, {
            type: 'awesome-hom',
            options: {
              modules: [{
                type: 'awesome-module',
                visibility: ['small'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'E',
                    age: 5
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['medium'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'F',
                    age: 6
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['large'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'G',
                    age: 7
                  }
                }
              }, {
                type: 'awesome-module',
                options: {
                  _data: { .... },
                  _dataOptions: {
                    name: 'H',
                    age: 8
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  }
};
```

__Modules__:
```js
{
  pageInfo: {
    title: 'Awesome complete stuff',
  },
  app: {
    type: <AwesomeAppModule />,
    options: {
      modules: [{
        type: <AwesomeHigherOrderModule />,
        options: {
          modules: [{
            type: <AwesomeModule />,
            visibility: ['small'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'A',
                age: 1
              }
            }
          }, {
            type: <AwesomeModule />,
            visibility: ['medium'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'B',
                age: 2
              }
            }
          }, {
            type: <AwesomeModule />,
            visibility: ['large'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'C',
                age: 3
              }
            }
          }, {
            type: <AwesomeModule />,
            options: {
              _data: { .... },
              _dataOptions: {
                name: 'D',
                age: 4
              }
            }
          }, {
            type: 'awesome-hom',
            options: {
              modules: [{
                type: <AwesomeModule />,
                visibility: ['small'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'E',
                    age: 5
                  }
                }
              }, {
                type: <AwesomeModule />,
                visibility: ['medium'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'F',
                    age: 6
                  }
                }
              }, {
                type: <AwesomeModule />,
                visibility: ['large'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'G',
                    age: 7
                  }
                }
              }, {
                type: <AwesomeModule />,
                options: {
                  _data: { .... },
                  _dataOptions: {
                    name: 'H',
                    age: 8
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  }
};
```

#### Client

__Original__:
```js
{
  pageInfo: {
    title: 'Awesome complete stuff',
  },
  app: {
    type: 'awesome-app',
    options: {
      modules: [{
        type: 'awesome-hom',
        options: {
          modules: [{
            type: 'awesome-module',
            visibility: ['small'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'A',
                age: 1
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['medium'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'B',
                age: 2
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['large'],
            options: {
              _hideOnServer: true,
              _data: { .... },
              _dataOptions: {
                name: 'C',
                age: 3
              }
            }
          }, {
            type: 'awesome-module',
            options: {
              _data: { .... },
              _dataOptions: {
                name: 'D',
                age: 4
              }
            }
          }, {
            type: 'awesome-hom',
            options: {
              modules: [{
                type: 'awesome-module',
                visibility: ['small'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'E',
                    age: 5
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['medium'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'F',
                    age: 6
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['large'],
                options: {
                  _hideOnServer: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'G',
                    age: 7
                  }
                }
              }, {
                type: 'awesome-module',
                options: {
                  _data: { .... },
                  _dataOptions: {
                    name: 'H',
                    age: 8
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  }
};
```

__Visibility__:
```js
{
  pageInfo: {
    title: 'Awesome complete stuff',
  },
  app: {
    type: 'awesome-app',
    options: {
      modules: [{
        type: 'awesome-hom',
        options: {
          modules: [{
            type: 'awesome-module',
            visibility: ['small'],
            options: {
              _hideOnServer: true,
              _hideOnClient: false,
              _data: { .... },
              _dataOptions: {
                name: 'A',
                age: 1
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['medium'],
            options: {
              _hideOnServer: true,
              _hideOnClient: true,
              _data: { .... },
              _dataOptions: {
                name: 'B',
                age: 2
              }
            }
          }, {
            type: 'awesome-module',
            visibility: ['large'],
            options: {
              _hideOnServer: true,
              _hideOnClient: true,
              _data: { .... },
              _dataOptions: {
                name: 'C',
                age: 3
              }
            }
          }, {
            type: 'awesome-module',
            options: {
              _data: { .... },
              _dataOptions: {
                name: 'D',
                age: 4
              }
            }
          }, {
            type: 'awesome-hom',
            options: {
              modules: [{
                type: 'awesome-module',
                visibility: ['small'],
                options: {
                  _hideOnServer: true,
                  _hideOnClient: false,
                  _data: { .... },
                  _dataOptions: {
                    name: 'E',
                    age: 5
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['medium'],
                options: {
                  _hideOnServer: true,
                  _hideOnClient: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'F',
                    age: 6
                  }
                }
              }, {
                type: 'awesome-module',
                visibility: ['large'],
                options: {
                  _hideOnServer: true,
                  _hideOnClient: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'G',
                    age: 7
                  }
                }
              }, {
                type: 'awesome-module',
                options: {
                  _data: { .... },
                  _dataOptions: {
                    name: 'H',
                    age: 8
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  }
};
```

__Modules__:
```js
{
  pageInfo: {
    title: 'Awesome complete stuff',
  },
  app: {
    type: <AwesomeAppModule />,
    options: {
      modules: [{
        type: <AwesomeHigherOrderModule />,
        options: {
          modules: [{
            type: <AwesomeModule />,
            visibility: ['small'],
            options: {
              _hideOnServer: true,
              _hideOnClient: false,
              _data: { .... },
              _dataOptions: {
                name: 'A',
                age: 1
              }
            }
          }, {
            type: <AwesomeModule />,
            visibility: ['medium'],
            options: {
              _hideOnServer: true,
              _hideOnClient: true,
              _data: { .... },
              _dataOptions: {
                name: 'B',
                age: 2
              }
            }
          }, {
            type: <AwesomeModule />,
            visibility: ['large'],
            options: {
              _hideOnServer: true,
              _hideOnClient: true,
              _data: { .... },
              _dataOptions: {
                name: 'C',
                age: 3
              }
            }
          }, {
            type: <AwesomeModule />,
            options: {
              _data: { .... },
              _dataOptions: {
                name: 'D',
                age: 4
              }
            }
          }, {
            type: <AwesomeHigherOrderModule />,
            options: {
              modules: [{
                type: <AwesomeModule />,
                visibility: ['small'],
                options: {
                  _hideOnServer: true,
                  _hideOnClient: false,
                  _data: { .... },
                  _dataOptions: {
                    name: 'E',
                    age: 5
                  }
                }
              }, {
                type: <AwesomeModule />,
                visibility: ['medium'],
                options: {
                  _hideOnServer: true,
                  _hideOnClient: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'F',
                    age: 6
                  }
                }
              }, {
                type: <AwesomeModule />,
                visibility: ['large'],
                options: {
                  _hideOnServer: true,
                  _hideOnClient: true,
                  _data: { .... },
                  _dataOptions: {
                    name: 'G',
                    age: 7
                  }
                }
              }, {
                type: <AwesomeModule />,
                options: {
                  _data: { .... },
                  _dataOptions: {
                    name: 'H',
                    age: 8
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  }
};
```
