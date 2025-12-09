const {
  Singleton,
  createSingleton,
  DatabaseConnection,
  AppConfig,
} = require("./index");

describe("Singleton", () => {
  beforeEach(() => {
    Singleton.resetInstance();
  });

  test("getInstance should return an instance", () => {
    const instance = Singleton.getInstance();
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(Singleton);
  });

  test("getInstance should always return the same instance", () => {
    const instance1 = Singleton.getInstance();
    const instance2 = Singleton.getInstance();
    expect(instance1).toBe(instance2);
  });

  test("multiple calls should return identical reference", () => {
    const instances = [];
    for (let i = 0; i < 10; i++) {
      instances.push(Singleton.getInstance());
    }
    expect(instances.every((inst) => inst === instances[0])).toBe(true);
  });

  test("resetInstance should allow new instance creation", () => {
    const instance1 = Singleton.getInstance();
    Singleton.resetInstance();
    const instance2 = Singleton.getInstance();
    expect(instance1).not.toBe(instance2);
  });
});

describe("createSingleton", () => {
  test("should create a singleton from any class", () => {
    class MyClass {
      constructor() {
        this.id = Math.random();
      }
    }

    const SingletonMyClass = createSingleton(MyClass);
    const instance1 = SingletonMyClass.getInstance();
    const instance2 = SingletonMyClass.getInstance();

    expect(instance1).toBe(instance2);
    expect(instance1.id).toBe(instance2.id);
  });

  test("should pass constructor arguments on first call", () => {
    class Greeter {
      constructor(name) {
        this.name = name;
      }
      greet() {
        return `Hello, ${this.name}!`;
      }
    }

    const SingletonGreeter = createSingleton(Greeter);
    const instance = SingletonGreeter.getInstance("Alice");

    expect(instance.greet()).toBe("Hello, Alice!");
  });

  test("should ignore arguments on subsequent calls", () => {
    class Config {
      constructor(env) {
        this.env = env;
      }
    }

    const SingletonConfig = createSingleton(Config);
    const instance1 = SingletonConfig.getInstance("production");
    const instance2 = SingletonConfig.getInstance("development");

    expect(instance1.env).toBe("production");
    expect(instance2.env).toBe("production"); // Same as first
    expect(instance1).toBe(instance2);
  });

  test("should support resetInstance", () => {
    class Counter {
      constructor() {
        this.count = 0;
      }
      increment() {
        return ++this.count;
      }
    }

    const SingletonCounter = createSingleton(Counter);
    const counter1 = SingletonCounter.getInstance();
    counter1.increment();
    counter1.increment();
    expect(counter1.count).toBe(2);

    SingletonCounter.resetInstance();
    const counter2 = SingletonCounter.getInstance();
    expect(counter2.count).toBe(0);
    expect(counter1).not.toBe(counter2);
  });

  test("different singletons should be independent", () => {
    class A {
      constructor() {
        this.type = "A";
      }
    }
    class B {
      constructor() {
        this.type = "B";
      }
    }

    const SingletonA = createSingleton(A);
    const SingletonB = createSingleton(B);

    const instanceA = SingletonA.getInstance();
    const instanceB = SingletonB.getInstance();

    expect(instanceA.type).toBe("A");
    expect(instanceB.type).toBe("B");
    expect(instanceA).not.toBe(instanceB);
  });
});

describe("DatabaseConnection Singleton", () => {
  let SingletonDB;

  beforeEach(() => {
    SingletonDB = createSingleton(DatabaseConnection);
    SingletonDB.resetInstance();
  });

  test("should return same database instance", () => {
    const db1 = SingletonDB.getInstance("mongodb://localhost");
    const db2 = SingletonDB.getInstance("different-string"); // ignored

    expect(db1).toBe(db2);
    expect(db1.connectionString).toBe("mongodb://localhost");
  });

  test("should maintain connection state across references", () => {
    const db1 = SingletonDB.getInstance("mongodb://localhost");
    db1.connect();

    const db2 = SingletonDB.getInstance();
    expect(db2.connected).toBe(true);
  });
});

describe("AppConfig Singleton", () => {
  let SingletonConfig;

  beforeEach(() => {
    SingletonConfig = createSingleton(AppConfig);
    SingletonConfig.resetInstance();
  });

  test("should share configuration across references", () => {
    const config1 = SingletonConfig.getInstance();
    config1.set("apiUrl", "https://api.example.com");
    config1.set("debug", true);

    const config2 = SingletonConfig.getInstance();
    expect(config2.get("apiUrl")).toBe("https://api.example.com");
    expect(config2.get("debug")).toBe(true);
  });

  test("should persist settings", () => {
    const config = SingletonConfig.getInstance();
    config.set("theme", "dark");

    const sameConfig = SingletonConfig.getInstance();
    expect(sameConfig.get("theme")).toBe("dark");
  });
});
