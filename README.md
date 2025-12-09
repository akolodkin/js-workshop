# JavaScript Workshop - Advanced Assignments

Master JavaScript through hands-on coding challenges with automated tests.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific assignment
npm run test:01  # Deep Clone
npm run test:02  # Debounce/Throttle
# ... etc

# Run tests in watch mode
npm test:watch

# Run with coverage report
npm test:coverage
```

## Assignments

### Core JavaScript Mastery

#### 01 - [Deep Clone](./01-deep-clone)

**Difficulty:** Medium | **Topics:** Recursion, Type checking, WeakMap

Create a deep copy of any JavaScript value including nested objects, arrays, and special types (Date, RegExp, Map, Set). Learn to handle circular references using WeakMap and understand JavaScript's type system.

#### 02 - [Debounce & Throttle](./02-debounce-throttle)

**Difficulty:** Medium | **Topics:** Closures, Timing, `this` context

Implement two essential rate-limiting utilities. Debounce delays execution until after a pause in calls; throttle limits execution to once per time period. Master closures, setTimeout, and preserving execution context.

#### 03 - [Custom Bind](./03-custom-bind)

**Difficulty:** Hard | **Topics:** `this` context, Prototypes, `new` operator

Recreate `Function.prototype.bind` from scratch. Deep dive into how `this` binding works, handle partial application of arguments, and support constructor invocation with the `new` keyword.

#### 04 - [Memoization](./04-memoization)

**Difficulty:** Medium | **Topics:** Closures, Caching, Higher-order functions

Build a memoization utility that caches function results based on arguments. Implement advanced features like TTL (time-to-live), max cache size with LRU eviction, and custom key generation.

---

### Async Patterns

#### 05 - [Promise Utilities](./05-promise-utilities)

**Difficulty:** Hard | **Topics:** Promises, Async control flow, Error handling

Implement Promise.all, Promise.race, Promise.allSettled, and Promise.any from scratch. Understand how promises work internally and learn to coordinate multiple async operations.

#### 06 - [Async Queue](./06-async-queue)

**Difficulty:** Hard | **Topics:** Concurrency control, Promises, Task scheduling

Build an async task queue with configurable concurrency limits. Learn to manage parallel execution, handle task priorities, implement pause/resume functionality, and track queue state.

#### 07 - [Retry with Backoff](./07-retry-with-backoff)

**Difficulty:** Medium | **Topics:** Error handling, Async/await, Algorithms

Create a retry utility with exponential backoff for handling transient failures. Implement different backoff strategies (fixed, linear, exponential), jitter for thundering herd prevention, and configurable retry conditions.

---

### Design Patterns

#### 08 - [Event Emitter](./08-event-emitter)

**Difficulty:** Medium | **Topics:** Pub/Sub pattern, Callbacks, Memory management

Implement a Node.js-style EventEmitter with on, off, emit, and once methods. Learn the publish-subscribe pattern, manage listener lifecycles, and handle edge cases like removing listeners during emit.

#### 09 - [Observable](./09-observable)

**Difficulty:** Hard | **Topics:** Reactive programming, Functional composition, Streams

Create a simple Observable implementation with operators like map, filter, take, and skip. Understand reactive data streams, lazy evaluation, and the observer pattern used in RxJS.

#### 10 - [LRU Cache](./10-lru-cache)

**Difficulty:** Hard | **Topics:** Data structures, Map ordering, Cache algorithms

Build a Least Recently Used cache that evicts the oldest items when at capacity. Learn to leverage Map's insertion order, implement O(1) operations, and understand cache eviction strategies.

#### 11 - [Singleton](./11-singleton)

**Difficulty:** Easy | **Topics:** Creational patterns, Static methods, Closures

Implement the singleton pattern ensuring only one instance exists. Create both class-based and factory-based singletons, understand lazy initialization, and learn when singletons are appropriate.

#### 12 - [Factory Pattern](./12-factory-pattern)

**Difficulty:** Medium | **Topics:** Creational patterns, Dynamic instantiation, Validation

Build a factory with type registration and validation. Learn to decouple object creation from usage, implement extensible factories, and validate constructor arguments dynamically.

#### 13 - [Decorator Pattern](./13-decorator-pattern)

**Difficulty:** Medium | **Topics:** Higher-order functions, Function composition, AOP

Create function decorators for logging, timing, retry, memoization, and validation. Learn aspect-oriented programming concepts, implement compose and pipe utilities, and understand how decorators wrap behavior.

#### 14 - [Middleware Pipeline](./14-middleware-pipeline)

**Difficulty:** Hard | **Topics:** Chain of responsibility, Async middleware, Express/Koa patterns

Build an Express/Koa-style middleware pipeline. Understand how middleware chains work, implement the `next()` pattern, handle async middleware, and compose middleware functions.

#### 15 - [Dependency Injection](./15-dependency-injection)

**Difficulty:** Hard | **Topics:** IoC container, SOLID principles, Circular dependency detection

Create a DI container supporting class registration, factory functions, singletons, and dependency resolution. Learn inversion of control, detect circular dependencies, and understand how frameworks like Angular manage dependencies.

#### 16 - [State Machine](./16-state-machine)

**Difficulty:** Hard | **Topics:** FSM, State management, Guard conditions

Implement a finite state machine with states, transitions, guards, and actions. Learn to model complex workflows, validate state transitions, and manage application state predictably.

#### 17 - [Command Pattern](./17-command-pattern)

**Difficulty:** Medium | **Topics:** Undo/Redo, Action encapsulation, History management

Build a command system with undo/redo support. Encapsulate operations as objects, implement command history, create macro commands, and learn how text editors handle reversible actions.

#### 18 - [Strategy Pattern](./18-strategy-pattern)

**Difficulty:** Medium | **Topics:** Interchangeable algorithms, Runtime behavior selection

Implement the strategy pattern for sorting algorithms, pricing calculations, and validation rules. Learn to swap algorithms at runtime, reduce conditional logic, and follow the open/closed principle.

#### 19 - [Proxy Pattern](./19-proxy-pattern)

**Difficulty:** Medium | **Topics:** ES6 Proxy, Metaprogramming, Access control

Create proxies for validation, logging, caching, access control, lazy loading, and change observation. Master the ES6 Proxy API, implement traps for property access, and understand metaprogramming concepts.

#### 20 - [Builder Pattern](./20-builder-pattern)

**Difficulty:** Medium | **Topics:** Fluent interfaces, Object construction, Method chaining

Build fluent builders for SQL queries, HTML elements, configuration objects, and HTTP requests. Learn to construct complex objects step-by-step, implement method chaining, and separate construction from representation.

## How to Submit Your Work

### Step 1: Fork the Repository

1. Click the **Fork** button at the top right of this repository
2. This creates your own copy of the repository under your GitHub account
3. Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/js-workshop.git
   cd js-workshop
   npm install
   ```

