# Assignment 16: State Machine

## Difficulty: Hard

## Learning Objectives

- Understand finite state machines (FSM)
- Implement state transitions with guards
- Handle complex state-dependent logic
- Build predictable state management

## The Problem

A state machine manages states and transitions. Instead of scattered if/else checks, all state logic is centralized and predictable.

```javascript
// Without state machine: scattered checks
if (order.status === "pending" && payment.received) {
  order.status = "paid";
} else if (order.status === "paid" && items.shipped) {
  order.status = "shipped";
}

// With state machine: clear transitions
orderMachine.transition("PAY"); // pending → paid
orderMachine.transition("SHIP"); // paid → shipped
```

## Requirements

### StateMachine Class

Create a `StateMachine` class:

```javascript
const machine = new StateMachine({
  initial: "idle",
  states: {
    idle: {
      on: {
        START: "running",
      },
    },
    running: {
      on: {
        PAUSE: "paused",
        STOP: "idle",
      },
    },
    paused: {
      on: {
        RESUME: "running",
        STOP: "idle",
      },
    },
  },
});
```

#### Properties

- `state` - Current state name

#### Methods

- `transition(event)` - Attempt state transition
- `can(event)` - Check if transition is allowed
- `getAvailableTransitions()` - Get valid events for current state

### Advanced Features

1. **Guards**: Conditions for transitions

```javascript
states: {
  cart: {
    on: {
      CHECKOUT: {
        target: 'payment',
        guard: (context) => context.items.length > 0
      }
    }
  }
}
```

2. **Actions**: Side effects on transition

```javascript
on: {
  SUBMIT: {
    target: 'submitted',
    action: (context) => console.log('Form submitted')
  }
}
```

3. **Context**: Data that travels with machine

```javascript
const machine = new StateMachine({
  initial: 'idle',
  context: { count: 0 },
  states: { ... }
});
```

## Examples

```javascript
// Traffic light
const trafficLight = new StateMachine({
  initial: "red",
  states: {
    red: { on: { TIMER: "green" } },
    green: { on: { TIMER: "yellow" } },
    yellow: { on: { TIMER: "red" } },
  },
});

trafficLight.state; // 'red'
trafficLight.transition("TIMER");
trafficLight.state; // 'green'

// Order workflow with guards
const orderMachine = new StateMachine({
  initial: "pending",
  context: { paid: false },
  states: {
    pending: {
      on: {
        PAY: {
          target: "processing",
          action: (ctx) => {
            ctx.paid = true;
          },
        },
        CANCEL: "cancelled",
      },
    },
    processing: {
      on: {
        SHIP: {
          target: "shipped",
          guard: (ctx) => ctx.paid === true,
        },
      },
    },
    shipped: {
      on: {
        DELIVER: "delivered",
      },
    },
    delivered: {},
    cancelled: {},
  },
});
```

## Hints

1. Store current state and configuration
2. `transition` looks up current state, finds matching event
3. Check guard before transitioning
4. Call action after successful transition
5. Return success/failure from transition

## Resources

- [XState](https://xstate.js.org/) - Full-featured state machine library
- [Statecharts](https://statecharts.dev/) - Visual state machine concepts
