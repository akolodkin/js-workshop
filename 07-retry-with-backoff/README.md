# Assignment 07: Retry with Backoff

## Difficulty: Medium

## Learning Objectives

- Implement error recovery patterns
- Understand exponential backoff algorithm
- Work with async/await and error handling
- Build resilient network request utilities

## The Problem

Network requests can fail temporarily. Instead of failing immediately, we should retry with increasing delays (backoff) to give the server time to recover.

```javascript
// Without retry: fails on first error
await fetch("/api/data"); // Error: Server busy

// With retry: automatically retries with backoff
await retry(() => fetch("/api/data"), { maxRetries: 3 });
// Attempt 1: fails, wait 1s
// Attempt 2: fails, wait 2s
// Attempt 3: success!
```

## Requirements

### `retry(fn, options)`

Create a retry function that:

1. **Executes `fn`** and returns its result on success
2. **Retries on failure** up to `maxRetries` times
3. **Waits between retries** with configurable backoff
4. **Supports different backoff strategies**:
   - Fixed: Same delay every time
   - Linear: Delay increases by fixed amount
   - Exponential: Delay doubles each time
5. **Supports jitter** to prevent thundering herd

### Options

```javascript
{
  maxRetries: 3,           // Maximum retry attempts (default: 3)
  initialDelay: 1000,      // First retry delay in ms (default: 1000)
  maxDelay: 30000,         // Maximum delay cap (default: 30000)
  backoff: 'exponential',  // 'fixed' | 'linear' | 'exponential'
  jitter: true,            // Add randomness to delay (default: false)
  retryIf: (error) => true // Function to decide if should retry
  onRetry: (error, attempt) => {} // Called before each retry
}
```

### Backoff Calculations

- **Fixed**: `delay = initialDelay`
- **Linear**: `delay = initialDelay * attempt`
- **Exponential**: `delay = initialDelay * 2^(attempt-1)`

With jitter, add random 0-25% to the delay.

## Examples

```javascript
// Basic usage
const data = await retry(() => fetch("/api/data").then((r) => r.json()), {
  maxRetries: 3,
});

// Exponential backoff
await retry(fetchData, {
  maxRetries: 5,
  initialDelay: 1000,
  backoff: "exponential",
});
// Delays: 1s, 2s, 4s, 8s, 16s

// Custom retry condition
await retry(fetchData, {
  retryIf: (error) => error.status === 429 || error.status >= 500,
});

// With callback
await retry(fetchData, {
  onRetry: (error, attempt) => {
    console.log(`Attempt ${attempt} failed: ${error.message}`);
  },
});

// With jitter
await retry(fetchData, {
  backoff: "exponential",
  jitter: true,
});
// Delays: ~1.1s, ~2.3s, ~4.0s (randomized)
```

## Hints

1. Use a loop or recursion for retry logic
2. Calculate delay based on attempt number
3. Use `Math.min()` to cap at maxDelay
4. For jitter: `delay * (1 + Math.random() * 0.25)`
5. Rethrow the last error if all retries fail

## Resources

- [AWS: Exponential Backoff](https://docs.aws.amazon.com/general/latest/gr/api-retries.html)
- [MDN: async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
