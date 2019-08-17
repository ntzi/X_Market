# ranged-date

[![NPM](https://nodei.co/npm/ranged-date.png)](https://nodei.co/npm/ranged-date/)

Converts a given string, number, or Date object to the number of milliseconds since the Unix epoch, provided that it can be recognized as millisecond, second, or microsecond time within a specified range from the current date.

Milliseconds, seconds, or microseconds may be excluded as possibilities for range matching.

Useful for:
* Parsing timestampted data from external APIs.
* Integrating collections containing mixed timestamp formats.

**Warning:**
* *Although it is unlikely for a given number to fall within the default range (one year), it is advisable to both restrict the range and use exclusions wherever possible, in order to avoid incorrectly classifying and converting values that were not intended to be timestamps.*

## Getting Started

### Prerequisites

Node.JS version 6.0.0 or above.

### Installing

```
npm i ranged-date
```

### Testing

The following commands will test the package for errors.

```
cd /path/to/node_modules/ranged-date
npm test
```

### Deployment

```js
const rangedDate = require('ranged-date')
```

### Usage

```js
const sec    = ~~(Date.now() / 1000) // Test unixtime
const ms     = sec * 1000            // Test millisecond time
const us     = ms * 1000             // Test microsecond time
const past   = sec - 31536000        // Unixtime one year prior
const future = sec + 31536000        // Unixtime one year after

console.log(rangedDate(sec))                        // converted time in ms
console.log(rangedDate(ms))                         // time in ms
console.log(rangedDate(us))                         // converted time in ms
console.log(rangedDate(String(sec)))                // converted time in ms
console.log(rangedDate(past))                       // false
console.log(rangedDate(past, 2))                    // converted time in ms
console.log(rangedDate(future))                     // false
console.log(rangedDate(future, null, 2))            // converted time in ms
console.log(rangedDate(sec, 0.5, 0.5, { s: true })) // false
console.log(rangedDate(ms, 0.5, 0.5, { ms: true })) // false
console.log(rangedDate(us, 0.5, 0.5, { us: true })) // false
console.log(
  rangedDate(new Date(ms), 0.5, 0.5, { ms: true })
)                                                   // converted time in ms
```

## Documentation

### rangedDate ⇒ <code>number</code> \| <code>boolean</code>

| Param | Type | Attributes | Default | Description |
| --- | --- | --- | --- | --- |
| data | <code>Date</code> \| <code>number</code> \| <code>string</code> |  |  | Data to attempt to recognize as valid date. |
| back | <code>number</code> | <code>&#60;optional&#62;</code> | <code>0.5</code> | Years before current date as lower bound. |
| fwd | <code>number</code> | <code>&#60;optional&#62;</code> | <code>0.5</code> | Years after current date as upper bound. |
| exclude | <code><a href="#rangedDate~exclude">rangedDate~exclude</a></code> | <code>&#60;optional&#62;</code> | <code>{}</code> | Specifies range exclusions, if any. |

**Returns**: <code>number</code> \| <code>boolean</code> - Converted ms or false if outside range.  

### <a name="rangedDate~exclude"></a> <code>rangedDate~exclude</code>
Settings for exclusion of milliseconds, seconds, or microseconds as possibilities for range matching.

**Properties**

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| ms | <code>boolean</code> | <code>&#60;optional&#62;</code> | Exclude milliseconds. |
| s | <code>boolean</code> | <code>&#60;optional&#62;</code> | Exclude seconds. |
| us | <code>boolean</code> | <code>&#60;optional&#62;</code> | Exclude microseconds. |

### See
* [API Docs](https://github.com/jpcx/ranged-date/blob/master/docs/API.md)
* [Global Docs](https://github.com/jpcx/ranged-date/blob/master/docs/global.md)

## Versioning

Versioning using [SemVer](http://semver.org/). For available versions, see the [tags on this repository](https://github.com/jpcx/ranged-date/tags).

## Author

* **Justin Collier** - [jpcx](https://github.com/jpcx)

## License

This project is licensed under the ISC License - see the [LICENSE.md](https://github.com/jpcx/ranged-date/blob/master/LICENSE.md) file for details
