/**
 * Promise.all Implementation
 *
 * Returns a promise that resolves when all promises resolve,
 * or rejects when any promise rejects.
 *
 * @param {Iterable} promises - An iterable of promises (or values)
 * @returns {Promise} A promise that resolves to an array of results
 */
function promiseAll(promises) {
  // TODO: Implement promiseAll

  // Step 1: Convert iterable to array
  // const promiseArray = Array.from(promises);

  // Step 2: Handle empty array case
  // Return Promise.resolve([]) for empty input

  // Step 3: Create a new Promise
  // return new Promise((resolve, reject) => {

  // Step 4: Track results and completion count
  // const results = new Array(promiseArray.length);
  // let completed = 0;

  // Step 5: Iterate and handle each promise
  // - Use Promise.resolve() to handle non-promise values
  // - On resolve: store result at correct index, increment count
  // - If all completed: resolve with results array
  // - On reject: immediately reject the whole promise

  // });

  return Promise.reject(new Error("Not implemented")); // Broken: Replace with your implementation
}

/**
 * Promise.race Implementation
 *
 * Returns a promise that settles with the first promise to settle.
 *
 * @param {Iterable} promises - An iterable of promises (or values)
 * @returns {Promise} A promise that settles with the first result
 */
function promiseRace(promises) {
  // TODO: Implement promiseRace

  // Step 1: Convert iterable to array

  // Step 2: Handle empty array (return pending promise)
  // For empty array, return a promise that never settles

  // Step 3: Create a new Promise
  // The first promise to settle wins

  // Step 4: For each promise, attach then/catch that resolves/rejects the race

  return new Promise(() => {}); // Replace with your implementation
}

/**
 * Promise.allSettled Implementation
 *
 * Returns a promise that resolves when all promises have settled.
 * Never rejects.
 *
 * @param {Iterable} promises - An iterable of promises (or values)
 * @returns {Promise} A promise that resolves to an array of settlement objects
 */
function promiseAllSettled(promises) {
  // TODO: Implement promiseAllSettled

  // Step 1: Convert iterable to array

  // Step 2: Handle empty array case

  // Step 3: Create a new Promise

  // Step 4: Track results and completion count
  // Each result is: { status: 'fulfilled', value } or { status: 'rejected', reason }

  // Step 5: For each promise:
  // - On resolve: store { status: 'fulfilled', value }
  // - On reject: store { status: 'rejected', reason }
  // - Never reject the outer promise
  // - Resolve when all have settled

  return Promise.reject(new Error("Not implemented")); // Broken: Replace with your implementation
}

/**
 * Promise.any Implementation
 *
 * Returns a promise that resolves with the first fulfilled promise,
 * or rejects with an AggregateError if all reject.
 *
 * @param {Iterable} promises - An iterable of promises (or values)
 * @returns {Promise} A promise that resolves with the first fulfilled value
 */
function promiseAny(promises) {
  // TODO: Implement promiseAny

  // Step 1: Convert iterable to array

  // Step 2: Handle empty array (reject with AggregateError)

  // Step 3: Create a new Promise

  // Step 4: Track rejection count and errors
  // const errors = [];
  // let rejectedCount = 0;

  // Step 5: For each promise:
  // - On resolve: immediately resolve the outer promise (first wins)
  // - On reject: collect error, increment count
  // - If all rejected: reject with AggregateError

  // Note: AggregateError is created like:
  // new AggregateError(errorsArray, 'All promises were rejected')

  return Promise.reject(new AggregateError([], "No promises")); // Replace
}

module.exports = { promiseAll, promiseRace, promiseAllSettled, promiseAny };
