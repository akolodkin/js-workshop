# Assignment 12: Factory Pattern

## Difficulty: Medium

## Learning Objectives

- Understand the Factory creational pattern
- Decouple object creation from usage
- Implement registration-based factories
- Use factories for extensible architecture

## The Problem

Instead of creating objects directly with `new`, a factory centralizes creation logic. This allows for:

- Easy switching between implementations
- Dynamic type selection at runtime
- Simplified object creation with complex setup

```javascript
// Without factory: tight coupling
const logger = new FileLogger("/var/log/app.log");

// With factory: loose coupling
const logger = LoggerFactory.create("file", { path: "/var/log/app.log" });
```

## Requirements

### Part 1: Simple Factory

Create a `ShapeFactory` that creates different shapes:

```javascript
const circle = ShapeFactory.create("circle", { radius: 5 });
const rectangle = ShapeFactory.create("rectangle", { width: 10, height: 5 });
```

### Part 2: Registration Factory

Create a `Factory` class where types can be registered dynamically:

```javascript
const factory = new Factory();
factory.register("user", User);
factory.register("admin", AdminUser);

const user = factory.create("user", { name: "Alice" });
const admin = factory.create("admin", { name: "Bob" });
```

### Part 3: Factory with Validation (Bonus)

Add optional validation for constructor arguments:

```javascript
factory.register("user", User, {
  required: ["name", "email"],
  validate: (args) => args.age >= 18,
});
```

## Examples

```javascript
// Shape Factory
class Circle {
  constructor({ radius }) {
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
}

const ShapeFactory = {
  create(type, options) {
    switch (type) {
      case "circle":
        return new Circle(options);
      case "rectangle":
        return new Rectangle(options);
      default:
        throw new Error(`Unknown shape: ${type}`);
    }
  },
};

// Registration Factory
const factory = new Factory();

factory.register("circle", Circle);
factory.register("rectangle", Rectangle);

const shape = factory.create("circle", { radius: 10 });
console.log(shape.area()); // ~314.16

// Get registered types
factory.getTypes(); // ['circle', 'rectangle']

// Check if type exists
factory.has("circle"); // true
```

## Hints

1. Use a Map or object to store registered types
2. The `create` method looks up the type and calls `new`
3. Spread options into constructor: `new Class(options)`
4. Throw helpful errors for unknown types

## When to Use Factory

**Good use cases:**

- Creating objects based on configuration
- Plugin systems
- Dependency injection containers
- Testing (easy to mock)

**Consider alternatives when:**

- Only one implementation exists
- Creation logic is simple

## Resources

- [Refactoring Guru: Factory](https://refactoring.guru/design-patterns/factory-method)
- [JavaScript Design Patterns](https://www.patterns.dev/posts/factory-pattern)
