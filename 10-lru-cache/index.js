/**
 * LRU Cache Implementation
 *
 * A cache that evicts the least recently used items when at capacity.
 */
class LRUCache {
  /**
   * Create an LRU Cache
   * @param {number} capacity - Maximum number of items
   */
  constructor(capacity) {
    // TODO: Initialize the cache
    // Step 1: Store capacity
    // this.capacity = capacity;
    // Step 2: Create storage (Map recommended)
    // this.cache = new Map();
  }

  /**
   * Get value by key
   * @param {*} key - Cache key
   * @returns {*} Value or undefined if not found
   */
  get(key) {
    // TODO: Implement get

    // Step 1: Check if key exists

    // Step 2: If exists:
    //   - Get the value
    //   - Move to end (most recent)
    //   - Return value

    // Step 3: If not exists, return undefined

    throw new Error("Not implemented");
  }

  /**
   * Set key-value pair
   * @param {*} key - Cache key
   * @param {*} value - Value to store
   */
  put(key, value) {
    // TODO: Implement put
    // Step 1: If key already exists, delete it first (to update position)
    // Step 2: If at capacity, evict least recently used (first item)
    // Step 3: Add the new key-value pair (goes to end = most recent)
  }

  /**
   * Check if key exists (without updating recency)
   * @param {*} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    // TODO: Implement has

    throw new Error("Not implemented");
  }

  /**
   * Delete a key
   * @param {*} key - Cache key
   * @returns {boolean} true if key existed
   */
  delete(key) {
    // TODO: Implement delete

    throw new Error("Not implemented");
  }

  /**
   * Clear all items
   */
  clear() {
    // TODO: Implement clear
    throw new Error("Not implemented");
  }

  /**
   * Current number of items
   * @returns {number}
   */
  get size() {
    // TODO: Return current size

    throw new Error("Not implemented");
  }

  /**
   * Get all keys in order (least recent first)
   * @returns {Array} Array of keys
   */
  keys() {
    // TODO: Return array of keys

    throw new Error("Not implemented");
  }

  /**
   * Get all values in order (least recent first)
   * @returns {Array} Array of values
   */
  values() {
    // TODO: Return array of values

    throw new Error("Not implemented");
  }
}

module.exports = { LRUCache };
