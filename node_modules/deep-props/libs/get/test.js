'use strict'

/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @see {@link http://github.com/jpcx/deep-props.get|GitHub}
 * @license MIT
 */

/**
 * Wrapper for console.dir for maximum depth and coloring.
 *
 * @private
 * @param {*} x - Value to long to console.
 * @example
 * // prints { foo: 'bar' }
 * dirDeep({ foo: 'bar' })
 */
const dirDeep = x => console.dir(x, { depth: null, colors: true })

let get = require('./')

const assert = require('assert')

const ANSI_RED = '\x1b[31m'
const ANSI_GREEN = '\x1b[32m'
const ANSI_CYAN = '\x1b[36m'
const ANSI_RESET = '\x1b[0m'

const tests = []

// --- Test 1: --- //

tests.push(() => {
  const description = `Testing pure nested objects...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: {
        bar: {
          baz: {
            beh: 'qux'
          }
        }
      }
    }`
  const operations = []
  const data = {
    foo: {
      bar: {
        baz: {
          beh: 'qux'
        }
      }
    }
  }
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, [ 'foo', 'bar', 'baz', 'beh' ])
  })
  return { data, description, operations }
})

// --- Test 2: --- //

tests.push(() => {
  const description = `Testing dot notational strings for nested objects...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: {
        bar: {
          baz: {
            beh: 'qux'
          }
        }
      }
    }`
  const operations = []
  const data = {
    foo: {
      bar: {
        baz: {
          beh: 'qux'
        }
      }
    }
  }
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, 'foo.bar.baz.beh')
  })
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, '[foo][bar][baz][beh]')
  })
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, '[foo].bar.baz[beh]')
  })
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, 'foo[bar][baz]beh')
  })
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, 'foo.[bar].[baz].beh')
  })
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, '[foo].[bar].[baz].[beh]')
  })
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, '..[foo]..[bar.].[.baz.]...[beh].')
  })
  return { data, description, operations }
})

// --- Test 3: --- //

tests.push(() => {
  const description = `Testing dot notational strings with spaced keys...${
    '\n\nData Preparation:'
  }
    const data = {
      'foo bar': {
        'baz beh': {
          'qux quz': {
            'quux quuz': 'thud'
          }
        }
      }
    }`
  const operations = []
  const data = {
    'foo bar': {
      'baz beh': {
        'qux quz': {
          'quux quuz': 'thud'
        }
      }
    }
  }
  operations.push({
    expect: data['foo bar']['baz beh']['qux quz']['quux quuz'],
    result: () => get(data, 'foo bar.baz beh.qux quz.quux quuz')
  })
  operations.push({
    expect: data['foo bar']['baz beh']['qux quz']['quux quuz'],
    result: () => get(data, 'foo bar[baz beh][qux quz][quux quuz]')
  })
  return { data, description, operations }
})

// --- Test 4: --- //

tests.push(() => {
  const description = `Testing pure nested arrays...${
    '\n\nData Preparation:'
  }
    const data = [
      [
        [
          [
            'qux'
          ]
        ]
      ]
    ]`
  const operations = []
  const data = [
    [
      [
        [
          'qux'
        ]
      ]
    ]
  ]
  operations.push({
    expect: data[0][0][0][0],
    result: () => get(data, [ 0, 0, 0, 0 ])
  })
  return { data, description, operations }
})

// --- Test 5: --- //

tests.push(() => {
  const description = `Testing dot notational strings for nested arrays${
    '\n\nData Preparation:'
  }
    const data = [
      [
        [
          [
            'qux'
          ]
        ]
      ]
    ]`
  const operations = []
  const data = [
    [
      [
        [
          'qux'
        ]
      ]
    ]
  ]
  operations.push({
    expect: data[0][0][0][0],
    result: () => get(data, '0.0.0.0')
  })
  operations.push({
    expect: data[0][0][0][0],
    result: () => get(data, '[0][0][0][0]')
  })
  operations.push({
    expect: data[0][0][0][0],
    result: () => get(data, '[0].0.0[0]')
  })
  operations.push({
    expect: data[0][0][0][0],
    result: () => get(data, '0[0][0]0')
  })
  operations.push({
    expect: data[0][0][0][0],
    result: () => get(data, '0.[0].[0].0')
  })
  operations.push({
    expect: data[0][0][0][0],
    result: () => get(data, '[0].[0].[0].[0]')
  })
  operations.push({
    expect: data[0][0][0][0],
    result: () => get(data, '..[0]..[0.].[.0.]...[0].')
  })
  return { data, description, operations }
})

