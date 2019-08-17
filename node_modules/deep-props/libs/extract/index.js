/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/deep-props.extract|GitHub}
 */

/** @namespace deep-props.extract */

'use strict'

/**
 * Custom dataset for use as a <a href="#~Container">Container</a>. May be accessed via valid customizer functions.
 *
 * @typedef {*} deep-props.extract~Custom
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
 * @typedef {(string|deep-props.extract~Container)} deep-props.extract~Key
 */

/**
 * Container object used as a target for child property extraction.
 *
 * @typedef {(Object|Array|Map|WeakMap|Set|WeakSet|deep-props.extract~Custom)} deep-props.extract~Container
 */

/**
 * A non-primitive <a href="#~Container">Container</a> which represents the root of a given path.
 *
 * @typedef {deep-props.extract~Container} deep-props.extract~Host
 */

/**
 * Generator object which yields stepwise operation results.
 *
 * @typedef {Object} deep-props.extract~ResultGenerator
 */

/**
 * An Array of Arrays with Key at index 0 and property descriptors object at index 1.
 * <ul><li>Equivalent to the result of <code>Object.entries(Object.getOwnPropertyDescriptors(Target))</code>
 * <li> Only relevant property descriptors should be added.</ul>
 *
 * @typedef {Array} deep-props.extract~DescriptorEntries
 * @example
 * [
 *   [
 *     'foo',
 *     {
 *       value: 'bar',
 *       writable: true,
 *       enumerable: true,
 *       configurable: true
 *     }
 *   ]
 * ]
 */

/**
 * Function supplied in Options that handles Target objects and returns a descriptor matrix of any children within a Custom container. Returns undefined if not applicable.
 *
 * @typedef {Function} deep-props.extract~PropsCustomizer
 * @param   {deep-props.extract~Container} container - Container to analyze for additional children.
 * @returns {deep-props.extract~DescriptorEntries} Array of arrays of keys and property descriptor objects.
 * @example
 * target => {
 *   if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *     // Mapping the output of Object.entries to a DescriptorEntries array.
 *     return Object.entries(
 *       new Int8Array(target)
 *     ).map(entry => (
 *       [
 *         entry[0], { value: entry[1] }
 *       ]
 *     ))
 *   }
 * }
 */

/**
 * The result of the Object permissions tests for a Container object.
 *
 * @typedef  {Object}  deep-props.extract~Permissions
 * @property {boolean} parentIsFrozen     - Result of Object.isFrozen(Container)
 * @property {boolean} parentIsSealed     - Result of Object.isSealed(Container)
 * @property {boolean} parentIsExtensible - Result of Object.isExtensible(Container)
 */

/**
 * Describes the location of a previously encountered target.
 *
 * @typedef  {Object} deep-props.extract~Ref
 * @property {deep-props.extract~Host}   [host] - If Host is different than the supplied Host, it will be specified.
 * @property {deep-props.extract~Key[]}  path   - Path of previously encountered target.
 * @example
 * { path: [ 'foo', 'bar' ] }
 * @example
 * { host: { foo: 'bar' }, path: [ 'baz', 'beh' ] }
 */

/**
 * Description of the properties found for a given value during the search,
 *
 * @typedef  {Object}  deep-props.extract~Prop
 * @property {deep-props.extract~Key} key - Key used on the parent (Container) object to retrieve the value.
 * @property {*}       [value]        - Value described at the Prop's location (if any). In cases of a previously discovered reference (circular or otherwise), value will be replaced with a ref property (unless opt.showRefValues is true).
 * @property {boolean} [writable]     - 'Writable' property descriptor of the value.
 * @property {boolean} [enumerable]   - 'Enumerable' property descriptor of the value.
 * @property {boolean} [configurable] - 'Configurable' property descriptor of the value.
 * @property {boolean} [parentIsFrozen]     - Frozen status of the parent object.
 * @property {boolean} [parentIsSealed]     - Sealed status of the parent object.
 * @property {boolean} [parentIsExtensible] - Extensible status of the parent object.
 * @example
 * {
 *   key: 'foo',
 *   value: 'bar',
 *   writable: true,
 *   enumerable: true,
 *   configurable: true,
 *   parentIsFrozen: false,
 *   parentIsSealed: false,
 *   parentIsExtensible: true
 * }
 */

