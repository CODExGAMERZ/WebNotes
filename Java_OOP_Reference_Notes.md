# Java Programming & Object-Oriented Programming (OOP) Reference Notes

This manual is a comprehensive, self-contained reference guide for learning **Java Programming** and **Object-Oriented Programming (OOP)** patterns in Java — from foundational JVM internals through modern language features introduced in Java 8–17+.

Throughout this guide, you will find highlighted **Notes**, **Warnings**, and **Important** callouts pointing out Virtual Machine optimizations, memory management guidelines, and potential compiler traps, alongside **Practice Questions** to test understanding at the end of every section. **The Answer Key & Explanations for all questions are placed at the end of this document in [§12](#12-answer-key--explanations), followed by your personalized signature.**

---

## Table of Contents
1. [Introduction to Java & The Virtual Machine Platform](#1-introduction-to-java--the-virtual-machine-platform)
2. [Java Syntax, Core Data Types & Memory Allocation](#2-java-syntax-core-data-types--memory-allocation)
3. [Operators & Control Flow](#3-operators--control-flow)
4. [Classes, Objects & Constructors](#4-classes-objects--constructors)
5. [OOP Pillar 1: Encapsulation & Access Modifiers](#5-oop-pillar-1-encapsulation--access-modifiers)
6. [OOP Pillar 2: Inheritance & super Keyword](#6-oop-pillar-2-inheritance--super-keyword)
7. [OOP Pillar 3: Polymorphism (Static vs. Dynamic Binding)](#7-oop-pillar-3-polymorphism-static-vs-dynamic-binding)
8. [OOP Pillar 4: Abstraction (Abstract Classes vs. Interfaces)](#8-oop-pillar-4-abstraction-abstract-classes-vs-interfaces)
9. [Exception Handling (Checked, Unchecked, Try-With-Resources)](#9-exception-handling-checked-unchecked-try-with-resources)
10. [File Input & Output (I/O Streams)](#10-file-input--output-io-streams)
11. [Essential Java Collections Framework](#11-essential-java-collections-framework)
12. [Answer Key & Explanations](#12-answer-key--explanations)

---

## 1. Introduction to Java & The Virtual Machine Platform

Java is a class-based, object-oriented programming language developed by **James Gosling** at Sun Microsystems and released in **1995**. Its core design philosophy is **"Write Once, Run Anywhere" (WORA)** — compiled Java code runs on any platform that hosts a compatible Java Virtual Machine, without recompilation.

### The Java Compilation and Execution Model

Unlike C/C++, which compile directly to CPU-specific machine binary code, and Python, which is interpreted directly from source code at runtime, Java uses a **hybrid compilation-interpretation** approach that combines the safety of compile-time checking with the portability of an intermediate representation:

1. **Compilation:** The Java compiler (`javac`) translates human-readable source code (`.java` files) into platform-independent intermediate **Bytecode** (`.class` files).
2. **Execution:** The **Java Virtual Machine (JVM)** loads, verifies, and executes this bytecode on the host computer, translating it to native machine instructions on the fly.

```
[Source Code (.java)]
        │
        ▼  javac (compiler)
[Bytecode (.class)]
        │
        ▼  JVM (interpreter + JIT compiler)
[Native Machine Code]  ──▶  Executed by CPU
```

### Key JVM Components

| Component | Full Name | Role |
|:---|:---|:---|
| **JVM** | Java Virtual Machine | The core engine that loads and executes Java Bytecode. |
| **JRE** | Java Runtime Environment | Bundles the JVM with the standard class libraries needed to **run** Java programs. |
| **JDK** | Java Development Kit | A superset of the JRE: includes the compiler (`javac`), debugger (`jdb`), archiver (`jar`), documentation generator (`javadoc`), and all development utilities. |

> [!NOTE]
> **JIT Compiler Optimization**
> While interpreting bytecode, the JVM's **Just-In-Time (JIT) Compiler** monitors execution and identifies frequently executed code paths called **"hot spots."** These hot spots are compiled directly into optimized native machine code at runtime, dramatically improving performance. This is why the reference implementation of the JVM is called **HotSpot**.

### JVM Memory Model

Understanding how the JVM organizes memory is critical for writing performant applications and diagnosing issues like `OutOfMemoryError`.

```
┌─────────────────────────────────────────────────────┐
│                     JVM MEMORY                      │
├──────────────────────┬──────────────────────────────┤
│     HEAP (Shared)    │     NON-HEAP                 │
│  ┌────────────────┐  │  ┌────────────────────────┐  │
│  │   Young Gen    │  │  │     Metaspace           │  │
│  │  ┌──────────┐  │  │  │  (Class metadata,       │  │
│  │  │   Eden   │  │  │  │   method bytecode,      │  │
│  │  ├──────────┤  │  │  │   constant pools)       │  │
│  │  │Survivor 0│  │  │  └────────────────────────┘  │
│  │  ├──────────┤  │  │  ┌────────────────────────┐  │
│  │  │Survivor 1│  │  │  │   Thread Stacks         │  │
│  │  └──────────┘  │  │  │  (One stack per thread:  │  │
│  ├────────────────┤  │  │   local vars, frames)    │  │
│  │   Old Gen      │  │  └────────────────────────┘  │
│  │  (Tenured)     │  │  ┌────────────────────────┐  │
│  │                │  │  │  Code Cache              │  │
│  └────────────────┘  │  │  (JIT-compiled code)     │  │
└──────────────────────┴──┴────────────────────────┘  │
                                                       │
└─────────────────────────────────────────────────────┘
```

**Heap Regions:**

| Region | Purpose | Garbage Collection |
|:---|:---|:---|
| **Eden** (Young Gen) | Where all new objects are initially allocated. | Minor GC — fast, frequent. |
| **Survivor 0 & 1** (Young Gen) | Objects that survive one or more Minor GCs are moved here. | Minor GC — objects bounce between S0 and S1. |
| **Old Gen** (Tenured) | Long-lived objects promoted from Young Gen after surviving several GC cycles. | Major GC (Full GC) — slower, less frequent. |
| **Metaspace** (Non-Heap) | Stores class metadata, replacing the old PermGen (removed in Java 8). Grows dynamically from native memory. | Collected when classes are unloaded. |

### Class Loading Mechanism

The JVM loads classes on demand through a hierarchical **ClassLoader** delegation model:

1. **Bootstrap ClassLoader** — Loads core Java API classes from `rt.jar` (or the `java.base` module in Java 9+). Written in native code.
2. **Platform (Extension) ClassLoader** — Loads classes from the platform extensions directory.
3. **Application ClassLoader** — Loads classes from the application classpath (`-cp` or `CLASSPATH`).

```java
// Inspecting the class loader hierarchy
public class ClassLoaderDemo {
    public static void main(String[] args) {
        // Application ClassLoader loads our class
        ClassLoader appLoader = ClassLoaderDemo.class.getClassLoader();
        System.out.println("App ClassLoader:      " + appLoader);

        // Platform ClassLoader is the parent
        System.out.println("Platform ClassLoader: " + appLoader.getParent());

        // Bootstrap ClassLoader is represented as null in Java
        System.out.println("Bootstrap ClassLoader: " + appLoader.getParent().getParent());
    }
}
```

> [!IMPORTANT]
> **Delegation Model:** When asked to load a class, a ClassLoader first delegates the request to its parent. Only if the parent cannot find the class does the child attempt to load it. This prevents duplicate loading and ensures core Java classes cannot be overridden by user code.

```java
// Standard entry point in Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

### 🌍 Real-World Analogy
> - **JVM/WORA:** Think of compile-once run-anywhere like a **universal DVD player**: instead of rendering different video types for Sony, Samsung, and LG TVs, the movie is burned to a standard DVD format (bytecode `.class` files), and each manufacturer builds its own player (JVM) to translate standard DVD tracks to their TV's specific electronics.
> - **JIT Compiler:** The JIT compiler is like a **translator who memorizes frequent phrases**: rather than looking up the same foreign sentence in a dictionary every time (interpreting bytecode), they translate it once to native speech and memorize it (JIT-compiled native code) to repeat it instantly the next time.
> - **Class Loaders:** This system is like a **library's lookup hierarchy**: checking your desk bookshelf first (System ClassLoader), then the reference section (Platform ClassLoader), and finally calling the main library archives (Bootstrap ClassLoader).
>
> **💼 Industry Application:** Large scale systems like **Elasticsearch**, **Apache Spark**, and enterprise backend APIs run on JVM-based systems. Financial institutions use HotSpot's JIT optimization because low-latency server transactions automatically speed up over runtime as hotspots are compiled directly to machine binary.

### Practice Questions

* **Question 1:** Explain how Java achieves platform independence, highlighting the roles of `.class` files, Bytecode, and the JVM.
* **Question 2:** Describe the three regions of the JVM Heap (Eden, Survivor, Old Gen) and explain what triggers a Minor GC versus a Major (Full) GC.

---

## 2. Java Syntax, Core Data Types & Memory Allocation

Java is a **statically typed** language, meaning every variable must be declared with an explicit data type before it can be used. The compiler enforces type correctness at compile time, catching type mismatches before the program ever runs.

### Primitives vs. Reference Types

Java divides data types into two fundamental categories:

1. **Primitive Types:** Basic scalar values stored directly on the **Stack** (when local) or inline within the containing object (when fields).
2. **Reference Types:** Complex objects (arrays, Strings, custom classes) instantiated on the **Heap**. The variable on the Stack holds a **memory address reference** pointing to the heap object.

#### Primitive Data Type Summary

| Type | Size | Min Value | Max Value | Default | Example |
|:---|:---|:---|:---|:---|:---|
| `byte` | 1 byte | -128 | 127 | `0` | `byte b = 100;` |
| `short` | 2 bytes | -32,768 | 32,767 | `0` | `short s = 30000;` |
| `int` | 4 bytes | -2³¹ | 2³¹ − 1 | `0` | `int i = 42;` |
| `long` | 8 bytes | -2⁶³ | 2⁶³ − 1 | `0L` | `long l = 99L;` |
| `float` | 4 bytes | ±1.4E-45 | ±3.4E+38 | `0.0f` | `float f = 3.14f;` |
| `double` | 8 bytes | ±4.9E-324 | ±1.8E+308 | `0.0d` | `double d = 2.718;` |
| `char` | 2 bytes | `\u0000` | `\uffff` | `\u0000` | `char c = 'A';` |
| `boolean` | ~1 bit* | — | — | `false` | `boolean ok = true;` |

> [!NOTE]
> **Boolean Size:** The JVM specification does not mandate a precise size for `boolean`. In practice, the HotSpot JVM stores a `boolean` as a full `int` (4 bytes) on the stack and as a `byte` (1 byte) in arrays.

```java
// Primitive vs. Reference memory layout
int score = 100;                       // Primitive: value 100 stored directly on Stack
String name = new String("Alice");     // Reference: pointer on Stack → object on Heap
```

### Autoboxing, Unboxing, and Wrapper Class Caching

For every primitive type, Java provides a corresponding **wrapper class** that allows primitives to be used as objects (required by Collections, Generics, etc.):

| Primitive | Wrapper Class |
|:---|:---|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

* **Autoboxing:** Automatic conversion from primitive → wrapper object (e.g., `int` → `Integer`).
* **Unboxing:** Automatic conversion from wrapper object → primitive (e.g., `Integer` → `int`).

```java
Integer x = 50;    // Autoboxing: compiler converts to Integer.valueOf(50)
int y = x;         // Unboxing:   compiler converts to x.intValue()
```

> [!WARNING]
> **Wrapper Class Caching Pitfall (-128 to 127)**
> Java caches `Integer` objects for values in the range **-128 to 127**. Within this range, `Integer.valueOf()` returns the same cached object, so `==` comparison works. Outside this range, new objects are created, and `==` will return `false` even for equal values. **Always use `.equals()` to compare wrapper objects.**
> ```java
> Integer a = 127;
> Integer b = 127;
> System.out.println(a == b);       // true  — cached, same object
>
> Integer c = 128;
> Integer d = 128;
> System.out.println(c == d);       // false — different objects!
> System.out.println(c.equals(d));  // true  — correct comparison
> ```

### The String Pool

Java maintains a special memory region within the Heap called the **String Pool** (also known as the String Intern Pool). When you create a String using a **literal**, the JVM checks the pool first:

```
                 HEAP MEMORY
    ┌────────────────────────────────────┐
    │        String Pool                 │
    │   ┌──────────┐  ┌──────────┐      │
    │   │ "Hello"  │  │ "World"  │      │
    │   └────▲─────┘  └──────────┘      │
    │        │                           │
    │        │  (both point here)        │
    │        │                           │
    ├────────┼───────────────────────────┤
    │        │   Regular Heap Objects    │
    │   ┌────┴─────┐                    │
    │   │ "Hello"  │ ← new String()     │
    │   └──────────┘   (separate copy)  │
    └────────────────────────────────────┘

Stack:
  s1 ──────┐
  s2 ──────┘──▶  Pool "Hello"  (same reference)
  s3 ──────────▶  Heap "Hello"  (different object)
```

```java
String s1 = "Hello";               // Created in String Pool
String s2 = "Hello";               // Reuses existing pool entry
String s3 = new String("Hello");   // Forces a NEW object on the regular Heap

System.out.println(s1 == s2);      // true  — same pool reference
System.out.println(s1 == s3);      // false — different objects
System.out.println(s1.equals(s3)); // true  — same character content

// You can explicitly intern a string to move it into the pool
String s4 = s3.intern();
System.out.println(s1 == s4);      // true  — now points to pool entry
```

### Local Variable Type Inference: `var` (Java 10+)

Starting with Java 10, you can use the `var` keyword for **local variable type inference**. The compiler infers the type from the initializer expression on the right-hand side.

```java
// Instead of explicit type declarations:
ArrayList<String> names = new ArrayList<>();

// You can write:
var names = new ArrayList<String>();  // Compiler infers ArrayList<String>

var count = 10;         // Inferred as int
var price = 19.99;      // Inferred as double
var message = "Hello";  // Inferred as String
```

> [!CAUTION]
> **`var` Restrictions:**
> - `var` can **only** be used for local variables with an initializer — not for method parameters, return types, or fields.
> - `var` is **not a keyword** — it is a reserved type name. You can still use `var` as a variable name (though you shouldn't).
> - Avoid `var` when the type is not obvious from the right-hand side: `var result = process();` hides the return type and reduces readability.

### Java Garbage Collection

> [!IMPORTANT]
> **Automatic Memory Management**
> Java manages Heap memory automatically. The **Garbage Collector (GC)** runs inside the JVM, scanning the Heap to find and reclaim objects that are no longer reachable from any live thread's stack or static references. This prevents memory leaks that plague languages with manual memory management. However, the GC cannot collect objects that are still referenced — holding unnecessary references (e.g., in a growing `List`) causes **memory leaks** even in Java.

### 🌍 Real-World Analogy
> - **Stack vs. Heap:** Think of Stack vs. Heap as a **desk workspace vs. a giant warehouse**. The **Stack** is your desk: it's tiny, clean, and everything is organized in quick arms-reach (frames containing primitive local variables). The **Heap** is a huge warehouse: you rent space to store large crates of equipment (objects). You write the warehouse bin location on a sticky note (reference pointer) and keep it on your desk so you can find the crate when needed.
> - **String Pool:** This acts like a **shared office whiteboard**: if two team members want to write the exact same motivational slogan, they point to the slogan already written on the whiteboard rather than writing a new one.
> - **Wrapper Cache:** Wrapper caching is like a **store's loyalty card points**: small, common values (like integers -128 to 127) are pre-printed and cached on cards ready to hand out instantly to customers.
>
> **💼 Industry Application:** High-throughput backend APIs reuse pre-allocated string references (via interning or pooling) to prevent garbage collection pauses, which could otherwise delay transactions. Local variable type inference (`var`) is heavily used in modern frameworks like Spring Boot to write cleaner controller and database query code without verbose declarations.

### Practice Questions

* **Question 3:** Predict the outcome of the following statements. Which variable lives on the Stack, and which object lives on the Heap?
  ```java
  Integer x = 50;
  int y = x;
  ```
* **Question 4:** What will the following code print, and why?
  ```java
  Integer a = 200;
  Integer b = 200;
  System.out.println(a == b);
  System.out.println(a.equals(b));
  ```

---

## 3. Operators & Control Flow

### Operators in Java

#### Arithmetic Operators

| Operator | Description | Example | Notes |
|:---|:---|:---|:---|
| `+` | Addition | `5 + 3` → `8` | Also used for String concatenation |
| `-` | Subtraction | `5 - 3` → `2` | |
| `*` | Multiplication | `5 * 3` → `15` | |
| `/` | Division | `7 / 2` → `3` | Integer division truncates the fractional part |
| `%` | Modulus (Remainder) | `7 % 2` → `1` | Useful for even/odd checks |

#### Relational Operators

| Operator | Meaning | Example |
|:---|:---|:---|
| `==` | Equal to | `a == b` |
| `!=` | Not equal to | `a != b` |
| `>` | Greater than | `a > b` |
| `<` | Less than | `a < b` |
| `>=` | Greater than or equal to | `a >= b` |
| `<=` | Less than or equal to | `a <= b` |

#### Logical Operators

| Operator | Name | Behavior |
|:---|:---|:---|
| `&&` | Short-circuit AND | Evaluates right operand only if left is `true` |
| `\|\|` | Short-circuit OR | Evaluates right operand only if left is `false` |
| `!` | Logical NOT | Inverts boolean value |

#### Assignment & Shorthand Operators

`=`, `+=`, `-=`, `*=`, `/=`, `%=`, `<<=`, `>>=`, `&=`, `^=`, `|=`

### The Ternary (Conditional) Operator

The ternary operator is a concise single-line replacement for simple `if-else` statements:

```java
// Syntax: condition ? valueIfTrue : valueIfFalse
int age = 20;
String status = (age >= 18) ? "Adult" : "Minor";
System.out.println(status);  // Output: Adult

// Ternary can be nested (but avoid deep nesting for readability)
String category = (age < 13) ? "Child" : (age < 18) ? "Teen" : "Adult";
```

> [!WARNING]
> **The String Comparison Pitfall**
> In Java, the `==` operator on reference objects checks if they point to the **exact same memory address** on the Heap, not if they have the same value. To compare the actual contents of two String objects, you must use the `.equals()` method.
> ```java
> String s1 = new String("Java");
> String s2 = new String("Java");
> System.out.println(s1 == s2);      // false (different references)
> System.out.println(s1.equals(s2)); // true  (identical character contents)
> ```

---

### Control Flow Structures

#### Conditionals: `if-else`

```java
int score = 85;
if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 80) {
    System.out.println("Grade: B");  // This executes
} else {
    System.out.println("Grade: C");
}
```

#### Traditional `switch` Statement

```java
int day = 3;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;     // Without break, execution "falls through" to the next case
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Other day");
}
```

#### Switch Expressions (Java 14+)

Java 14 introduced **switch expressions** with arrow syntax (`->`) that eliminate fall-through bugs and allow `switch` to return a value:

```java
int day = 3;

// Switch expression — returns a value, no break needed
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    case 6, 7 -> "Weekend";       // Multiple labels in one case
    default -> "Invalid day";
};
System.out.println(dayName);  // Output: Wednesday

// Multi-line case blocks use "yield" to return a value
String description = switch (day) {
    case 1, 2, 3, 4, 5 -> {
        System.out.println("Processing weekday...");
        yield "Weekday";     // "yield" returns a value from a block
    }
    case 6, 7 -> "Weekend";
    default -> "Invalid";
};
```

> [!NOTE]
> **Switch Expressions Key Rules:**
> - Arrow (`->`) cases do **not** fall through — no `break` needed.
> - All possible values must be covered (use `default` as a catch-all).
> - Use `yield` to return a value from a multi-statement block.

#### `instanceof` Pattern Matching (Java 16+)

Traditional `instanceof` checks require a separate cast statement. Java 16 introduced **pattern matching** that combines the type check and variable binding into a single expression:

```java
// Traditional approach (pre-Java 16)
Object obj = "Hello, World!";
if (obj instanceof String) {
    String s = (String) obj;     // Explicit cast required
    System.out.println(s.toUpperCase());
}

// Modern pattern matching (Java 16+)
if (obj instanceof String s) {   // Type check + binding variable in one step
    System.out.println(s.toUpperCase());  // 's' is already cast to String
}

// The binding variable's scope extends to the else-if chain
if (obj instanceof Integer n) {
    System.out.println("Integer: " + n);
} else if (obj instanceof String s) {
    System.out.println("String: " + s);
} else {
    System.out.println("Unknown type");
}
```

### Loops

| Loop | When to Use |
|:---|:---|
| `while` | When the number of iterations is unknown; condition checked **before** each iteration. |
| `do-while` | When the body must execute **at least once**; condition checked **after** each iteration. |
| `for` | When the number of iterations is known in advance. |
| `for-each` | When iterating through all elements of an array or `Iterable` without needing the index. |

```java
// Enhanced For Loop (for-each) — clean iteration over arrays/collections
String[] fruits = {"Apple", "Banana", "Cherry"};
for (String fruit : fruits) {
    System.out.println(fruit);
}
```

### 🌍 Real-World Analogy
> - **Equality (`==` vs `.equals()`):** This is like **comparing house addresses vs. comparing house interiors**. If you check `addressA == addressB`, you are checking if both pointers lead to the exact same physical plot of land. If you check `houseA.equals(houseB)`, you are walking inside both houses to see if they have the same layout and furniture (same values), even if they are located on different streets.
> - **Ternary Operator:** A ternary operator is like a quick **coin flip decision**: "heads, we go out; tails, we stay in".
> - **Switch Expressions & Pattern Matching:** These act like a **smart sorting machine at a postal office**: looking at the package shape, size, and destination and routing it accordingly in one swift motion.
>
> **💼 Industry Application:** Web security filters and authentication protocols use `.equals()` to safely verify password credentials. Modern Java microservices (e.g., Quarkus, Micronaut) use pattern matching in their request routers to match incoming JSON payloads to specific service handler methods.

### Practice Questions

* **Question 5:** What is printed by this code snippet?
  ```java
  String a = "Hello";
  String b = "Hello";
  System.out.print((a == b) + " " + a.equals(b));
  ```
  *(Hint: Consider Java's internal String Pool mechanism).*
* **Question 6:** Rewrite the following `if-else` chain as a switch expression (Java 14+):
  ```java
  String result;
  if (code == 200) result = "OK";
  else if (code == 404) result = "Not Found";
  else if (code == 500) result = "Server Error";
  else result = "Unknown";
  ```

---

## 4. Classes, Objects & Constructors

Java is **class-centric** — every executable line of code must reside inside a class. Classes are the fundamental building blocks of all Java programs.

### Classes and Objects

* **Class:** A structural blueprint that defines the fields (data) and methods (behavior) that objects of that type will have.
* **Object:** A concrete instance of a class, allocated on the Heap at runtime using the `new` keyword.

```java
public class User {
    // Instance fields — each object gets its own copy
    String username;
    int age;

    // Instance method — operates on the object's own data
    public void display() {
        System.out.println("User: " + username + ", Age: " + age);
    }
}

// Creating objects
User alice = new User();
alice.username = "Alice";
alice.age = 25;
alice.display();  // Output: User: Alice, Age: 25
```

### Static vs. Instance Context

Understanding the distinction between `static` and instance members is essential:

| Aspect | `static` (Class-Level) | Instance (Object-Level) |
|:---|:---|:---|
| **Belongs to** | The class itself | A specific object |
| **Accessed via** | `ClassName.member` | `objectRef.member` |
| **Memory** | Single copy in Metaspace | One copy per object on Heap |
| **Can access** | Only other `static` members directly | Both `static` and instance members |
| **Use case** | Utility methods, constants, counters | Object-specific state and behavior |

```java
public class Counter {
    static int totalCount = 0;   // Shared across ALL Counter objects
    int instanceId;              // Unique to each object

    public Counter() {
        totalCount++;
        this.instanceId = totalCount;
    }

    // Static method — can only access static members directly
    public static int getTotalCount() {
        // Cannot use "this" or access instanceId here
        return totalCount;
    }

    // Instance method — can access both static and instance members
    public String getInfo() {
        return "Instance #" + instanceId + " of " + totalCount;
    }
}
```

> [!WARNING]
> **Common Mistake:** You cannot reference `this` or instance variables from a `static` method. The `static` method belongs to the class, not to any particular instance. Attempting `this.field` inside a static method causes a compile error.

---

### Constructors

Constructors are special methods called automatically when a new object is created with `new`.

* They have the **exact same name** as the class.
* They have **no return type** (not even `void`).
* **Constructor Overloading:** Defining multiple constructors with different parameter signatures.
* **Constructor Chaining:** Using `this()` to call another constructor in the same class, or `super()` to call a parent class constructor.

```java
public class Product {
    String name;
    double price;

    // Default (No-arg) Constructor
    public Product() {
        this("Unknown", 0.0);  // Constructor chaining with this()
    }

    // Parameterized Constructor
    public Product(String name, double price) {
        this.name = name;    // "this" resolves ambiguity between field and parameter
        this.price = price;
    }

    @Override
    public String toString() {
        return name + " ($" + price + ")";
    }
}
```

> [!NOTE]
> **The Implicit Default Constructor Rule**
> If you write a class without defining any constructors, Java automatically inserts a blank default constructor: `public ClassName() {}`. However, the moment you define **any** constructor (including a parameterized one), Java **stops** generating the default. If you still need a no-arg constructor, you must write it explicitly.

### Record Classes (Java 16+)

**Records** are a special kind of class designed for simple data carriers — classes whose primary purpose is to hold data. Records automatically generate the constructor, `equals()`, `hashCode()`, `toString()`, and accessor methods.

```java
// Traditional approach: ~30 lines of boilerplate
// Record approach: 1 line
public record Point(int x, int y) { }

// Usage:
Point p = new Point(3, 7);
System.out.println(p.x());           // 3  — accessor method (not getX())
System.out.println(p.y());           // 7
System.out.println(p);               // Point[x=3, y=7]  — auto-generated toString()
System.out.println(p.equals(new Point(3, 7)));  // true — auto-generated equals()
```

**Record characteristics:**
- All fields are implicitly `private final` — records are **immutable**.
- Records implicitly extend `java.lang.Record` and cannot extend other classes.
- Records can implement interfaces, have static fields, and define custom methods.
- You can define a **compact constructor** for validation:

```java
public record Person(String name, int age) {
    // Compact constructor — parameters are implicitly assigned after this block
    public Person {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        name = name.trim();  // Normalize before assignment
    }
}
```

### Sealed Classes (Java 17+)

**Sealed classes** restrict which classes can extend them, giving you precise control over your type hierarchy. This is especially useful for domain modeling where you want a closed set of subtypes.

```java
// Only Circle, Rectangle, and Triangle may extend Shape
public sealed class Shape permits Circle, Rectangle, Triangle {
    // Common fields and methods
    public abstract double area();
}

// Permitted subclasses must be final, sealed, or non-sealed
public final class Circle extends Shape {
    private final double radius;

    public Circle(double radius) { this.radius = radius; }

    @Override
    public double area() { return Math.PI * radius * radius; }
}

public final class Rectangle extends Shape {
    private final double width, height;

    public Rectangle(double w, double h) { this.width = w; this.height = h; }

    @Override
    public double area() { return width * height; }
}

// non-sealed allows further unrestricted subclassing
public non-sealed class Triangle extends Shape {
    private final double base, height;

    public Triangle(double b, double h) { this.base = b; this.height = h; }

    @Override
    public double area() { return 0.5 * base * height; }
}
```

> [!IMPORTANT]
> **Sealed classes + pattern matching** work together powerfully. Because the compiler knows all permitted subtypes, it can check exhaustiveness in `switch` expressions — warning you if you forget to handle a subtype.

### 🌍 Real-World Analogy
> - **Class vs. Object:** A class is an **architectural blueprint**, and an object is the **physical house** built from that blueprint.
> - **Static vs. Instance Context:** A `static` field or method is like a **shared community bulletin board** in the building lobby: there is only one board for the entire building, and any tenant can write on it or read from it, whereas non-static fields are like the individual private bulletin boards inside each tenant's apartment.
> - **Record Classes:** These are like **pre-printed forms**: once you fill in the fields, the document is a fixed, read-only record.
> - **Sealed Classes:** These are like a **franchise agreement**: only authorized business owners (permitted subclasses) are allowed to open stores under that brand.
>
> **💼 Industry Application:** Record classes are used in modern API development to represent immutable **Data Transfer Objects (DTOs)** for JSON serialization. Sealed classes are used in domain-driven design to represent restricted data hierarchies, such as payment status results (`Success`, `Pending`, `Failed`).

### Practice Questions

* **Question 7:** What is constructor chaining, and how are the `this()` and `super()` keywords used to call constructors within the same class or a parent class?
* **Question 8:** Convert the following traditional class into a Java `record`. What methods are auto-generated?
  ```java
  public class Coordinate {
      private final double lat;
      private final double lon;
      // constructor, getters, equals, hashCode, toString...
  }
  ```

---

## 5. OOP Pillar 1: Encapsulation & Access Modifiers

**Encapsulation** is the practice of bundling data (fields) and the methods that operate on that data into a single unit (class), while restricting direct external access to the internal state. We achieve this by:

1. Declaring fields as `private`.
2. Providing controlled access through public **getter** and **setter** methods.

This pattern protects data integrity by allowing validation, computation, or logging inside the accessor methods.

```java
public class Employee {
    private String name;
    private double salary;  // Private — cannot be modified directly from outside

    // Constructor
    public Employee(String name, double salary) {
        this.name = name;
        setSalary(salary);  // Use setter for validation even in constructor
    }

    // Getter — read access
    public double getSalary() {
        return this.salary;
    }

    // Setter — write access with validation
    public void setSalary(double salary) {
        if (salary >= 0) {
            this.salary = salary;
        } else {
            throw new IllegalArgumentException("Salary cannot be negative: " + salary);
        }
    }

    // Getter for name (read-only — no setter provided)
    public String getName() {
        return this.name;
    }
}
```

---

### Access Modifiers in Java

Java uses four levels of access control, from most restrictive to most permissive:

| Modifier | Class | Package | Subclass (any package) | World |
|:---|:---:|:---:|:---:|:---:|
| `private` | ✅ | ❌ | ❌ | ❌ |
| **Default** (no keyword) | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

> [!NOTE]
> **Package-Private (Default) vs. Protected**
> Members with `default` access are visible only within the same package. Members with `protected` access are visible within the same package **and** to subclasses in different packages (but only through inheritance, not through an arbitrary reference).

### Designing Immutable Classes

An **immutable class** is one whose instances cannot be modified after creation. Immutable objects are inherently thread-safe, can be freely shared, and make excellent keys for `HashMap`.

**Rules for creating an immutable class:**

1. Declare the class as `final` (prevents subclassing).
2. Make all fields `private` and `final`.
3. Provide no setter methods.
4. Initialize all fields via the constructor.
5. For fields referencing mutable objects (e.g., `Date`, `List`), return **defensive copies** from getters.

```java
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;

public final class ImmutableStudent {
    private final String name;
    private final int age;
    private final List<String> courses;

    public ImmutableStudent(String name, int age, List<String> courses) {
        this.name = name;
        this.age = age;
        // Defensive copy — prevents external list from modifying our state
        this.courses = new ArrayList<>(courses);
    }

    public String getName()  { return name; }
    public int getAge()      { return age; }

    // Return an unmodifiable view — prevents callers from modifying the internal list
    public List<String> getCourses() {
        return Collections.unmodifiableList(courses);
    }
}
```

### JavaBeans Conventions

The **JavaBeans** specification defines a standard naming convention used extensively by frameworks (Spring, Hibernate, Jackson, etc.):

| Convention | Rule | Example |
|:---|:---|:---|
| **Class** | Public class with a public no-arg constructor | `public class User { }` |
| **Fields** | Private | `private String name;` |
| **Getter** | `getFieldName()` (or `isFieldName()` for booleans) | `public String getName()` |
| **Setter** | `setFieldName(Type value)` | `public void setName(String name)` |
| **Serializable** | Implement `java.io.Serializable` (optional but recommended) | `implements Serializable` |

```java
import java.io.Serializable;

// JavaBean-compliant class
public class UserBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String username;
    private boolean active;

    public UserBean() { }  // No-arg constructor required

    public String getUsername()           { return username; }
    public void setUsername(String name)  { this.username = name; }

    public boolean isActive()            { return active; }     // "is" prefix for boolean
    public void setActive(boolean active){ this.active = active; }
}
```

### 🌍 Real-World Analogy
> - **Encapsulation:** Private fields are like a **bank vault**, and getter/setter methods are like a **bank teller**. You cannot walk into the bank vault and grab money (data) directly. Instead, you go to the teller window, and the teller checks your ID, validates your deposit/withdrawal amount (data validation in set methods), and updates the vault safely.
> - **Immutable Object:** An immutable object is like a **sealed envelope containing a letter**: once closed and sent, you cannot alter its contents without tearing it up and creating a new envelope.
>
> **💼 Industry Application:** Enterprise APIs wrap database model attributes using private fields and JavaBeans getter/setter methods to ensure that negative values (like a negative product price or age) cannot be set, keeping the system database consistent.

### Practice Questions

* **Question 9:** A class `Parent` in package `A` has a `protected void show()` method. Class `Child` in package `B` inherits from `Parent`. Can an instance of `Child` call `show()`? Can an unrelated class `Test` in package `B` call it?
* **Question 10:** Why does making a field `final` alone not guarantee immutability if the field references a mutable object like `ArrayList`? What additional step is required?

---

## 6. OOP Pillar 2: Inheritance & super Keyword

**Inheritance** allows a child class (subclass) to acquire the fields and methods of a parent class (superclass), promoting code reuse and establishing a natural hierarchy. In Java, class inheritance is declared using the `extends` keyword.

```java
class Vehicle {
    protected String brand = "Toyota";

    public void honk() {
        System.out.println("Beep!");
    }
}

// Car inherits all non-private members from Vehicle
class Car extends Vehicle {
    private String model = "Prius";

    public void showDetails() {
        System.out.println(brand + " " + model);  // Accesses inherited field "brand"
    }
}
```

---

### The `super` Keyword

The `super` keyword refers to the parent class instance, enabling three key operations:

1. **Call parent constructors** — must be the **first statement** in the subclass constructor.
2. **Call overridden parent methods** — access the parent's version when the child has overridden it.
3. **Access parent fields** — when shadowed by a child field of the same name.

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    public void makeNoise() {
        System.out.println(name + " makes a noise.");
    }
}

class Dog extends Animal {
    String breed;

    public Dog(String name, String breed) {
        super(name);        // Must be first line — calls Animal(String)
        this.breed = breed;
    }

    @Override
    public void makeNoise() {
        super.makeNoise();  // Calls parent version: "Rex makes a noise."
        System.out.println(name + " barks!");
    }
}
```

> [!IMPORTANT]
> **Single Inheritance Limitation**
> To avoid ambiguity (e.g., the **Diamond Problem**, where a class inherits identical methods from two different parents), Java does **not** support multiple inheritance of classes. A class can only extend **one** parent class. However, a class can implement **multiple interfaces**, which provides an alternative mechanism for achieving multiple inheritance of behavior.

### The `final` Keyword: Classes, Methods, and Variables

The `final` keyword serves three distinct purposes depending on where it is applied:

| Applied To | Effect | Example |
|:---|:---|:---|
| **Class** | Prevents the class from being subclassed (extended). | `final class MathUtils { }` |
| **Method** | Prevents the method from being overridden in subclasses. | `final void calculate() { }` |
| **Variable** | Makes the variable a constant — it can only be assigned once. | `final int MAX = 100;` |

```java
// final class — cannot be extended
public final class Constants {
    public static final double PI = 3.14159265358979;
    public static final int MAX_RETRIES = 3;
}

// final method — cannot be overridden
class BaseLogger {
    public final void log(String message) {
        System.out.println("[LOG] " + message);
    }
}

class AppLogger extends BaseLogger {
    // ERROR: Cannot override final method 'log'
    // public void log(String message) { ... }
}

// final variable — assigned once, cannot be reassigned
final int maxSize = 100;
// maxSize = 200;  // Compile error: cannot assign a value to final variable
```

> [!CAUTION]
> **`final` on reference variables** prevents reassignment of the reference, but does **not** make the referenced object immutable. A `final List<String>` can still have elements added or removed — only the reference itself cannot point to a different list.
> ```java
> final List<String> names = new ArrayList<>();
> names.add("Alice");   // Legal — modifying the object's contents
> // names = new ArrayList<>();  // Compile error — reassigning the reference
> ```

### The `Object` Class: Root of All Java Classes

Every class in Java implicitly extends `java.lang.Object`. This class provides several critical methods that you should understand and often override:

| Method | Purpose | When to Override |
|:---|:---|:---|
| `toString()` | Returns a string representation of the object. | Always — default output like `User@1a2b3c` is not useful. |
| `equals(Object o)` | Checks logical equality between two objects. | When your class represents a value (e.g., `Money`, `Coordinate`). |
| `hashCode()` | Returns a hash integer for the object. | **Always** override together with `equals()` — required by `HashMap`/`HashSet`. |
| `getClass()` | Returns the runtime class of the object. | Rarely — typically used for reflection. |
| `clone()` | Creates a shallow copy of the object. | Rarely — prefer copy constructors or factory methods. |

```java
public class Student {
    private String name;
    private int id;

    public Student(String name, int id) {
        this.name = name;
        this.id = id;
    }

    @Override
    public String toString() {
        return "Student{name='" + name + "', id=" + id + "}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;                        // Same reference
        if (o == null || getClass() != o.getClass()) return false;  // Null or wrong type
        Student student = (Student) o;
        return id == student.id && name.equals(student.name);
    }

    @Override
    public int hashCode() {
        // Contract: if equals() returns true, hashCode() must return the same value
        return java.util.Objects.hash(name, id);
    }
}
```

> [!WARNING]
> **The `equals`-`hashCode` Contract:** If you override `equals()` without overriding `hashCode()`, objects that are logically equal may end up in different hash buckets, causing `HashMap` and `HashSet` to malfunction. **Always override both together.**

### 🌍 Real-World Analogy
> - **Inheritance:** Inheritance is like a **family tree of vehicles**: a general `Vehicle` class defines properties like engine and doors; a `Car` subclass inherits these and adds trunk space, while a `Motorcycle` adds a kickstand.
> - **The `super` Keyword:** The `super` keyword is like **calling your parent for advice**: you reuse their wisdom (parent constructor/methods) to initialize your own character.
> - **The `final` Keyword:** The `final` keyword is like a **locked document**: a final class cannot be extended, a final method cannot be overridden, and a final variable is a permanent value.
>
> **💼 Industry Application:** Frameworks like JUnit rely on base test classes containing common configuration methods (`setup()`) which are inherited by all test suite classes. The `final` keyword is critical in security APIs to prevent attackers from overriding system security classes (like `java.lang.String`, which is final).

### Practice Questions

* **Question 11:** Explain the difference between **Method Overloading** (compile-time polymorphism) and **Method Overriding** (runtime polymorphism).
* **Question 12:** Why is it critical to override `hashCode()` whenever you override `equals()`? What can go wrong if you don't?

---

## 7. OOP Pillar 3: Polymorphism (Static vs. Dynamic Binding)

**Polymorphism** ("many forms") is the ability of an entity to take on different forms. In Java, this means a single reference variable can point to objects of different types within an inheritance hierarchy, and the correct method implementation is selected based on the actual object type.

```java
// Upcasting: Parent reference variable pointing to a Child object on the Heap
Animal myAnimal = new Dog();
```

---

### Compile-Time Polymorphism (Static Binding / Method Overloading)

Resolved by the compiler at **compile time** based on the method signature (name + parameter types). Multiple methods share the same name but differ in their parameter lists.

**Overloading rules:**
- Methods must have different parameter types, number of parameters, or order of parameters.
- Return type alone is **not** sufficient to distinguish overloaded methods.
- Access modifiers can differ.

```java
class Calculator {
    int add(int a, int b)          { return a + b; }
    double add(double a, double b) { return a + b; }       // Different param types
    int add(int a, int b, int c)   { return a + b + c; }   // Different param count
}
```

#### Var-Args in Overloading

Java supports **variable-length arguments** (`varargs`) using the `...` syntax. A varargs parameter is treated as an array internally.

```java
class MathHelper {
    // Accepts any number of int arguments
    public static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }

    // Overloaded — specific two-argument version
    public static int sum(int a, int b) {
        System.out.println("Two-arg version called");
        return a + b;
    }
}

// Usage:
MathHelper.sum(1, 2);         // Calls sum(int, int) — more specific match wins
MathHelper.sum(1, 2, 3);      // Calls sum(int...) — varargs version
MathHelper.sum(1, 2, 3, 4);   // Calls sum(int...) — varargs version
```

> [!NOTE]
> **Varargs Resolution Priority:** When both a specific overload and a varargs overload could match, Java **always** prefers the more specific (non-varargs) version. A varargs parameter must be the **last** parameter in the method signature, and only one varargs parameter is allowed per method.

---

### Runtime Polymorphism (Dynamic Binding / Method Overriding)

Resolved at **runtime** by the JVM based on the actual object type on the Heap, not the compile-time reference type. The child class provides its own implementation of a method defined in the parent class.

```java
class Animal {
    void speak() { System.out.println("Generic sound"); }
}

class Cat extends Animal {
    @Override
    void speak() { System.out.println("Meow"); }
}

public class Test {
    public static void main(String[] args) {
        Animal pet = new Cat();  // Compile-time type: Animal, Runtime type: Cat
        pet.speak();             // Output: "Meow" — JVM dispatches to Cat.speak()
    }
}
```

### Covariant Return Types

When overriding a method, the return type in the child class can be a **subtype** of the return type in the parent class. This is called a **covariant return type**.

```java
class AnimalFactory {
    public Animal create() {
        return new Animal();
    }
}

class DogFactory extends AnimalFactory {
    @Override
    public Dog create() {    // Dog is a subtype of Animal — covariant return
        return new Dog();
    }
}

// Benefit: callers using DogFactory get Dog directly without casting
DogFactory factory = new DogFactory();
Dog myDog = factory.create();  // No cast needed
```

### Method Hiding (Static Methods)

When a subclass defines a `static` method with the same signature as a `static` method in the superclass, it **hides** (does not override) the parent method. The method called depends on the **compile-time reference type**, not the runtime object type.

```java
class Parent {
    static void greet() { System.out.println("Hello from Parent"); }
}

class Child extends Parent {
    static void greet() { System.out.println("Hello from Child"); }  // Hides, not overrides
}

public class TestHiding {
    public static void main(String[] args) {
        Parent ref = new Child();
        ref.greet();    // Output: "Hello from Parent" — resolved by reference type (static binding)

        Child.greet();  // Output: "Hello from Child"
    }
}
```

> [!IMPORTANT]
> **Key Difference:** Instance methods are **overridden** (dynamic dispatch based on object type). Static methods are **hidden** (resolved based on reference type at compile time). The `@Override` annotation cannot be used on static methods.

### Upcasting vs. Downcasting

| Operation | Direction | Safety | Syntax |
|:---|:---|:---|:---|
| **Upcasting** | Child → Parent reference | Safe, implicit | `Animal a = new Dog();` |
| **Downcasting** | Parent reference → Child | Unsafe, explicit cast required | `Dog d = (Dog) a;` |

```java
Animal pet = new Cat();  // Upcasting — safe, automatic

// Downcasting — must verify type first to avoid ClassCastException
if (pet instanceof Cat myCat) {     // Pattern matching (Java 16+)
    myCat.purr();                    // Safe — myCat is already typed as Cat
}
```

### 🌍 Real-World Analogy
> - **Polymorphism:** Polymorphism is like a **universal remote control**: you can press the "Power" button on the remote, and it turns on a TV, a stereo, or a projector. The action requested is the same ("Power On"), but the behavior is different depending on which device (subclass) receives the signal.
> - **Method Overloading:** Overloading is like a **restaurant menu with size options**: you order a "Burger", but you can choose a Small, Medium, or Large version depending on your appetite (arguments).
> - **Method Overriding:** Overriding is like a **local franchise modifying a corporate menu**: the corporate headquarters defines a "Breakfast" item, but the local branch overrides it with regional specialties.
>
> **💼 Industry Application:** Logging frameworks (like SLF4J/Logback) overload log methods to accept strings, exceptions, or formatting arguments: `log.info("Message")`, `log.info("Error: ", exception)`. Polymorphic interfaces allow databases (MySQL, PostgreSQL, Oracle) to plug into the Java Database Connectivity (JDBC) API seamlessly.

### Practice Questions

* **Question 13:** Given `Animal pet = new Cat();` where class `Cat` has a child-only method `purr()`, can you call `pet.purr()` directly? Why or why not?
* **Question 14:** What is the difference between method **overriding** and method **hiding**? Write a code example demonstrating method hiding with static methods.

---

## 8. OOP Pillar 4: Abstraction (Abstract Classes vs. Interfaces)

**Abstraction** is the process of hiding internal implementation details and exposing only the essential features of an object. This is achieved using two mechanisms: **Abstract Classes** and **Interfaces**.

### Abstract Classes

* Declared using the `abstract` keyword.
* **Cannot be instantiated** with `new`.
* Can contain both **abstract methods** (no body — must be implemented by subclasses) and **concrete methods** (with a body).
* Can have constructors, instance variables, and any access modifier.

```java
abstract class GraphicObject {
    int x, y;

    // Constructor — called via super() from subclasses
    public GraphicObject(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Abstract method — no body, MUST be implemented by concrete subclasses
    abstract void draw();

    // Concrete method — inherited as-is by subclasses
    void moveTo(int newX, int newY) {
        this.x = newX;
        this.y = newY;
        System.out.println("Moved to (" + newX + ", " + newY + ")");
    }
}

class Circle extends GraphicObject {
    double radius;

    public Circle(int x, int y, double radius) {
        super(x, y);  // Call abstract class constructor
        this.radius = radius;
    }

    @Override
    void draw() {
        System.out.println("Drawing circle at (" + x + ", " + y + ") with radius " + radius);
    }
}
```

---

### Interfaces

An Interface defines a **contract** — a set of method signatures that implementing classes must provide.

* Declared using the `interface` keyword. Classes adopt them via `implements`.
* All fields are implicitly `public static final` (constants).
* A class can implement **multiple interfaces**, bypassing the single-inheritance class limitation.

```java
interface Flyable {
    void fly();   // Implicitly public and abstract
}

interface Swimmable {
    void swim();
}

// A class can implement multiple interfaces
class Duck implements Flyable, Swimmable {
    @Override
    public void fly()  { System.out.println("Duck is flying"); }

    @Override
    public void swim() { System.out.println("Duck is swimming"); }
}
```

### Modern Interface Features

| Java Version | Feature | Description |
|:---|:---|:---|
| **Java 8** | `default` methods | Methods with a body in interfaces; implementing classes can override them. |
| **Java 8** | `static` methods | Utility methods that belong to the interface itself; cannot be overridden. |
| **Java 9** | `private` methods | Helper methods for internal code reuse within the interface; not visible to implementors. |

```java
interface Loggable {
    // Abstract method — must be implemented
    void performAction();

    // Default method (Java 8) — provides a default implementation
    default void log(String message) {
        logInternal("INFO", message);
    }

    // Static method (Java 8) — called via Loggable.getVersion()
    static String getVersion() {
        return "1.0";
    }

    // Private method (Java 9) — internal helper, not visible to implementors
    private void logInternal(String level, String message) {
        System.out.println("[" + level + "] " + message);
    }
}
```

### Functional Interfaces and Lambda Expressions (Java 8+)

A **functional interface** is an interface with exactly **one abstract method** (SAM — Single Abstract Method). These interfaces can be implemented concisely using **lambda expressions** instead of verbose anonymous inner classes.

The `@FunctionalInterface` annotation is optional but recommended — it instructs the compiler to enforce the single-abstract-method rule.

```java
@FunctionalInterface
interface MathOperation {
    double operate(double a, double b);
    // Only ONE abstract method allowed in a functional interface
}

public class LambdaDemo {
    public static void main(String[] args) {
        // Lambda expression replaces anonymous inner class
        MathOperation addition       = (a, b) -> a + b;
        MathOperation multiplication = (a, b) -> a * b;

        System.out.println("5 + 3 = " + calculate(5, 3, addition));        // 8.0
        System.out.println("5 × 3 = " + calculate(5, 3, multiplication));  // 15.0

        // Lambda with a block body
        MathOperation power = (a, b) -> {
            double result = Math.pow(a, b);
            return result;
        };
        System.out.println("2 ^ 10 = " + calculate(2, 10, power));  // 1024.0
    }

    static double calculate(double a, double b, MathOperation op) {
        return op.operate(a, b);
    }
}
```

#### Built-in Functional Interfaces (`java.util.function`)

Java provides a rich set of pre-defined functional interfaces:

| Interface | Method | Purpose | Example |
|:---|:---|:---|:---|
| `Predicate<T>` | `boolean test(T t)` | Test a condition | `s -> s.isEmpty()` |
| `Function<T,R>` | `R apply(T t)` | Transform T → R | `s -> s.length()` |
| `Consumer<T>` | `void accept(T t)` | Perform an action (no return) | `s -> System.out.println(s)` |
| `Supplier<T>` | `T get()` | Produce a value (no input) | `() -> new ArrayList<>()` |
| `UnaryOperator<T>` | `T apply(T t)` | Transform T → T (same type) | `s -> s.toUpperCase()` |
| `BinaryOperator<T>` | `T apply(T a, T b)` | Combine two T → T | `(a, b) -> a + b` |

```java
import java.util.function.*;

Predicate<String> isLong = s -> s.length() > 10;
Function<String, Integer> toLength = String::length;   // Method reference
Consumer<String> printer = System.out::println;         // Method reference

System.out.println(isLong.test("Hello"));         // false
System.out.println(toLength.apply("Hello World"));// 11
printer.accept("Lambda!");                        // prints: Lambda!
```

### Abstract Classes vs. Interfaces — Comparison

| Criteria | Abstract Class | Interface |
|:---|:---|:---|
| **Keyword** | `abstract class` | `interface` |
| **Inheritance** | Single (`extends`) | Multiple (`implements`) |
| **Fields** | Any type (instance, static, mutable) | `public static final` only |
| **Constructors** | ✅ Yes | ❌ No |
| **Method types** | Abstract + concrete | Abstract + default + static + private |
| **When to use** | Shared state and behavior among related classes | Define a contract/capability across unrelated classes |

### 🌍 Real-World Analogy
> - **Abstract Class:** An abstract class is like an **incomplete draft** of a novel: it has the main outline and some chapters written (concrete methods), but expects someone else to finish the missing chapters (abstract methods).
> - **Interface:** An **interface** is like an **electrical outlet standard**: it defines exactly where the pins must go, but doesn't care how the power plant generates electricity.
> - **Lambda Expression:** A **lambda expression** is like a **quick sticky note with a single instruction** passed to a coworker: "here's how you sort these files."
>
> **💼 Industry Application:** GUI libraries (like JavaFX) and Web APIs utilize interfaces to define event listeners (e.g., `OnClickListener`). Spring Boot utilizes interfaces to define database repositories, leaving the framework to generate the actual SQL implementation at runtime.

### Practice Questions

* **Question 15:** Compare Abstract Classes and Interfaces by completing a grid across these criteria: (a) Multiple inheritance, (b) Variable modifiers, (c) Constructor presence, and (d) Method types.
* **Question 16:** Write a `@FunctionalInterface` called `StringProcessor` with a single method `String process(String input)`. Then use it with lambda expressions to create: (a) an uppercase converter, and (b) a string reverser.

---

## 9. Exception Handling (Checked, Unchecked, Try-With-Resources)

Exceptions are runtime events that disrupt the normal flow of program execution. Java provides a structured mechanism to handle these events gracefully.

### Exception Hierarchy

```
                        Throwable
                       /         \
                  Error          Exception
                  /                /         \
         OutOfMemoryError   IOException    RuntimeException
         StackOverflowError  SQLException   /      |       \
                             (Checked)  NullPtr  IndexOOB  ClassCast
                                       Exception Exception Exception
                                        (All Unchecked / Runtime)
```

| Category | Superclass | Checked by Compiler? | Examples | Recovery |
|:---|:---|:---|:---|:---|
| **Error** | `Error` | No | `OutOfMemoryError`, `StackOverflowError` | Generally unrecoverable |
| **Checked** | `Exception` (not `RuntimeException`) | Yes | `IOException`, `SQLException`, `FileNotFoundException` | Must handle or declare |
| **Unchecked** | `RuntimeException` | No | `NullPointerException`, `ArrayIndexOutOfBoundsException` | Programming bugs — fix the code |

### Checked vs. Unchecked Exceptions

1. **Checked Exceptions:** Verified at **compile time**. The compiler forces you to handle them (using `try-catch`) or declare them in the method signature (`throws`). These represent **recoverable** conditions external to the program (file not found, network down).

2. **Unchecked Exceptions (Runtime Exceptions):** Not checked by the compiler. They occur due to **programming errors** (null dereference, array out of bounds, bad casts). Fix the code rather than catching them.

---

### Exception Handling Blocks

| Block | Purpose |
|:---|:---|
| `try` | Wraps code that might throw an exception. |
| `catch` | Catches and handles a specific exception type. |
| `finally` | Code that **always** executes — whether an exception was thrown, caught, or not. Used for cleanup. |

```java
try {
    int data = 50 / 0;  // Throws ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero: " + e.getMessage());
} finally {
    System.out.println("Cleanup completed.");  // Always runs
}
```

### Multi-Catch Blocks (Java 7+)

You can catch multiple exception types in a single `catch` block using the pipe (`|`) operator, reducing code duplication:

```java
try {
    String text = null;
    int number = Integer.parseInt(text);  // Could throw NumberFormatException or NullPointerException
} catch (NumberFormatException | NullPointerException e) {
    // Handle both exceptions the same way
    System.out.println("Invalid input: " + e.getMessage());
} catch (Exception e) {
    // Catch-all for any other exceptions
    System.out.println("Unexpected error: " + e.getMessage());
}
```

> [!NOTE]
> **Multi-catch rules:**
> - The caught exception types must not be in an inheritance relationship (e.g., you cannot combine `IOException | Exception` because `IOException` is already a subtype of `Exception`).
> - The variable `e` in a multi-catch block is implicitly `final` — you cannot reassign it.

### `throw` vs. `throws`

| Keyword | Location | Purpose | Example |
|:---|:---|:---|:---|
| `throw` | Inside a method body | Manually throw a specific exception **object** | `throw new IllegalArgumentException("Bad input");` |
| `throws` | In a method signature | Declare that the method **might** throw certain exceptions, warning callers | `public void read() throws IOException` |

---

### Try-With-Resources (Automatic Resource Management — Java 7+)

This syntax automatically closes resources declared within the `try` statement, replacing explicit cleanup in `finally` blocks.

> [!IMPORTANT]
> **The AutoCloseable Requirement**
> To be used inside a try-with-resources statement, a resource class must implement the `java.lang.AutoCloseable` interface (or its subinterface `Closeable`).

```java
// Resources are automatically closed at the end of the try block
try (BufferedReader br = new BufferedReader(new FileReader("test.txt"));
     PrintWriter pw = new PrintWriter(new FileWriter("output.txt"))) {

    String line;
    while ((line = br.readLine()) != null) {
        pw.println(line.toUpperCase());
    }
    // Both br and pw are automatically closed here, even if an exception is thrown

} catch (IOException e) {
    System.out.println("I/O Error: " + e.getMessage());
}
```

### Creating Custom Exceptions

You can define your own exception classes by extending `Exception` (for checked) or `RuntimeException` (for unchecked):

```java
// Custom checked exception
public class InsufficientFundsException extends Exception {
    private final double deficit;

    public InsufficientFundsException(double deficit) {
        super("Insufficient funds. Deficit: $" + deficit);
        this.deficit = deficit;
    }

    public double getDeficit() {
        return deficit;
    }
}

// Usage in a banking class
public class BankAccount {
    private double balance;

    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }

    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(amount - balance);
        }
        balance -= amount;
        System.out.println("Withdrawn: $" + amount + " | Remaining: $" + balance);
    }
}

// Caller must handle the checked exception
public class BankDemo {
    public static void main(String[] args) {
        BankAccount account = new BankAccount(500.0);
        try {
            account.withdraw(700.0);
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage());               // Insufficient funds. Deficit: $200.0
            System.out.println("Deficit: $" + e.getDeficit()); // 200.0
        }
    }
}
```

### 🌍 Real-World Analogy
> - **Checked Exception:** A **checked exception** is like a **mandatory seatbelt law**: the law (compiler) forces you to buckle up before you can drive (compile) the car.
> - **Unchecked Exception:** An **unchecked exception** is like hitting a **pothole**: you cannot predict exactly where it will be, and the compiler doesn't force you to prepare for it, but you should handle the impact (try-catch) so you don't blow a tire.
> - **Try-With-Resources:** This is like **auto-locking doors** that lock themselves behind you as you walk out, ensuring you never forget to lock up.
>
> **💼 Industry Application:** Network communication frameworks (like Netty or Spring WebClient) use exception handling to catch database socket connections and retry requests or fall back to cached data.

### Practice Questions

* **Question 17:** What is the difference between `throw` and `throws` in Java exception handling?
* **Question 18:** Create a custom unchecked exception called `InvalidAgeException` that extends `RuntimeException` and includes the invalid age value. Write a method `validateAge(int age)` that throws it if age is negative or greater than 150.

---

## 10. File Input & Output (I/O Streams)

Java provides two primary I/O APIs: the classic `java.io` package (since Java 1.0) and the modern `java.nio.file` package (NIO.2, since Java 7). Both are important to understand.

### Classic I/O: Stream Types (`java.io`)

| Stream Category | Unit | Best For | Key Classes |
|:---|:---|:---|:---|
| **Byte Streams** | 8-bit bytes | Binary files (images, audio, video) | `FileInputStream`, `FileOutputStream` |
| **Character Streams** | 16-bit chars | Text files | `FileReader`, `FileWriter` |
| **Buffered Streams** | Buffered blocks | Performance optimization | `BufferedReader`, `BufferedWriter`, `BufferedInputStream`, `BufferedOutputStream` |

> [!NOTE]
> **Why Buffering Matters:** Reading one character at a time from disk requires a system call for each character — extremely slow. `BufferedReader` reads a large block (typically 8 KB) into an in-memory buffer in a single I/O operation. Subsequent reads are served from fast RAM, reducing disk access by orders of magnitude.

```java
// Fast line-by-line file reading with BufferedReader (classic I/O)
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ReadFileClassic {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

```java
// Writing to a file with BufferedWriter (classic I/O)
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class WriteFileClassic {
    public static void main(String[] args) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
            writer.write("Hello, File I/O!");
            writer.newLine();
            writer.write("Second line.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

---

### Modern I/O: NIO.2 (`java.nio.file` — Java 7+)

The NIO.2 API provides a more powerful, flexible, and concise way to work with files and directories. The two central classes are:

| Class | Purpose |
|:---|:---|
| `Path` | Represents a file or directory path in the filesystem (replaces `java.io.File`). |
| `Files` | A utility class with static methods for file operations (read, write, copy, delete, walk). |

```java
import java.nio.file.*;
import java.io.IOException;
import java.util.List;

public class NioDemo {
    public static void main(String[] args) throws IOException {
        Path filePath = Path.of("data", "notes.txt");  // Construct a path

        // Write lines to a file (creates file if it doesn't exist)
        Files.writeString(filePath, "Hello, NIO.2!\nSecond line.\n");

        // Read entire file as a string
        String content = Files.readString(filePath);
        System.out.println(content);

        // Read all lines into a List<String>
        List<String> lines = Files.readAllLines(filePath);
        lines.forEach(System.out::println);

        // File metadata
        System.out.println("Size: " + Files.size(filePath) + " bytes");
        System.out.println("Exists: " + Files.exists(filePath));
        System.out.println("Is Directory: " + Files.isDirectory(filePath));

        // Copy a file
        Path backup = Path.of("data", "notes_backup.txt");
        Files.copy(filePath, backup, StandardCopyOption.REPLACE_EXISTING);

        // Delete a file
        Files.deleteIfExists(backup);
    }
}
```

### Walking Directory Trees

```java
import java.nio.file.*;
import java.io.IOException;

public class DirectoryWalker {
    public static void main(String[] args) throws IOException {
        Path root = Path.of("src");

        // Walk the directory tree and list all .java files
        try (var stream = Files.walk(root)) {
            stream.filter(path -> path.toString().endsWith(".java"))
                  .forEach(System.out::println);
        }

        // List immediate children of a directory
        try (var listing = Files.list(root)) {
            listing.forEach(System.out::println);
        }
    }
}
```

### Classic I/O vs. NIO.2 Comparison

| Feature | `java.io` (Classic) | `java.nio.file` (NIO.2) |
|:---|:---|:---|
| **File reference** | `File` object | `Path` object |
| **Read/Write** | Streams (`FileReader`, etc.) | `Files.readString()`, `Files.readAllLines()` |
| **Directory listing** | `File.listFiles()` | `Files.list()`, `Files.walk()` |
| **File copy** | Manual stream copy | `Files.copy()` |
| **Symbolic links** | Limited support | Full support |
| **Atomic operations** | No | Yes (`Files.move` with `ATOMIC_MOVE`) |
| **Recommendation** | Legacy code | **Preferred for new code** |

### 🌍 Real-World Analogy
> - **Classic I/O Streams:** Classic I/O streams are like **water pipes**: data flows in a single direction, byte-by-byte or character-by-character.
> - **BufferedReader:** This is like **reading a book one chapter at a time**: instead of reading a single word, going to the library to fetch the next word, and returning (slow disk access), you fetch a whole chunk of text at once.
> - **NIO.2:** This is like an **express delivery courier service**: you use paths and channels to request file packages and let the system deliver them instantly.
>
> **💼 Industry Application:** Log rotation services scan directories using NIO.2 `Files.walk()` to archive files older than 30 days. E-commerce platforms parse uploaded CSV catalogs using stream readers to update product inventories.

### Practice Questions

* **Question 19:** Why is using `BufferedReader` faster than reading characters one-by-one using a plain `FileReader`?
* **Question 20:** Using the NIO.2 API, write a program that reads all lines from a file called `"data.txt"`, converts each line to uppercase, and writes the result to `"data_upper.txt"`.

---

## 11. Essential Java Collections Framework

The **Collections Framework** is a unified architecture for storing, retrieving, and manipulating groups of objects. It consists of interfaces, implementations (classes), and algorithms (static utility methods in `Collections`).

### Collection Hierarchy

```
                       Iterable<T>
                           │
                      Collection<T>
                     /       |       \
                List<T>    Set<T>    Queue<T>
               /    \       |   \        \
        ArrayList  LinkedList HashSet TreeSet  PriorityQueue
                                                   
                       Map<K,V>  (separate hierarchy)
                      /       \
                HashMap     TreeMap
```

### Core Collections Comparison

| Collection | Interface | Ordering | Duplicates | Null Elements | Access Time | Insertion Time |
|:---|:---|:---|:---|:---|:---|:---|
| `ArrayList` | `List` | Insertion order | ✅ | ✅ | $O(1)$ by index | $O(n)$ (middle), $O(1)$ amortized (end) |
| `LinkedList` | `List`, `Deque` | Insertion order | ✅ | ✅ | $O(n)$ | $O(1)$ (head/tail) |
| `HashSet` | `Set` | No guaranteed order | ❌ | ✅ (one null) | $O(1)$ | $O(1)$ |
| `TreeSet` | `SortedSet` | Sorted (natural/comparator) | ❌ | ❌ | $O(\log n)$ | $O(\log n)$ |
| `HashMap` | `Map` | No guaranteed order | Keys: ❌, Values: ✅ | ✅ (one null key) | $O(1)$ | $O(1)$ |
| `TreeMap` | `SortedMap` | Sorted by keys | Keys: ❌, Values: ✅ | ❌ (null keys) | $O(\log n)$ | $O(\log n)$ |
| `PriorityQueue` | `Queue` | Heap-ordered (min by default) | ✅ | ❌ | $O(1)$ peek | $O(\log n)$ |

```java
import java.util.*;

public class CollectionsDemo {
    public static void main(String[] args) {
        // ArrayList — type-safe with Generics
        List<String> users = new ArrayList<>();
        users.add("Alice");
        users.add("Bob");
        users.add("Charlie");
        System.out.println("Users: " + users);          // [Alice, Bob, Charlie]
        System.out.println("Second user: " + users.get(1));  // Bob

        // HashMap — key-value pairs
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 87);
        scores.put("Charlie", 92);
        System.out.println("Alice's score: " + scores.get("Alice"));  // 95

        // HashSet — unique elements
        Set<String> uniqueNames = new HashSet<>(users);
        uniqueNames.add("Alice");  // Duplicate — ignored
        System.out.println("Unique: " + uniqueNames);  // [Alice, Bob, Charlie]
    }
}
```

> [!NOTE]
> **Generics Type Safety**
> Prior to Java 5, collections stored raw `Object` references, requiring manual casting and causing runtime `ClassCastException` errors. **Generics** (e.g., `ArrayList<String>`) enforce type safety at compile time, eliminating the need for casting and catching type errors before the program runs.

### The `Iterator` Pattern

The `Iterator` interface provides a standard way to traverse any collection without exposing its internal structure. It also supports safe removal of elements during iteration.

```java
import java.util.*;

List<String> names = new ArrayList<>(Arrays.asList("Alice", "Bob", "Charlie", "Diana"));

// Using an Iterator for safe removal during traversal
Iterator<String> it = names.iterator();
while (it.hasNext()) {
    String name = it.next();
    if (name.startsWith("C")) {
        it.remove();  // Safe removal — avoids ConcurrentModificationException
    }
}
System.out.println(names);  // [Alice, Bob, Diana]
```

> [!WARNING]
> **ConcurrentModificationException:** You cannot use `list.remove()` inside a `for-each` loop over the same list. The enhanced for loop uses an iterator internally, and modifying the collection through any means other than the iterator's own `remove()` method will throw a `ConcurrentModificationException`. Always use `Iterator.remove()` or `List.removeIf()` instead.

### `Comparable` vs. `Comparator`

Both interfaces are used to define ordering for objects, but they serve different purposes:

| Aspect | `Comparable<T>` | `Comparator<T>` |
|:---|:---|:---|
| **Package** | `java.lang` | `java.util` |
| **Method** | `int compareTo(T other)` | `int compare(T a, T b)` |
| **Defined in** | The class itself (intrinsic natural ordering) | A separate class or lambda (external ordering) |
| **Sorting** | `Collections.sort(list)` | `Collections.sort(list, comparator)` |
| **Multiple orderings?** | One per class | Unlimited — create different comparators |

```java
// Comparable — defines natural ordering inside the class
public class Student implements Comparable<Student> {
    String name;
    double gpa;

    public Student(String name, double gpa) {
        this.name = name;
        this.gpa = gpa;
    }

    @Override
    public int compareTo(Student other) {
        return Double.compare(this.gpa, other.gpa);  // Natural order: ascending by GPA
    }

    @Override
    public String toString() { return name + "(" + gpa + ")"; }
}

// Comparator — defines external ordering, can define multiple strategies
import java.util.*;

List<Student> students = new ArrayList<>(List.of(
    new Student("Alice", 3.8),
    new Student("Bob", 3.5),
    new Student("Charlie", 3.9)
));

// Sort by natural order (Comparable — ascending GPA)
Collections.sort(students);
System.out.println(students);  // [Bob(3.5), Alice(3.8), Charlie(3.9)]

// Sort by name using a Comparator (lambda)
students.sort(Comparator.comparing(s -> s.name));
System.out.println(students);  // [Alice(3.8), Bob(3.5), Charlie(3.9)]

// Sort by GPA descending using Comparator
students.sort(Comparator.comparingDouble((Student s) -> s.gpa).reversed());
System.out.println(students);  // [Charlie(3.9), Alice(3.8), Bob(3.5)]
```

### Stream API Basics (Java 8+)

The **Stream API** provides a declarative, functional-style approach to processing collections. A stream pipeline consists of three stages:

1. **Source:** A collection, array, or generator that creates the stream.
2. **Intermediate Operations:** Lazy, chainable transformations (`filter`, `map`, `sorted`, `distinct`, `limit`).
3. **Terminal Operation:** Triggers processing and produces a result (`collect`, `forEach`, `reduce`, `count`).

```java
import java.util.*;
import java.util.stream.*;

public class StreamDemo {
    public static void main(String[] args) {
        List<String> names = List.of("Alice", "Bob", "Charlie", "Diana", "Eve", "Alice");

        // Filter, transform, and collect
        List<String> result = names.stream()
            .filter(name -> name.length() > 3)          // Keep names longer than 3 chars
            .map(String::toUpperCase)                    // Transform to uppercase
            .distinct()                                   // Remove duplicates
            .sorted()                                     // Sort alphabetically
            .collect(Collectors.toList());                // Collect into a new List

        System.out.println(result);  // [ALICE, CHARLIE, DIANA]

        // Reduce — aggregate values
        int totalLength = names.stream()
            .mapToInt(String::length)
            .sum();
        System.out.println("Total characters: " + totalLength);  // 30

        // Counting
        long count = names.stream()
            .filter(n -> n.startsWith("A"))
            .count();
        System.out.println("Names starting with A: " + count);  // 2

        // Grouping with Collectors
        Map<Integer, List<String>> byLength = names.stream()
            .collect(Collectors.groupingBy(String::length));
        System.out.println("Grouped by length: " + byLength);
        // {3=[Bob, Eve], 5=[Alice, Diana, Alice], 7=[Charlie]}
    }
}
```

> [!IMPORTANT]
> **Streams are Lazy and One-Shot:**
> - **Lazy:** Intermediate operations are not executed until a terminal operation is invoked. This allows the stream pipeline to be optimized (e.g., short-circuiting with `findFirst()`).
> - **One-Shot:** A stream can only be consumed once. Attempting to reuse a stream after a terminal operation throws `IllegalStateException`.

### The `Optional` Class (Java 8+)

`Optional<T>` is a container that may or may not hold a non-null value. It is designed to eliminate `NullPointerException` by forcing explicit handling of the "no value" case.

```java
import java.util.Optional;

public class OptionalDemo {
    public static void main(String[] args) {
        // Creating Optional instances
        Optional<String> present = Optional.of("Hello");
        Optional<String> empty   = Optional.empty();
        Optional<String> nullable = Optional.ofNullable(getUserName()); // Handles null safely

        // Checking and accessing
        if (present.isPresent()) {
            System.out.println(present.get());  // Hello
        }

        // Preferred: use ifPresent with a lambda
        present.ifPresent(value -> System.out.println("Value: " + value));

        // Providing a default value
        String name = empty.orElse("Guest");
        System.out.println(name);  // Guest

        // Lazy default with orElseGet
        String computed = empty.orElseGet(() -> "User_" + System.currentTimeMillis());

        // Throw if empty
        // String required = empty.orElseThrow(() -> new RuntimeException("Value required!"));

        // Chaining with map and flatMap
        Optional<Integer> length = present.map(String::length);
        System.out.println("Length: " + length.orElse(0));  // 5

        // Filtering
        Optional<String> longName = present.filter(s -> s.length() > 10);
        System.out.println(longName.isPresent());  // false
    }

    static String getUserName() {
        return null;  // Simulating no value
    }
}
```

> [!CAUTION]
> **`Optional` Best Practices:**
> - Use `Optional` as a **return type** for methods that might not have a result.
> - **Never** use `Optional` as a method parameter, a field type, or in collections — it adds unnecessary overhead.
> - **Never** call `.get()` without first checking `.isPresent()` — use `orElse()`, `orElseGet()`, or `ifPresent()` instead.

### 🌍 Real-World Analogy
> - **ArrayList:** An `ArrayList` is like a **dynamic bookshelf** that expands as you buy more books.
> - **HashMap:** A `HashMap` is like a **filing cabinet with labeled folders**: you drop the folder into the drawer labeled with its first letter (hash code) for instant retrieval.
> - **Stream API:** The **Stream API** is like a **factory conveyor belt**: items pass down the belt, and workers filter out defects, format labels (map), and box them up (collect) without altering the original raw materials.
>
> **💼 Industry Application:** Spring Boot microservices query user lists from database tables, convert them to Java Streams to filter out inactive users, map them to public profiles, and collect them into a JSON response array.

### Practice Questions

* **Question 21:** Write a program that counts the frequency of words in an array of strings using a `HashMap<String, Integer>`.
* **Question 22:** Using the Stream API, write a pipeline that takes a `List<Integer>`, filters out even numbers, squares the remaining odd numbers, and collects the result into a new list. For input `[1, 2, 3, 4, 5, 6]`, what is the output?

---
---

## 12. Answer Key & Explanations

### Section 1: Introduction to Java & The JVM Platform

* **Answer 1:**
  The Java compiler (`javac`) converts `.java` source code into intermediate **Bytecode** (`.class` files). This bytecode is not bound to any specific CPU architecture — it is a platform-neutral instruction set. Any computer with a **Java Virtual Machine (JVM)** installed can load, verify, and execute this bytecode, translating it into native machine instructions for the host operating system. The JVM abstracts away hardware differences, achieving the "Write Once, Run Anywhere" promise. Additionally, the **JIT compiler** within the JVM optimizes frequently executed code paths by compiling them to native machine code at runtime.

* **Answer 2:**
  * **Eden (Young Generation):** Where all new objects are initially allocated. When Eden fills up, a **Minor GC** is triggered — fast and frequent. Objects that survive are moved to a Survivor space.
  * **Survivor 0 & Survivor 1 (Young Generation):** Hold objects that have survived one or more Minor GCs. Objects are copied back and forth between S0 and S1 during each Minor GC cycle. After surviving a configurable number of cycles (age threshold), objects are promoted.
  * **Old Generation (Tenured):** Stores long-lived objects promoted from the Young Generation. A **Major (Full) GC** is triggered when Old Gen runs out of space. Full GCs are slower and more disruptive because they scan the entire heap.

  Minor GCs are triggered when Eden fills up. Major GCs are triggered when Old Gen cannot accommodate promoted objects.

### Section 2: Java Syntax, Core Data Types & Memory Allocation

* **Answer 3:**
  * `Integer x = 50;` — The primitive literal `50` is **autoboxed** to an `Integer` object via `Integer.valueOf(50)`. The reference variable `x` resides on the **Stack**, pointing to the `Integer` object stored on the **Heap**.
  * `int y = x;` — The `Integer` object is **unboxed** by calling `x.intValue()`, and the resulting primitive value `50` is assigned to `y`. Both `y` and its value `50` reside entirely on the **Stack**.

* **Answer 4:**
  ```
  false
  true
  ```
  **Explanation:** `Integer.valueOf()` caches values in the range **-128 to 127**. Since `200` is outside this range, `Integer.valueOf(200)` creates **two distinct** `Integer` objects on the Heap. The `==` operator compares references (memory addresses), so `a == b` returns `false` because they are different objects. The `.equals()` method compares the actual integer values, so `a.equals(b)` returns `true` because both hold the value `200`.

### Section 3: Operators & Control Flow

* **Answer 5:**
  * Output: **`true true`**
  * **Explanation:** Java uses a **String Pool** to optimize memory for string literals. When you write `String a = "Hello"` and `String b = "Hello"`, the JVM stores only one `"Hello"` object in the String Pool and points both `a` and `b` to that same object. Therefore:
    * `a == b` → `true` (same reference in the pool).
    * `a.equals(b)` → `true` (same character content).
  * *Note: If you used `new String("Hello")`, the `new` keyword forces creation of a new object outside the pool, and `==` would return `false`.*

* **Answer 6:**
  ```java
  String result = switch (code) {
      case 200 -> "OK";
      case 404 -> "Not Found";
      case 500 -> "Server Error";
      default  -> "Unknown";
  };
  ```
  The switch expression uses arrow syntax (`->`), which eliminates fall-through (no `break` needed), and returns a value directly assigned to `result`. All possible values must be covered — the `default` acts as a catch-all.

### Section 4: Classes, Objects & Constructors

* **Answer 7:**
  **Constructor Chaining** is the technique of calling one constructor from another constructor within the same class or from a parent class.
  * Use **`this(args)`** to call another (overloaded) constructor within the **same class**. This must be the **first statement** in the constructor body.
  * Use **`super(args)`** to call a **parent class** constructor from a subclass. This must also be the **first statement** in the subclass constructor.
  * You cannot use both `this()` and `super()` in the same constructor because both require being the first statement.

  ```java
  class Animal {
      String name;
      Animal(String name) { this.name = name; }
  }

  class Dog extends Animal {
      String breed;
      Dog() { this("Unknown", "Mixed"); }  // Chains to Dog(String, String)
      Dog(String name, String breed) {
          super(name);           // Calls Animal(String)
          this.breed = breed;
      }
  }
  ```

* **Answer 8:**
  ```java
  public record Coordinate(double lat, double lon) { }
  ```
  The `record` declaration automatically generates:
  1. A **canonical constructor** `Coordinate(double lat, double lon)`.
  2. **Accessor methods** `lat()` and `lon()` (not `getLat()`/`getLon()`).
  3. An `equals()` method that compares all components.
  4. A `hashCode()` method consistent with `equals()`.
  5. A `toString()` method returning `Coordinate[lat=..., lon=...]`.

  All fields are implicitly `private final`, making records immutable.

### Section 5: OOP Pillar 1: Encapsulation & Access Modifiers

* **Answer 9:**
  * **Yes**, `Child` can call the inherited `protected show()` method because it is a subclass of `Parent`. Protected members are accessible to subclasses regardless of package.
  * **No**, the unrelated class `Test` in package `B` cannot call `show()` on a `Parent` instance. Even though `Test` is in the same package as `Child`, `Test` does not inherit from `Parent` and is in a different package than where `show()` is defined. The `protected` modifier only grants access to subclasses and classes within the same package as the declaring class (`A`).

* **Answer 10:**
  A `final` field prevents **reassignment** of the reference variable, but it does **not** prevent modification of the object's internal state. For example:
  ```java
  final List<String> list = new ArrayList<>();
  list.add("Hello");  // Legal — modifying the object's contents
  // list = new ArrayList<>();  // Compile error — reassigning the reference
  ```
  The list's contents can still be modified via `add()`, `remove()`, etc. To achieve true immutability with mutable fields, you must:
  1. Make a **defensive copy** of the mutable object in the constructor: `this.list = new ArrayList<>(input)`.
  2. Return an **unmodifiable view** from the getter: `return Collections.unmodifiableList(list)`.

### Section 6: OOP Pillar 2: Inheritance & super Keyword

* **Answer 11:**
  * **Method Overloading (Compile-Time Polymorphism):**
    * Same method name, **different** parameter signature (type, number, or order of parameters).
    * Resolved at **compile time** by the compiler based on the arguments passed (static binding).
    * Can occur within the **same class**.
    * Return type alone does not distinguish overloaded methods.
  * **Method Overriding (Runtime Polymorphism):**
    * Same method name **and** same parameter signature in a subclass.
    * Resolved at **runtime** by the JVM based on the actual object type on the heap (dynamic binding).
    * Occurs between a **parent and child class**.
    * The `@Override` annotation is recommended to catch errors at compile time.

* **Answer 12:**
  The `equals`-`hashCode` contract states: **If two objects are equal according to `equals()`, they must have the same `hashCode()`**. Hash-based collections (`HashMap`, `HashSet`) use `hashCode()` to determine the bucket where an object is stored. If `equals()` is overridden without `hashCode()`:
  * Two logically equal objects may have different hash codes (inherited from `Object`, which returns based on memory address).
  * They will be placed in **different buckets** in a `HashSet` or `HashMap`.
  * Looking up a logically equal key in a `HashMap` will fail because the lookup checks the wrong bucket.

  Example of the bug:
  ```java
  // equals() overridden, hashCode() NOT overridden
  Student s1 = new Student("Alice", 101);
  Student s2 = new Student("Alice", 101);

  Set<Student> set = new HashSet<>();
  set.add(s1);
  System.out.println(set.contains(s2));  // false! — wrong bucket
  ```

### Section 7: OOP Pillar 3: Polymorphism (Static vs. Dynamic Binding)

* **Answer 13:**
  **No**, you cannot call `pet.purr()` directly. The compiler performs type checking based on the **compile-time reference type** (`Animal`), not the runtime object type (`Cat`). Since the `Animal` class does not define a `purr()` method, the compilation fails with a "cannot find symbol" error. To call `purr()`, you must **downcast** the reference to `Cat`:
  ```java
  if (pet instanceof Cat myCat) {
      myCat.purr();  // Safe downcast with pattern matching
  }
  ```

* **Answer 14:**
  * **Method Overriding** applies to **instance** methods. The JVM uses **dynamic dispatch** at runtime — the method called depends on the actual object type on the heap, regardless of the reference type. The `@Override` annotation is used.
  * **Method Hiding** applies to **static** methods. Static methods are resolved at **compile time** based on the reference type (static binding). The parent's static method is "hidden," not overridden. The `@Override` annotation cannot be used.

  ```java
  class Parent {
      static void greet() { System.out.println("Parent greet"); }
      void hello()        { System.out.println("Parent hello"); }
  }

  class Child extends Parent {
      static void greet() { System.out.println("Child greet"); }  // Hides
      @Override
      void hello()        { System.out.println("Child hello"); }  // Overrides
  }

  Parent ref = new Child();
  ref.greet();  // "Parent greet" — static, resolved by reference type
  ref.hello();  // "Child hello"  — instance, resolved by object type
  ```

### Section 8: OOP Pillar 4: Abstraction (Abstract Classes vs. Interfaces)

* **Answer 15:**

  | Criteria | Abstract Class | Interface |
  |:---|:---|:---|
  | **(a) Multiple inheritance** | ❌ Single (one parent class via `extends`) | ✅ Multiple (a class can `implement` many interfaces) |
  | **(b) Variable modifiers** | Any: private, protected, public; mutable or final | `public static final` only (constants) |
  | **(c) Constructor presence** | ✅ Can have constructors | ❌ Cannot have constructors |
  | **(d) Method types** | Abstract + concrete (any access modifier) | Abstract + `default` + `static` (Java 8) + `private` (Java 9) |

* **Answer 16:**
  ```java
  @FunctionalInterface
  interface StringProcessor {
      String process(String input);
  }

  public class StringProcessorDemo {
      public static void main(String[] args) {
          // (a) Uppercase converter
          StringProcessor toUpper = input -> input.toUpperCase();
          System.out.println(toUpper.process("hello"));  // HELLO

          // (b) String reverser
          StringProcessor reverser = input -> new StringBuilder(input).reverse().toString();
          System.out.println(reverser.process("hello"));  // olleh

          // Using method reference for (a)
          StringProcessor toUpperRef = String::toUpperCase;
          System.out.println(toUpperRef.process("world"));  // WORLD
      }
  }
  ```

### Section 9: Exception Handling (Checked, Unchecked, Try-With-Resources)

* **Answer 17:**
  * **`throw`** is used **inside a method body** to manually create and throw a specific exception object. It transfers control to the nearest matching `catch` block.
    * Example: `throw new IllegalArgumentException("Invalid input");`
  * **`throws`** is used **in a method signature** to declare that the method might throw certain checked exceptions, warning callers that they must handle or propagate those exceptions.
    * Example: `public void readFile() throws IOException, FileNotFoundException`
  * In short: `throw` performs the action of throwing; `throws` declares the possibility.

* **Answer 18:**
  ```java
  // Custom unchecked exception
  public class InvalidAgeException extends RuntimeException {
      private final int invalidAge;

      public InvalidAgeException(int age) {
          super("Invalid age: " + age + ". Age must be between 0 and 150.");
          this.invalidAge = age;
      }

      public int getInvalidAge() {
          return invalidAge;
      }
  }

  // Validation method
  public class AgeValidator {
      public static void validateAge(int age) {
          if (age < 0 || age > 150) {
              throw new InvalidAgeException(age);
          }
          System.out.println("Valid age: " + age);
      }

      public static void main(String[] args) {
          validateAge(25);    // Valid age: 25
          validateAge(-5);    // Throws InvalidAgeException: Invalid age: -5
      }
  }
  ```

### Section 10: File Input & Output (I/O Streams)

* **Answer 19:**
  Reading a file character-by-character with a plain `FileReader` issues a **system call** (an OS-level I/O request to the disk) for every single character read. System calls are expensive because they involve context switching between user space and kernel space.

  `BufferedReader` reads a large block of characters (typically **8,192 characters / 8 KB**) from the disk in a **single system call**, storing them in an in-memory buffer. Subsequent `read()` calls are served directly from this fast RAM buffer. This reduces the number of disk reads by orders of magnitude, dramatically improving performance.

* **Answer 20:**
  ```java
  import java.nio.file.*;
  import java.io.IOException;
  import java.util.List;
  import java.util.stream.Collectors;

  public class UpperCaseFile {
      public static void main(String[] args) throws IOException {
          Path input = Path.of("data.txt");
          Path output = Path.of("data_upper.txt");

          // Read all lines, convert to uppercase, and write to output file
          List<String> lines = Files.readAllLines(input);
          List<String> upperLines = lines.stream()
              .map(String::toUpperCase)
              .collect(Collectors.toList());

          Files.write(output, upperLines);
          System.out.println("Conversion complete. " + upperLines.size() + " lines written.");
      }
  }
  ```

### Section 11: Essential Java Collections Framework

* **Answer 21:**
  ```java
  import java.util.HashMap;
  import java.util.Map;

  public class WordFrequencyCalculator {
      public static void calculateFrequency(String[] words) {
          Map<String, Integer> frequencyMap = new HashMap<>();
          for (String word : words) {
              frequencyMap.put(word, frequencyMap.getOrDefault(word, 0) + 1);
          }
          // Print results
          frequencyMap.forEach((word, count) ->
              System.out.println(word + " → " + count)
          );
      }

      public static void main(String[] args) {
          String[] sample = {"apple", "banana", "apple", "cherry", "banana", "apple"};
          calculateFrequency(sample);
          // Output:
          // banana → 2
          // cherry → 1
          // apple → 3
      }
  }
  ```
  The `getOrDefault(word, 0)` method returns the current count for the word, or `0` if the word has not been seen before. Adding `1` and putting it back updates the frequency.

* **Answer 22:**
  ```java
  import java.util.*;
  import java.util.stream.*;

  public class StreamExercise {
      public static void main(String[] args) {
          List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);

          List<Integer> result = numbers.stream()
              .filter(n -> n % 2 != 0)    // Keep odd numbers: [1, 3, 5]
              .map(n -> n * n)             // Square them: [1, 9, 25]
              .collect(Collectors.toList());

          System.out.println(result);  // [1, 9, 25]
      }
  }
  ```
  **Pipeline breakdown:**
  1. `filter(n -> n % 2 != 0)` removes even numbers: `[1, 3, 5]`
  2. `map(n -> n * n)` squares each remaining element: `[1, 9, 25]`
  3. `collect(Collectors.toList())` gathers results into a new `List<Integer>`

  Output: **`[1, 9, 25]`**

---

## Made by NotAryanSinha
*(Created with care for your programming journey!)*