// --- Test 6: --- //

tests.push(() => {
  const description = `Testing dot notational strings with mixed types...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: [
        {
          bar: [
            {
              baz: 'beh'
            }
          ]
        }
      ]
    }`
  const operations = []
  const data = {
    foo: [
      {
        bar: [
          {
            baz: 'beh'
          }
        ]
      }
    ]
  }
  operations.push({
    expect: data.foo[0].bar[0].baz,
    result: () => get(data, 'foo.0.bar.0.baz')
  })
  operations.push({
    expect: data.foo[0].bar[0].baz,
    result: () => get(data, 'foo[0].bar[0].baz')
  })
  operations.push({
    expect: data.foo[0].bar[0].baz,
    result: () => get(data, 'foo.[0].bar.[0].baz')
  })
  operations.push({
    expect: data.foo[0].bar[0].baz,
    result: () => get(data, 'foo[0].bar.[0].baz')
  })
  operations.push({
    expect: data.foo[0].bar[0].baz,
    result: () => get(data, '..foo.[.0.]..bar...[.0.]...baz..')
  })
  return { data, description, operations }
})

// --- Test 7: --- //

tests.push(() => {
  const description = `Testing pure nested Maps...${
    '\n\nData Preparation:'
  }
    const data = new Map().set(
      'foo', new Map().set(
        'bar', new Map().set(
          'baz', new Map().set(
            'beh', 'qux'
          )
        )
      )
    )`
  const operations = []
  const data = new Map().set(
    'foo', new Map().set(
      'bar', new Map().set(
        'baz', new Map().set(
          'beh', 'qux'
        )
      )
    )
  )
  operations.push({
    expect: data.get('foo').get('bar').get('baz').get('beh'),
    result: () => get(data, [ 'foo', 'bar', 'baz', 'beh' ])
  })
  return { data, description, operations }
})

// --- Test 8: --- //

tests.push(() => {
  const description = `Testing pure nested WeakMaps...${
    '\n\nData Preparation:'
  }
    const wmKeys = [
      { foo: 'foo' },
      { baz: 'bar' },
      { qux: 'baz' },
      { quux: 'beh'}
    ]

    const data = new WeakMap().set(
      wmKeys[0], new WeakMap().set(
        wmKeys[1], new WeakMap().set(
          wmKeys[2], new WeakMap().set(
            wmKeys[3], 'qux'
          )
        )
      )
    )`
  const operations = []
  const wmKeys = [
    { foo: 'foo' },
    { baz: 'bar' },
    { qux: 'baz' },
    { quux: 'beh' }
  ]

  const data = new WeakMap().set(
    wmKeys[0], new WeakMap().set(
      wmKeys[1], new WeakMap().set(
        wmKeys[2], new WeakMap().set(
          wmKeys[3], 'qux'
        )
      )
    )
  )
  operations.push({
    expect: data.get(wmKeys[0]).get(wmKeys[1]).get(wmKeys[2]).get(wmKeys[3]),
    result: () => get(data, [ wmKeys[0], wmKeys[1], wmKeys[2], wmKeys[3] ])
  })
  return { data, description, operations }
})

// --- Test 9: --- //

tests.push(() => {
  const description = `Testing pure nested JSON Objects...${
    '\n\nData Preparation:'
  }
    const data = JSON.stringify({
      foo: JSON.stringify({
        bar: JSON.stringify({
          baz: JSON.stringify({
            beh: 'qux'
          })
        })
      })
    })`
  const operations = []
  const data = JSON.stringify({
    foo: JSON.stringify({
      bar: JSON.stringify({
        baz: JSON.stringify({
          beh: 'qux'
        })
      })
    })
  })
  operations.push({
    expect:
      JSON.parse(
        JSON.parse(
          JSON.parse(
            JSON.parse(data).foo
          ).bar
        ).baz
      ).beh,
    result: () => get(data, [ 'foo', 'bar', 'baz', 'beh' ])
  })
  return { data, description, operations }
})

