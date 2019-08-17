/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/deep-props|GitHub}
 */

'use strict'

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

const ANSI_RED = '\x1b[31m'
const ANSI_GREEN = '\x1b[32m'
const ANSI_RESET = '\x1b[0m'
const ANSI_BOLD = '\x1b[1m'

const master = require('./')

const extractTests = require('./libs/extract/test.js')
const getTests = require('./libs/get/test.js')
const setTests = require('./libs/set/test.js')

const extractResults = extractTests.run(master.extract)
const getResults = getTests.run(master.get)
const setResults = setTests.run(master.set)

let totalTestsAttempt = 0
let numFailed = 0

totalTestsAttempt += extractResults.totalTestsAttempt
totalTestsAttempt += getResults.totalTestsAttempt
totalTestsAttempt += setResults.totalTestsAttempt

if (extractResults.numFailed > 0) {
  numFailed += extractResults.numFailed

  console.log(
    `\n========================================${
      '========================================'
    }\n`
  )

  console.log(
    ANSI_BOLD + ANSI_RED + 'Extract module test failure!\n' + ANSI_RESET
  )
  for (let e of extractResults.errors) {
    dirDeep(e)
  }
}

if (getResults.numFailed > 0) {
  numFailed += getResults.numFailed

  console.log(
    `\n========================================${
      '========================================'
    }\n`
  )

  console.log(
    ANSI_BOLD + ANSI_RED + 'Get module test failure!\n' + ANSI_RESET
  )
  for (let e of getResults.errors) {
    dirDeep(e)
  }
}

if (setResults.numFailed > 0) {
  numFailed += setResults.numFailed

  console.log(
    `\n========================================${
      '========================================'
    }\n`
  )

  console.log(
    ANSI_BOLD + ANSI_RED + 'Set module test failure!\n' + ANSI_RESET
  )
  for (let e of setResults.errors) {
    dirDeep(e)
  }
}

console.log(
  `\n========================================${
    '========================================'
  }\n`
)

console.log(ANSI_BOLD + 'Submodules\' Test Results:\n' + ANSI_RESET)

if (numFailed === 0) {
  console.log(ANSI_GREEN + '[PASS]' + ANSI_RESET)
} else {
  console.log(ANSI_RED + '[FAIL]' + ANSI_RESET)
}

console.log()

console.log('Total Tests Attempted: ' + totalTestsAttempt)
console.log('Total Operational Failures: ' + numFailed)

if (numFailed > 0) throw Error('Failed Tests!')
