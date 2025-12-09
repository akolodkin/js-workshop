# Assignment 13: Decorator Pattern

## Difficulty: Medium

## Learning Objectives

- Understand the Decorator structural pattern
- Add behavior to objects dynamically
- Work with function composition
- Implement class and function decorators

## The Problem

Decorators add new behavior to objects without modifying their original code. They wrap the original and extend functionality.

```javascript
// Without decorator: modifying original
class Logger {
  log(msg) {
    console.log(new Date().toISOString(), msg); // Mixing concerns
  }
}

// With decorator: separation of concerns
const logger = new Logger();
const timedLogger = withTimestamp(logger);
timedLogger.log("Hello"); // [2024-01-01T12:00:00Z] Hello
```

## Requirements

### Part 1: Function Decorators

Create decorator functions that wrap other functions:

#### `withLogging(fn)`

Logs function calls with arguments and return value.

```javascript
const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
loggedAdd(2, 3);
// Log: "Calling add with args: [2, 3]"
// Log: "add returned: 5"
// Returns: 5
```

#### `withTiming(fn)`

Measures and logs execution time.

```javascript
const slow = () => {
  /* slow operation */
};
const timedSlow = withTiming(slow);
timedSlow();
// Log: "slow took 150ms"
```

#### `withRetry(fn, maxRetries)`

Retries on failure.

```javascript
const unreliable = withRetry(fetchData, 3);
```

### Part 2: Object Decorators

Create functions that decorate objects:

#### `withCache(obj, methodName)`

Caches method results.

```javascript
const api = { fetchUser: (id) => /* expensive call */ };
const cachedApi = withCache(api, 'fetchUser');
cachedApi.fetchUser(1); // Fetches
cachedApi.fetchUser(1); // Returns cached
```

### Part 3: Composable Decorators

Allow decorators to be composed:

```javascript
const fn = compose(withLogging, withTiming, withRetry(3))(originalFn);
```

## Examples

```javascript
// Function decorator
function withLogging(fn) {
  return function (...args) {
    console.log(`Calling ${fn.name} with:`, args);
    const result = fn.apply(this, args);
    console.log(`${fn.name} returned:`, result);
    return result;
  };
}

// Object method decorator
function withValidation(obj, methodName, validator) {
  const original = obj[methodName];
  obj[methodName] = function (...args) {
    if (!validator(...args)) {
      throw new Error("Validation failed");
    }
    return original.apply(this, args);
  };
  return obj;
}

// Composing decorators
const enhance = compose(withLogging, withTiming);
const enhancedFn = enhance(myFunction);
```

## Hints

1. Decorators return new functions that wrap the original
2. Use `apply` or `call` to preserve `this` context
3. Use spread operator for arguments: `fn(...args)`
4. For composition, pipe decorators right-to-left

## Real-World Uses

- Logging and monitoring
- Caching
- Authentication/authorization
- Rate limiting
- Validation
- Error handling

## Resources

- [Refactoring Guru: Decorator](https://refactoring.guru/design-patterns/decorator)
- [TC39 Decorators Proposal](https://github.com/tc39/proposal-decorators)