// --- Test 10: --- //

tests.push(() => {
  const description = `Testing pure nested JSON Arrays...${
    '\n\nData Preparation:'
  }
    const data = JSON.stringify([
      JSON.stringify([
        JSON.stringify([
          JSON.stringify([
            'foo'
          ])
        ])
      ])
    ])`
  const operations = []
  const data = JSON.stringify([
    JSON.stringify([
      JSON.stringify([
        JSON.stringify([
          'foo'
        ])
      ])
    ])
  ])
  operations.push({
    expect:
      JSON.parse(
        JSON.parse(
          JSON.parse(
            JSON.parse(data)[0]
          )[0]
        )[0]
      )[0],
    result: () => get(data, [ 0, 0, 0, 0 ])
  })
  return { data, description, operations }
})

// --- Test 11: --- //

tests.push(() => {
  const description = `Testing pure multi-nested Objects...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: {
        beh: {
          lorem: 'ex'
        }
      },
      bar: {
        qux: {
          ipsum: 'igne'
        }
      },
      baz: {
        quz: {
          dolor: 'vita'
        }
      }
    }`
  const operations = []
  const data = {
    foo: {
      beh: {
        lorem: 'ex'
      }
    },
    bar: {
      qux: {
        ipsum: 'igne'
      }
    },
    baz: {
      quz: {
        dolor: 'vita'
      }
    }
  }
  operations.push({
    expect: data.foo.beh.lorem,
    result: () => get(data, [ 'foo', 'beh', 'lorem' ])
  })
  operations.push({
    expect: data.bar.qux.ipsum,
    result: () => get(data, [ 'bar', 'qux', 'ipsum' ])
  })
  operations.push({
    expect: data.baz.quz.dolor,
    result: () => get(data, [ 'baz', 'quz', 'dolor' ])
  })
  return { data, description, operations }
})

// --- Test 12: --- //

tests.push(() => {
  const description = `Testing pure multi-nested Arrays...${
    '\n\nData Preparation:'
  }
    const data = [
      [
        [
          'foo'
        ]
      ],
      [
        [
          'bar'
        ]
      ],
      [
        [
          'baz'
        ]
      ]
    ]`
  const operations = []
  const data = [
    [
      [
        'foo'
      ]
    ],
    [
      [
        'bar'
      ]
    ],
    [
      [
        'baz'
      ]
    ]
  ]
  operations.push({
    expect: data[0][0][0],
    result: () => get(data, [ 0, 0, 0 ])
  })
  operations.push({
    expect: data[1][0][0],
    result: () => get(data, [ 1, 0, 0 ])
  })
  operations.push({
    expect: data[2][0][0],
    result: () => get(data, [ 2, 0, 0 ])
  })
  return { data, description, operations }
})

// --- Test 13: --- //

tests.push(() => {
  const description = `Testing pure multi-nested Maps...${
    '\n\nData Preparation:'
  }
    const data = new Map().set(
      'foo', new Map().set(
        'beh', new Map().set(
          'lorem', 'ex'
        )
      )
    ).set(
      'bar', new Map().set(
        'qux', new Map().set(
          'ipsum', 'igne'
        )
      )
    ).set(
      'baz', new Map().set(
        'quz', new Map().set(
          'dolor', 'vita'
        )
      )
    )`
  const operations = []
  const data = new Map().set(
    'foo', new Map().set(
      'beh', new Map().set(
        'lorem', 'ex'
      )
    )
  ).set(
    'bar', new Map().set(
      'qux', new Map().set(
        'ipsum', 'igne'
      )
    )
  ).set(
    'baz', new Map().set(
      'quz', new Map().set(
        'dolor', 'vita'
      )
    )
  )
  operations.push({
    expect: data.get('foo').get('beh').get('lorem'),
    result: () => get(data, [ 'foo', 'beh', 'lorem' ])
  })
  operations.push({
    expect: data.get('bar').get('qux').get('ipsum'),
    result: () => get(data, [ 'bar', 'qux', 'ipsum' ])
  })
  operations.push({
    expect: data.get('baz').get('quz').get('dolor'),
    result: () => get(data, [ 'baz', 'quz', 'dolor' ])
  })
  return { data, description, operations }
})

