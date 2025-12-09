const { deepClone } = require("./index");

describe("deepClone", () => {
  describe("primitives", () => {
    test("should return numbers as-is", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone(3.14)).toBe(3.14);
      expect(deepClone(-0)).toBe(-0);
      expect(deepClone(Infinity)).toBe(Infinity);
    });

    test("should return strings as-is", () => {
      expect(deepClone("hello")).toBe("hello");
      expect(deepClone("")).toBe("");
    });

    test("should return booleans as-is", () => {
      expect(deepClone(true)).toBe(true);
      expect(deepClone(false)).toBe(false);
    });

    test("should return null and undefined as-is", () => {
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    test("should return symbols as-is", () => {
      const sym = Symbol("test");
      expect(deepClone(sym)).toBe(sym);
    });

    test("should return bigints as-is", () => {
      expect(deepClone(BigInt(9007199254740991))).toBe(
        BigInt(9007199254740991),
      );
    });
  });

  describe("arrays", () => {
    test("should clone simple arrays", () => {
      const arr = [1, 2, 3];
      const cloned = deepClone(arr);
      expect(cloned).toEqual([1, 2, 3]);
      expect(cloned).not.toBe(arr);
    });

    test("should clone nested arrays", () => {
      const arr = [1, [2, [3, 4]]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual([1, [2, [3, 4]]]);
      expect(cloned[1]).not.toBe(arr[1]);
      expect(cloned[1][1]).not.toBe(arr[1][1]);
    });

    test("should clone arrays with objects", () => {
      const arr = [{ a: 1 }, { b: 2 }];
      const cloned = deepClone(arr);
      expect(cloned).toEqual([{ a: 1 }, { b: 2 }]);
      expect(cloned[0]).not.toBe(arr[0]);
    });

    test("should handle empty arrays", () => {
      expect(deepClone([])).toEqual([]);
    });
  });

  describe("objects", () => {
    test("should clone simple objects", () => {
      const obj = { a: 1, b: 2 };
      const cloned = deepClone(obj);
      expect(cloned).toEqual({ a: 1, b: 2 });
      expect(cloned).not.toBe(obj);
    });

    test("should clone nested objects", () => {
      const obj = { a: { b: { c: 3 } } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual({ a: { b: { c: 3 } } });
      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.a.b).not.toBe(obj.a.b);
    });

    test("should clone objects with arrays", () => {
      const obj = { arr: [1, 2, 3] };
      const cloned = deepClone(obj);
      expect(cloned).toEqual({ arr: [1, 2, 3] });
      expect(cloned.arr).not.toBe(obj.arr);
    });

    test("should handle empty objects", () => {
      expect(deepClone({})).toEqual({});
    });

    test("cloning should not affect original", () => {
      const obj = { a: 1, nested: { b: 2 } };
      const cloned = deepClone(obj);
      cloned.a = 999;
      cloned.nested.b = 999;
      expect(obj.a).toBe(1);
      expect(obj.nested.b).toBe(2);
    });
  });

  describe("special types", () => {
    test("should clone Date objects", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const cloned = deepClone(date);
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
      expect(cloned instanceof Date).toBe(true);
      cloned.setFullYear(2000);
      expect(date.getFullYear()).toBe(2024);
    });

    test("should clone RegExp objects", () => {
      const regex = /test/gi;
      const cloned = deepClone(regex);
      expect(cloned.source).toBe("test");
      expect(cloned.flags).toBe("gi");
      expect(cloned).not.toBe(regex);
      expect(cloned instanceof RegExp).toBe(true);
    });

    test("should clone Map objects", () => {
      const map = new Map([
        ["a", 1],
        ["b", { nested: 2 }],
      ]);
      const cloned = deepClone(map);
      expect(cloned).not.toBe(map);
      expect(cloned instanceof Map).toBe(true);
      expect(cloned.get("a")).toBe(1);
      expect(cloned.get("b")).toEqual({ nested: 2 });
      expect(cloned.get("b")).not.toBe(map.get("b"));
    });

    test("should clone Set objects", () => {
      const obj = { a: 1 };
      const set = new Set([1, "two", obj]);
      const cloned = deepClone(set);
      expect(cloned).not.toBe(set);
      expect(cloned instanceof Set).toBe(true);
      expect(cloned.size).toBe(3);
      expect(cloned.has(1)).toBe(true);
      expect(cloned.has("two")).toBe(true);
    });
  });

  describe("circular references", () => {
    test("should handle self-referencing objects", () => {
      const obj = { name: "circular" };
      obj.self = obj;
      const cloned = deepClone(obj);
      expect(cloned.name).toBe("circular");
      expect(cloned.self).toBe(cloned);
      expect(cloned).not.toBe(obj);
    });

    test("should handle mutually referencing objects", () => {
      const a = { name: "a" };
      const b = { name: "b" };
      a.ref = b;
      b.ref = a;
      const clonedA = deepClone(a);
      expect(clonedA.name).toBe("a");
      expect(clonedA.ref.name).toBe("b");
      expect(clonedA.ref.ref).toBe(clonedA);
    });

    test("should handle circular arrays", () => {
      const arr = [1, 2];
      arr.push(arr);
      const cloned = deepClone(arr);
      expect(cloned[0]).toBe(1);
      expect(cloned[1]).toBe(2);
      expect(cloned[2]).toBe(cloned);
    });
  });

  describe("complex structures", () => {
    test("should clone deeply nested mixed structures", () => {
      const complex = {
        string: "hello",
        number: 42,
        array: [1, { a: 2 }, [3, 4]],
        nested: {
          date: new Date("2024-01-01"),
          map: new Map([["key", "value"]]),
        },
      };
      const cloned = deepClone(complex);
      expect(cloned).toEqual(complex);
      expect(cloned.array).not.toBe(complex.array);
      expect(cloned.nested).not.toBe(complex.nested);
      expect(cloned.nested.date).not.toBe(complex.nested.date);
      expect(cloned.nested.map).not.toBe(complex.nested.map);
    });
  });
});
