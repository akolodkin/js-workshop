const {
  Container,
  createChildContainer,
  Logger,
  Database,
  UserRepository,
  UserService,
} = require("./index");

describe("Container", () => {
  let container;

  beforeEach(() => {
    container = new Container();
  });

  describe("register and resolve", () => {
    test("should register and resolve a simple class", () => {
      container.register("logger", Logger);
      const logger = container.resolve("logger");
      expect(logger).toBeInstanceOf(Logger);
    });

    test("should resolve with dependencies", () => {
      container.register("logger", Logger);
      container.register("db", Database, ["logger"]);

      const db = container.resolve("db");
      expect(db).toBeInstanceOf(Database);
      expect(db.logger).toBeInstanceOf(Logger);
    });

    test("should resolve deep dependency chain", () => {
      container.register("logger", Logger);
      container.register("db", Database, ["logger"]);
      container.register("userRepo", UserRepository, ["db", "logger"]);
      container.register("userService", UserService, ["userRepo", "logger"]);

      const service = container.resolve("userService");
      expect(service).toBeInstanceOf(UserService);
      expect(service.userRepository).toBeInstanceOf(UserRepository);
      expect(service.userRepository.database).toBeInstanceOf(Database);
    });

    test("should throw for unregistered service", () => {
      expect(() => container.resolve("unknown")).toThrow();
    });
  });

  describe("singleton", () => {
    test("should create new instance each time by default", () => {
      container.register("logger", Logger);
      const logger1 = container.resolve("logger");
      const logger2 = container.resolve("logger");
      expect(logger1).not.toBe(logger2);
    });

    test("should return same instance for singleton", () => {
      container.register("logger", Logger, [], { singleton: true });
      const logger1 = container.resolve("logger");
      const logger2 = container.resolve("logger");
      expect(logger1).toBe(logger2);
    });

    test("singleton should persist state", () => {
      container.register("logger", Logger, [], { singleton: true });
      const logger1 = container.resolve("logger");
      logger1.log("test");

      const logger2 = container.resolve("logger");
      expect(logger2.getLogs()).toEqual(["test"]);
    });
  });

  describe("registerInstance", () => {
    test("should register and return existing instance", () => {
      const config = { apiKey: "secret", debug: true };
      container.registerInstance("config", config);

      const resolved = container.resolve("config");
      expect(resolved).toBe(config);
      expect(resolved.apiKey).toBe("secret");
    });

    test("should always return same instance", () => {
      const obj = { value: 1 };
      container.registerInstance("obj", obj);

      const resolved1 = container.resolve("obj");
      const resolved2 = container.resolve("obj");
      expect(resolved1).toBe(resolved2);
      expect(resolved1).toBe(obj);
    });
  });

  describe("registerFactory", () => {
    test("should use factory to create instance", () => {
      container.registerFactory("random", () => Math.random());

      const value = container.resolve("random");
      expect(typeof value).toBe("number");
    });

    test("should pass dependencies to factory", () => {
      container.registerInstance("multiplier", 2);
      container.registerFactory("double", (mult) => (x) => x * mult, [
        "multiplier",
      ]);

      const double = container.resolve("double");
      expect(double(5)).toBe(10);
    });

    test("should support singleton factory", () => {
      let callCount = 0;
      container.registerFactory(
        "counter",
        () => {
          callCount++;
          return { count: callCount };
        },
        [],
        { singleton: true },
      );

      container.resolve("counter");
      container.resolve("counter");
      expect(callCount).toBe(1);
    });
  });

  describe("circular dependency detection", () => {
    test("should detect direct circular dependency", () => {
      class A {
        constructor(b) {
          this.b = b;
        }
      }
      class B {
        constructor(a) {
          this.a = a;
        }
      }

      container.register("a", A, ["b"]);
      container.register("b", B, ["a"]);

      expect(() => container.resolve("a")).toThrow(/circular/i);
    });

    test("should detect indirect circular dependency", () => {
      class A {
        constructor(b) {}
      }
      class B {
        constructor(c) {}
      }
      class C {
        constructor(a) {}
      }

      container.register("a", A, ["b"]);
      container.register("b", B, ["c"]);
      container.register("c", C, ["a"]);

      expect(() => container.resolve("a")).toThrow(/circular/i);
    });
  });

  describe("has", () => {
    test("should return true for registered service", () => {
      container.register("logger", Logger);
      expect(container.has("logger")).toBe(true);
    });

    test("should return false for unregistered service", () => {
      expect(container.has("unknown")).toBe(false);
    });
  });

  describe("unregister", () => {
    test("should remove registered service", () => {
      container.register("logger", Logger);
      const result = container.unregister("logger");
      expect(result).toBe(true);
      expect(container.has("logger")).toBe(false);
    });

    test("should return false for unregistered service", () => {
      expect(container.unregister("unknown")).toBe(false);
    });
  });

  describe("clear", () => {
    test("should remove all registrations", () => {
      container.register("logger", Logger);
      container.register("db", Database, ["logger"]);
      container.clear();
      expect(container.getRegistrations().length).toBe(0);
    });
  });

  describe("getRegistrations", () => {
    test("should return all registered names", () => {
      container.register("logger", Logger);
      container.register("db", Database, ["logger"]);
      container.registerInstance("config", {});

      const names = container.getRegistrations();
      expect(names).toContain("logger");
      expect(names).toContain("db");
      expect(names).toContain("config");
    });
  });
});

describe("Real-world scenario", () => {
  test("should wire up application services", () => {
    const container = new Container();

    // Configure
    container.registerInstance("config", {
      dbName: "testdb",
      logLevel: "debug",
    });

    container.register("logger", Logger, [], { singleton: true });
    container.register("db", Database, ["logger"]);
    container.register("userRepo", UserRepository, ["db", "logger"]);
    container.register("userService", UserService, ["userRepo", "logger"]);

    // Resolve and use
    const userService = container.resolve("userService");
    userService.getUser(1);

    // Verify shared logger captured all logs
    const logger = container.resolve("logger");
    const logs = logger.getLogs();

    expect(logs).toContain("Getting user 1");
    expect(logs).toContain("Finding user 1");
    expect(logs.some((l) => l.includes("Query"))).toBe(true);
  });
});
