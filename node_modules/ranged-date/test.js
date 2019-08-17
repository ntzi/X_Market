'use strict'

const rangedDate = require('./index.js')

const ANSI_RED   = '\x1b[31m'
const ANSI_GREEN = '\x1b[32m'
const ANSI_RESET = '\x1b[0m'

const now = ~~(Date.now() / 1000) * 1000
const yrSince1970 = new Date(now).getUTCFullYear() - 1970
const yrSince1940 = new Date(now).getUTCFullYear() - 1940

console.log(`Using ${now} as 'now' argument for current date in ms.`)
console.log(`Using ${yrSince1970} as 'yrSince1970' argument for the number of years since 1970.`)
console.log(`Using ${yrSince1940} as 'yrSince1940' argument for the number of years since 1940.`)

console.log('---')

const tests = []

tests.push({
  expects: now,
  results: () => rangedDate(new Date(now))
})
tests.push({
  expects: now,
  results: () => rangedDate(String(new Date(now)))
})
tests.push({
  expects: now,
  results: () => rangedDate(String(now))
})
tests.push({
  expects: now,
  results: () => rangedDate(now)
})
tests.push({
  expects: now,
  results: () => rangedDate(now / 1000)
})
tests.push({
  expects: now,
  results: () => rangedDate(now * 1000)
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.0000001, 0.0000001)
})
tests.push({
  expects: now - 10000,
  results: () => rangedDate(now - 10000, 0.000001, 0.000001)
})
tests.push({
  expects: false,
  results: () => rangedDate(10)
})
tests.push({
  expects: 10,
  results: () => rangedDate(10, yrSince1970 + 2)
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000)
})
tests.push({
  expects: now + 100000000000,
  results: () => rangedDate(now + 100000000000, 0.1, 5)
})
tests.push({
  expects: -946771200000,
  results: () => rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2))
})