/**
 * Description of a given level of the chain. Transformed Prop Object with location attched.
 *
 * @typedef  {Object}  deep-props.extract~PropAt
 * @memberof deep-props.extract
 * @property {deep-props.extract~Host} [host] - When a non-primitive key has been encountered, a separate chain will be created with that key. Items on that chain will be labeled with a 'host' property to specify which host the path applies to. PropAt Objects lacking a 'host' property imply that the path applies to the initially supplied Host.
 * @property {deep-props.extract~Key[]} path - Describes the steps taken from the Host in order to reach the Prop's value.
 * @property {*}       [value]        - Value described at the Prop's location (if any). In cases of a previously discovered reference (circular or otherwise), value will be replaced with a ref property (unless opt.showRefValues is true).
 * @property {boolean} [writable]     - 'Writable' property descriptor of the value.
 * @property {boolean} [enumerable]   - 'Enumerable' property descriptor of the value.
 * @property {boolean} [configurable] - 'Configurable' property descriptor of the value.
 * @property {boolean} [parentIsFrozen]     - Frozen status of the parent object.
 * @property {boolean} [parentIsSealed]     - Sealed status of the parent object.
 * @property {boolean} [parentIsExtensible] - Extensible status of the parent object.
 * @property {deep-props.extract~Ref} [ref] - If the value strictly equals a previously discovered Container, the path and Host (if applicable) of that Container will be provided.
 * @example
 * {
 *   path: [ 'foo', 'bar', 'baz', 'beh' ],
 *   value: 'qux',
 *   writable: true,
 *   enumerable: true,
 *   configurable: true,
 *   parentIsFrozen: false,
 *   parentIsSealed: false,
 *   parentIsExtensible: true
 * }
 */

/**
 * Execution-wide settings supplied to the module.
 * Modifies types of data attached to results.
 * Modifies types of children to extract.
 *
 * @typedef  {Object}  deep-props.extract~Options
 * @property {boolean} [inherited]        - Whether or not to search for inherited properties. Attaches these keys behind a '__proto__' key.
 * @property {boolean} [own=true]         - Whether or not to search for own properties. Defaults to true.
 * @property {boolean} [nonEnumerable]    - Whether or not to search for and return non-enumerable properties.
 * @property {boolean} [permissions]      - Whether or not to attach Permissions to results.
 * @property {boolean} [descriptors]      - Whether or not to attach property descriptors other than 'value' to results.
 * @property {boolean} [stepwise]         - Whether or not to yield a PropAt object at every step down the chain.
 * @property {boolean} [includeRefValues] - Whether or not to attach a value to Props with Refs attached.
 * @property {boolean} [gen]              - Whether or not to return a generator instead of executing the entire search.
 * @property {boolean} [full]             - If true, replaces undefined Options with maximum search settings (All options except for propsCustomizer will be set to true). User supplied options supercede any changes here.
 * @property {deep-props.extract~PropsCustomizer} [propsCustomizer] - Function used for custom extraction of PropEntries from a Target.
 * @example
 * {
 *   inherited: true,
 *   own: true,
 *   nonEnumerable: true,
 *   permissions: true,
 *   descriptors: true,
 *   stepwise: true,
 *   includeRefValues: true,
 *   gen: true,
 *   full: true,
 *   propsCustomizer: target => {
 *     if (target instanceof ArrayBuffer && target.byteLength === 16) {
 *       return Object.entries(
 *         new Int8Array(target)
 *       ).map(entry => (
 *         [
 *           entry[0], { value: entry[1] }
 *         ]
 *       ))
 *     }
 *   }
 * }
 */

/**
 * Determines if x is a JS primitive.
 * Used to determine if a value should be unpacked.
 *
 * @memberof deep-props.extract
 * @param   {*}       x - Test value.
 * @returns {boolean} True if primitive, false if not.
 * @example
 * // returns true
 *
 * isPrimitive('foo')
 * @example
 * // returns false
 *
 * isPrimitive({})
 */
const isPrimitive = x => (
  typeof x === 'string' ||
  typeof x === 'number' ||
  typeof x === 'boolean' ||
  typeof x === 'symbol' ||
  x === null ||
  x === undefined
)