// --- Test 14: --- //

tests.push(() => {
  const description = `Testing pure multi-nested WeakMaps...${
    '\n\nData Preparation:'
  }
    const wmKeys = [
      { foo: 'foo' },
      { bar: 'bar' },
      { baz: 'baz' },
      { beh: 'beh' },
      { qux: 'qux' },
      { quz: 'quz' },
      { lorem: 'lorem' },
      { ispum: 'ipsum' },
      { dolor: 'dolor' }
    ]

    const data = new WeakMap().set(
      wmKeys[0], new WeakMap().set(
        wmKeys[3], new WeakMap().set(
          wmKeys[6], 'ex'
        )
      )
    ).set(
      wmKeys[1], new WeakMap().set(
        wmKeys[4], new WeakMap().set(
          wmKeys[7], 'igne'
        )
      )
    ).set(
      wmKeys[2], new WeakMap().set(
        wmKeys[5], new WeakMap().set(
          wmKeys[8], 'vita'
        )
      )
    )`
  const operations = []
  const wmKeys = [
    { foo: 'foo' },
    { bar: 'bar' },
    { baz: 'baz' },
    { beh: 'beh' },
    { qux: 'qux' },
    { quz: 'quz' },
    { lorem: 'lorem' },
    { ispum: 'ipsum' },
    { dolor: 'dolor' }
  ]

  const data = new WeakMap().set(
    wmKeys[0], new WeakMap().set(
      wmKeys[3], new WeakMap().set(
        wmKeys[6], 'ex'
      )
    )
  ).set(
    wmKeys[1], new WeakMap().set(
      wmKeys[4], new WeakMap().set(
        wmKeys[7], 'igne'
      )
    )
  ).set(
    wmKeys[2], new WeakMap().set(
      wmKeys[5], new WeakMap().set(
        wmKeys[8], 'vita'
      )
    )
  )
  operations.push({
    expect: data.get(wmKeys[0]).get(wmKeys[3]).get(wmKeys[6]),
    result: () => get(data, [ wmKeys[0], wmKeys[3], wmKeys[6] ])
  })
  operations.push({
    expect: data.get(wmKeys[1]).get(wmKeys[4]).get(wmKeys[7]),
    result: () => get(data, [ wmKeys[1], wmKeys[4], wmKeys[7] ])
  })
  operations.push({
    expect: data.get(wmKeys[2]).get(wmKeys[5]).get(wmKeys[8]),
    result: () => get(data, [ wmKeys[2], wmKeys[5], wmKeys[8] ])
  })
  return { data, description, operations }
})

// --- Test 15: --- //

tests.push(() => {
  const description = `Testing pure multi-nested JSON Objects...${
    '\n\nData Preparation:'
  }
    const data = JSON.stringify({
      foo: JSON.stringify({
        beh: JSON.stringify({
          lorem: 'ex'
        })
      }),
      bar: JSON.stringify({
        qux: JSON.stringify({
          ipsum: 'igne'
        })
      }),
      baz: JSON.stringify({
        quz: JSON.stringify({
          dolor: 'vita'
        })
      })
    })`
  const operations = []
  const data = JSON.stringify({
    foo: JSON.stringify({
      beh: JSON.stringify({
        lorem: 'ex'
      })
    }),
    bar: JSON.stringify({
      qux: JSON.stringify({
        ipsum: 'igne'
      })
    }),
    baz: JSON.stringify({
      quz: JSON.stringify({
        dolor: 'vita'
      })
    })
  })
  operations.push({
    expect:
      JSON.parse(
        JSON.parse(
          JSON.parse(data).foo
        ).beh
      ).lorem,
    result: () => get(data, [ 'foo', 'beh', 'lorem' ])
  })
  operations.push({
    expect:
      JSON.parse(
        JSON.parse(
          JSON.parse(data).bar
        ).qux
      ).ipsum,
    result: () => get(data, [ 'bar', 'qux', 'ipsum' ])
  })
  operations.push({
    expect:
      JSON.parse(
        JSON.parse(
          JSON.parse(data).baz
        ).quz
      ).dolor,
    result: () => get(data, [ 'baz', 'quz', 'dolor' ])
  })
  return { data, description, operations }
})

