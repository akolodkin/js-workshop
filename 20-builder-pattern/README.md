# Assignment 20: Builder Pattern

## Difficulty: Medium

## Learning Objectives

- Understand the Builder creational pattern
- Implement fluent interfaces (method chaining)
- Construct complex objects step by step
- Separate object construction from representation

## The Problem

When objects have many optional parameters, constructors become unwieldy:

```javascript
// Without builder: confusing constructor
const user = new User(
  "Alice",
  30,
  "alice@example.com",
  true,
  false,
  "admin",
  null,
  "2024-01-01",
);

// With builder: clear and readable
const user = new UserBuilder()
  .setName("Alice")
  .setAge(30)
  .setEmail("alice@example.com")
  .setActive(true)
  .setRole("admin")
  .build();
```

## Requirements

### Builder Class

Create a builder with:

- Setter methods for each property
- Method chaining (return `this`)
- A `build()` method that creates the final object
- Optional validation in `build()`

### Implement: QueryBuilder

```javascript
const query = new QueryBuilder()
  .select("name", "email")
  .from("users")
  .where("age", ">", 18)
  .where("active", "=", true)
  .orderBy("name", "ASC")
  .limit(10)
  .build();

// Returns: "SELECT name, email FROM users WHERE age > 18 AND active = true ORDER BY name ASC LIMIT 10"
```

### Implement: HTMLBuilder

```javascript
const html = new HTMLBuilder()
  .tag("div")
  .id("container")
  .class("wrapper", "main")
  .attr("data-page", "home")
  .content("Hello World")
  .build();

// Returns: <div id="container" class="wrapper main" data-page="home">Hello World</div>
```

### Implement: ConfigBuilder (Bonus)

```javascript
const config = new ConfigBuilder()
  .setEnvironment("production")
  .setDatabase({ host: "localhost", port: 5432 })
  .enableFeature("caching")
  .enableFeature("logging")
  .setLogLevel("error")
  .build();
```

## Examples

```javascript
// Simple user builder
class UserBuilder {
  constructor() {
    this.user = {};
  }

  setName(name) {
    this.user.name = name;
    return this; // Method chaining
  }

  setEmail(email) {
    this.user.email = email;
    return this;
  }

  setAge(age) {
    this.user.age = age;
    return this;
  }

  build() {
    // Validation
    if (!this.user.name) throw new Error("Name is required");
    return { ...this.user };
  }
}

const user = new UserBuilder()
  .setName("Alice")
  .setEmail("alice@example.com")
  .setAge(30)
  .build();

// Director pattern (optional)
class UserDirector {
  static createAdmin(builder) {
    return builder
      .setRole("admin")
      .setPermissions(["read", "write", "delete"])
      .build();
  }

  static createGuest(builder) {
    return builder.setRole("guest").setPermissions(["read"]).build();
  }
}
```

## Hints

1. Store accumulated state in the builder
2. Each setter returns `this` for chaining
3. `build()` creates and returns the final object
4. Consider adding a `reset()` method
5. Validate in `build()` before creating object

## Resources

- [Refactoring Guru: Builder](https://refactoring.guru/design-patterns/builder)
- [JavaScript Design Patterns](https://www.patterns.dev/posts/builder-pattern)