/**
 * Gets the frozen, sealed, and extensible statuses of an object.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Container}   container - Target container.
 * @returns {deep-props.extract~Permissions} Result of the three Object permissions tests.
 * @example
 * // returns {
 * //   parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true
 * // }
 *
 * getObjectPermissions({})
 */
const getObjectPermissions = container => ({
  parentIsFrozen: Object.isFrozen(container),
  parentIsSealed: Object.isSealed(container),
  parentIsExtensible: Object.isExtensible(container)
})

/**
 * Converts list of descriptors to prop Array.
 * Attaches information based on options.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~DescriptorEntries} descriptorEntries - Matrix of keys and descriptors.
 * @param   {deep-props.extract~Permissions} permissions - Permissions list.
 * @param   {deep-props.extract~Options}     opt         - Execution settings.
 * @returns {deep-props.extract~Prop[]}      Converted 1D Array of properties.
 * @example
 *
 * // returns [
 * //   {
 * //     key: 'foo',
 * //     value: 'bar',
 * //     writable: true,
 * //     enumerable: true,
 * //     configurable: true,
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * genPropsFromDescriptorEntries(
 *   [
 *     [
 *       'foo',
 *       {
 *         value: 'bar',
 *         writable: true,
 *         enumerable: true,
 *         configurable: true
 *       }
 *     ]
 *   ],
 *   { parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true },
 *   { descriptors: true, permissions: true }
 * )
 */
const genPropsFromDescriptorEntries = (descriptorEntries, permissions, opt) => (
  descriptorEntries.map(
    entry => {
      let prop
      if (opt.descriptors === true) {
        prop = { key: entry[0], ...entry[1] }
      } else {
        prop = { key: entry[0] }
        if (entry[1].hasOwnProperty('value')) {
          prop.value = entry[1].value
        }
      }
      if (opt.permissions === true) {
        prop = { ...prop, ...permissions }
      }
      return prop
    }
  )
)

/**
 * Generates a prop for a target object's prototype.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Container}   container   - Target container.
 * @param   {deep-props.extract~Permissions} permissions - Object permissions.
 * @param   {deep-props.extract~Options}     opt         - Execution settings.
 * @returns {deep-props.extract~Prop[]}      Array with single entry of '__proto__' key and value.
 * @example
 * // returns [
 * //   {
 * //     key: '__proto__',
 * //     value: {},
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * genProtoProp(
 *   {},
 *   { parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true },
 *   { descriptors: true, permissions: true }
 * )
 */
const genProtoProp = (container, permissions, opt) => (
  genPropsFromDescriptorEntries(
    [[
      '__proto__',
      { value: Object.getPrototypeOf(container) }
    ]],
    permissions,
    opt
  )
)

/**
 * Generates a list of non-inherited properties of a target object.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Container}   container   - Target container.
 * @param   {deep-props.extract~Permissions} permissions - Object permissions.
 * @param   {deep-props.extract~Options}     opt         - Execution settings.
 * @returns {deep-props.extract~Prop[]}      Array of associated properties.
 * @example
 * // returns [
 * //   {
 * //     key: 'foo',
 * //     value: 'bar',
 * //     writable: true,
 * //     enumerable: true,
 * //     configurable: true,
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   },
 * //   {
 * //     key: 'baz',
 * //     value: 'beh',
 * //     writable: true,
 * //     enumerable: true,
 * //     configurable: true,
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * getOwnProps(
 *   { foo: 'bar', baz: 'beh' },
 *   { parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true },
 *   { descriptors: true, permissions: true }
 * )
 */
const getOwnProps = (container, permissions, opt) => (
  genPropsFromDescriptorEntries(
    Object.entries(
      Object.getOwnPropertyDescriptors(
        container
      )
    ).filter(
      entry => {
        if (
          opt.nonEnumerable === true ||
          entry[1].enumerable !== false
        ) {
          return entry
        }
      }
    ),
    permissions,
    opt
  )
)

/**
 * Gets a list of properties within a target Map.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Container}   container   - Target container.
 * @param   {deep-props.extract~Permissions} permissions - Object permissions.
 * @param   {deep-props.extract~Options} opt - Execution settings.
 * @returns {deep-props.extract~Prop[]}  Array of associated properties.
 * @example
 * // returns [
 * //   {
 * //     key: 'foo',
 * //     value: 'bar',
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   },
 * //   {
 * //     key: { baz: 'beh' },
 * //     value: { qux: 'quz' },
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * getMapProps(
 *   new Map([
 *     [ 'foo', 'bar' ],
 *     [ { baz: 'beh' }, { qux: 'quz' } ]
 *   ]),
 *   { parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true },
 *   { descriptors: true, permissions: true }
 * )
 */
