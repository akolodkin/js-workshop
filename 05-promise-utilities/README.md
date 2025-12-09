# Assignment 05: Promise Utilities

## Difficulty: Hard

## Learning Objectives

- Deep understanding of Promise internals
- Implement Promise static methods from scratch
- Handle various Promise states and edge cases
- Work with iterables and async operations

## The Problem

JavaScript's Promise has several useful static methods: `Promise.all()`, `Promise.race()`, `Promise.allSettled()`, and `Promise.any()`. Your task is to implement these from scratch.

## Requirements

### 1. `promiseAll(promises)`

Wait for all promises to resolve, or reject if any rejects.

```javascript
promiseAll([promise1, promise2, promise3])
  .then((results) => console.log(results)) // [result1, result2, result3]
  .catch((error) => console.log(error)); // First rejection
```

Requirements:

- Returns a promise that resolves with an array of results
- Results are in the same order as input (not completion order)
- Rejects immediately if any promise rejects
- Handles empty array (resolves with [])
- Handles non-promise values (treats as resolved)

### 2. `promiseRace(promises)`

Return the first promise to settle (resolve or reject).

```javascript
promiseRace([slow, fast, medium]).then((result) => console.log(result)); // Result of 'fast'
```

Requirements:

- Returns result/error of first settled promise
- Handles empty array (never settles - pending forever)
- Handles non-promise values

### 3. `promiseAllSettled(promises)`

Wait for all promises to settle, never rejects.

```javascript
promiseAllSettled([promise1, promise2, promise3]).then((results) =>
  console.log(results),
);
// [
//   { status: 'fulfilled', value: result1 },
//   { status: 'rejected', reason: error2 },
//   { status: 'fulfilled', value: result3 }
// ]
```

Requirements:

- Always resolves (never rejects)
- Returns array of status objects
- Each object has `status` ('fulfilled' or 'rejected')
- Fulfilled: `{ status: 'fulfilled', value }`
- Rejected: `{ status: 'rejected', reason }`

### 4. `promiseAny(promises)`

Return first fulfilled promise, or aggregate error if all reject.

```javascript
promiseAny([rejects1, resolves, rejects2]).then((result) =>
  console.log(result),
); // Result of 'resolves'

promiseAny([rejects1, rejects2]).catch((error) => console.log(error)); // AggregateError
```

Requirements:

- Resolves with first fulfilled value
- Ignores rejections until all reject
- If all reject, reject with `AggregateError`
- Empty array rejects with AggregateError

## Examples

```javascript
// promiseAll
const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
promiseAll(promises).then(console.log); // [1, 2, 3]

// promiseRace
const race = [
  new Promise((r) => setTimeout(() => r("slow"), 100)),
  new Promise((r) => setTimeout(() => r("fast"), 10)),
];
promiseRace(race).then(console.log); // 'fast'

// promiseAllSettled
const mixed = [Promise.resolve("success"), Promise.reject("error")];
promiseAllSettled(mixed).then(console.log);
// [{ status: 'fulfilled', value: 'success' }, { status: 'rejected', reason: 'error' }]

// promiseAny
const any = [
  Promise.reject("fail1"),
  Promise.resolve("success"),
  Promise.reject("fail2"),
];
promiseAny(any).then(console.log); // 'success'
```

## Hints

1. Use `Promise.resolve()` to wrap non-promise values
2. Track completion count to know when all are done
3. For promiseAll, reject immediately on first rejection
4. For promiseAny, track rejection count to know when all failed
5. `AggregateError` takes an array of errors and a message

## Resources

- [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN: Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [MDN: Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN: Promise.any()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
