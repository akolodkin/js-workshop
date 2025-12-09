# Assignment 10: LRU Cache

## Difficulty: Hard

## Learning Objectives

- Implement a cache with eviction policy
- Understand LRU (Least Recently Used) algorithm
- Work with Map for O(1) operations
- Design efficient data structures

## The Problem

A cache stores frequently accessed data for quick retrieval. When the cache is full, we need to decide what to remove. LRU evicts the item that hasn't been accessed for the longest time.

```javascript
const cache = new LRUCache(3);
cache.put("a", 1);
cache.put("b", 2);
cache.put("c", 3); // Cache: [a, b, c]
cache.get("a"); // Access 'a', moves to end: [b, c, a]
cache.put("d", 4); // Cache full, evict 'b' (least recent): [c, a, d]
```

## Requirements

Create an `LRUCache` class:

### Constructor

```javascript
const cache = new LRUCache(capacity);
```

- `capacity`: Maximum number of items to store

### Methods

#### `get(key)`

- Returns the value if key exists
- Returns `undefined` (or -1) if not found
- Marks the key as recently used

#### `put(key, value)`

- Inserts or updates the key-value pair
- Marks the key as recently used
- If capacity exceeded, evicts the least recently used item

#### `has(key)`

- Returns `true` if key exists, `false` otherwise
- Does NOT update recency

#### `delete(key)`

- Removes the key-value pair
- Returns `true` if existed, `false` otherwise

#### `clear()`

- Removes all items from cache

### Properties

- `size` - Current number of items
- `capacity` - Maximum capacity

## Examples

```javascript
const cache = new LRUCache(2);

cache.put("a", 1);
cache.put("b", 2);
console.log(cache.get("a")); // 1

cache.put("c", 3); // Evicts 'b' (least recent)
console.log(cache.get("b")); // undefined
console.log(cache.get("c")); // 3

cache.put("d", 4); // Evicts 'a'
console.log(cache.get("a")); // undefined
console.log(cache.get("c")); // 3
console.log(cache.get("d")); // 4
```

## Implementation Options

### Option 1: Map (Recommended)

JavaScript's `Map` maintains insertion order. Delete and re-insert to move to end.

```javascript
// Move to end (most recent)
const value = map.get(key);
map.delete(key);
map.set(key, value);

// Get least recent (first item)
const [firstKey] = map.keys();
```

### Option 2: Doubly Linked List + Map

More traditional approach with O(1) for all operations.

## Time Complexity Goals

- `get`: O(1)
- `put`: O(1)
- `has`: O(1)
- `delete`: O(1)

## Hints

1. `Map` preserves insertion order - use this to track recency
2. On `get` or `put`, move the item to the end (most recent)
3. On eviction, remove the first item (least recent)
4. Be careful: `put` existing key should update AND move to end

## Resources

- [LeetCode: LRU Cache](https://leetcode.com/problems/lru-cache/)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Wikipedia: Cache replacement policies](https://en.wikipedia.org/wiki/Cache_replacement_policies)
