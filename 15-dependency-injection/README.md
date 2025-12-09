# Assignment 15: Dependency Injection

## Difficulty: Hard

## Learning Objectives

- Understand Inversion of Control (IoC) principle
- Implement a simple DI container
- Learn about loose coupling and testability
- Work with service registration and resolution

## The Problem

Without DI, classes create their own dependencies:

```javascript
class UserService {
  constructor() {
    this.db = new Database(); // Tight coupling!
    this.logger = new Logger();
  }
}
```

With DI, dependencies are injected:

```javascript
class UserService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }
}

// Configure in container
container.register("db", Database);
container.register("logger", Logger);
container.register("userService", UserService, ["db", "logger"]);

const userService = container.resolve("userService");
```

## Requirements

### Container Class

Create a `Container` class with:

#### `register(name, Class, dependencies = [])`

Register a service with its dependencies.

```javascript
container.register("logger", Logger);
container.register("db", Database, ["logger"]);
container.register("userService", UserService, ["db", "logger"]);
```

#### `registerInstance(name, instance)`

Register an existing instance (singleton).

```javascript
container.registerInstance("config", { apiKey: "xxx" });
```

#### `registerFactory(name, factory, dependencies = [])`

Register a factory function.

```javascript
container.registerFactory(
  "connection",
  (config) => {
    return createConnection(config.connectionString);
  },
  ["config"],
);
```

#### `resolve(name)`

Get an instance, creating if necessary.

```javascript
const service = container.resolve("userService");
```

### Features

1. **Automatic Dependency Resolution**: Dependencies are resolved recursively
2. **Singleton Support**: Option to register as singleton
3. **Circular Dependency Detection**: Throw error for circular deps
4. **Factory Functions**: Support function-based creation

## Examples

```javascript
const container = new Container();

// Simple registration
class Logger {
  log(msg) {
    console.log(msg);
  }
}
container.register("logger", Logger);

// With dependencies
class Database {
  constructor(logger) {
    this.logger = logger;
  }
  query(sql) {
    this.logger.log(`Query: ${sql}`);
    return [];
  }
}
container.register("db", Database, ["logger"]);

// Resolve
const db = container.resolve("db");
db.query("SELECT * FROM users");

// Singleton
container.register("logger", Logger, [], { singleton: true });
const logger1 = container.resolve("logger");
const logger2 = container.resolve("logger");
console.log(logger1 === logger2); // true

// Factory
container.registerFactory("timestamp", () => Date.now());
```

## Hints

1. Use a Map to store registrations
2. Store: `{ Class, dependencies, singleton, instance }`
3. `resolve` should check for cached singleton instance
4. Track resolution stack for circular dependency detection
5. Support both Class and factory function

## Real-World Example

```javascript
// Config
container.registerInstance("config", {
  dbUrl: "mongodb://localhost",
  apiKey: process.env.API_KEY,
});

// Services
container.register("logger", ConsoleLogger, [], { singleton: true });
container.register("db", MongoDatabase, ["config", "logger"]);
container.register("cache", RedisCache, ["config"]);
container.register("userRepo", UserRepository, ["db", "cache"]);
container.register("authService", AuthService, ["userRepo", "config"]);
container.register("userController", UserController, ["authService", "logger"]);

// Usage
const controller = container.resolve("userController");
```

## Resources

- [Martin Fowler: Inversion of Control](https://martinfowler.com/articles/injection.html)
- [InversifyJS](https://inversify.io/) (Full-featured DI for TypeScript)
