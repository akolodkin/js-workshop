/**
 * Observable Implementation
 *
 * A simple Observable for reactive data streams.
 */
class Observable {
  /**
   * Create an Observable
   * @param {Function} subscribeFn - Function called with subscriber on subscribe
   */
  constructor(subscribeFn) {
    // TODO: Store the subscribe function
    // this._subscribeFn = subscribeFn;
  }

  /**
   * Subscribe to the Observable
   * @param {Object|Function} observer - Observer object or next callback
   * @returns {Object} Subscription with unsubscribe method
   */
  subscribe(observer) {
    // TODO: Implement subscribe

    // Step 1: Normalize observer (handle function shorthand)
    // If observer is a function, wrap it: { next: observer }

    // Step 2: Create a subscriber object that:
    //   - Has next, error, complete methods
    //   - Tracks if completed/errored (stops accepting values)
    //   - Calls observer methods when appropriate

    // Step 3: Call the subscribe function with the subscriber

    // Step 4: Handle cleanup function returned by subscribeFn

    // Step 5: Return subscription object with unsubscribe method

    throw new Error("Not implemented");
  }

  /**
   * Transform each emitted value
   * @param {Function} fn - Transform function
   * @returns {Observable} New Observable with transformed values
   */
  map(fn) {
    // TODO: Implement map operator

    // Return new Observable that:
    // - Subscribes to source (this)
    // - Calls fn on each value
    // - Emits transformed value

    return new Observable(() => {}); // Broken: Replace with implementation
  }

  /**
   * Filter emitted values
   * @param {Function} predicate - Filter function
   * @returns {Observable} New Observable with filtered values
   */
  filter(predicate) {
    // TODO: Implement filter operator

    // Return new Observable that:
    // - Subscribes to source (this)
    // - Only emits values where predicate returns true

    return new Observable(() => {}); // Broken: Replace with implementation
  }

  /**
   * Take only first n values
   * @param {number} count - Number of values to take
   * @returns {Observable} New Observable limited to count values
   */
  take(count) {
    // TODO: Implement take operator

    // Return new Observable that:
    // - Subscribes to source (this)
    // - Emits first `count` values
    // - Completes after `count` values

    return new Observable(() => {}); // Broken: Replace with implementation
  }

  /**
   * Skip first n values
   * @param {number} count - Number of values to skip
   * @returns {Observable} New Observable that skips first count values
   */
  skip(count) {
    // TODO: Implement skip operator

    // Return new Observable that:
    // - Subscribes to source (this)
    // - Ignores first `count` values
    // - Emits remaining values

    return new Observable(() => {}); // Broken: Replace with implementation
  }

  /**
   * Create Observable from array
   * @param {Array} array - Array of values
   * @returns {Observable} Observable that emits array values
   */
  static from(array) {
    // TODO: Implement from

    // Return new Observable that:
    // - Emits each array element
    // - Completes after last element

    return new Observable((subscriber) => {
      // subscriber.next(...) for each
      // subscriber.complete()
    });
  }

  /**
   * Create Observable from single value
   * @param {*} value - Value to emit
   * @returns {Observable} Observable that emits single value
   */
  static of(...values) {
    // TODO: Implement of

    // Return new Observable that emits all values then completes

    return Observable.from(values);
  }
}

module.exports = { Observable };
