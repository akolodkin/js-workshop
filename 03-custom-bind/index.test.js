const { customBind } = require("./index");

describe("customBind", () => {
  describe("basic binding", () => {
    test("should bind this context", () => {
      const obj = { value: 42 };
      function getValue() {
        return this.value;
      }
      const bound = customBind(getValue, obj);
      expect(bound()).toBe(42);
    });

    test("should work with methods that use this", () => {
      const person = { name: "Alice" };
      function greet() {
        return `Hello, ${this.name}`;
      }
      const bound = customBind(greet, person);
      expect(bound()).toBe("Hello, Alice");
    });

    test("should bind to null context", () => {
      function getThis() {
        return this;
      }
      const bound = customBind(getThis, null);
      // In non-strict mode, null becomes global; in strict, stays null
      const result = bound();
      expect(result === null || result === global || result === undefined).toBe(
        true,
      );
    });

    test("should bind to undefined context", () => {
      function getThis() {
        return this;
      }
      const bound = customBind(getThis, undefined);
      const result = bound();
      expect(result === undefined || result === global).toBe(true);
    });
  });

  describe("argument handling", () => {
    test("should pass arguments to the original function", () => {
      const obj = {};
      function sum(a, b, c) {
        return a + b + c;
      }
      const bound = customBind(sum, obj);
      expect(bound(1, 2, 3)).toBe(6);
    });

    test("should support partial application", () => {
      function sum(a, b, c) {
        return a + b + c;
      }
      const bound = customBind(sum, null, 10);
      expect(bound(20, 30)).toBe(60);
    });

    test("should support multiple pre-bound arguments", () => {
      function sum(a, b, c, d) {
        return a + b + c + d;
      }
      const bound = customBind(sum, null, 1, 2);
      expect(bound(3, 4)).toBe(10);
    });

    test("should combine bound and called arguments in correct order", () => {
      function concat(...args) {
        return args.join("-");
      }
      const bound = customBind(concat, null, "a", "b");
      expect(bound("c", "d")).toBe("a-b-c-d");
    });

    test("should work with no pre-bound arguments", () => {
      function identity(x) {
        return x;
      }
      const bound = customBind(identity, null);
      expect(bound(42)).toBe(42);
    });
  });

  describe("return value", () => {
    test("should return the original function return value", () => {
      function double(x) {
        return x * 2;
      }
      const bound = customBind(double, null);
      expect(bound(21)).toBe(42);
    });

    test("should return undefined if original returns undefined", () => {
      function noReturn() {
        // No return statement
      }
      const bound = customBind(noReturn, null);
      expect(bound()).toBeUndefined();
    });

    test("should handle object return values", () => {
      function createObj(name) {
        return { name, created: true };
      }
      const bound = customBind(createObj, null);
      expect(bound("test")).toEqual({ name: "test", created: true });
    });
  });

  describe("constructor usage (new keyword)", () => {
    test("should work with new keyword", () => {
      function Person(name) {
        this.name = name;
      }
      const BoundPerson = customBind(Person, null);
      const alice = new BoundPerson("Alice");
      expect(alice.name).toBe("Alice");
    });

    test("should ignore bound context when using new", () => {
      const boundContext = { name: "Ignored" };
      function Person(name) {
        this.name = name;
      }
      const BoundPerson = customBind(Person, boundContext);
      const bob = new BoundPerson("Bob");
      expect(bob.name).toBe("Bob");
      expect(bob).not.toBe(boundContext);
    });

    test("should preserve instanceof relationship", () => {
      function Animal(type) {
        this.type = type;
      }
      const BoundAnimal = customBind(Animal, null);
      const dog = new BoundAnimal("dog");
      expect(dog instanceof Animal).toBe(true);
    });

    test("should use pre-bound arguments with new", () => {
      function Point(x, y) {
        this.x = x;
        this.y = y;
      }
      const BoundPoint = customBind(Point, null, 10);
      const point = new BoundPoint(20);
      expect(point.x).toBe(10);
      expect(point.y).toBe(20);
    });

    test("should inherit prototype methods", () => {
      function Counter(initial) {
        this.count = initial;
      }
      Counter.prototype.increment = function () {
        this.count++;
        return this.count;
      };

      const BoundCounter = customBind(Counter, null, 0);
      const counter = new BoundCounter();
      expect(counter.count).toBe(0);
      expect(counter.increment()).toBe(1);
      expect(counter.increment()).toBe(2);
    });
  });

  describe("edge cases", () => {
    test("should throw TypeError for non-function", () => {
      expect(() => customBind("not a function", null)).toThrow(TypeError);
      expect(() => customBind(123, null)).toThrow(TypeError);
      expect(() => customBind({}, null)).toThrow(TypeError);
    });

    test("should handle arrow functions (ignores bound context)", () => {
      const obj = { value: 42 };
      const arrow = () => "arrow";
      const bound = customBind(arrow, obj);
      expect(bound()).toBe("arrow");
    });

    test("should be callable multiple times", () => {
      const obj = { x: 1 };
      function getX() {
        return this.x;
      }
      const bound = customBind(getX, obj);
      expect(bound()).toBe(1);
      expect(bound()).toBe(1);
      expect(bound()).toBe(1);
    });

    test("should allow chained binding", () => {
      function add(a, b, c) {
        return a + b + c;
      }
      const bound1 = customBind(add, null, 1);
      const bound2 = customBind(bound1, null, 2);
      expect(bound2(3)).toBe(6);
    });
  });
});
