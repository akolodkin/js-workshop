/**
 * Dependency Injection Container Implementation
 */
class Container {
  constructor() {
    // TODO: Initialize registry
    // this.registry = new Map();
  }

  /**
   * Register a class with the container
   * @param {string} name - Service name
   * @param {Function} Class - Constructor function
   * @param {string[]} [dependencies=[]] - Names of dependencies
   * @param {Object} [options={}] - Registration options
   * @param {boolean} [options.singleton=false] - Whether to create singleton
   */
  register(name, Class, dependencies = [], options = {}) {
    // TODO: Implement register
    // Store in registry:
    // { type: 'class', Class, dependencies, singleton, instance: null }
  }

  /**
   * Register an existing instance
   * @param {string} name - Service name
   * @param {*} instance - Instance to register
   */
  registerInstance(name, instance) {
    // TODO: Implement registerInstance
    // Store in registry:
    // { type: 'instance', instance }
  }

  /**
   * Register a factory function
   * @param {string} name - Service name
   * @param {Function} factory - Factory function
   * @param {string[]} [dependencies=[]] - Names of dependencies
   * @param {Object} [options={}] - Registration options
   */
  registerFactory(name, factory, dependencies = [], options = {}) {
    // TODO: Implement registerFactory
    // Store in registry:
    // { type: 'factory', factory, dependencies, singleton, instance: null }
  }

  /**
   * Resolve a service by name
   * @param {string} name - Service name
   * @param {Set} [resolutionStack] - Stack for circular dependency detection
   * @returns {*} The resolved instance
   */
  resolve(name, resolutionStack = new Set()) {
    // TODO: Implement resolve

    // Step 1: Check if service is registered
    // Throw error if not found

    // Step 2: Check for circular dependencies
    // If name is already in resolutionStack, throw error

    // Step 3: Get registration from registry

    // Step 4: Handle different types:

    // For 'instance':
    //   - Return the stored instance

    // For 'class' or 'factory':
    //   - If singleton and instance exists, return instance
    //   - Add name to resolutionStack
    //   - Resolve all dependencies recursively
    //   - Create instance (new Class(...deps) or factory(...deps))
    //   - Remove name from resolutionStack
    //   - If singleton, cache instance
    //   - Return instance

    // Broken: returns undefined (causes test assertions to fail)
    return undefined;
  }

  /**
   * Check if a service is registered
   * @param {string} name - Service name
   * @returns {boolean}
   */
  has(name) {
    // TODO: Implement has
    throw new Error("Not implemented");
  }

  /**
   * Unregister a service
   * @param {string} name - Service name
   * @returns {boolean} true if was registered
   */
  unregister(name) {
    // TODO: Implement unregister
    throw new Error("Not implemented");
  }

  /**
   * Clear all registrations
   */
  clear() {
    // TODO: Implement clear
    throw new Error("Not implemented");
  }

  /**
   * Get all registered service names
   * @returns {string[]}
   */
  getRegistrations() {
    // TODO: Implement getRegistrations
    throw new Error("Not implemented");
  }
}

/**
 * Create a child container that inherits from parent
 *
 * @param {Container} parent - Parent container
 * @returns {Container} Child container
 */
function createChildContainer(parent) {
  // TODO: Implement createChildContainer

  // Create a new container that:
  // - First checks its own registry
  // - Falls back to parent for unregistered services

  const child = new Container();
  // Override resolve to check parent...
  return child;
}

// Example classes for testing
class Logger {
  constructor() {
    this.logs = [];
  }

  log(message) {
    this.logs.push(message);
  }

  getLogs() {
    return [...this.logs];
  }
}

class Database {
  constructor(logger) {
    this.logger = logger;
    this.connected = false;
  }

  connect() {
    this.logger.log("Database connected");
    this.connected = true;
  }

  query(sql) {
    this.logger.log(`Query: ${sql}`);
    return [];
  }
}

class UserRepository {
  constructor(database, logger) {
    this.database = database;
    this.logger = logger;
  }

  findById(id) {
    this.logger.log(`Finding user ${id}`);
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

class UserService {
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  getUser(id) {
    this.logger.log(`Getting user ${id}`);
    return this.userRepository.findById(id);
  }
}

module.exports = {
  Container,
  createChildContainer,
  Logger,
  Database,
  UserRepository,
  UserService,
};
