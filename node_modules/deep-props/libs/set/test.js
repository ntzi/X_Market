'use strict'

/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @see {@link http://github.com/jpcx/deep-props.set|GitHub}
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

let set = require('./')

const assert = require('assert')

const ANSI_RED = '\x1b[31m'
const ANSI_GREEN = '\x1b[32m'
const ANSI_CYAN = '\x1b[36m'
const ANSI_RESET = '\x1b[0m'

const tests = []

// --- Test 1: --- //

tests.push(() => {
  const description = `Testing setting within existing Object structure...${
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
    expect: {
      foo: {
        bar: {
          baz: {
            beh: 'quux'
          }
        }
      }
    },
    result: () => {
      set(data, [ 'foo', 'bar', 'baz', 'beh' ], 'quux')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 2: --- //

tests.push(() => {
  const description = `Testing setting within existing Array structure...${
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
      [
        [
          [
            'bar'
          ]
        ]
      ]
    ],
    result: () => {
      set(data, [ 0, 0, 0, 0 ], 'bar')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 3: --- //

tests.push(() => {
  const description = `Testing setting within new Object structure...${
    '\n\nData Preparation:'
  }
    const data = {}`
  const operations = []
  const data = {}

  operations.push({
    expect: {
      foo: {
        bar: {
          baz: {
            beh: 'qux'
          }
        }
      }
    },
    result: () => {
      set(data, [ 'foo', 'bar', 'baz', 'beh' ], 'qux')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 4: --- //

tests.push(() => {
  const description = `Testing setting within new Array structure...${
    '\n\nData Preparation:'
  }
    const data = []`
  const operations = []
  const data = []

  operations.push({
    expect: [
      [
        [
          [
            'foo'
          ]
        ]
      ]
    ],
    result: () => {
      set(data, [ 0, 0, 0, 0 ], 'foo')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 5: --- //

tests.push(() => {
  const description = `Testing setting within existing Map structure...${
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
    expect: new Map().set(
      'foo', new Map().set(
        'bar', new Map().set(
          'baz', new Map().set(
            'beh', 'quux'
          )
        )
      )
    ),
    result: () => {
      set(data, [ 'foo', 'bar', 'baz', 'beh' ], 'quux')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 6: --- //

tests.push(() => {
  const description = `Testing setting within new Map structure...${
    '\n\nData Preparation:'
  }
    const data = new Map()`
  const operations = []
  const data = new Map()

  operations.push({
    expect: new Map().set(
      ['foo'], new Map().set(
        ['bar'], new Map().set(
          ['baz'], new Map().set(
            ['beh'], 'qux'
          )
        )
      )
    ),
    result: () => {
      set(data, [ ['foo'], ['bar'], ['baz'], ['beh'] ], 'qux')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 7: --- //

tests.push(() => {
  const description = `Testing setting within existing Set structure; adding value to set...${
    '\n\nData Preparation:'
  }
    const data = new Set().add(
      new Set().add(
        new Set().add(
          new Set().add(
            'foo'
          )
        )
      )
    )`
  const operations = []
  const data = new Set().add(
    new Set().add(
      new Set().add(
        new Set().add(
          'foo'
        )
      )
    )
  )

  operations.push({
    expect: new Set().add(
      new Set().add(
        new Set().add(
          new Set([ 'foo', 'bar' ])
        )
      )
    ),
    result: () => {
      set(data, [ 0, 0, 0, 1 ], 'bar')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 8: --- //

tests.push(() => {
  const description = `Testing setting within existing Set structure; replacing value at end of set...${
    '\n\nData Preparation:'
  }
    const data = new Set().add(
      new Set().add(
        new Set().add(
          new Set().add(
            'foo'
          )
        )
      )
    )`
  const operations = []
  const data = new Set().add(
    new Set().add(
      new Set().add(
        new Set().add(
          'foo'
        )
      )
    )
  )

  operations.push({
    expect: new Set().add(
      new Set().add(
        new Set().add(
          new Set().add(
            'bar'
          )
        )
      )
    ),
    result: () => {
      set(data, [ 0, 0, 0, 0 ], 'bar')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 9: --- //

tests.push(() => {
  const description = `Testing setting within existing Set structure; replacing value within middle of set...${
    '\n\nData Preparation:'
  }
    const data = new Set().add(
      new Set().add(
        new Set().add(
          new Set([ 'foo', 'bar', 'baz', 'beh', 'qux', 'quz' ])
        )
      )
    )`
  const operations = []
  const data = new Set().add(
    new Set().add(
      new Set().add(
        new Set([ 'foo', 'bar', 'baz', 'beh', 'qux', 'quz' ])
      )
    )
  )

  operations.push({
    expect: new Set().add(
      new Set().add(
        new Set().add(
          new Set([ 'foo', 'bar', 'foobar', 'beh', 'qux', 'quz' ])
        )
      )
    ),
    result: () => {
      set(data, [ 0, 0, 0, 2 ], 'foobar')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 10: --- //

tests.push(() => {
  const description = `Testing setting within WeakMaps and WeakSets...${
    '\n\nData Preparation:'
  }
    const data = {
      weakMap: new WeakMap(),
      weakSet: new WeakSet()
    }()`
  const operations = []
  const data = {
    weakMap: new WeakMap(),
    weakSet: new WeakSet()
  }

  operations.push({
    expect: true,
    result: () => {
      const key = ['foo']
      set(data.weakMap, [key], 'bar')
      return data.weakMap.has(key)
    }
  })

  operations.push({
    expect: true,
    result: () => {
      const key = ['foo']
      set(data.weakSet, [key], key)
      return data.weakSet.has(key)
    }
  })

  return { data, description, operations }
})

// --- Test 11: --- //

tests.push(() => {
  const description = `Testing multiple type creation; origin Object...${
    '\n\nData Preparation:'
  }
    const data = {}`
  const operations = []
  const data = {}

  operations.push({
    expect: {
      foo: [
        new Map().set(
          ['bar'], {
            baz: [
              new Map().set(
                ['beh'], 'qux'
              )
            ]
          }
        )
      ]
    },
    result: () => {
      set(data, [ 'foo', 0, ['bar'], 'baz', 0, ['beh'] ], 'qux')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 12: --- //

tests.push(() => {
  const description = `Testing multiple type creation; origin Array...${
    '\n\nData Preparation:'
  }
    const data = []`
  const operations = []
  const data = []

  operations.push({
    expect: [
      {
        foo: new Map().set(
          ['bar'], [
            {
              baz: new Map().set(
                ['beh'], 'qux'
              )
            }
          ]
        )
      }
    ],
    result: () => {
      set(data, [ 0, 'foo', ['bar'], 0, 'baz', ['beh'] ], 'qux')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 13: --- //

tests.push(() => {
  const description = `Testing multiple type creation; origin Map...${
    '\n\nData Preparation:'
  }
    const data = new Map()`
  const operations = []
  const data = new Map()

  operations.push({
    expect: new Map().set(
      ['foo'], {
        bar: [
          new Map().set(
            ['baz'], {
              beh: [
                'qux'
              ]
            }
          )
        ]
      }
    ),
    result: () => {
      set(data, [ ['foo'], 'bar', 0, ['baz'], 'beh', 0 ], 'qux')
      return data
    }
  })
  return { data, description, operations }
})

// --- Test 14: --- //

tests.push(() => {
  const description = `Testing invalid origin...${
    '\n\nData Preparation:'
  }
    const data = {}`
  const operations = []
  const data = {}

  operations.push({
    expect: true,
    result: () => {
      try {
        set(data, [['foo']], 'bar')
        return false
      } catch (err) {
        if (err.message === 'Invalid Host type') {
          return true
        } else {
          return false
        }
      }
    }
  })
  return { data, description, operations }
})

// --- Test 15: --- //

tests.push(() => {
  const description = `Testing errors...${
    '\n\nData Preparation:'
  }
    const data = {
      obj: {},
      set: new Set(),
      weakSet: new WeakSet()
    }()`
  const operations = []
  const data = {
    obj: {},
    set: new Set(),
    weakSet: new WeakSet(),
    json: JSON.stringify({ foo: 'bar' })
  }

  operations.push({
    expect: true,
    result: () => {
      Object.freeze(data.obj)
      try {
        set(data.obj, ['foo'], 'bar')
        return false
      } catch (err) {
        if (err.message === 'Cannot add property foo, object is not extensible') {
          return true
        } else {
          return false
        }
      }
    }
  })

  operations.push({
    expect: true,
    result: () => {
      try {
        set(data.set, [1], 'foo')
        return false
      } catch (err) {
        if (err.message === 'Iteration order out of bounds') {
          return true
        } else {
          return false
        }
      }
    }
  })

  operations.push({
    expect: true,
    result: () => {
      try {
        set(data.weakSet, [0], 'foo')
        return false
      } catch (err) {
        if (err.message === 'Cannot enumerate WeakSets') {
          return true
        } else {
          return false
        }
      }
    }
  })

  operations.push({
    expect: true,
    result: () => {
      try {
        set(data.set, ['foo'], 'bar')
        return false
      } catch (err) {
        if (err.message === 'Invalid iteration order') {
          return true
        } else {
          return false
        }
      }
    }
  })

  operations.push({
    expect: true,
    result: () => {
      try {
        set(data.json, [ 'foo', 2 ], 'm')
        return false
      } catch (err) {
        if (err.message === 'Cannot set within strings') {
          return true
        } else {
          return false
        }
      }
    }
  })

  operations.push({
    expect: true,
    result: () => {
      try {
        set(data.json, ['baz'], 'beh')
        return false
      } catch (err) {
        if (err.message === 'Cannot set within strings') {
          return true
        } else {
          return false
        }
      }
    }
  })

  return { data, description, operations }
})

// --- Test 16: --- //

tests.push(() => {
  const description = `Testing string paths...${
    '\n\nData Preparation:'
  }
    const data = {}`

  const operations = []

  const data = {}

  operations.push({
    expect: {
      foo: {
        bar: {
          baz: 'beh'
        }
      }
    },
    result: () => {
      Object.keys(data).forEach(x => delete data[x])
      set(data, 'foo.bar.baz', 'beh')
      return data
    }
  })

  operations.push({
    expect: {
      foo: {
        bar: {
          baz: 'beh'
        }
      }
    },
    result: () => {
      Object.keys(data).forEach(x => delete data[x])
      set(data, 'foo[bar][baz]', 'beh')
      return data
    }
  })

  operations.push({
    expect: {
      foo: [
        [
          [
            'bar'
          ]
        ]
      ]
    },
    result: () => {
      Object.keys(data).forEach(x => delete data[x])
      set(data, 'foo[0][0][0]', 'bar')
      return data
    }
  })

  operations.push({
    expect: {
      foo: {
        bar: {
          baz: 'beh'
        }
      }
    },
    result: () => {
      Object.keys(data).forEach(x => delete data[x])
      set(data, 'foo/bar/baz', 'beh', { match: /[^/]+/g })
      return data
    }
  })

  return { data, description, operations }
})

// --- Test 17: --- //

tests.push(() => {
  const description = `Testing __proto__...${
    '\n\nData Preparation:'
  }
    const data = {
      obj: {},
      arr: [],
      map: new Map(),
      set: new Set(),
      weakMap: new WeakMap(),
      weakSet: new WeakSet(),
      arrayBuffer: new ArrayBuffer(16) // using ArrayBuffer to test other objects
    }
    const testProto = { foo: 'bar' }`

  const operations = []

  const data = {
    obj: {},
    arr: [],
    map: new Map(),
    set: new Set(),
    weakMap: new WeakMap(),
    weakSet: new WeakSet(),
    arrayBuffer: new ArrayBuffer(16) // using ArrayBuffer to test other objects
  }
  const testProto = { foo: 'bar' }

  operations.push({
    expect: testProto,
    result: () => {
      set(data.obj, ['__proto__'], testProto)
      return Object.getPrototypeOf(data.obj)
    }
  })

  operations.push({
    expect: testProto,
    result: () => {
      set(data.arr, ['__proto__'], testProto)
      return Object.getPrototypeOf(data.arr)
    }
  })

  operations.push({
    expect: testProto,
    result: () => {
      set(data.map, ['__proto__'], testProto)
      return Object.getPrototypeOf(data.map)
    }
  })

  operations.push({
    expect: testProto,
    result: () => {
      set(data.set, ['__proto__'], testProto)
      return Object.getPrototypeOf(data.set)
    }
  })

  operations.push({
    expect: testProto,
    result: () => {
      set(data.weakMap, ['__proto__'], testProto)
      return Object.getPrototypeOf(data.weakMap)
    }
  })

  operations.push({
    expect: testProto,
    result: () => {
      set(data.weakSet, ['__proto__'], testProto)
      return Object.getPrototypeOf(data.weakSet)
    }
  })

  operations.push({
    expect: testProto,
    result: () => {
      set(data.arrayBuffer, ['__proto__'], testProto)
      return Object.getPrototypeOf(data.arrayBuffer)
    }
  })

  return { data, description, operations }
})

// --- Test 18: --- //

tests.push(() => {
  const description = `Testing custom data structures...${
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
    expect: 3,
    result: () => {
      set(data, [ 0, 'foo', 'bar', 'baz', 2 ], 3, {
        getCustomizer: (target, key) => {
          if (target instanceof NonNativeDataStructure) {
            return target.retrieve(key)
          }
        },
        setCustomizer: (target, key, depth, data) => {
          if (target instanceof ArrayBuffer && target.byteLength === 16) {
            new Int16Array(target)[key] = data
            return true
          }
        }
      })

      return new Int16Array(data.retrieve(0).foo.bar.baz)[2]
    }
  })

  return { data, description, operations }
})

// --- Test 18: --- //

tests.push(() => {
  const description = `Testing force constructor option...${
    '\n\nData Preparation:'
  }
    const data = {
      obj: {},
      map: new Map(),
      set: new Set()
    }`
  const operations = []

  const data = {
    obj: {},
    map: new Map(),
    set: new Set()
  }

  operations.push({
    expect: {
      0: {
        0: {
          0: 'foo'
        }
      }
    },
    result: () => {
      set(data.obj, [ 0, 0, 0 ], 'foo', { forceConstructor: Object })
      return data.obj
    }
  })

  operations.push({
    expect: new Map().set(
      'foo', new Map().set(
        'bar', new Map().set(
          'baz', 'beh'
        )
      )
    ),
    result: () => {
      set(data.map, [ 'foo', 'bar', 'baz' ], 'beh', { forceConstructor: Map })
      return data.map
    }
  })

  operations.push({
    expect: new Set([
      new Set([
        new Set([
          'foo'
        ])
      ])
    ]),
    result: () => {
      set(data.set, [ 0, 0, 0 ], 'foo', { forceConstructor: Set })
      return data.set
    }
  })

  return { data, description, operations }
})

// --- Test 19: --- //

tests.push(() => {
  const description = `Testing return equivalence...${
    '\n\nData Preparation:'
  }
    const data = {}`
  const operations = []

  const data = {}

  operations.push({
    expect: true,
    result: () => {
      const ret = set(data, [ 'foo', 'bar' ], 'baz')
      return data === ret
    }
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
 * @param   {deep-props.set} module - Module to use for testing. Used when testing entire deep-props package.
 * @returns {TestResults} Results of tests.
 */
const run = module => {
  if (module !== undefined) set = module
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
