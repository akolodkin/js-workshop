# Assignment 04: Memoization

## Difficulty: Medium

## Learning Objectives

- Understand memoization as an optimization technique
- Work with closures for private cache storage
- Learn cache key generation strategies
- Handle cache invalidation and limits

## The Problem

Memoization caches function results based on arguments. When called again with the same arguments, it returns the cached result instead of recomputing.

```javascript
// Without memoization: calls API every time
fetchUser(1); // API call
fetchUser(1); // API call again!

// With memoization: caches result
const memoizedFetch = memoize(fetchUser);
memoizedFetch(1); // API call
memoizedFetch(1); // Returns cached result
```

## Requirements

### Part 1: Basic `memoize(fn)`

Create a memoization wrapper that:

1. **Caches results** based on arguments
2. **Returns cached values** for repeated calls
3. **Handles multiple arguments** correctly
4. **Works with primitive arguments** (strings, numbers, booleans)

### Part 2: `memoize(fn, options)`

Extend with optional configuration:

```javascript
const options = {
  maxSize: 100,           // Maximum cache entries
  ttl: 5000,              // Time-to-live in ms
  keyGenerator: (args) => // Custom cache key function
};
```

Requirements:

- **maxSize**: Evict oldest entries when limit reached (FIFO)
- **ttl**: Entries expire after specified milliseconds
- **keyGenerator**: Custom function to generate cache keys

### Part 3: Cache Control

Add methods to the memoized function:

- `memoizedFn.cache.clear()` - Clear all cached values
- `memoizedFn.cache.delete(key)` - Delete specific entry
- `memoizedFn.cache.has(key)` - Check if key exists
- `memoizedFn.cache.size` - Get current cache size

## Examples

```javascript
// Basic usage
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoFib = memoize(fibonacci);
memoFib(40); // Fast after first call!

// Multiple arguments
function add(a, b) {
  return a + b;
}
const memoAdd = memoize(add);
memoAdd(1, 2); // Computed: 3
memoAdd(1, 2); // Cached: 3
memoAdd(2, 1); // Computed: 3 (different args)

// With options
const memoized = memoize(expensiveOperation, {
  maxSize: 50,
  ttl: 60000, // 1 minute
  keyGenerator: (args) => args.map(JSON.stringify).join("|"),
});

// Cache control
memoized.cache.clear();
memoized.cache.delete("1|2");
console.log(memoized.cache.size); // 0
```

## Hints

1. Use `Map` for the cache (preserves insertion order for FIFO)
2. Default key: `JSON.stringify(args)` or `args.join(',')`
3. Store timestamps with values for TTL: `{ value, timestamp }`
4. Check expiration before returning cached values

## Resources

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Wikipedia: Memoization](https://en.wikipedia.org/wiki/Memoization)
