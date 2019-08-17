## Global Functions

<dl>
<dt><a href="#inRange">inRange(t, l, u)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true only if value falls within range.</p>
</dd>
<dt><a href="#yrDist">yrDist(target)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the difference of a number and the current date in ms as years from the current date.</p>
</dd>
<dt><a href="#bound">bound(target, back, fwd)</a> ⇒ <code>number</code> | <code>boolean</code></dt>
<dd><p>Returns the given number only if it falls within a given range in years from the current date.</p>
</dd>
<dt><a href="#check">check(target, back, fwd, exclude)</a> ⇒ <code>number</code> | <code>boolean</code></dt>
<dd><p>Returns time in ms if number itself, seconds equivalent, or microseconds equivalent falls within a given range in years from the current date.</p>
</dd>
</dl>

<a name="inRange"></a>

### inRange(t, l, u) ⇒ <code>boolean</code>
Returns true only if value falls within range.

| Param | Type | Description |
| --- | --- | --- |
| t | <code>number</code> | Number being tested. |
| l | <code>number</code> | Lower bound. |
| u | <code>number</code> | Upper bound. |

> Source: [index.js](https://github.com/jpcx/ranged-date/blob/master/index.js), [line 17](https://github.com/jpcx/ranged-date/blob/master/index.js#L17)

**Returns**: <code>boolean</code> - True if number falls within range, false if not.  

**Examples**  
```js
// returns true
inRange(0, -1, 1)

// returns false
inRange(-1, 0, 1)
```

<a name="yrDist"></a>

### yrDist(target) ⇒ <code>number</code>
Returns the difference of a number and the current date in ms as years from the current date.

| Param | Type | Description |
| --- | --- | --- |
| target | <code>number</code> | Number to subtract from. |

> Source: [index.js](https://github.com/jpcx/ranged-date/blob/master/index.js), [line 30](https://github.com/jpcx/ranged-date/blob/master/index.js#L30)

**Returns**: <code>number</code> - Years until given time in ms.  

**Examples**  
```js
// returns years until unix epoch
yrDist(0)

// returns 1
yrDist(Date.now() + 31536000000)
```

<a name="bound"></a>

### bound(target, back, fwd) ⇒ <code>number</code> \| <code>boolean</code>
Returns the given number only if it falls within a given range in years from the current date.

| Param | Type | Description |
| --- | --- | --- |
| target | <code>number</code> | Number being tested. |
| back | <code>number</code> | Years before current date as lower bound. |
| fwd | <code>number</code> | Years after current date as upper bound. |

> Source: [index.js](https://github.com/jpcx/ranged-date/blob/master/index.js), [line 45](https://github.com/jpcx/ranged-date/blob/master/index.js#L45)

**Returns**: <code>number</code> \| <code>boolean</code> - Number falls within range.  

**Examples**  
```js
// returns current time in ms
bound(Date.now(), 0.5, 0.5)

// returns false
bound(Date.now() * 1000, 0.5, 0.5)
```

<a name="check"></a>

### check(target, back, fwd, exclude) ⇒ <code>number</code> \| <code>boolean</code>
Returns time in ms if number itself, seconds equivalent, or microseconds equivalent falls within a given range in years from the current date.

| Param | Type | Description |
| --- | --- | --- |
| target | <code>number</code> | Number being tested. |
| back | <code>number</code> | Years before current date as lower bound. |
| fwd | <code>number</code> | Years after current date as upper bound. |
| exclude | <code><a href="https://github.com/jpcx/ranged-date/blob/master/docs/API.md#rangedDate~exclude">rangedDate~exclude</a></code> | Specifies range exclusions, if any. |

> Source: [index.js](https://github.com/jpcx/ranged-date/blob/master/index.js), [line 93](https://github.com/jpcx/ranged-date/blob/master/index.js#L93)

**Returns**: <code>number</code> \| <code>boolean</code> - Converted ms or false if outside range.  

**Examples**  
```js
// returns current time in ms
check(Date.now(), 0.5, 0.5, {})

// returns current time in ms
check(Date.now() / 1000, 0.5, 0.5, {})

// returns current time in ms
check(Date.now() * 1000, 0.5, 0.5, {})

// returns false
check(Date.now() - 100000000000, 0.5, 0.5, {})

// returns current time in ms - 100000000000
check(Date.now() - 100000000000, 5, 0.5, {})

// returns false
check(Date.now(), 0.5, 0.5, { ms: true })

// returns current time in ms
check(Date.now(), 0.5, 0.5, { s: true, us: true })

// returns false
check(Date.now() / 1000, 0.5, 0.5, { s: true })

// returns current time in ms
check(Date.now() / 1000, 0.5, 0.5, { ms: true, us: true })

// returns false
check(Date.now() * 1000, 0.5, 0.5, { us: true })

// returns current time in ms
check(Date.now() * 1000, 0.5, 0.5, { ms: true, s: true })

// returns false
check(Date.now(), 0.5, 0.5, { ms: true, s: true , us: true })
```
