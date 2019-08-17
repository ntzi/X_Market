'use strict'

/**
 * Returns true only if value falls within range.
 *
 * @param {number} t - Number being tested.
 * @param {number} l - Lower bound.
 * @param {number} u - Upper bound.
 * @returns {boolean} True if number falls within range, false if not.
 * @example
 * // returns true
 * inRange(0, -1, 1)
 * @example
 * // returns false
 * inRange(-1, 0, 1)
 */
const inRange = (t, l, u) => t > l && t < u
/**
 * Returns the difference of a number and the current date in ms as years from the current date.
 *
 * @param {number} target - Number to subtract from.
 * @returns {number} Years until given time in ms.
 * @example
 * // returns years until unix epoch
 * yrDist(0)
 * @example
 * // returns 1
 * yrDist(Date.now() + 31536000000)
 */
const yrDist = target => (target - Date.now()) / +'31536e6'
/**
 * Returns the given number only if it falls within a given range in years from the current date.
 *
 * @param {number} target - Number being tested.
 * @param {number} back   - Years before current date as lower bound.
 * @param {number} fwd    - Years after current date as upper bound.
 * @returns {(number|boolean)} Number falls within range.
 * @example
 * // returns current time in ms
 * bound(Date.now(), 0.5, 0.5)
 * @example
 * // returns false
 * bound(Date.now() * 1000, 0.5, 0.5)
 */
const bound = (target, back, fwd) => (
  inRange(yrDist(target), -back, fwd) && target
)
/**
 * Returns time in ms if number itself, seconds equivalent, or microseconds equivalent falls within a given range in years from the current date.
 *
 * @param   {number} target - Number being tested.
 * @param   {number} back   - Years before current date as lower bound.
 * @param   {number} fwd    - Years after current date as upper bound.
 * @param   {rangedDate~exclude} exclude - Specifies range exclusions, if any.
 * @returns {(number|boolean)} Converted ms or false if outside range.
 * @example
 * // returns current time in ms
 * check(Date.now(), 0.5, 0.5, {})
 * @example
 * // returns current time in ms
 * check(Date.now() / 1000, 0.5, 0.5, {})
 * @example
 * // returns current time in ms
 * check(Date.now() * 1000, 0.5, 0.5, {})
 * @example
 * // returns false
 * check(Date.now() - 100000000000, 0.5, 0.5, {})
 * @example
 * // returns current time in ms - 100000000000
 * check(Date.now() - 100000000000, 5, 0.5, {})
 * @example
 * // returns false
 * check(Date.now(), 0.5, 0.5, { ms: true })
 * @example
 * // returns current time in ms
 * check(Date.now(), 0.5, 0.5, { s: true, us: true })
 * @example
 * // returns false
 * check(Date.now() / 1000, 0.5, 0.5, { s: true })
 * @example
 * // returns current time in ms
 * check(Date.now() / 1000, 0.5, 0.5, { ms: true, us: true })
 * @example
 * // returns false
 * check(Date.now() * 1000, 0.5, 0.5, { us: true })
 * @example
 * // returns current time in ms
 * check(Date.now() * 1000, 0.5, 0.5, { ms: true, s: true })
 * @example
 * // returns false
 * check(Date.now(), 0.5, 0.5, { ms: true, s: true , us: true })
 */
const check = (target, back, fwd, exclude) => isFinite(target) && (
  (!(exclude.ms === true) && bound(target, back, fwd))
  || (!(exclude.s === true) && bound(target * 1000, back, fwd))
  || (!(exclude.us === true) && bound(target / 1000, back, fwd))
)

/**
 * Exclude milliseconds, seconds, or microseconds as possibilities for range matching.
 *
 * @typedef  {rangedDate~exclude}
 * @type     {Object}
 * @property {boolean} [ms] - Exclude milliseconds.
 * @property {boolean} [s]  - Exclude seconds.
 * @property {boolean} [us] - Exclude microseconds.
 */

/**
 * Converts a given string, number, or Date object to the number of milliseconds since the Unix epoch, provided that it can be recognized as millisecond, second, or microsecond time within a specified range from the current date.
 *
 * @module rangedDate
 * @param {(Date|number|string)} data - Data to attempt to recognize as valid date.
 * @param   {number}  [back=0.5] - Years before current date as lower bound.
 * @param   {number}  [fwd=0.5]  - Years after current date as upper bound.
 * @param   {rangedDate~exclude} [exclude={}] - Specifies range exclusions, if any.
 * @returns {(number|boolean)} Converted time in ms or false if outside range.
 * @example
 * // returns current time in ms
 * rangedDate(new Date())
 * @example
 * // returns current time in ms
 * rangedDate(String(new Date()))
 * @example
 * // returns current time in ms
 * rangedDate(Date.now())
 * @example
 * // returns current time in ms
 * rangedDate(String(Date.now()))
 * @example
 * // returns current time in ms
 * rangedDate(Date.now() / 1000)
 * @example
 * // returns current time in ms
 * rangedDate(Date.now() * 1000)
 * @example
 * // returns false
 * rangedDate(Date.now() - 10000, 0.0000001, 0.0000001)
 * @example
 * // returns current time in ms - 10000
 * rangedDate(Date.now() - 10000, 0.000001, 0.000001)
 * @example
 * // returns false
 * rangedDate(10)
 * @example
 * // returns 10
 * const yrSince1970 = new Date().getUTCFullYear() - 1970
 * rangedDate(10, yrSince1970 + 2)
 * @example
 * // returns false
 * rangedDate(Date.now() + 100000000000)
 * @example
 * // returns current time in ms + 100000000000
 * rangedDate(Date.now() + 100000000000, 0.1, 5)
 * @example
 * // returns -946771200000
 * const yrSince1940 = new Date().getUTCFullYear() - 1940
 * rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2))
 * @example
 * // returns false
 * rangedDate(Date.now(), 0.5, 0.5, { ms: true })
 * @example
 * // returns current time in ms
 * rangedDate(Date.now(), 0.5, 0.5, { s: true, us: true })
 * @example
 * // returns false
 * rangedDate(Date.now() / 1000, 0.5, 0.5, { s: true })
 * @example
 * // returns current time in ms
 * rangedDate(Date.now() / 1000, 0.5, 0.5, { ms: true, us: true })
 * @example
 * // returns false
 * rangedDate(Date.now() * 1000, 0.5, 0.5, { us: true })
 * @example
 * // returns current time in ms
 * rangedDate(Date.now() * 1000, 0.5, 0.5, { ms: true, s: true })
 * @example
 * // returns false
 * rangedDate(Date.now(), 0.5, 0.5, { ms: true, s: true, us: true })
 * @example
 * // returns current time in ms
 * rangedDate(new Date(), 0.5, 0.5, { ms: true, s: true, us: true })
 * @example
 * // returns false
 * rangedDate(String(new Date()), 0.5, 0.5, { ms: true, s: true, us: true })
 */
const rangedDate = (data, back = 0.5, fwd = 0.5, exclude = {}) => {
  if (data instanceof Date) return data.valueOf()
  if (typeof data === 'number') return check(data, back, fwd, exclude)
  return (
    check(Date.parse(data), back, fwd, exclude)
    || check(+data, back, fwd, exclude)
  )
}

module.exports = rangedDate
