/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @see {@link http://github.com/jpcx/deep-props.extract|GitHub}
 * @license MIT
 */

'use strict'

/**
 * Test script for deep-props.extract module.
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

let extract = require('./')

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
    expect: [
      {
        path: [ 'foo', 'bar', 'baz', 'beh' ],
        value: data.foo.bar.baz.beh
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 2: --- //

tests.push(() => {
  const description = `Testing pure nested arrays...${
    '\n\nData Preparation:'
  }
    const data = [
      [
        [
          [
            'foo'
          ]
        ]
      ]
    ]`
  const operations = []
  const data = [
    [
      [
        [
          'foo'
        ]
      ]
    ]
  ]
  operations.push({
    expect: [
      {
        path: [ '0', '0', '0', '0' ],
        value: data[0][0][0][0]
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 3: --- //

tests.push(() => {
  const description = `Testing pure nested Maps...${
    '\n\nData Preparation:'
  }
    const data = new Map()
      .set(
        'foo', new Map()
          .set(
            'bar', new Map()
              .set(
                'baz', new Map()
                  .set(
                    'beh', 'qux'
                  )
              )
          )
      )`
  const operations = []
  const data = new Map()
    .set(
      'foo', new Map()
        .set(
          'bar', new Map()
            .set(
              'baz', new Map()
                .set(
                  'beh', 'qux'
                )
            )
        )
    )
  operations.push({
    expect: [
      {
        path: [ 'foo', 'bar', 'baz', 'beh' ],
        value: data.get('foo').get('bar').get('baz').get('beh')
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 4: --- //

tests.push(() => {
  const description = `Testing pure nested Sets...${
    '\n\nData Preparation:'
  }
    const data = new Set([
      new Set([
        new Set([
          new Set([
            'foo'
          ])
        ])
      ])
    ])`
  const operations = []
  const data = new Set([
    new Set([
      new Set([
        new Set([
          'foo'
        ])
      ])
    ])
  ])
  operations.push({
    expect: [
      {
        path: [ '0', '0', '0', '0' ],
        value: [...[...[...[...data][0]][0]][0]][0]
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 5: --- //

tests.push(() => {
  const description = `Testing multi-typed nests...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: [
        new Map().set(
          'bar', new Set(['baz'])
        )
      ]
    }`
  const operations = []
  const data = {
    foo: [
      new Map().set(
        'bar', new Set(['baz'])
      )
    ]
  }
  operations.push({
    expect: [
      {
        path: [ 'foo', '0', 'bar', '0' ],
        value: [...data.foo[0].get('bar')][0]
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 6: --- //

tests.push(() => {
  const description = `Testing unsupported objects...${
    '\n\nData Preparation:'
  }
    const wmKey = { foo: 'bar' }
    const wmVal = 'baz'
    const data = new WeakMap().set(wmKey, wmVal)`
  const operations = []
  const wmKey = { foo: 'bar' }
  const wmVal = 'baz'
  const data = new WeakMap().set(wmKey, wmVal)
  operations.push({
    expect: [],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 7: --- //

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
    expect: [
      {
        path: [ 'foo', 'beh', 'lorem' ],
        value: data.foo.beh.lorem
      },
      {
        path: [ 'bar', 'qux', 'ipsum' ],
        value: data.bar.qux.ipsum
      },
      {
        path: [ 'baz', 'quz', 'dolor' ],
        value: data.baz.quz.dolor
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 8: --- //

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
    expect: [
      {
        path: [ '0', '0', '0' ],
        value: data[0][0][0]
      },
      {
        path: [ '1', '0', '0' ],
        value: data[1][0][0]
      },
      {
        path: [ '2', '0', '0' ],
        value: data[2][0][0]
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 9: --- //

tests.push(() => {
  const description = `Testing pure multi-nested Maps...${
    '\n\nData Preparation:'
  }
    const data = new Map()
      .set(
        'foo', new Map()
          .set(
            'beh', new Map()
              .set(
                'lorem', 'ex'
              )
          )
      )
      .set(
        'bar', new Map()
          .set(
            'qux', new Map()
              .set(
                'ipsum', 'igne'
              )
          )
      )
      .set(
        'baz', new Map()
          .set(
            'quz', new Map()
              .set(
                'dolor', 'vita'
              )
          )
      )`
  const operations = []
  const data = new Map()
    .set(
      'foo', new Map()
        .set(
          'beh', new Map()
            .set(
              'lorem', 'ex'
            )
        )
    )
    .set(
      'bar', new Map()
        .set(
          'qux', new Map()
            .set(
              'ipsum', 'igne'
            )
        )
    )
    .set(
      'baz', new Map()
        .set(
          'quz', new Map()
            .set(
              'dolor', 'vita'
            )
        )
    )
  operations.push({
    expect: [
      {
        path: [ 'foo', 'beh', 'lorem' ],
        value: data.get('foo').get('beh').get('lorem')
      },
      {
        path: [ 'bar', 'qux', 'ipsum' ],
        value: data.get('bar').get('qux').get('ipsum')
      },
      {
        path: [ 'baz', 'quz', 'dolor' ],
        value: data.get('baz').get('quz').get('dolor')
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 10: --- //

tests.push(() => {
  const description = `Testing circular references...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: {
        bar: {
          baz: {}
        }
      }
    }

    data.foo.bar.baz.beh = data`
  const operations = []
  const data = {
    foo: {
      bar: {
        baz: {}
      }
    }
  }
  data.foo.bar.baz.beh = data
  operations.push({
    expect: [
      {
        path: [ 'foo', 'bar', 'baz', 'beh' ],
        ref: { path: [] }
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 11: --- //

tests.push(() => {
  const description = `Testing generator...${
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
    expect: [
      {
        path: [ 'foo', 'beh', 'lorem' ],
        value: data.foo.beh.lorem
      },
      {
        path: [ 'bar', 'qux', 'ipsum' ],
        value: data.bar.qux.ipsum
      },
      {
        path: [ 'baz', 'quz', 'dolor' ],
        value: data.baz.quz.dolor
      }
    ],
    result: () => {
      const compilation = []
      for (let result of extract(data, { gen: true })) {
        compilation.push(result)
      }
      return compilation
    }
  })
  return { data, description, operations }
})

// --- Test 12: --- //

tests.push(() => {
  const description = `Testing full...${
    '\n\n  Tests each result for:' +
    '\n    - At least one of the descriptor properties' +
    '\n    - All of the permissions properties' +
    '\n  Additionally, tests for a few chosen deeply nested properties'
  }${
    '\n\nData Preparation:'
  }
    const data = {}`
  const operations = []
  const data = {}
  operations.push({
    expect: true,
    result: () => {
      const t = extract(data, { full: true })

      const anyMissingDescriptors = t.some(
        prop => {
          if (prop.path[prop.path.length - 1] === '__proto__') {
            // ignore generated proto property; it lacks descriptors
            return false
          }
          return !(
            [
              'writable',
              'enumerable',
              'configurable'
            ].some(p => prop.hasOwnProperty(p))
          )
        }
      )

      const anyMissingAnyPermissions = t.some(
        prop => (
          [
            'parentIsFrozen',
            'parentIsSealed',
            'parentIsExtensible'
          ].some(p => !prop.hasOwnProperty(p))
        )
      )

      const hasDeepProp1 = t.some(
        prop => {
          try {
            assert.deepStrictEqual(prop.path, [ '__proto__', '__proto__' ])
            return prop.value === null
          } catch (err) {
            return false
          }
        }
      )

      const hasDeepProp2 = t.some(
        prop => {
          try {
            assert.deepStrictEqual(
              prop.path,
              [
                '__proto__',
                'constructor',
                'getOwnPropertyDescriptor',
                'length'
              ]
            )
            return prop.value === 2
          } catch (err) {
            return false
          }
        }
      )

      const hasDeepProp3 = t.some(
        prop => {
          try {
            assert.deepStrictEqual(
              prop.path,
              [
                '__proto__',
                'constructor',
                'isExtensible',
                '__proto__'
              ]
            )
            assert.deepStrictEqual(
              prop.ref.path,
              [
                '__proto__',
                'constructor',
                '__proto__'
              ]
            )
            return true
          } catch (err) {
            return false
          }
        }
      )

      return (
        !(
          anyMissingDescriptors ||
          anyMissingAnyPermissions
        ) &&
        (
          hasDeepProp1 &&
          hasDeepProp2 &&
          hasDeepProp3
        )
      )
    }
  })
  return { data, description, operations }
})

// --- Test 13: --- //

tests.push(() => {
  const description = `Testing full with generator...${
    '\n\nData Preparation:'
  }
    const data = {}`
  const operations = []
  const data = {}
  operations.push({
    expect: true,
    result: () => {
      const t = []
      for (let result of extract(data, { full: true, gen: true })) {
        t.push(result)
      }

      const anyMissingDescriptors = t.some(
        prop => {
          if (prop.path[prop.path.length - 1] === '__proto__') {
            // ignore generated proto property; it lacks descriptors
            return false
          }
          return !(
            [
              'writable',
              'enumerable',
              'configurable'
            ].some(p => prop.hasOwnProperty(p))
          )
        }
      )

      const anyMissingAnyPermissions = t.some(
        prop => (
          [
            'parentIsFrozen',
            'parentIsSealed',
            'parentIsExtensible'
          ].some(p => !prop.hasOwnProperty(p))
        )
      )

      const hasDeepProp1 = t.some(
        prop => {
          try {
            assert.deepStrictEqual(prop.path, [ '__proto__', '__proto__' ])
            return prop.value === null
          } catch (err) {
            return false
          }
        }
      )

      const hasDeepProp2 = t.some(
        prop => {
          try {
            assert.deepStrictEqual(
              prop.path,
              [
                '__proto__',
                'constructor',
                'getOwnPropertyDescriptor',
                'length'
              ]
            )
            return prop.value === 2
          } catch (err) {
            return false
          }
        }
      )

      const hasDeepProp3 = t.some(
        prop => {
          try {
            assert.deepStrictEqual(
              prop.path,
              [
                '__proto__',
                'constructor',
                'isExtensible',
                '__proto__'
              ]
            )
            assert.deepStrictEqual(
              prop.ref.path,
              [
                '__proto__',
                'constructor',
                '__proto__'
              ]
            )
            return true
          } catch (err) {
            return false
          }
        }
      )

      return (
        !(
          anyMissingDescriptors ||
          anyMissingAnyPermissions
        ) &&
        (
          hasDeepProp1 &&
          hasDeepProp2 &&
          hasDeepProp3
        )
      )
    }
  })
  return { data, description, operations }
})

// --- Test 14: --- //

tests.push(() => {
  const description = `Testing proto...${
    '\n\nData Preparation:'
  }
    const data = {}
    const proto_1 = {}
    const proto_2 = {}
    const proto_3 = {}
    Object.setPrototypeOf(data, proto1)
    Object.setPrototypeOf(proto1, proto2)
    Object.setPrototypeOf(proto2, proto3)
    Object.setPrototypeOf(proto3, null)`
  const operations = []
  const data = {}
  const proto1 = {}
  const proto2 = {}
  const proto3 = {}
  Object.setPrototypeOf(data, proto1)
  Object.setPrototypeOf(proto1, proto2)
  Object.setPrototypeOf(proto2, proto3)
  Object.setPrototypeOf(proto3, null)
  operations.push({
    expect: [
      {
        path: [ '__proto__', '__proto__', '__proto__', '__proto__' ],
        value: null
      }
    ],
    result: () => extract(data, { inherited: true })
  })
  return { data, description, operations }
})

// --- Test 15: --- //

tests.push(() => {
  const description = `Testing full with proto...${
    '\n\nData Preparation:'
  }
    const data = {}
    const proto1 = {}
    const proto2 = {}
    const proto3 = {}
    Object.setPrototypeOf(data, proto1)
    Object.setPrototypeOf(proto1, proto2)
    Object.setPrototypeOf(proto2, proto3)
    Object.setPrototypeOf(proto3, null)`
  const operations = []
  const data = {}
  const proto1 = {}
  const proto2 = {}
  const proto3 = {}
  Object.setPrototypeOf(data, proto1)
  Object.setPrototypeOf(proto1, proto2)
  Object.setPrototypeOf(proto2, proto3)
  Object.setPrototypeOf(proto3, null)
  operations.push({
    expect: [
      {
        path: ['__proto__'],
        value: proto1,
        parentIsFrozen: false,
        parentIsSealed: false,
        parentIsExtensible: true
      },
      {
        path: [ '__proto__', '__proto__' ],
        value: proto2,
        parentIsFrozen: false,
        parentIsSealed: false,
        parentIsExtensible: true
      },
      {
        path: [ '__proto__', '__proto__', '__proto__' ],
        value: proto3,
        parentIsFrozen: false,
        parentIsSealed: false,
        parentIsExtensible: true
      },
      {
        path: [ '__proto__', '__proto__', '__proto__', '__proto__' ],
        value: null,
        parentIsFrozen: false,
        parentIsSealed: false,
        parentIsExtensible: true
      }
    ],
    result: () => extract(data, { full: true, proto: true })
  })
  return { data, description, operations }
})

// --- Test 16: --- //

tests.push(() => {
  const description = `Testing non-enumerable object properties...${
    '\n\nData Preparation:'
  }
    const data = {}
    Object.defineProperty(data, 'foo', { value: {}, enumerable: false })
    Object.defineProperty(data.foo, 'bar', { value: {}, enumerable: false })
    Object.defineProperty(data.foo.bar, 'baz', {
      value: 'beh', enumerable: false
    })`

  const operations = []
  const data = {}
  Object.defineProperty(data, 'foo', { value: {}, enumerable: false })
  Object.defineProperty(data.foo, 'bar', { value: {}, enumerable: false })
  Object.defineProperty(data.foo.bar, 'baz', {
    value: 'beh', enumerable: false
  })
  operations.push({
    expect: [
      { path: [ 'foo', 'bar', 'baz' ], value: data.foo.bar.baz }
    ],
    result: () => extract(data, { nonEnumerable: true })
  })
  return { data, description, operations }
})

// --- Test 17: --- //

tests.push(() => {
  const description = `Testing Object key exploration...${
    '\n\nData Preparation:'
  }
    const mKey1 = { foo: 'bar' }
    const mKey2 = { baz: 'beh' }
    const mKey3 = { qux: 'quz' }

    const data = new Map([
      [
        mKey1,
        new Map([
          [
            mKey2,
            new Map([
              [
                mKey3,
                { quux: 'quuz' }
              ]
            ])
          ]
        ])
      ]
    ])`

  const operations = []

  const mKey1 = { foo: 'bar' }
  const mKey2 = { baz: 'beh' }
  const mKey3 = { qux: 'quz' }

  const data = new Map([
    [
      mKey1,
      new Map([
        [
          mKey2,
          new Map([
            [
              mKey3,
              { quux: 'quuz' }
            ]
          ])
        ]
      ])
    ]
  ])
  operations.push({
    expect: [
      {
        path: [ mKey1, mKey2, mKey3, 'quux' ],
        value: data.get(mKey1).get(mKey2).get(mKey3).quux
      },
      {
        host: mKey3,
        path: ['qux'],
        value: 'quz'
      },
      {
        host: mKey2,
        path: ['baz'],
        value: 'beh'
      },
      {
        host: mKey1,
        path: ['foo'],
        value: 'bar'
      }
    ],
    result: () => extract(data)
  })
  return { data, description, operations }
})

// --- Test 18: --- //

tests.push(() => {
  const description = `Testing entries customizer...${
    '\n\nData Preparation:'
  }
    /**
     * Sample data structure.
     * Supplies 'get', 'getValues', and 'push' functions.
     */
    class NonNativeDataStructure {
      constructor(arr) {
        const values = arr
        this.get = i => values[i]
        this.getValues = () => values
        this.push = x => values.push(x)
      }
    }

    const data = new NonNativeDataStructure([
      new NonNativeDataStructure(['foo'])
    ])`

  /**
   * Sample data structure.
   * Supplies 'get', 'getValues', and 'push' functions.
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
     * @example
     * //returns [1, 2, 3]
     * hiddenData.getValues()
     * @example
     * //returns 1
     * hiddenData.push('foo')
     */
    constructor (arr) {
      const values = arr
      this.get = i => values[i]
      this.getValues = () => values
      this.push = x => values.push(x)
    }
  }

  const operations = []
  const data = new NonNativeDataStructure([
    new NonNativeDataStructure(['foo'])
  ])

  operations.push({
    expect: [
      {
        path: ['get'],
        value: data.get
      },
      {
        path: ['getValues'],
        value: data.getValues
      },
      {
        path: ['push'],
        value: data.push
      },
      {
        path: [ '0', 'get' ],
        value: data.get(0).get
      },
      {
        path: [ '0', 'getValues' ],
        value: data.get(0).getValues
      },
      {
        path: [ '0', 'push' ],
        value: data.get(0).push
      },
      {
        path: [ '0', '0' ],
        value: data.get(0).get(0)
      },
      {
        path: [ '0', 'length' ],
        value: data.get(0).get('length')
      },
      {
        path: ['length'],
        value: data.get('length')
      }
    ],
    result: () => {
      return extract(data, {
        propsCustomizer: target => {
          if (target instanceof NonNativeDataStructure) {
            return (
              Object.entries(
                Object.getOwnPropertyDescriptors(
                  target.getValues()
                )
              )
            )
          }
        }
      })
    }
  })
  return { data, description, operations }
})

// --- Test 19: --- //

tests.push(() => {
  const description = `Testing entries customizer with circular references...${
    '\n\nData Preparation:'
  }
    /**
     * Sample data structure.
     * Supplies 'get', 'getValues', and 'push' functions.
     */
    class NonNativeDataStructure {
      constructor(arr) {
        const values = arr
        this.get = i => values[i]
        this.getValues = () => values
        this.push = x => values.push(x)
      }
    }

    const data = new NonNativeDataStructure([
      new NonNativeDataStructure(['foo'])
    ])

    data.get(0).push(data.get(0))`

  /**
   * Sample data structure.
   * Supplies 'get', 'getValues', and 'push' functions.
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
     * @example
     * //returns [1, 2, 3]
     * hiddenData.getValues()
     * @example
     * //returns 1
     * hiddenData.push('foo')
     */
    constructor (arr) {
      const values = arr
      this.get = i => values[i]
      this.getValues = () => values
      this.push = x => values.push(x)
    }
  }

  const operations = []
  const data = new NonNativeDataStructure([
    new NonNativeDataStructure(['foo'])
  ])

  data.get(0).push(data.get(0))

  operations.push({
    expect: [
      {
        path: ['get'],
        value: data.get
      },
      {
        path: ['getValues'],
        value: data.getValues
      },
      {
        path: ['push'],
        value: data.push
      },
      {
        path: [ '0', 'get' ],
        value: data.get(0).get
      },
      {
        path: [ '0', 'getValues' ],
        value: data.get(0).getValues
      },
      {
        path: [ '0', 'push' ],
        value: data.get(0).push
      },
      {
        path: [ '0', '0' ],
        value: data.get(0).get(0)
      },
      {
        path: [ '0', '1' ],
        ref: { path: ['0'] }
      },
      {
        path: [ '0', 'length' ],
        value: data.get(0).get('length')
      },
      {
        path: ['length'],
        value: data.get('length')
      }
    ],
    result: () => {
      return extract(data, {
        propsCustomizer: target => {
          if (target instanceof NonNativeDataStructure) {
            return (
              Object.entries(
                Object.getOwnPropertyDescriptors(
                  target.getValues()
                )
              )
            )
          }
        }
      })
    }
  })
  return { data, description, operations }
})

// --- Test 20: --- //

tests.push(() => {
  const description = `Testing various individual options...${
    '\n\nData Preparation:'
  }
    const data = {
      foo: {
        bar: 'baz'
      }
    }
    
    Object.defineProperty(
      data.foo,
      'hidden',
      { value: 'foobar', enumerable: false }
    )`

  const operations = []
  const data = {
    foo: {
      bar: 'baz'
    }
  }

  Object.defineProperty(
    data.foo,
    'hidden',
    { value: 'foobar', enumerable: false }
  )

  operations.push({
    expect: [
      {
        path: [ '__proto__', '__proto__' ],
        value: Object.getPrototypeOf(Object.getPrototypeOf(data))
      },
      {
        path: [ 'foo', '__proto__' ],
        ref: { path: ['__proto__'] }
      },
      {
        path: [ 'foo', 'bar' ],
        value: data.foo.bar
      }
    ],
    result: () => extract(data, { inherited: true })
  })

  operations.push({
    expect: [
      {
        path: [ '__proto__', '__proto__' ],
        value: Object.getPrototypeOf(Object.getPrototypeOf(data))
      },
      {
        path: [ 'foo', '__proto__' ],
        value: Object.getPrototypeOf(data.foo),
        ref: { path: ['__proto__'] }
      },
      {
        path: [ 'foo', 'bar' ],
        value: data.foo.bar
      }
    ],
    result: () => extract(data, { inherited: true, includeRefValues: true })
  })

  operations.push({
    expect: [
      {
        path: [ '__proto__', '__proto__' ],
        value: Object.getPrototypeOf(Object.getPrototypeOf(data))
      }
    ],
    result: () => extract(data, { inherited: true, own: false })
  })

  operations.push({
    expect: [
      {
        path: [ 'foo', 'bar' ],
        value: data.foo.bar
      },
      {
        path: [ 'foo', 'hidden' ],
        value: data.foo.hidden
      }
    ],
    result: () => extract(data, { nonEnumerable: true })
  })

  operations.push({
    expect: [
      {
        path: [ 'foo', 'bar' ],
        value: data.foo.bar,
        parentIsFrozen: false,
        parentIsSealed: false,
        parentIsExtensible: true
      }
    ],
    result: () => extract(data, { permissions: true })
  })

  operations.push({
    expect: [
      {
        path: [ 'foo', 'bar' ],
        value: data.foo.bar,
        writable: true,
        enumerable: true,
        configurable: true
      }
    ],
    result: () => extract(data, { descriptors: true })
  })

  operations.push({
    expect: [
      { path: ['foo'], value: data.foo },
      { path: [ 'foo', 'bar' ], value: data.foo.bar }
    ],
    result: () => extract(data, { stepwise: true })
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
 * @param   {deep-props.extract} module - Module to use for testing. Used when testing entire deep-props package.
 * @returns {TestResults} Results of tests.
 */
const run = module => {
  if (module !== undefined) extract = module
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