const getMapProps = (container, permissions, opt) => (
  genPropsFromDescriptorEntries(
    Object.entries(
      Object.getOwnPropertyDescriptors(
        [...container]
      )
    ).map(
      entry => {
        if (entry[0] !== 'length') {
          return [
            entry[1].value[0],
            { value: entry[1].value[1] }
          ]
        }
      }
    ).filter(x => x !== undefined),
    permissions,
    opt
  )
)

/**
 * Gets a list of properties within a target Set.
 * Uses insertion order as keys.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Container}   container   - Target container.
 * @param   {deep-props.extract~Permissions} permissions - Object permissions.
 * @param   {deep-props.extract~Options}     opt - Execution settings.
 * @returns {deep-props.extract~Prop[]}      Array of associated properties.
 * @example
 * // returns [
 * //   {
 * //     key: '0',
 * //     value: 1,
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   },
 * //   {
 * //     key: '1',
 * //     value: 2,
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * getSetProps(
 *   new Set([ 1, 2 ]),
 *   { parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true },
 *   { descriptors: true, permissions: true }
 * )
 */
const getSetProps = (container, permissions, opt) => (
  genPropsFromDescriptorEntries(
    Object.entries(
      Object.getOwnPropertyDescriptors(
        [...container]
      )
    ).map(
      entry => {
        if (entry[0] !== 'length') {
          return [
            entry[0],
            { value: entry[1].value }
          ]
        }
      }
    ).filter(x => x !== undefined),
    permissions,
    opt
  )
)

/**
 * Gets any special object properties.
 * If propsCustomizer is supplied, and returns a defined value from target, then getSpecialProps will return this value.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Container}   container   - Target container.
 * @param   {deep-props.extract~Permissions} permissions - Object permissions.
 * @param   {deep-props.extract~Options} opt - Execution settings.
 * @returns {deep-props.extract~Prop[]}  Array of associated properties.
 * @example
 * const map = new Map(
 *   [
 *     [ 'foo', 'bar' ]
 *   ]
 * )
 *
 * // returns [
 * //   {
 * //     key: 'foo',
 * //     value: 'bar',
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * getSpecialProps(
 *   map,
 *   { parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true },
 *   { descriptors: true, permissions: true }
 * )
 * @example
 * const s = new Set(
 *   [ 'baz', 'beh' ]
 * )
 *
 * // returns [
 * //   {
 * //     key: '0',
 * //     value: 'baz',
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   },
 * //   {
 * //     key: '1',
 * //     value: 'beh',
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * getSpecialProps(
 *   s,
 *   { parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true },
 *   { descriptors: true, permissions: true }
 * )
 * @example
 * class NonNativeDataStructure {
 *   constructor(arr) {
 *     const values = arr
 *     this.get = i => values[i]
 *     this.getValues = () => values
 *     this.push = x => values.push(x)
 *   }
 * }
 *
 * const custom = new NonNativeDataStructure([ 'qux', 'quz' ])
 *
 * const propsCustomizer = container => {
 *   if (container instanceof NonNativeDataStructure) {
 *     return (
 *       Object.entries(
 *         Object.getOwnPropertyDescriptors(
 *           target.getValues()
 *         )
 *       ).filter(
 *         entry => entry[1].enumerable !== false
 *       )
 *     )
 *   }
 * }
 *
 * // returns [
 * //   {
 * //     key: '0',
 * //     value: 'qux',
 * //     writable: true,
 * //     enumerable: true,
 * //     configurable: true,
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   },
 * //   {
 * //     key: '1',
 * //     value: 'quz',
 * //     writable: true,
 * //     enumerable: true,
 * //     configurable: true,
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * getSpecialProps(
 *   custom,
 *   { parentIsFrozen: false, parentIsSealed: false, parentIsExtensible: true },
 *   { descriptors: true, permissions: true, propsCustomizer }
 * )
 */
