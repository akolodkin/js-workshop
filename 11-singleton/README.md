# Assignment 11: Singleton Pattern

## Difficulty: Easy

## Learning Objectives

- Understand the Singleton creational pattern
- Implement lazy initialization
- Work with closures for private state
- Learn when to use (and avoid) singletons

## The Problem

A Singleton ensures a class has only one instance and provides a global point of access to it. This is useful for shared resources like configuration, logging, or database connections.

```javascript
const config1 = Config.getInstance();
const config2 = Config.getInstance();
console.log(config1 === config2); // true - same instance!
```

## Requirements

### Part 1: Basic Singleton Class

Create a `Singleton` class that:

1. **Returns the same instance** every time `getInstance()` is called
2. **Supports lazy initialization** - instance created on first access
3. **Prevents direct instantiation** with `new Singleton()`

### Part 2: createSingleton Factory

Create a `createSingleton(Class)` function that converts any class into a singleton:

```javascript
class Logger {
  log(msg) {
    console.log(msg);
  }
}

const SingletonLogger = createSingleton(Logger);
const logger1 = SingletonLogger.getInstance();
const logger2 = SingletonLogger.getInstance();
// logger1 === logger2
```

### Part 3: Resettable Singleton (Optional)

Add ability to reset the singleton for testing:

```javascript
Singleton.resetInstance(); // Clears the cached instance
```

## Examples

```javascript
// Basic Singleton
class Database {
  static instance = null;

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query(sql) {
    /* ... */
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true

// Factory approach
const SingletonDB = createSingleton(Database);
const db = SingletonDB.getInstance();

// With arguments (passed only on first creation)
class Config {
  constructor(env) {
    this.env = env;
  }
}

const SingletonConfig = createSingleton(Config);
const config = SingletonConfig.getInstance("production");
```

## Hints

1. Use a static property to store the instance
2. Use closure to hide the instance in factory approach
3. Consider using `Object.freeze()` to prevent modifications
4. For preventing `new`, throw in constructor or use closure

## When to Use Singletons

**Good use cases:**

- Configuration objects
- Logging services
- Connection pools
- Caches

**Avoid when:**

- It introduces global state (hard to test)
- Classes need different configurations
- Dependency injection is a better fit

## Resources

- [Refactoring Guru: Singleton](https://refactoring.guru/design-patterns/singleton)
- [JavaScript Design Patterns](https://www.patterns.dev/posts/singleton-pattern)