// test us exclusions
tests.push({
  expects: now,
  results: () => rangedDate(new Date(now), 0.5, 0.5, { us: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(String(new Date(now)), 0.5, 0.5, { us: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(String(now), 0.5, 0.5, { us: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now, 0.5, 0.5, { us: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now / 1000, 0.5, 0.5, { us: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now * 1000, 0.5, 0.5, { us: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.0000001, 0.0000001, { us: true })
})
tests.push({
  expects: now - 10000,
  results: () => rangedDate(now - 10000, 0.000001, 0.000001, { us: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(10, 0.5, 0.5, { us: true })
})
tests.push({
  expects: 10,
  results: () => rangedDate(10, yrSince1970 + 2, 0.5, { us: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.5, 0.5, { us: true })
})
tests.push({
  expects: now + 100000000000,
  results: () => rangedDate(now + 100000000000, 0.1, 5, { us: true })
})
tests.push({
  expects: -946771200000,
  results: () => rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2), { us: true })
})

// test ms exclusions
tests.push({
  expects: now,
  results: () => rangedDate(new Date(now), 0.5, 0.5, { ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(String(new Date(now)), 0.5, 0.5, { ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(String(now), 0.5, 0.5, { ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now, 0.5, 0.5, { ms: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now / 1000, 0.5, 0.5, { ms: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now * 1000, 0.5, 0.5, { ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.0000001, 0.0000001, { ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.000001, 0.000001, { ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(10, 0.5, 0.5, { ms: true })
})
tests.push({
  expects: 10000,
  results: () => rangedDate(10, yrSince1970 + 2, 0.5, { ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.5, 0.5, { ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.1, 5, { ms: true })
})
tests.push({
  expects: -946771200000,
  results: () => rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2), { ms: true })
})

// test s exclusions
tests.push({
  expects: now,
  results: () => rangedDate(new Date(now), 0.5, 0.5, { s: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(String(new Date(now)), 0.5, 0.5, { s: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(String(now), 0.5, 0.5, { s: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now, 0.5, 0.5, { s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now / 1000, 0.5, 0.5, { s: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now * 1000, 0.5, 0.5, { s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.0000001, 0.0000001, { s: true })
})
tests.push({
  expects: now - 10000,
  results: () => rangedDate(now - 10000, 0.000001, 0.000001, { s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(10, 0.5, 0.5, { s: true })
})
tests.push({
  expects: 10,
  results: () => rangedDate(10, yrSince1970 + 2, 0.5, { s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.5, 0.5, { s: true })
})
tests.push({
  expects: now + 100000000000,
  results: () => rangedDate(now + 100000000000, 0.1, 5, { s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2), { s: true })
})

// test us and ms exclusions
tests.push({
  expects: now,
  results: () => rangedDate(new Date(now), 0.5, 0.5, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(String(new Date(now)), 0.5, 0.5, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(String(now), 0.5, 0.5, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now, 0.5, 0.5, { us: true, ms: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now / 1000, 0.5, 0.5, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now * 1000, 0.5, 0.5, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.0000001, 0.0000001, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.000001, 0.000001, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(10, 0.5, 0.5, { us: true, ms: true })
})
tests.push({
  expects: 10000,
  results: () => rangedDate(10, yrSince1970 + 2, 0.5, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.5, 0.5, { us: true, ms: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.1, 5, { us: true, ms: true })
})
tests.push({
  expects: -946771200000,
  results: () => rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2), { us: true, ms: true })
})

// test us and s exclusions
tests.push({
  expects: now,
  results: () => rangedDate(new Date(now), 0.5, 0.5, { us: true, s: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(String(new Date(now)), 0.5, 0.5, { us: true, s: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(String(now), 0.5, 0.5, { us: true, s: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now, 0.5, 0.5, { us: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now / 1000, 0.5, 0.5, { us: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now * 1000, 0.5, 0.5, { us: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.0000001, 0.0000001, { us: true, s: true })
})
tests.push({
  expects: now - 10000,
  results: () => rangedDate(now - 10000, 0.000001, 0.000001, { us: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(10, 0.5, 0.5, { us: true, s: true })
})
tests.push({
  expects: 10,
  results: () => rangedDate(10, yrSince1970 + 2, 0.5, { us: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.5, 0.5, { us: true, s: true })
})
tests.push({
  expects: now + 100000000000,
  results: () => rangedDate(now + 100000000000, 0.1, 5, { us: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2), { us: true, s: true })
})

// test ms and s exclusions
tests.push({
  expects: now,
  results: () => rangedDate(new Date(now), 0.5, 0.5, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(String(new Date(now)), 0.5, 0.5, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(String(now), 0.5, 0.5, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now, 0.5, 0.5, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now / 1000, 0.5, 0.5, { ms: true, s: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now * 1000, 0.5, 0.5, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.0000001, 0.0000001, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.000001, 0.000001, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(10, 0.5, 0.5, { ms: true, s: true })
})
tests.push({
  expects: 0.01,
  results: () => rangedDate(10, yrSince1970 + 2, 0.5, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.5, 0.5, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.1, 5, { ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2), { ms: true, s: true })
})

// test us, ms, and s exclusions
tests.push({
  expects: now,
  results: () => rangedDate(new Date(now), 0.5, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(String(new Date(now)), 0.5, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(String(now), 0.5, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now, 0.5, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now / 1000, 0.5, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now * 1000, 0.5, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.0000001, 0.0000001, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now - 10000, 0.000001, 0.000001, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(10, 0.5, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(10, yrSince1970 + 2, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.5, 0.5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(now + 100000000000, 0.1, 5, { us: true, ms: true, s: true })
})
tests.push({
  expects: false,
  results: () => rangedDate(-946771200, yrSince1940 + 2, -(yrSince1940 - 2), { us: true, ms: true, s: true })
})

// invalid exclusion tests
tests.push({
  expects: now,
  results: () => rangedDate(now, 0.5, 0.5, { invalid: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now / 1000, 0.5, 0.5, { invalid: true })
})
tests.push({
  expects: now,
  results: () => rangedDate(now * 1000, 0.5, 0.5, { invalid: true })
})

const errors = []
for (let test of tests) {
  test.operation = test.results.toString().replace('() => ', '')
  test.results = test.results()
  console.log('Operation: ' + test.operation)
  if (test.expects !== test.results) {
    console.log('Expected:  ' + ANSI_RED + test.expects + ANSI_RESET)
    console.log('Result:    ' + ANSI_RED + test.results + ANSI_RESET)
    errors.push(test.operation)
  } else {
    console.log('Expected:  ' + test.expects)
    console.log('Result:    ' + test.results)
  }
  console.log('---')
}

if (errors.length > 0) {
  console.log(ANSI_RED, '\n[FAIL]' , ANSI_RESET)
  for (let e of errors) {
    console.log('Bad: ' + e)
  }
} else {
  console.log(ANSI_GREEN, '\n[PASS]', ANSI_RESET)
}

console.log(`\n${tests.length - errors.length} / ${tests.length} tests completed successfully.`)