// --- Test 16: --- //

tests.push(() => {
  const description = `Testing pure multi-nested JSON Arrays...${
    '\n\nData Preparation:'
  }
    const data = JSON.stringify([
      JSON.stringify([
        JSON.stringify([
          'foo'
        ])
      ]),
      JSON.stringify([
        JSON.stringify([
          'bar'
        ])
      ]),
      JSON.stringify([
        JSON.stringify([
          'baz'
        ])
      ])
    ])`
  const operations = []
  const data = JSON.stringify([
    JSON.stringify([
      JSON.stringify([
        'foo'
      ])
    ]),
    JSON.stringify([
      JSON.stringify([
        'bar'
      ])
    ]),
    JSON.stringify([
      JSON.stringify([
        'baz'
      ])
    ])
  ])
  operations.push({
    expect:
      JSON.parse(
        JSON.parse(
          JSON.parse(data)[0]
        )[0]
      )[0],
    result: () => get(data, [ 0, 0, 0 ])
  })
  operations.push({
    expect:
      JSON.parse(
        JSON.parse(
          JSON.parse(data)[1]
        )[0]
      )[0],
    result: () => get(data, [ 1, 0, 0 ])
  })
  operations.push({
    expect:
      JSON.parse(
        JSON.parse(
          JSON.parse(data)[2]
        )[0]
      )[0],
    result: () => get(data, [ 2, 0, 0 ])
  })
  return { data, description, operations }
})

// --- Test 17: --- //

tests.push(() => {
  const description = `Testing circular references...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: {
        bar: {
          baz: {
            beh: undefined
          }
        }
      }
    }

    data.foo.bar.baz.beh = data`
  const operations = []
  const data = {
    foo: {
      bar: {
        baz: {
          beh: undefined
        }
      }
    }
  }
  data.foo.bar.baz.beh = data
  operations.push({
    expect: data,
    result: () => get(data, 'foo.bar.baz.beh')
  })
  operations.push({
    expect: data.foo,
    result: () => get(data, 'foo.bar.baz.beh.foo')
  })
  return { data, description, operations }
})

// --- Test 18: --- //

tests.push(() => {
  const description = `Testing prototype retrieval...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: {
        bar: {
          baz: {
            beh: {}
          }
        }
      }
    }

    Object.setPrototypeOf(data.foo.bar.baz.beh, { qux: 'quz' })`
  const operations = []
  const data = {
    foo: {
      bar: {
        baz: {
          beh: {}
        }
      }
    }
  }

  Object.setPrototypeOf(data.foo.bar.baz.beh, { qux: 'quz' })
  operations.push({
    expect: Object.getPrototypeOf(data.foo.bar.baz.beh),
    result: () => get(data, 'foo.bar.baz.beh.__proto__')
  })
  return { data, description, operations }
})

// --- Test 19: --- //

tests.push(() => {
  const description = `Testing multi-typed nests...${
    '\n\nData Preparation:'
  }
    const wmKey = { baz: 'baz' }

    const data = {
      foo: [
        new Map().set(
          'bar', new WeakMap().set(
            wmKey, JSON.stringify({
              baz: [
                {
                  qux: 'quz'
                }
              ]
            })
          )
        )
      ]
    }`
  const operations = []
  const wmKey = { baz: 'baz' }

  const data = {
    foo: [
      new Map().set(
        'bar', new WeakMap().set(
          wmKey, JSON.stringify({
            baz: [
              {
                qux: 'quz'
              }
            ]
          })
        )
      )
    ]
  }
  operations.push({
    expect:
      JSON.parse(
        data.foo[0]
          .get('bar')
          .get(wmKey)
      ).baz[0].qux,
    result: () => get(data, [ 'foo', 0, 'bar', wmKey, 'baz', 0, 'qux' ])
  })
  return { data, description, operations }
})

