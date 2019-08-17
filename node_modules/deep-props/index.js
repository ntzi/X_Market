/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/deep-props|GitHub}
 */

/**
 * Provides a collection of non-recursive tools for performing operations on deeply nested object properties and prototypes. Allows for custom execution settings including non-native dataset handling.
 *
 * @namespace deep-props
 */

'use strict'

/**
 * Provides an interface to the deep-props submodules.
 *
 * @typedef  {Object} deep-props~Submodules
 * @property {deep-props.extract} extract - Extract module.
 * @property {deep-props.get}     get     - Get module.
 * @property {deep-props.set}     set     - Set module.
 */

/**
 * Exports the deep-props submodules.
 *
 * @module deep-props
 * @returns {deep-props~Submodules} Object containing submodules.
 * @example
 * // returns {
 * //   extract: [Function: extract],
 * //   get: [Function: get],
 * //   set: [Function: set]
 * // }
 * const props = require('deep-props')
 *
 * const extract = props.extract
 * const get = props.get
 * const set = props.get
 */
module.exports = {
  extract: require('./libs/extract'),
  get: require('./libs/get'),
  set: require('./libs/set')
}
