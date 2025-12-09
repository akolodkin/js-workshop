const {
  ShapeFactory,
  Factory,
  Circle,
  Rectangle,
  Triangle,
  ConsoleLogger,
  FileLogger,
  JsonLogger,
} = require("./index");

describe("ShapeFactory", () => {
  test("should create a circle", () => {
    const circle = ShapeFactory.create("circle", { radius: 5 });
    expect(circle).toBeInstanceOf(Circle);
    expect(circle.radius).toBe(5);
    expect(circle.area()).toBeCloseTo(Math.PI * 25);
  });

  test("should create a rectangle", () => {
    const rect = ShapeFactory.create("rectangle", { width: 10, height: 5 });
    expect(rect).toBeInstanceOf(Rectangle);
    expect(rect.width).toBe(10);
    expect(rect.height).toBe(5);
    expect(rect.area()).toBe(50);
  });

  test("should create a triangle", () => {
    const tri = ShapeFactory.create("triangle", { base: 6, height: 4 });
    expect(tri).toBeInstanceOf(Triangle);
    expect(tri.area()).toBe(12);
  });

  test("should throw error for unknown type", () => {
    expect(() => ShapeFactory.create("hexagon", {})).toThrow();
  });
});

describe("Factory", () => {
  let factory;

  beforeEach(() => {
    factory = new Factory();
  });

  describe("registration", () => {
    test("should register a type", () => {
      factory.register("circle", Circle);
      expect(factory.has("circle")).toBe(true);
    });

    test("should register multiple types", () => {
      factory.register("circle", Circle);
      factory.register("rectangle", Rectangle);
      expect(factory.has("circle")).toBe(true);
      expect(factory.has("rectangle")).toBe(true);
    });

    test("should unregister a type", () => {
      factory.register("circle", Circle);
      const result = factory.unregister("circle");
      expect(result).toBe(true);
      expect(factory.has("circle")).toBe(false);
    });

    test("unregister should return false for unknown type", () => {
      expect(factory.unregister("unknown")).toBe(false);
    });

    test("should get all registered types", () => {
      factory.register("circle", Circle);
      factory.register("rectangle", Rectangle);
      const types = factory.getTypes();
      expect(types).toContain("circle");
      expect(types).toContain("rectangle");
      expect(types.length).toBe(2);
    });

    test("should clear all types", () => {
      factory.register("circle", Circle);
      factory.register("rectangle", Rectangle);
      factory.clear();
      expect(factory.getTypes().length).toBe(0);
    });
  });

  describe("creation", () => {
    test("should create registered type", () => {
      factory.register("circle", Circle);
      const circle = factory.create("circle", { radius: 10 });
      expect(circle).toBeInstanceOf(Circle);
      expect(circle.radius).toBe(10);
    });

    test("should throw for unregistered type", () => {
      expect(() => factory.create("unknown", {})).toThrow();
    });

    test("should pass arguments to constructor", () => {
      factory.register("rectangle", Rectangle);
      const rect = factory.create("rectangle", { width: 5, height: 3 });
      expect(rect.width).toBe(5);
      expect(rect.height).toBe(3);
    });

    test("should handle empty arguments", () => {
      class Simple {
        constructor(opts = {}) {
          this.value = opts.value || "default";
        }
      }
      factory.register("simple", Simple);
      const instance = factory.create("simple");
      expect(instance.value).toBe("default");
    });
  });

  describe("validation", () => {
    test("should validate required fields", () => {
      class User {
        constructor({ name, email }) {
          this.name = name;
          this.email = email;
        }
      }

      factory.register("user", User, {
        required: ["name", "email"],
      });

      expect(() => factory.create("user", { name: "Alice" })).toThrow();

      const user = factory.create("user", {
        name: "Alice",
        email: "alice@example.com",
      });
      expect(user.name).toBe("Alice");
    });

    test("should run custom validation", () => {
      class Adult {
        constructor({ name, age }) {
          this.name = name;
          this.age = age;
        }
      }

      factory.register("adult", Adult, {
        validate: (args) => args.age >= 18,
      });

      expect(() => factory.create("adult", { name: "Kid", age: 10 })).toThrow();

      const adult = factory.create("adult", { name: "Alice", age: 25 });
      expect(adult.age).toBe(25);
    });
  });
});

describe("Logger Factory Example", () => {
  let factory;

  beforeEach(() => {
    factory = new Factory();
    factory.register("console", ConsoleLogger);
    factory.register("file", FileLogger);
    factory.register("json", JsonLogger);
  });

  test("should create console logger", () => {
    const logger = factory.create("console", { prefix: "[APP] " });
    expect(logger).toBeInstanceOf(ConsoleLogger);
    expect(logger.prefix).toBe("[APP] ");
  });

  test("should create file logger", () => {
    const logger = factory.create("file", { path: "/var/log/app.log" });
    expect(logger).toBeInstanceOf(FileLogger);
    expect(logger.path).toBe("/var/log/app.log");
  });

  test("should create json logger", () => {
    const logger = factory.create("json", { includeTimestamp: false });
    expect(logger).toBeInstanceOf(JsonLogger);
    logger.log("test");
    expect(logger.getEntries()[0].timestamp).toBeUndefined();
  });

  test("file logger should accumulate logs", () => {
    const logger = factory.create("file", { path: "/tmp/test.log" });
    logger.log("message 1");
    logger.log("message 2");
    logger.error("error 1");
    expect(logger.getLogs().length).toBe(3);
  });
});
