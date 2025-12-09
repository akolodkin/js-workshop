# Assignment 19: Proxy Pattern

## Difficulty: Medium

## Learning Objectives

- Understand the Proxy structural pattern
- Use JavaScript's Proxy API
- Implement validation, logging, and caching proxies
- Control access to objects

## The Problem

A Proxy wraps an object and intercepts operations on it. This enables:

- Validation before setting properties
- Logging property access
- Lazy loading
- Access control
- Caching

```javascript
// Without proxy: no control
user.age = -5; // Invalid but allowed!

// With proxy: validation
const safeUser = createValidatingProxy(user, {
  age: (value) => value >= 0 && value <= 150,
});
safeUser.age = -5; // Throws error!
```

## Requirements

### 1. Validation Proxy

Create a proxy that validates property values:

```javascript
const user = createValidatingProxy(
  {},
  {
    name: (v) => typeof v === "string" && v.length > 0,
    age: (v) => Number.isInteger(v) && v >= 0,
    email: (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v),
  },
);

user.name = "Alice"; // OK
user.age = 25; // OK
user.age = -5; // Error!
user.email = "bad"; // Error!
```

### 2. Logging Proxy

Create a proxy that logs all property access:

```javascript
const logged = createLoggingProxy(obj, (action, prop, value) => {
  console.log(`${action} ${prop}: ${value}`);
});

logged.name = "Alice"; // Log: "set name: Alice"
logged.name; // Log: "get name: Alice"
delete logged.name; // Log: "delete name: undefined"
```

### 3. Caching Proxy

Create a proxy that caches method results:

```javascript
const api = {
  fetchUser(id) {
    /* expensive */
  },
};

const cached = createCachingProxy(api, ["fetchUser"]);
cached.fetchUser(1); // Fetches
cached.fetchUser(1); // Returns cached
```

### 4. Access Control Proxy

Create a proxy that restricts access:

```javascript
const admin = { role: "admin", secret: "12345" };
const restricted = createAccessProxy(admin, {
  readable: ["role"],
  writable: [],
});

restricted.role; // 'admin'
restricted.secret; // Error: Access denied
restricted.role = "user"; // Error: Property is read-only
```

## Examples

```javascript
// JavaScript Proxy basics
const handler = {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`Setting ${prop} = ${value}`);
    target[prop] = value;
    return true;
  },
};

const proxy = new Proxy({}, handler);
proxy.name = "Alice"; // "Setting name = Alice"
proxy.name; // "Getting name" -> "Alice"

// Traps available: get, set, has, deleteProperty, apply, construct, etc.
```

## Hints

1. Use JavaScript's built-in `Proxy` class
2. Handler traps: `get`, `set`, `has`, `deleteProperty`, etc.
3. Return `true` from `set` trap to indicate success
4. Use `Reflect` for default behavior: `Reflect.get(target, prop)`
5. For methods, check if value is function before caching

## Resources

- [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN: Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [JavaScript.info: Proxy](https://javascript.info/proxy)