const getSpecialProps = (container, permissions, opt) => {
  let customProps
  if (opt.propsCustomizer instanceof Function) {
    customProps = opt.propsCustomizer(container)
  }
  if (customProps !== undefined) {
    return (
      genPropsFromDescriptorEntries(
        customProps, permissions, opt
      )
    )
  }
  if (container instanceof Map) return getMapProps(container, permissions, opt)
  if (container instanceof Set) return getSetProps(container, permissions, opt)
  return []
}

/**
 * Returns all inherited properties, own properties, special properties, and object permissions.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Container} container - Target container.
 * @param   {deep-props.extract~Options}   opt - Execution settings.
 * @returns {deep-props.extract~Prop[]}    Array of associated properties.
 * @example
 * const map = new Map(
 *   [
 *     [ 'foo', 'bar' ]
 *   ]
 * )
 *
 * // returns [
 * //   {
 * //     key: '__proto__',
 * //     value: Map {},
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   },
 * //   {
 * //     key: 'foo',
 * //     value: 'bar',
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * getProps(map, { inherited: true, descriptors: true, permissions: true })
 */
const getProps = (container, opt) => {
  if (isPrimitive(container)) return []
  const permissions = (
    opt.permissions === true
      ? getObjectPermissions(container)
      : {}
  )
  const proto = (
    opt.inherited === true
      ? genProtoProp(container, permissions, opt)
      : []
  )
  const ownProps = (
    opt.own === true
      ? getOwnProps(container, permissions, opt)
      : []
  )
  return [
    ...proto,
    ...ownProps,
    ...getSpecialProps(container, permissions, opt)
  ]
}

/**
 * Assigns reference points to a list of properties.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Prop[]} props      - Prop array.
 * @param   {deep-props.extract~Host}   [host]     - Host object.
 * @param   {deep-props.extract~Key[]}  [path=[]]  - Path to current prop array.
 * @returns {deep-props.extract~PropAt[]} Array of location-tagged Props.
 * @example
 * let props = [
 *   {
 *     key: 'foo',
 *     value: 'bar',
 *     parentIsFrozen: false,
 *     parentIsSealed: false,
 *     parentIsExtensible: true
 *   },
 *   {
 *     key: { baz: 'beh' },
 *     value: { qux: 'quz' },
 *     parentIsFrozen: false,
 *     parentIsSealed: false,
 *     parentIsExtensible: true
 *   }
 * ]
 *
 * // returns [
 * //   {
 * //     path: ['foo'],
 * //     value: 'bar',
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   },
 * //   {
 * //     path: [{ foo: 'bar' }],
 * //     value: { qux: 'quz' },
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * assignReferencePoints(props)
 * @example
 * props = [
 *   {
 *     key: 'qux',
 *     value: 'quz',
 *     parentIsFrozen: false,
 *     parentIsSealed: false,
 *     parentIsExtensible: true
 *   }
 * ]
 *
 * // returns [
 * //   {
 * //     host: { foo: 'bar' },
 * //     path: ['qux'],
 * //     value: 'quz',
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   }
 * // ]
 *
 * assignReferencePoints(props, { foo: 'bar' })
 */
const assignReferencePoints = (props, host, path = []) => (
  props.map(prop => {
    const cur = {}
    if (host !== undefined) cur.host = host
    cur.path = path.concat(prop.key)
    for (let key in prop) {
      if (key !== 'key') cur[key] = prop[key]
    }
    return cur
  })
)

/**
 * Non-recursively searches through the host object by queueing its children.
 * Attaches information based on options.
 * Determines whether child should be unpacked by checking if it is a primitive.
 * Keeps track of all object references encountered to avoid circular looping.
 * Explores object keys via creation of a new Host.
 *
 * @generator
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Host} host - Host container supplied to module.
 * @param   {deep-props.extract~Options} opt - Execution settings.
 * @yields  {deep-props.extract~PropAt} Current Prop with attached location.
 * @returns {undefined} Undefined if done.
 * @example
 * // Searching through an Object
 *
 * const data = {
 *   foo: {
 *     bar: {
 *       baz: {
 *         beh: 'qux'
 *       }
 *     }
 *   }
 * }
 *
 * const query = search(data, { own: true })
 * for (let step of query) {
 *   // iterates once:
 *   // 1: step === { path: [ 'foo', 'bar', 'baz', 'beh' ], value: 'qux' }
 * }
 * @example
 * // Searching through an multi-nested Object
 *
 * const data = {
 *   foo: {
 *     beh: {
 *       lorem: 'ex'
 *     }
 *   },
 *   bar: {
 *     qux: {
 *       ipsum: 'igne'
 *     }
 *   },
 *   baz: {
 *     quz: {
 *       dolor: 'vita'
 *     }
 *   }
 * }
 *
 * const query = search(data, { own: true })
 * for (let step of query) {
 *   // iterates 3 times:
 *   // 1: step === { path: [ 'foo', 'beh', 'lorem' ], value: 'ex'   }
 *   // 2: step === { path: [ 'bar', 'qux', 'ipsum' ], value: 'igne' }
 *   // 3: step === { path: [ 'baz', 'quz', 'dolor' ], value: 'vita' }
 * }
 */
