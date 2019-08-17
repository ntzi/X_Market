/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @see {@link http://github.com/jpcx/deep-props.set|GitHub}
 * @license MIT
 */

'use strict'

/** @namespace deep-props.set */

/**
 * Custom dataset for use as a <a href="#~Container">Container</a>. May be accessed via valid customizer functions.
 *
 * @typedef {*} deep-props.set~Custom
 * @example
 * (() => {
 *   class CustomDataStructure {
 *     constructor(array) {
 *       this.get = i => array[i]
 *       this.getValues = () => array
 *       this.push = x => array.push(x)
 *     }
 *   }
 *   return new CustomDataStructure([ 'foo', 'bar' ])
 * })()
 */

/**
 * Key used for accessing a child property within a container. When its value is <code>'__proto__'</code>, it is used as a stand-in for <code>Object.getPrototypeOf()</code>.
 *
 * @typedef {*} deep-props.set~Key
 */

/**
 * Container object used as a target for child property extraction.
 *
 * @typedef {(Object|Array|Map|WeakMap|Set|WeakSet|deep-props.set~Custom)} deep-props.set~Container
 */

/**
 * A non-primitive <a href="#~Container">Container</a> which represents the root of a given path.
 *
 * @typedef {deep-props.set~Container} deep-props.set~Host
 */

/**
 * Generator object which yields stepwise operation results.
 * While exploring existing structures, yields each value found along the way. During structure creation operations, yields Host after each modification.
 *
 * @typedef {Object} deep-props.set~ResultGenerator
 */

/**
 * Current reference to a given level of the path; parent to the next key along the path.
 * <ul>
 *   <li> For the host <code>{ foo: { bar: 'baz' } }</code> and a path <code>['foo', 'bar']</code>, the Target value will change during the operation as follows:
 *   <ul>
 *     <li> <code>{ bar: 'baz' }</code>
 *     <li> <code>'baz'</code>
 *   </ul>
 *   <li> Unless Target is a primitive type, or has been extracted from within a primitive type (such as a JSON string), Target will be a reference to the host object.
 *   <ul>
 *     <li> In this case, if any of its nested parents are mutable, modifications of a mutable object returned or yielded by set will result in changes to the host object.
 *   </ul>
 * </ul>
 *
 * @typedef {(deep-props.set~Container|string|undefined)} deep-props.set~Target
 */

/**
 * Function used for custom handling of entry into next level of the dataset.
 * <ul>
 *   <li> Allows for extraction from container objects that are not directly supported.
 *   <li> Returns new value of Target based on key.
 *   <li> Returns undefined if Target is not compatible with the filter.
 * </ul>
 *
 * @typedef {Function} deep-props.set~GetCustomizer
 * @param   {deep-props.set~Target} target - Current data being analyzed.
 * @param   {deep-props.set~Key}    key    - Next key along the path.
 * @returns {deep-props.set~Target} Value to pass along to the search function as the next Target. If undefined, will fall back on using standard extraction methods to find the next Target.
 * @example
 * (target, key) => {
 *   if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *     return new Int16Array(target)[key]
 *   }
 * }
 */

/**
 * Function used for custom handling of setting values within a data structure.
 * <ul>
 *   <li> Allows for extraction from container objects that are not directly supported.
 *   <li> Returns true if successful.
 *   <li> Returns undefined if Target is not compatible with the filter.
 * </ul>
 *
 * @typedef {Function} deep-props.set~SetCustomizer
 * @param   {deep-props.set~Target} target - Current data being analyzed.
 * @param   {deep-props.set~Key}    key    - Next key along the path.
 * @param   {number}                depth  - Current level of depth within the data structure (used for further customization).
 * @param   {*}                     data   - Data to set.
 * @returns {(boolean|undefined)} True if successful, undefined if not applicable.
 * @example
 * (target, key, depth, data) => {
 *   if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *     new Int16Array(target)[key] = data
 *     return true
 *   }
 * }
 */

/**
 * Settings for customizing behaviour.
 *
 * @typedef  {Object}  deep-props.set~Options
 * @property {boolean} [gen] - If true, module returns a generator that yields each search step and returns the final value.
 * @property {deep-props.set~GetCustomizer} [getCustomizer] - Allows for custom extraction.
 * @property {deep-props.set~SetCustomizer} [setCustomizer] - Allows for setting within custom objects.
 * @property {Function} [forceConstructor] - Forces a certain constructor to be used instead when creating new structures.
 * @property {RegExp} [match] - Regular expression used for custom key extraction from supplied path string. If supplied, it is used as the only argument for <code>path.match()</code>, which should return an array of key names.
 * @example
 * {
 *   gen: true,
 *   getCustomizer: (target, key) => {
 *     if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *       return new Int16Array(target)[key]
 *     }
 *   },
 *   setCustomizer: (target, key, depth, data) => {
 *     if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *       new Int16Array(target)[key] = data
 *       return true
 *     }
 *   },
 *   forceConstructor: Map,
 *   match: /[^/]+/g
 * }
 */

/**
 * Instructions that specify which keys should be accessed at each level of the dataset.
 * <ul>
 *   <li> A nested array <code>'arr'</code> with property <code>arr[0][0] === 'foo'</code> should be represented as <code>[0, 0]</code> or <code>'[0][0]'</code>, (or <code>'0.0'</code>, etc.) in order to retrieve <code>'foo'</code>.
 *   <li> A nested object <code>'nest'</code> with property <code>nest.foo.bar === 'baz'</code> should be represented as either <code>['foo', 'bar']</code> or <code>'foo.bar'</code> (or <code>'foo[bar]'</code>, etc.) in order to retrieve <code>'baz'</code>.
 *   <li> String paths will be converted to an array of keys based on matches of the following regex: <code>/[^.[\]]+/g</code>.
 *   <ul>
 *     <li> In other words, anything between periods or brackets will be interpreted as keys.
 *     <li> Paths containing any keys that are references (such as WeakMap keys) must be passed as an array, such as <code>['foo', 'bar', weakMapKey]</code>
 *     <li> Paths containing any keys with periods or brackets must also be passed as an array, such as <code>['foo.bar', 'baz[qux]']</code> (unless a custom match regex is supplied).
 *   </ul>
 * </ul>
 *
 * @typedef  {deep-props.set~Key[]|string} deep-props.set~Path
 * @example
 * [ 'foo', 'bar', 'baz' ]
 * @example
 * 'foo.bar.baz'
 * @example
 * 'foo[0][0]'
 */

/**
 * Sets a value within an Object or Array.
 *
 * @memberof deep-props.set
 * @param    {deep-props.set~Target} target  - Current reference to a given level of the path.
 * @param    {deep-props.set~Key}    key     - Key to construct within.
 * @param    {*}                     [data]  - Data to set within target at key.
 */
const setWithinStandard = (target, key, data) => {
  if (typeof key === 'string' || typeof key === 'number') {
    if (key !== '__proto__') {
      target[key] = data
    } else {
      Object.setPrototypeOf(target, data)
    }
    return data
  } else {
    throw Error('Invalid Host type')
  }
}

/**
 * Sets a value within an Map or WeakMap.
 *
 * @memberof deep-props.set
 * @param    {deep-props.set~Target} target  - Current reference to a given level of the path.
 * @param    {deep-props.set~Key}    key     - Key to construct within.
 * @param    {*}                     [data]  - Data to set within target at key.
 */
const setWithinMap = (target, key, data) => {
  if (key !== '__proto__') {
    target.set(key, data)
  } else {
    Object.setPrototypeOf(target, data)
  }
  return data
}

/**
 * Sets a value within a Set or WeakSet.
 *
 * @memberof deep-props.set
 * @param    {deep-props.set~Target} target  - Current reference to a given level of the path.
 * @param    {deep-props.set~Key}    key     - Key to construct within.
 * @param    {*}                     [data]  - Data to set within target at key.
 */
const setWithinSet = (target, key, data) => {
  if (data !== key) {
    if (
      !isNaN(+key) && (
        typeof key === 'string' ||
        typeof key === 'number'
      )
    ) {
      if (target instanceof Set) {
        if (+key <= target.size) {
          if (+key === target.size - 1) {
            target.delete([...target][+key])
            target.add(data)
            return data
          } else if (+key < target.size - 1) {
            const cache = [...target]
            for (let i = +key; i < cache.length; i++) {
              target.delete(cache[i])
            }
            target.add(data)
            for (let i = +key + 1; i < cache.length; i++) {
              target.add(cache[i])
            }
            return data
          } else {
            target.add(data)
            return data
          }
        } else {
          throw Error('Iteration order out of bounds')
        }
      } else {
        throw Error('Cannot enumerate WeakSets')
      }
    } else {
      if (key === '__proto__') {
        Object.setPrototypeOf(target, data)
        return data
      } else {
        throw Error('Invalid iteration order')
      }
    }
  } else {
    if (key !== '__proto__') {
      target.add(data)
    } else {
      Object.setPrototypeOf(target, data)
    }
    return data
  }
}

/**
 * Defines a value within an object at a key. Uses next key along the chain (and options) to determine the type of constructor to be used. If data is provided, sets a value at key.
 *
 * @memberof deep-props.set
 * @param    {deep-props.set~Target}  target  - Current reference to a given level of the path.
 * @param    {deep-props.set~Key}     key     - Key to construct within.
 * @param    {deep-props.set~Key}     nextKey - Next key along the path.
 * @param    {number}                 depth   - Current level of path.
 * @param    {boolean}                isLast  - True if end of path has been reached.
 * @param    {*}                      data    - Data to set within target.
 * @param    {deep-props.set~Options} opt     - Execution settings.
 * @returns  {deep-props.set~Target}  New reference.
 */
const setWithin = (target, key, nextKey, depth, isLast, data, opt) => {
  if (!isLast) {
    if (opt.hasOwnProperty('forceConstructor')) {
      let Constructor = opt.forceConstructor
      data = new Constructor()
    } else {
      if (
        !isNaN(+nextKey) && (
          typeof nextKey === 'string' ||
          typeof nextKey === 'number'
        )
      ) {
        data = []
      } else if (typeof nextKey === 'string') {
        data = {}
      } else {
        data = new Map()
      }
    }
  }
  if (opt.setCustomizer instanceof Function) {
    if (opt.setCustomizer(target, key, depth, data) === true) {
      return data
    }
  }
  if (
    target instanceof Map ||
    target instanceof WeakMap
  ) {
    return setWithinMap(target, key, data)
  } else if (
    target instanceof Set ||
    target instanceof WeakSet
  ) {
    return setWithinSet(target, key, data)
  } else if (
    target instanceof Object ||
    target instanceof Array
  ) {
    return setWithinStandard(target, key, data)
  } else {
    throw Error('Could not set data.')
  }
}

/**
 * Iterates along the supplied path and shifts a reference point along the way. Sets data to last key in path.
 *
 * @generator
 * @memberof deep-props.set
 * @param   {deep-props.set~Host} host - Base container dataset to search within.
 * @param   {deep-props.set~Path} path - Path to desired property.
 * @param   {*} data - Data to set at endpoint of path.
 * @param   {deep-props.set~Options} opt - Execution settings.
 * @yields  {(deep-props.set~Target|deep-props.set~Host)} While exploring existing structures, yields each level explored. While creating new structures, yields new value of Host. Yields Host at end of search.
 * @returns {undefined} Returns undefined if search has finished executing or if the desired value has not been found.
 */
const place = function * (host, path, data, opt) {
  let target = host
  let get
  try {
    get = require('../get')
  } catch (e) {
    get = require('deep-props.get')
  }
  let query = get(host, path.slice(0, -1), { ...opt, ...{ gen: true } })
  let depth = 0
  for (let result of query) {
    if (result !== undefined) {
      target = result
      if (typeof target === 'string') {
        throw Error('Cannot set within strings')
      }
      depth++
      yield target
    }
  }
  for (let i = depth; i < path.length - 1; i++) {
    target = setWithin(
      target, path[i], path[i + 1], depth, false, undefined, opt
    )
    if (typeof target === 'string') {
      throw Error('Cannot set within strings')
    }
    yield host
    depth++
  }
  setWithin(target, path.slice(-1)[0], undefined, depth, true, data, opt)
  yield host
}

/**
 * Sets values within nested objects; creates structure if not found. Supports setting within Objects, Arrays, Maps, Sets, WeakMaps, and WeakSets; supports creation of Objects, Arrays, and Maps.
 *
 * @module  set
 * @param   {deep-props.set~Host} host - Container to search within.
 * @param   {deep-props.set~Path} path - Path to desired property.
 * @param   {*} data - Data to set at endpoint of path.
 * @param   {deep-props.set~Options} [opt={}] - Execution settings.
 * @returns {(boolean|deep-props.set~ResultGenerator)} True if successful, false if not. If <code>opt.gen === true</code>, returns a generator that yields each search step.
 * @example
 * const data = { foo: { bar: { baz: 'beh' } } }
 *
 * // Both return { foo: { bar: { baz: 'qux' } } }
 * set(data, 'foo.bar.baz', 'qux')
 * data
 * @example
 * const data = {}
 *
 * // Both return { foo: { bar: { baz: 'qux' } } }
 * set(data, 'foo.bar.baz', 'qux')
 * data
 */
const set = (host, path, data, opt = {}) => {
  if (
    host === undefined ||
    path === undefined ||
    data === undefined
  ) {
    throw Error('Bad args')
  }
  if (typeof path === 'string') {
    path = path.match(opt.match instanceof RegExp
      ? opt.match
      : /[^.[\]]+/g)
  }
  if (!(path instanceof Array)) throw Error('Bad path')
  const operation = place(host, path, data, opt)
  if (opt.gen === true) return operation
  let result
  for (let response of operation) result = response
  return result
}

module.exports = set
