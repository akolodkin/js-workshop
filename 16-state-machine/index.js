/**
 * State Machine Implementation
 */
class StateMachine {
  /**
   * Create a state machine
   * @param {Object} config - Machine configuration
   * @param {string} config.initial - Initial state
   * @param {Object} config.states - State definitions
   * @param {Object} [config.context] - Initial context data
   */
  constructor(config) {
    // TODO: Implement constructor
    // Step 1: Validate config has initial and states
    // Step 2: Store configuration
    // this.config = config;
    // this.currentState = config.initial;
    // this.context = config.context || {};
    // Step 3: Validate initial state exists in states
  }

  /**
   * Get current state
   * @returns {string}
   */
  get state() {
    // TODO: Return current state
    throw new Error("Not implemented");
  }

  /**
   * Attempt a state transition
   * @param {string} event - Event name
   * @param {Object} [payload] - Optional data for the transition
   * @returns {boolean} Whether transition was successful
   */
  transition(event, payload) {
    // TODO: Implement transition

    // Step 1: Get current state config

    // Step 2: Check if event is valid for current state
    // Return false if not

    // Step 3: Get transition config (can be string or object)
    // If string: target = transition
    // If object: { target, guard, action }

    // Step 4: Check guard if present
    // If guard returns false, return false

    // Step 5: Update state to target

    // Step 6: Call action if present

    // Step 7: Return true

    throw new Error("Not implemented");
  }

  /**
   * Check if a transition is possible
   * @param {string} event - Event name
   * @returns {boolean}
   */
  can(event) {
    // TODO: Implement can

    // Check if event exists for current state
    // Check guard if present

    throw new Error("Not implemented");
  }

  /**
   * Get available transitions from current state
   * @returns {string[]} Array of event names
   */
  getAvailableTransitions() {
    // TODO: Implement getAvailableTransitions

    // Return array of event names from current state's 'on' config

    throw new Error("Not implemented");
  }

  /**
   * Get the context data
   * @returns {Object}
   */
  getContext() {
    // TODO: Return context
    throw new Error("Not implemented");
  }

  /**
   * Update context data
   * @param {Object|Function} updater - New context or updater function
   */
  updateContext(updater) {
    // TODO: Implement updateContext
    // If updater is function: this.context = updater(this.context)
    // If updater is object: merge with existing context
  }

  /**
   * Check if machine is in a final state (no transitions out)
   * @returns {boolean}
   */
  isFinal() {
    // TODO: Check if current state has no transitions
    throw new Error("Not implemented");
  }

  /**
   * Reset machine to initial state
   * @param {Object} [newContext] - Optional new context
   */
  reset(newContext) {
    // TODO: Reset to initial state
    // Optionally reset context
  }
}

/**
 * Create a state machine factory
 *
 * @param {Object} config - Machine configuration
 * @returns {Function} Factory function that creates machines
 */
function createMachine(config) {
  // TODO: Implement createMachine

  // Return a function that creates new StateMachine instances
  // with the given config

  return () => new StateMachine(config);
}

module.exports = { StateMachine, createMachine };
