---
name: hello-world
title: Hello, World!
description: A simple intro to recipes and step-by-step guides.
tags: [getting-started]
---

Get comfortable with how recipes work. This guide walks you through creating and running a basic script.

## Create a script file

Start by creating a new directory for your work and a TypeScript file inside it.

```bash
mkdir hello-world
cd hello-world
touch greet.ts
```

## Write the greeting function

Open `greet.ts` and add a simple function that logs a message.

```typescript
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

## Run your script

Execute the script using Node.js or a TypeScript runner.

```bash
npx ts-node greet.ts
```