// --- Test 20: --- //

tests.push(() => {
  const description = `Testing generator...${
    '\n\nData Preparation:'
  }
    const wmKey = { baz: 'baz' }

    const data = {
      foo: [
        new Map().set(
          'bar', new WeakMap().set(
            wmKey, JSON.stringify({
              baz: [
                {
                  qux: 'quz'
                }
              ]
            })
          )
        )
      ]
    }`
  const operations = []
  const wmKey = { baz: 'baz' }

  const data = {
    foo: [
      new Map().set(
        'bar', new WeakMap().set(
          wmKey, JSON.stringify({
            baz: [
              {
                qux: 'quz'
              }
            ]
          })
        )
      )
    ]
  }

  operations.push({
    expect:
      [
        data.foo,
        data.foo[0],
        data.foo[0].get('bar'),
        data.foo[0].get('bar').get(wmKey),
        JSON.parse(data.foo[0].get('bar').get(wmKey)).baz,
        JSON.parse(data.foo[0].get('bar').get(wmKey)).baz[0],
        JSON.parse(data.foo[0].get('bar').get(wmKey)).baz[0].qux
      ],
    result: () => {
      const results = []
      const path = [ 'foo', 0, 'bar', wmKey, 'baz', 0, 'qux' ]
      const query = get(data, path, { gen: true })
      for (let res of query) {
        results.push(res)
      }
      return results
    }
  })
  return { data, description, operations }
})

// --- Test 21: --- //

tests.push(() => {
  const description = `Testing custom key handling...${
    '\n\nData Preparation:'
  }
    /**
     * Sample data structure which uses a 'retrieve' method for data access.
     */
    class NonNativeDataStructure {
      constructor(arr) {
        const values = [...arr]
        this.retrieve = i => values[i]
      }
    }

    // here we are using another data structure that requires custom extraction
    let testAB = new ArrayBuffer(16)
    new Int16Array(testAB)[0] = 2

    const data = new NonNativeDataStructure([
      {
        foo: {
          bar: {
            baz: testAB
          }
        }
      }
    ])`
  const operations = []

  /**
   * Sample data structure which uses a 'retrieve' method for data access.
   *
   * @private
   * @class
   */
  class NonNativeDataStructure {
    /**
     * Stores array and initializes get method.
     *
     * @private
     * @param {Array} arr - Array to store.
     * @example
     * // returns 3
     * const hiddenData = new NonNativeDataStructure([1,2,3])
     * hiddenData.get(2)
     */
    constructor (arr) {
      const values = [...arr]
      this.retrieve = i => values[i]
    }
  }

  // here we are using another data structure that requires custom extraction
  let testAB = new ArrayBuffer(16)
  new Int16Array(testAB)[0] = 2

  const data = new NonNativeDataStructure([
    {
      foo: {
        bar: {
          baz: testAB
        }
      }
    }
  ])

  operations.push({
    expect: undefined,
    result: () => get(data, [ 0, 'foo', 'bar', 'baz', 0 ])
  })

  operations.push({
    expect: new Int16Array(data.retrieve(0).foo.bar.baz)[0],
    result: () => (
      get(data, [ 0, 'foo', 'bar', 'baz', 0 ], {
        getCustomizer: (target, key) => {
          if (target instanceof NonNativeDataStructure) {
            return target.retrieve(key)
          }
          if (target instanceof ArrayBuffer && target.byteLength === 16) {
            return new Int16Array(target)[key]
          }
        }
      })
    )
  })
  return { data, description, operations }
})

// --- Test 22: --- //

tests.push(() => {
  const description = `Testing custom match...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: {
        bar: {
          baz: {
            beh: 'qux'
          }
        }
      }
    }`
  const operations = []
  const data = {
    foo: {
      bar: {
        baz: {
          beh: 'qux'
        }
      }
    }
  }
  operations.push({
    expect: data.foo.bar.baz.beh,
    result: () => get(data, 'foo/bar/baz/beh', { match: /[^/]+/g })
  })
  return { data, description, operations }
})

// --- Test 23: --- //

