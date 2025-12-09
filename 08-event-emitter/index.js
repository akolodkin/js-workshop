/**
 * Event Emitter Implementation
 *
 * A pub/sub event system similar to Node.js EventEmitter.
 */
class EventEmitter {
  constructor() {
    // TODO: Initialize event storage
    // this.events = new Map(); // or {}
  }

  /**
   * Register a listener for an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} this (for chaining)
   */
  on(event, listener) {
    // TODO: Implement on

    // Step 1: Get or create the listeners array for this event

    // Step 2: Add the listener to the array

    // Step 3: Return this for chaining

    return null; // Broken: should return this
  }

  /**
   * Remove a specific listener for an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback to remove
   * @returns {EventEmitter} this (for chaining)
   */
  off(event, listener) {
    // TODO: Implement off

    // Step 1: Get the listeners array for this event

    // Step 2: Find and remove the listener
    // Note: Handle wrapped 'once' listeners

    // Step 3: Return this for chaining

    return null; // Broken: should return this
  }

  /**
   * Emit an event, calling all registered listeners
   * @param {string} event - Event name
   * @param {...*} args - Arguments to pass to listeners
   * @returns {boolean} true if event had listeners
   */
  emit(event, ...args) {
    // TODO: Implement emit

    // Step 1: Get the listeners array for this event

    // Step 2: If no listeners, return false

    // Step 3: Call each listener with the arguments
    // Make a copy of the array to handle removals during emit

    // Step 4: Return true

    throw new Error("Not implemented");
  }

  /**
   * Register a one-time listener
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} this (for chaining)
   */
  once(event, listener) {
    // TODO: Implement once

    // Step 1: Create a wrapper function that:
    //   - Removes itself after being called
    //   - Calls the original listener with arguments

    // Step 2: Store reference to original listener for 'off' to work

    // Step 3: Register the wrapper with 'on'

    // Step 4: Return this for chaining

    return null; // Broken: should return this
  }

  /**
   * Remove all listeners for an event (or all events)
   * @param {string} [event] - Event name (optional)
   * @returns {EventEmitter} this (for chaining)
   */
  removeAllListeners(event) {
    // TODO: Implement removeAllListeners

    // If event is provided, remove only that event's listeners
    // If no event, clear all events

    return null; // Broken: should return this
  }

  /**
   * Get array of listeners for an event
   * @param {string} event - Event name
   * @returns {Function[]} Array of listener functions
   */
  listeners(event) {
    // TODO: Implement listeners

    // Return copy of listeners array, or empty array if none

    throw new Error("Not implemented");
  }

  /**
   * Get number of listeners for an event
   * @param {string} event - Event name
   * @returns {number} Listener count
   */
  listenerCount(event) {
    // TODO: Implement listenerCount

    throw new Error("Not implemented");
  }
}

module.exports = { EventEmitter };
