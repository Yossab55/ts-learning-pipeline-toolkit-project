# 🛡️ Backend Pipeline Toolkit

A lightweight, type-safe backend middleware, validation, and event-processing toolkit for Node.js, built with modern TypeScript.

---

## 🎯 Features

* 🏷️ **Branded Types:** Compile-time nominal safety preventing accidental identifier mixing (`UserId` vs `RequestId`).
* 🚨 **Typed Error Hierarchy:** Centralized error handling using `instanceof` type narrowing and safe `unknown` error formatting.
* 🔍 **Runtime Type Predicates:** Custom type guards (`param is Type`) for validating untrusted network payloads without runtime crashes.
* 🏭 **Higher-Order Middleware Factories:** Express-like configurable middleware pipeline leveraging closures and contextual typing.
* 🔀 **Function Overloads:** Compile-time signature switching for event dispatching with exact return type inference.
* 🛡️ **Exhaustive State Machine:** Predictable pipeline lifecycle states validated with `never` compile-time exhaustiveness checking.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm

### Installation
```bash
npm install
```

### Type Checking & Build
```bash
# Run TypeScript type check
npm run typecheck

# Build to JavaScript
npm run build
```

---

## 📚 Project Architecture

```
src/
├── types/       # Domain models, branded types, key query utilities
├── errors/      # Custom error classes and global error narrowers
├── guards/      # Runtime type predicates and validation guards
├── middleware/  # Higher-order middleware factories
└── pipeline/    # Event dispatcher, pipeline runner & state machine
```

---

## 📝 License
MIT