const search = function * (host, opt) {
  if (isPrimitive(host)) return []
  const hostsExtracted = new WeakSet()
  const visited = new WeakMap()
  let Q = assignReferencePoints(getProps(host, opt))
  hostsExtracted.add(host)
  visited.set(host, { path: [] })
  while (Q.length > 0) {
    const cur = Q.shift()
    if (visited.has(cur.value)) {
      const ref = { ...cur, ref: visited.get(cur.value) }
      if (opt.includeRefValues !== true) delete ref.value
      yield ref
      continue
    }
    if (opt.stepwise === true) {
      yield cur
    }
    cur.path.forEach(step => {
      if (!isPrimitive(step) && !hostsExtracted.has(step)) {
        Q = assignReferencePoints(
          getProps(step, opt), step
        ).concat(Q)
        hostsExtracted.add(step)
        visited.set(step, { host: step, path: [] })
      }
    })
    if (!isPrimitive(cur.value)) {
      const toQ = assignReferencePoints(
        getProps(cur.value, opt), cur.host, cur.path
      )
      if (cur.hasOwnProperty('host')) {
        visited.set(cur.value, { host: cur.host, path: cur.path })
      } else {
        visited.set(cur.value, { path: cur.path })
      }
      if (toQ.length === 0 && opt.stepwise !== true) {
        yield cur
      }
      Q = toQ.concat(Q)
    } else if (opt.stepwise !== true) {
      yield cur
    }
  }
}

/**
 * Merges supplied options with defaults.
 *
 * @memberof deep-props.extract
 * @param   {deep-props.extract~Options} opt - Options passed to the module.
 * @returns {deep-props.extract~Options} Execution settings.
 * @example
 * // returns { own: true }
 *
 * mergeOptions({})
 * @example
 * // returns { own: false, inherited: true }
 *
 * mergeOptions({ own: false, inherited: true })
 * @example
 * // returns {
 * //   inherited: true,
 * //   own: true,
 * //   nonEnumerable: true,
 * //   permissions: true,
 * //   descriptors: true,
 * //   stepwise: true,
 * //   includeRefValues: true,
 * //   full: true
 * // }
 *
 * mergeOptions({ full: true })
 * @example
 * // returns {
 * //   inherited: true,
 * //   own: true,
 * //   nonEnumerable: true,
 * //   permissions: true,
 * //   descriptors: false,
 * //   stepwise: true,
 * //   includeRefValues: true,
 * //   full: true
 * // }
 *
 * mergeOptions({ full: true, descriptors: false })
 */
const mergeOptions = opt => {
  const defaultOptions = {
    own: true
  }

  const fullOptions = {
    inherited: true,
    own: true,
    nonEnumerable: true,
    permissions: true,
    descriptors: true,
    stepwise: true,
    includeRefValues: true
  }

  if (opt.full === true) {
    return {
      ...defaultOptions,
      ...fullOptions,
      ...opt
    }
  } else {
    return {
      ...defaultOptions,
      ...opt
    }
  }
}

