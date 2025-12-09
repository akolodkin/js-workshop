const {
  createValidatingProxy,
  createLoggingProxy,
  createCachingProxy,
  createAccessProxy,
  createLazyProxy,
  createObservableProxy,
} = require("./index");

describe("createValidatingProxy", () => {
  test("should allow valid values", () => {
    const user = createValidatingProxy(
      {},
      {
        age: (v) => Number.isInteger(v) && v >= 0,
      },
    );

    user.age = 25;
    expect(user.age).toBe(25);
  });

  test("should throw on invalid values", () => {
    const user = createValidatingProxy(
      {},
      {
        age: (v) => Number.isInteger(v) && v >= 0,
      },
    );

    expect(() => {
      user.age = -5;
    }).toThrow();
    expect(() => {
      user.age = "twenty";
    }).toThrow();
  });

  test("should allow unvalidated properties", () => {
    const user = createValidatingProxy(
      {},
      {
        age: (v) => v >= 0,
      },
    );

    user.name = "Alice"; // No validator, should pass
    expect(user.name).toBe("Alice");
  });

  test("should validate multiple properties", () => {
    const user = createValidatingProxy(
      {},
      {
        name: (v) => typeof v === "string" && v.length > 0,
        age: (v) => Number.isInteger(v) && v >= 0 && v <= 150,
        email: (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v),
      },
    );

    user.name = "Alice";
    user.age = 30;
    user.email = "alice@example.com";

    expect(user.name).toBe("Alice");
    expect(user.age).toBe(30);
    expect(user.email).toBe("alice@example.com");

    expect(() => {
      user.name = "";
    }).toThrow();
    expect(() => {
      user.email = "invalid";
    }).toThrow();
  });
});

describe("createLoggingProxy", () => {
  test("should log get operations", () => {
    const logs = [];
    const obj = { name: "Alice" };
    const logged = createLoggingProxy(obj, (action, prop, value) => {
      logs.push({ action, prop, value });
    });

    const result = logged.name;
    expect(result).toBe("Alice");
    expect(logs).toContainEqual({
      action: "get",
      prop: "name",
      value: "Alice",
    });
  });

  test("should log set operations", () => {
    const logs = [];
    const obj = {};
    const logged = createLoggingProxy(obj, (action, prop, value) => {
      logs.push({ action, prop, value });
    });

    logged.name = "Bob";
    expect(logs).toContainEqual({ action: "set", prop: "name", value: "Bob" });
  });

  test("should log delete operations", () => {
    const logs = [];
    const obj = { name: "Alice" };
    const logged = createLoggingProxy(obj, (action, prop) => {
      logs.push({ action, prop });
    });

    delete logged.name;
    expect(logs.some((l) => l.action === "delete" && l.prop === "name")).toBe(
      true,
    );
  });
});

describe("createCachingProxy", () => {
  test("should cache method results", () => {
    let callCount = 0;
    const api = {
      fetchUser(id) {
        callCount++;
        return { id, name: `User ${id}` };
      },
    };

    const cached = createCachingProxy(api, ["fetchUser"]);

    const result1 = cached.fetchUser(1);
    const result2 = cached.fetchUser(1);

    expect(result1).toEqual({ id: 1, name: "User 1" });
    expect(result2).toEqual({ id: 1, name: "User 1" });
    expect(callCount).toBe(1);
  });

  test("should cache different arguments separately", () => {
    let callCount = 0;
    const api = {
      fetchUser(id) {
        callCount++;
        return { id };
      },
    };

    const cached = createCachingProxy(api, ["fetchUser"]);

    cached.fetchUser(1);
    cached.fetchUser(2);
    cached.fetchUser(1);

    expect(callCount).toBe(2);
  });

  test("should not cache methods not in list", () => {
    let callCount = 0;
    const api = {
      uncached() {
        callCount++;
        return "result";
      },
    };

    const cached = createCachingProxy(api, []);

    cached.uncached();
    cached.uncached();

    expect(callCount).toBe(2);
  });

  test("should pass through non-method properties", () => {
    const obj = { value: 42 };
    const cached = createCachingProxy(obj, []);
    expect(cached.value).toBe(42);
  });
});

describe("createAccessProxy", () => {
  test("should allow reading permitted properties", () => {
    const obj = { public: "visible", private: "secret" };
    const restricted = createAccessProxy(obj, {
      readable: ["public"],
      writable: [],
    });

    expect(restricted.public).toBe("visible");
  });

  test("should deny reading unpermitted properties", () => {
    const obj = { public: "visible", private: "secret" };
    const restricted = createAccessProxy(obj, {
      readable: ["public"],
      writable: [],
    });

    expect(() => restricted.private).toThrow();
  });

  test("should allow writing permitted properties", () => {
    const obj = { editable: "old" };
    const restricted = createAccessProxy(obj, {
      readable: ["editable"],
      writable: ["editable"],
    });

    restricted.editable = "new";
    expect(restricted.editable).toBe("new");
  });

  test("should deny writing unpermitted properties", () => {
    const obj = { readonly: "value" };
    const restricted = createAccessProxy(obj, {
      readable: ["readonly"],
      writable: [],
    });

    expect(() => {
      restricted.readonly = "changed";
    }).toThrow();
  });
});

describe("createLazyProxy", () => {
  test("should not load until first access", () => {
    let loaded = false;
    const loader = () => {
      loaded = true;
      return { value: 42 };
    };

    const lazy = createLazyProxy(loader);
    expect(loaded).toBe(false);

    const value = lazy.value;
    expect(loaded).toBe(true);
    expect(value).toBe(42);
  });

  test("should only load once", () => {
    let loadCount = 0;
    const loader = () => {
      loadCount++;
      return { value: loadCount };
    };

    const lazy = createLazyProxy(loader);

    lazy.value;
    lazy.value;
    lazy.value;

    expect(loadCount).toBe(1);
  });
});

describe("createObservableProxy", () => {
  test("should notify on property change", () => {
    const changes = [];
    const obj = { count: 0 };
    const observable = createObservableProxy(obj, (prop, value, oldValue) => {
      changes.push({ prop, value, oldValue });
    });

    observable.count = 1;
    observable.count = 2;

    expect(changes).toHaveLength(2);
    expect(changes[0]).toEqual({ prop: "count", value: 1, oldValue: 0 });
    expect(changes[1]).toEqual({ prop: "count", value: 2, oldValue: 1 });
  });

  test("should notify on new property", () => {
    const changes = [];
    const obj = {};
    const observable = createObservableProxy(obj, (prop, value, oldValue) => {
      changes.push({ prop, value, oldValue });
    });

    observable.name = "Alice";

    expect(changes[0].prop).toBe("name");
    expect(changes[0].value).toBe("Alice");
    expect(changes[0].oldValue).toBeUndefined();
  });
});
