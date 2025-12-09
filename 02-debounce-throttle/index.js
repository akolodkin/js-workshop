/**
 * Debounce Implementation
 *
 * Creates a debounced function that delays invoking `fn` until after `delay`
 * milliseconds have elapsed since the last time the debounced function was called.
 *
 * @param {Function} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced function with a cancel() method
 */
function debounce(fn, delay) {
  // TODO: Implement debounce

  // Step 1: Create a variable to store the timeout ID

  // Step 2: Create the debounced function that:
  //   - Clears any existing timeout
  //   - Sets a new timeout to call fn after delay
  //   - Preserves `this` context and arguments

  // Step 3: Add a cancel() method to clear pending timeout

  // Step 4: Return the debounced function

  // Return a placeholder that doesn't work
  throw new Error("Not implemented");
}

/**
 * Throttle Implementation
 *
 * Creates a throttled function that only invokes `fn` at most once per
 * every `limit` milliseconds.
 *
 * @param {Function} fn - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} The throttled function with a cancel() method
 */
function throttle(fn, limit) {
  // TODO: Implement throttle

  // Step 1: Create variables to track:
  //   - Whether we're currently in a throttle period
  //   - The timeout ID for cleanup

  // Step 2: Create the throttled function that:
  //   - If not throttling, execute fn immediately and start throttle period
  //   - If throttling, ignore the call
  //   - Preserves `this` context and arguments

  // Step 3: Add a cancel() method to reset throttle state

  // Step 4: Return the throttled function

  // Return a placeholder that doesn't work
  throw new Error("Not implemented");
}

module.exports = { debounce, throttle };
