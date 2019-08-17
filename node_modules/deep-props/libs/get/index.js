/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @see {@link http://github.com/jpcx/deep-props.get|GitHub}
 * @license MIT
 */

'use strict'

/** @namespace deep-props.get */

/**
 * Custom dataset for use as a <a href="#~Container">Container</a>. May be accessed via valid customizer functions.
 *
 * @typedef {*} deep-props.get~Custom
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
 * @typedef {*} deep-props.get~Key
 */

/**
 * Container object used as a target for child property extraction.
 *
 * @typedef {(Object|Array|Map|WeakMap|Set|WeakSet|deep-props.get~Custom)} deep-props.get~Container
 */

/**
 * A non-primitive <a href="#~Container">Container</a> which represents the root of a given path.
 *
 * @typedef {deep-props.get~Container} deep-props.get~Host
 */

/**
 * Generator object which yields stepwise operation results.
 *
 * @typedef {Object} deep-props.get~ResultGenerator
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
 *     <li> In this case, if any of its nested parents are mutable, modifications of a mutable object returned or yielded by get will result in changes to the host object.
 *   </ul>
 * </ul>
 *
 * @typedef {(deep-props.get~Container|string|undefined)} deep-props.get~Target
 */

/**
 * Function used for custom handling of entry into next level of the dataset.
 * <ul>
 *   <li> Allows for extraction from container objects that are not directly supported.
 *   <li> Returns new value of Target based on key.
 *   <li> Returns undefined if Target is not compatible with the filter.
 * </ul>
 *
 * @typedef {function} deep-props.get~GetCustomizer
 * @param   {deep-props.get~Target} target - Current data being analyzed.
 * @param   {deep-props.get~Key}    key    - Key used to extract from target.
 * @returns {deep-props.get~Target} Value to pass along to the search function as the next Target. If undefined, will fall back on using standard extraction methods to find the next Target.
 * @example
 * (target, key) => {
 *   if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *     return new Int16Array(target)[key]
 *   }
 * }
 */

/**
 * Settings for customizing behaviour.
 *
 * @typedef  {Object}  deep-props.get~Options
 * @property {boolean} [gen] - If true, module returns a generator that yields each search step and ends at the final value.
 * @property {deep-props.get~GetCustomizer} [getCustomizer] - Allows for custom extraction.
 * @property {RegExp} [match] - Regular expression used for custom key extraction from supplied path string. If supplied, it is used as the only argument for <code>path.match()</code>, which should return an array of key names.
 * @example
 * {
 *   gen: true,
 *   getCustomizer: (target, key) => {
 *     if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *       return new Int16Array(target)[key]
 *     }
 *   },
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
 * @typedef  {deep-props.get~Key[]|string} deep-props.get~Path
 * @example
 * [ 'foo', 'bar', 'baz' ]
 * @example
 * 'foo.bar.baz'
 * @example
 * 'foo[0][0]'
 */

/**
 * Checks for String objects and properties attached to them. If not, checks for JSON and returns property from the extracted JSON object. If not JSON, returns the character at that index.
 *
 * @memberof deep-props.get
 * @param    {deep-props.get~Target} target - Target of Key search.
 * @param    {deep-props.get~Key}    key    - Key to find in target.
 * @returns  {deep-props.get~Target} New target from key or undefined if not found.
 * @example
 * // returns 'bar'
 * getFromString(JSON.stringify({ foo: 'bar' }), 'foo')
 * @example
 * // returns 'c'
 * getFromString('abc', '2')
 * @example
 * // returns 'bar'
 * let strObj = new String('abc')
 * strObj.foo = 'bar'
 * getFromString(strObj, 'foo')
 * @example
 * // returns 'c'
 * let strObj = new String('abc')
 * strObj.foo = 'bar'
 * getFromString(strObj, '2')
 */
const getFromString = (target, key) => {
  if (target instanceof String && target.hasOwnProperty(key)) {
    return target[key]
  } else {
    try {
      return JSON.parse(target)[key]
    } catch (e) {
      return target[key]
    }
  }
}

/**
 * Gets a key from a map, if it exists.  Looks for key as key first; if not found, looks for insertion order as key.
 *
 * @memberof deep-props.get
 * @param    {deep-props.get~Target} target - Target of Key search.
 * @param    {deep-props.get~Key}    key    - Key to find in target.
 * @returns  {deep-props.get~Target} New target from key or undefined if not found.
 * @example
 * // all return 'bar'
 * getFromMap(new Map([[ 'foo', 'bar' ]]), 'foo')
 * getFromMap(new Map([[ 'foo', 'bar' ]]), '0')
 * getFromMap(new Map([[ 'foo', 'bar' ]]), 0)
 */
const getFromMap = (target, key) => {
  if (target.has(key)) return target.get(key)
  if (isFinite(key) && target.size > key) return [...target][key][1]
}

/**
 * Checks to see if a Set has a key. If so, returns the key. If not found, looks for insertion order as key.
 *
 * @memberof deep-props.get
 * @param   {deep-props.get~Target} target - Target of Key search.
 * @param   {deep-props.get~Key}    key    - Key to find in target.
 * @returns {deep-props.get~Target} New target from key or undefined if not found.
 * @example
 * // all return 'foo'
 * getFromSet(new Set([ 'foo', 'bar' ]), 'foo')
 * getFromSet(new Set([ 'foo', 'bar' ]), '0')
 * getFromSet(new Set([ 'foo', 'bar' ]), 0)
 */
const getFromSet = (target, key) => {
  if (target.has(key)) return key
  if (isFinite(key) && target.size > key) return [...target][key]
}

/**
 * Gets a value from a Target behind a Key. Checks getCustomizer first, if it is provided.
 *
 * @memberof deep-props.get
 * @param   {deep-props.get~Target}  target - Target object.
 * @param   {deep-props.get~Key}     key    - Access key.
 * @param   {deep-props.get~Options} opt    - Execution settings.
 * @returns {deep-props.get~Target}  New target, final value, or undefined.
 * @example
 * // all return 'bar'
 * getFromKey({foo: 'bar'}, 'foo', {})
 * getFromKey(new Map([['foo', 'bar']]), 'foo', {})
 * getFromKey(new Set(['foo', 'bar']), 'bar', {})
 */
const getFromKey = (target, key, opt) => {
  if (opt.getCustomizer instanceof Function) {
    let customTarget = opt.getCustomizer(target, key)
    if (customTarget !== undefined) return customTarget
  }
  if (key === '__proto__') {
    return Object.getPrototypeOf(target)
  } else if (typeof target === 'string' || target instanceof String) {
    return getFromString(target, key)
  } else if (target instanceof Map) {
    return getFromMap(target, key)
  } else if (target instanceof WeakMap) {
    return target.get(key)
  } else if (target instanceof Set) {
    return getFromSet(target, key)
  } else if (target instanceof WeakSet) {
    return target.has(key) ? key : undefined
  } else {
    return target[key]
  }
}

/**
 * Iterates along the supplied path and shifts a reference point along the way.
 *
 * @generator
 * @memberof deep-props.get
 * @param   {deep-props.get~Host} host - Base container dataset to search within.
 * @param   {deep-props.get~Path} path - Path to desired property.
 * @param   {deep-props.get~Options} opt - Execution settings.
 * @yields  {deep-props.get~Target} Data retrieved at each level of execution; value of Target before reassignment.
 * @returns {undefined} Returns undefined if search has finished executing or if the desired value has not been found.
 * @example
 * const nest = { foo: { bar: 'baz' } }
 *
 * // returns generator
 * const query = search(nest, [ 'foo', 'bar' ], {})
 *
 * // yields { value: { bar: 'baz' }, done: false }
 * query.next()
 *
 * // yields { value: 'baz', done: true }
 * query.next()
 *
 * // returns { value: undefined, done: true }
 * query.next()
 */
const search = function * (host, path, opt) {
  try {
    let target = host
    let firstRun = true
    for (let key of path) {
      if (target === undefined) break
      if (firstRun) {
        firstRun = false
      } else {
        yield target
      }
      target = getFromKey(target, key, opt)
    }
    yield target
  } catch (e) {
    return undefined
  }
}

/**
 * Retrieves a nested property from a data source. Supports Objects, Arrays, Maps, Sets, WeakMaps, WeakSets, and JSON. Supports the use of a custom extraction function to handle unsupported datasets.
 *
 * @module  get
 * @param   {deep-props.get~Host} host - Container to search within.
 * @param   {deep-props.get~Path} path - Path to desired property.
 * @param   {deep-props.get~Options} [opt={}] - Execution settings.
 * @returns {(deep-props.get~Target|deep-props.get~ResultGenerator)} Endpoint of path - the result of the search. Target is undefined if not found. If <code>opt.gen === true</code>, returns a generator that yields each search step.
 * @example
 * // Nested object and array extraction
 *
 * const nest = { foo: { bar: { baz: ['qux'] } } }
 *
 * // returns 'qux'
 * get(nest, 'foo.bar.baz[0]') // or 'foo.bar.baz.0', or ['foo', 'bar', 'baz', 0]
 * @example
 * // Nested WeakMap extraction
 *
 * const foo = { key: 1 }
 * const bar = { key: 2 }
 * const nest = new WeakMap().set(foo, new WeakMap().set(bar, 'baz'))
 *
 * // returns 'baz'
 * get(nest, [foo, bar])
 * @example
 * // Usage of a custom extraction function
 *
 * // Creation of a sample custom data structure which uses a 'retrieve' method for data access.
 * class NonNativeDataStructure {
 *   constructor(arr) {
 *     const values = [...arr]
 *     this.retrieve = i => values[i]
 *   }
 * }
 *
 * // Addition of another data structure that, although native, requires custom extraction instructions
 * const testAB = new ArrayBuffer(16)
 * new Int16Array(testAB)[0] = 2
 *
 * const nest = new NonNativeDataStructure([{ foo: { bar: testAB } }])
 *
 * // returns undefined
 * get(nest, '0.foo.bar[0]')
 *
 * // returns 2
 * get(nest, '0.foo.bar[0]', {
 *   getCustomizer: (target, key) => {
 *     if (target instanceof NonNativeDataStructure) {
 *       return target.retrieve(key)
 *     }
 *     if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *       return new Int16Array(target)[key]
 *     }
 *   }
 * })
 * @example
 * // Stepwise extraction via the 'gen' option
 *
 * const nest = { foo: { bar: 'baz' } }
 *
 * // returns generator
 * const query = get(nest, 'foo.bar', { gen: true })
 *
 * for (let step of query) {
 *   // iterates twice:
 *   // 1: step === { bar: 'baz' }
 *   // 2: step === 'baz'
 * }
 */
const get = (host, path, opt = {}) => {
  if (host === undefined || path === undefined) throw Error('Bad args')
  if (typeof path === 'string') {
    path = path.match(opt.match instanceof RegExp
      ? opt.match
      : /[^.[\]]+/g)
  }
  if (!(path instanceof Array)) throw Error('Bad path')
  const query = search(host, path, opt)
  if (opt.gen === true) return query
  let result
  for (let response of query) result = response
  return result
}

module.exports = get