### Step 2: Create a Branch for Your Assignment

Create a new branch for each assignment you work on:

```bash
git checkout -b assignment-01-deep-clone
```

Use this naming convention: `assignment-XX-name` (e.g., `assignment-01-deep-clone`, `assignment-05-promise-utilities`)

### Step 3: Implement Your Solution

1. Open the assignment folder (e.g., `01-deep-clone/`)
2. Read the `README.md` for requirements and hints
3. Implement your solution in `index.js` (look for TODO comments)
4. Run tests frequently to check your progress:
   ```bash
   npm run test:01
   ```

### Step 4: Commit Your Changes

Once all tests pass, commit your work:

```bash
git add .
git commit -m "Complete assignment 01: Deep Clone"
```

### Step 5: Push and Create a Pull Request

1. Push your branch to your fork:

   ```bash
   git push origin assignment-01-deep-clone
   ```

2. Go to your fork on GitHub

3. Click **"Compare & pull request"** button (or go to Pull Requests → New Pull Request)

4. Set the PR details:
   - **Base repository:** The original repository (instructor's repo)
   - **Base branch:** `main`
   - **Head repository:** Your fork
   - **Compare branch:** Your assignment branch (e.g., `assignment-01-deep-clone`)

5. Fill in the PR template:

   ```markdown
   ## Assignment: 01 - Deep Clone

   ### Checklist

   - [ ] All tests pass (`npm run test:01`)
   - [ ] Code follows the existing style
   - [ ] No modifications to test files

   ### Notes

   (Any questions or comments about your implementation)
   ```

6. Click **"Create Pull Request"**

### Step 6: Address Review Feedback

1. Your instructor will review your PR and may leave comments
2. To make changes based on feedback:

   ```bash
   # Make sure you're on your assignment branch
   git checkout assignment-01-deep-clone

   # Make your changes, then commit
   git add .
   git commit -m "Address review feedback"

   # Push the changes (PR updates automatically)
   git push origin assignment-01-deep-clone
   ```

3. Once approved, your PR will be merged

### Working on Multiple Assignments

You can work on multiple assignments in parallel:

```bash
# Start assignment 2 while waiting for assignment 1 review
git checkout main
git pull origin main
git checkout -b assignment-02-debounce-throttle
```

### Keeping Your Fork Updated

If the main repository is updated:

```bash
# Add the original repo as upstream (one time only)
git remote add upstream https://github.com/ORIGINAL_OWNER/js-workshop.git

# Fetch and merge updates
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

## Assignment Structure

Each assignment folder contains:

- `README.md` - Assignment description and requirements
- `index.js` - Starter code with TODO markers
- `index.test.js` - Jest tests to verify your solution

## Tips for Success

1. **Read the README** carefully before starting
2. **Run the tests first** to see what's expected
3. **Implement incrementally** - get one test passing at a time
4. **Check edge cases** - tests cover many scenarios
5. **Don't modify test files** - only edit `index.js`

## License

MIT