tests.push(() => {
  const description = `Testing undefined path...${
    '\n\nData Preparation:'
  }
    const data = {}`
  const operations = []
  const data = {}
  operations.push({
    expect: undefined,
    result: () => get(data, [ 'foo', 'bar', 'baz', 'qux', 'quz' ])
  })
  return { data, description, operations }
})

// --- Test 24: --- //

tests.push(() => {
  const description = `Testing indexed Set access...${
    '\n\nData Preparation:'
  }
    const data = new Set([
      new Set([
        new Set(['foo'])
      ]),
      new Set([
        new Set(['bar'])
      ]),
      new Set([
        new Set(['baz'])
      ])
    ])`
  const operations = []
  const data = new Set([
    new Set([
      new Set(['foo'])
    ]),
    new Set([
      new Set(['bar'])
    ]),
    new Set([
      new Set(['baz'])
    ])
  ])
  operations.push({
    expect: 'foo',
    result: () => get(data, [ 0, 0, 0 ])
  })
  operations.push({
    expect: 'bar',
    result: () => get(data, [ 1, 0, 0 ])
  })
  operations.push({
    expect: 'baz',
    result: () => get(data, [ 2, 0, 0 ])
  })
  operations.push({
    expect: undefined,
    result: () => get(data, [ 3, 0, 0 ])
  })
  return { data, description, operations }
})

// --- Test 25: --- //

tests.push(() => {
  const description = `Testing indexed Map access...${
    '\n\nData Preparation:'
  }
    const data = new Map().set(
      'foo', new Map().set(
        'beh', new Map().set(
          'lorem', 'sit'
        )
      )
    ).set(
      'bar', new Map().set(
        'qux', new Map().set(
          'ipsum', 'amet'
        )
      )
    ).set(
      'baz', new Map().set(
        'quz', new Map().set(
          'dolor', 'consectetur'
        )
      )
    )`
  const operations = []
  const data = new Map().set(
    'foo', new Map().set(
      'beh', new Map().set(
        'lorem', 'sit'
      )
    )
  ).set(
    'bar', new Map().set(
      'qux', new Map().set(
        'ipsum', 'amet'
      )
    )
  ).set(
    'baz', new Map().set(
      'quz', new Map().set(
        'dolor', 'consectetur'
      )
    )
  )
  operations.push({
    expect: data.get('foo').get('beh').get('lorem'),
    result: () => get(data, [ 0, 0, 0 ])
  })
  operations.push({
    expect: data.get('bar').get('qux').get('ipsum'),
    result: () => get(data, [ 1, 0, 0 ])
  })
  operations.push({
    expect: data.get('baz').get('quz').get('dolor'),
    result: () => get(data, [ 2, 0, 0 ])
  })
  operations.push({
    expect: undefined,
    result: () => get(data, [ 3, 0, 0 ])
  })
  return { data, description, operations }
})

// --- Test 26: --- //

tests.push(() => {
  const description = `Testing WeakSets...${
    '\n\nData Preparation:'
  }
    const wsObjs = [
      { foo: 'bar' },
      { baz: 'beh' },
      { qux: 'quz' }
    ]

    const data = new WeakSet(wsObjs)`
  const operations = []
  const wsObjs = [
    { foo: 'bar' },
    { baz: 'beh' },
    { qux: 'quz' }
  ]

  const data = new WeakSet(wsObjs)
  operations.push({
    expect: wsObjs[0],
    result: () => get(data, [wsObjs[0]])
  })
  operations.push({
    expect: wsObjs[1],
    result: () => get(data, [wsObjs[1]])
  })
  operations.push({
    expect: wsObjs[2],
    result: () => get(data, [wsObjs[2]])
  })
  operations.push({
    expect: undefined,
    result: () => get(data, [{ quux: 'quuz' }])
  })
  return { data, description, operations }
})

// --- Test 27: --- //

