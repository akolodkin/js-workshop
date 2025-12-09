const { LRUCache } = require("./index");

describe("LRUCache", () => {
  describe("basic operations", () => {
    test("should store and retrieve values", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      expect(cache.get("a")).toBe(1);
    });

    test("should return undefined for missing keys", () => {
      const cache = new LRUCache(3);
      expect(cache.get("nonexistent")).toBeUndefined();
    });

    test("should update existing keys", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      cache.put("a", 2);
      expect(cache.get("a")).toBe(2);
    });

    test("should handle different value types", () => {
      const cache = new LRUCache(5);
      cache.put("num", 42);
      cache.put("str", "hello");
      cache.put("obj", { x: 1 });
      cache.put("arr", [1, 2, 3]);
      cache.put("null", null);

      expect(cache.get("num")).toBe(42);
      expect(cache.get("str")).toBe("hello");
      expect(cache.get("obj")).toEqual({ x: 1 });
      expect(cache.get("arr")).toEqual([1, 2, 3]);
      expect(cache.get("null")).toBe(null);
    });
  });

  describe("LRU eviction", () => {
    test("should evict least recently used when at capacity", () => {
      const cache = new LRUCache(2);
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3); // Should evict 'a'

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
    });

    test("get should update recency", () => {
      const cache = new LRUCache(2);
      cache.put("a", 1);
      cache.put("b", 2);
      cache.get("a"); // 'a' is now most recent
      cache.put("c", 3); // Should evict 'b'

      expect(cache.get("a")).toBe(1);
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("c")).toBe(3);
    });

    test("put existing key should update recency", () => {
      const cache = new LRUCache(2);
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("a", 10); // Update 'a', now most recent
      cache.put("c", 3); // Should evict 'b'

      expect(cache.get("a")).toBe(10);
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("c")).toBe(3);
    });

    test("should handle capacity of 1", () => {
      const cache = new LRUCache(1);
      cache.put("a", 1);
      cache.put("b", 2);

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
    });

    test("complex eviction scenario", () => {
      const cache = new LRUCache(3);

      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3); // [a, b, c]
      cache.get("a"); // [b, c, a]
      cache.put("d", 4); // [c, a, d] - evicts b
      cache.get("c"); // [a, d, c]
      cache.put("e", 5); // [d, c, e] - evicts a

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
      expect(cache.get("e")).toBe(5);
    });
  });

  describe("has method", () => {
    test("should return true for existing keys", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      expect(cache.has("a")).toBe(true);
    });

    test("should return false for missing keys", () => {
      const cache = new LRUCache(3);
      expect(cache.has("nonexistent")).toBe(false);
    });

    test("should NOT update recency", () => {
      const cache = new LRUCache(2);
      cache.put("a", 1);
      cache.put("b", 2);
      cache.has("a"); // Should NOT update recency
      cache.put("c", 3); // Should evict 'a', not 'b'

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
    });
  });

  describe("delete method", () => {
    test("should remove existing key", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      cache.delete("a");
      expect(cache.get("a")).toBeUndefined();
    });

    test("should return true when key existed", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      expect(cache.delete("a")).toBe(true);
    });

    test("should return false when key did not exist", () => {
      const cache = new LRUCache(3);
      expect(cache.delete("nonexistent")).toBe(false);
    });

    test("should decrease size", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      cache.put("b", 2);
      cache.delete("a");
      expect(cache.size).toBe(1);
    });
  });

  describe("clear method", () => {
    test("should remove all items", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      cache.put("b", 2);
      cache.clear();
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBeUndefined();
    });

    test("should reset size to 0", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      cache.put("b", 2);
      cache.clear();
      expect(cache.size).toBe(0);
    });
  });

  describe("size property", () => {
    test("should return 0 for empty cache", () => {
      const cache = new LRUCache(3);
      expect(cache.size).toBe(0);
    });

    test("should track number of items", () => {
      const cache = new LRUCache(5);
      cache.put("a", 1);
      expect(cache.size).toBe(1);
      cache.put("b", 2);
      expect(cache.size).toBe(2);
    });

    test("should not exceed capacity", () => {
      const cache = new LRUCache(2);
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);
      expect(cache.size).toBe(2);
    });

    test("should not change when updating existing key", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      cache.put("a", 2);
      expect(cache.size).toBe(1);
    });
  });

  describe("keys and values", () => {
    test("keys should return all keys", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      cache.put("b", 2);
      const keys = cache.keys();
      expect(keys).toContain("a");
      expect(keys).toContain("b");
      expect(keys.length).toBe(2);
    });

    test("values should return all values", () => {
      const cache = new LRUCache(3);
      cache.put("a", 1);
      cache.put("b", 2);
      const values = cache.values();
      expect(values).toContain(1);
      expect(values).toContain(2);
      expect(values.length).toBe(2);
    });
  });
});