/**
 * Non-recursively creates an array of deep paths and properties within an object. Optionally unpacks prototypes and non-enumerable property descriptors. Supports Objects, Arrays, Maps, and Sets.
 *
 * @module   extract
 * @param    {deep-props.extract~Host}    host     - Object to unpack.
 * @param    {deep-props.extract~Options} [opt={}] - Execution settings.
 * @return   {(deep-props.extract~PropAt[]|deep-props.extract~ResultGenerator)} Array of paths and values or references. Returns Search generator if opt.gen is true.
 * @example
 * // Simple nested object
 *
 * const data = {
 *   foo: {
 *     bar: {
 *       baz: {
 *         beh: 'qux'
 *       }
 *     }
 *   }
 * }
 *
 * // returns [{ path: [ 'foo', 'bar', 'baz', 'beh' ], val: 'qux' }]
 *
 * extract(data)
 * @example
 * // Multi-nested object
 *
 * const data = {
 *   foo: {
 *     beh: {
 *       lorem: 'ex'
 *     }
 *   },
 *   bar: {
 *     qux: {
 *       ipsum: 'igne'
 *     }
 *   },
 *   baz: {
 *     quz: {
 *       dolor: 'vita'
 *     }
 *   }
 * }
 *
 * // returns [
 * //   { path: [ 'foo', 'beh', 'lorem' ], val: 'ex'   },
 * //   { path: [ 'bar', 'qux', 'ipsum' ], val: 'igne' },
 * //   { path: [ 'baz', 'quz', 'dolor' ], val: 'vita' }
 * // ]
 *
 * extract(data)
 * @example
 * // Unrooting of Object Keys
 *
 * const data = new Map().set(
 *   { foo: 'bar' }, new Map().set(
 *     { baz: 'beh' }, new Map().set(
 *       { qux: 'quz' }, new Map().set(
 *         { quux: 'quuz' }, 'thud'
 *       )
 *     )
 *   )
 * )
 *
 * // returns:
 * // [
 * //   {
 * //     path: [ { foo: 'bar' }, { baz: 'beh' }, { qux: 'quz' }, { quux: 'quuz' } ],
 * //     value: 'thud'
 * //   },
 * //   { host: { quux: 'quuz' }, path: ['quux'], value: 'quuz' },
 * //   { host: { qux: 'quz' }, path: ['qux'], value: 'quz' },
 * //   { host: { baz: 'beh' }, path: ['baz'], value: 'beh' },
 * //   { host: { foo: 'bar' }, path: ['foo'], value: 'bar' }
 * // ]
 *
 * extract(data)
 * @example
 * // Extraction from complicated nests
 *
 * const data = {
 *   foo: [
 *     new Map().set(
 *       'bar', new Set([
 *         {
 *           baz: {
 *             qux: {
 *               quz: [
 *                 'quux',
 *                 'quuz'
 *               ]
 *             }
 *           }
 *         },
 *         {
 *           lorem: {
 *             ipsum: 'dolor'
 *           }
 *         }
 *       ])
 *     )
 *   ]
 * }
 *
 * // returns:
 * // [
 * //   {
 * //     path: [ 'foo', '0', 'bar', '0', 'baz', 'qux', 'quz', '0' ],
 * //     value: 'quux' },
 * //   { path: [ 'foo', '0', 'bar', '0', 'baz', 'qux', 'quz', '1' ],
 * //     value: 'quuz' },
 * //   { path: [ 'foo', '0', 'bar', '1', 'lorem', 'ipsum' ],
 * //     value: 'dolor'
 * //   }
 * // ]
 *
 * extract(data)
 * @example
 * // Verbose Options
 *
 * const data = { foo: { bar: 'baz' } }
 * Object.freeze(data.foo)
 *
 * // returns:
 * // [
 * //   {
 * //     path: ['foo'],
 * //     value: { bar: 'baz' },
 * //     writable: true,
 * //     enumerable: true,
 * //     configurable: true,
 * //     parentIsFrozen: false,
 * //     parentIsSealed: false,
 * //     parentIsExtensible: true
 * //   },
 * //   {
 * //     path: [ 'foo', 'bar' ],
 * //     value: 'baz',
 * //     writable: false,
 * //     enumerable: true,
 * //     configurable: false,
 * //     parentIsFrozen: true,
 * //     parentIsSealed: true,
 * //     parentIsExtensible: false
 * //   }
 * // ]
 *
 * extract(data, { stepwise: true, descriptors: true, permissions: true })
 */
const extract = (host, opt = {}) => {
  opt = mergeOptions(opt)
  if (opt.gen === true) return search(host, opt)
  const tree = []
  for (let res of search(host, opt)) tree.push(res)
  return tree
}

module.exports = extract