tests.push(() => {
  const description = `Testing properties hidden behind JSON String Objects...${
    '\n\nData Preparation:'
  }
    const StringConstructor = String

    const data = new StringConstructor(
      JSON.stringify({
        foo: {
          bar: {
            baz: 'beh'
          }
        }
      })
    )

    data.foobar = 'thud'`
  const operations = []

  const StringConstructor = String

  const data = new StringConstructor(
    JSON.stringify({
      foo: {
        bar: {
          baz: 'beh'
        }
      }
    })
  )

  data.foobar = 'thud'

  operations.push({
    expect: data.foobar,
    result: () => get(data, ['foobar'])
  })

  operations.push({
    expect: JSON.parse(data).foo.bar.baz,
    result: () => get(data, [ 'foo', 'bar', 'baz' ])
  })

  return { data, description, operations }
})

/**
 * Output of the run function for use in external testing scripts.
 *
 * @private
 * @typedef  {Object} TestResults
 * @property {number} TotalTestsAttempt - Total test groups attempted.
 * @property {number} numFailed - Total number of operational failures.
 * @property {Array}  errors - Errors encountered.
 */

/**
 * Runs each test, counts errors, and logs results to the console.
 *
 * @private
 * @exports run
 * @param   {deep-props.get} module - Module to use for testing. Used when testing entire deep-props package.
 * @returns {TestResults} Results of tests.
 */
const run = module => {
  if (module !== undefined) get = module
  console.log('Performing tests...')

  const errors = []
  let numFailed = 0
  let totalTestsAttempt = 0

  for (let i = 0; i < tests.length; i++) {
    totalTestsAttempt++
    console.log(`\n---\n\nTest ${i + 1}`)
    let reported = false
    try {
      const test = tests[i]()
      console.log(test.description)
      console.log('\nData:')
      dirDeep(test.data)
      for (let op of test.operations) {
        const result = op.result()
        let assertion
        try {
          assert.deepStrictEqual(op.expect, result)
          assertion = true
        } catch (err) {
          assertion = err
        }
        const resultString = op.result.toString()
        let formattedResult = ANSI_CYAN
        if (
          resultString.match(/\(\) => [^{(]/) !== null &&
          resultString.match(/\(\) => [^{(]/).index === 0
        ) {
          formattedResult += resultString.replace(/\(\) => /, '')
        } else {
          formattedResult += resultString.replace(/\(\) => [{(\s]*/, '')
            .slice(0, -1)
            .trim()
        }
        formattedResult += ANSI_RESET
        const operation = '\nOperation:\n      ' + formattedResult
        console.log(operation)
        process.stdout.write('\nExpected:\n')
        dirDeep(op.expect)
        process.stdout.write('\nResult:\n')
        dirDeep(result)
        if (assertion === true) {
          console.log(ANSI_GREEN + '[OK]' + ANSI_RESET)
        } else {
          console.log(ANSI_RED + '[FAIL]' + ANSI_RESET)
          errors.push({
            test_num: i + 1,
            descr: test.description,
            assertion,
            operation
          })
          numFailed++
          reported = true
        }
      }
    } catch (err) {
      console.log(ANSI_RED + '[FAIL]' + ANSI_RESET)
      errors.push({ test_num: i + 1, err })
      if (reported === false) numFailed++
    }
  }

  console.log(
    `\n========================================${
      '========================================'
    }\n`
  )

  if (errors.length > 0) {
    console.log(ANSI_RED + '[FAIL]' + ANSI_RESET)
    for (let e of errors) {
      console.log(`\nFailed test ${e.test_num}! `)
      if (e.err) {
        console.log()
        dirDeep(e.err)
      } else {
        console.log(`Description: ${e.descr}`)
        if (e.operation) console.log(e.operation)
        if (e.assertion) {
          const err = Error()
          Object.keys(e.assertion).forEach(x => {
            err[x] = e.assertion[x]
          })
          console.log('\nError:')
          dirDeep(err)
        }
      }
    }
  } else {
    console.log(ANSI_GREEN + '[PASS]' + ANSI_RESET)
  }

  console.log()

  console.log('Total Tests Attempted: ' + totalTestsAttempt)
  console.log('Total Operational Failures: ' + numFailed)

  if (process.argv[2] === 'standalone') {
    if (numFailed > 0) throw Error('Failed tests!')
  } else {
    return {
      totalTestsAttempt,
      numFailed,
      errors
    }
  }
}

if (process.argv[2] === 'standalone') {
  run()
}

module.exports = { run }
