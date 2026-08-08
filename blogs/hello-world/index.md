---
title: Getting Started with TypeScript
date: 2026-08-08
description: A quick introduction to TypeScript basics
tags: [getting-started, typescript]
---

TypeScript adds type safety to JavaScript. You write types, the compiler catches errors before runtime, and your code becomes easier to understand and maintain.

## Basic Types

Start with simple types: strings, numbers, booleans, and arrays. TypeScript infers many of these from your values, but you can also write them out:

```typescript
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;
let tags: string[] = ["react", "typescript"];
```

## Interfaces and Objects

Group related data with interfaces. They define the shape of objects and make it clear what properties your code expects:

```typescript
interface User {
  name: string;
  age: number;
  email?: string;
}

function getUser(user: User): string {
  return `${user.name} (${user.age})`;
}
```

The `?` after `email` means it's optional - users can exist without an email address.
