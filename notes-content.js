/* ========================================
   WebNotes - Built-in Notes Content Data
   ======================================== */

const BUILTIN_NOTES_CONTENT = {
  "python-reference": `# Python Complete Reference Notes: An Expansive Guide for Beginners

This reference manual is a comprehensive, self-contained guide designed to take you from writing your first line of code to understanding advanced, professional Python patterns. 

Throughout the text, you will find highlighted **Notes** pointing out critical behaviors, gotchas, and internal mechanics, as well as **Practice Questions** to test your understanding. **The Answer Key & Explanations are placed at the absolute end of this document.**

---

## Table of Contents
1. [Python Fundamentals & Design Philosophy](#1-python-fundamentals--design-philosophy)
2. [Variables, Dynamic Typing & Core Datatypes](#2-variables-dynamic-typing--core-datatypes)
3. [Operators & Logical Expressions](#3-operators--logical-expressions)
4. [Input, Output & Type Casting](#4-input-output--type-casting)
5. [Control Flow: Decisions & Repetitions](#5-control-flow-decisions--repetitions)
6. [Core Data Structures (Collections)](#6-core-data-structures-collections)
7. [Functions, Arguments & Variable Scope](#7-functions-arguments--variable-scope)
8. [Object-Oriented Programming (OOP)](#8-object-oriented-programming-oop)
9. [Error & Exception Handling](#9-error--exception-handling)
10. [File Input & Output (I/O)](#10-file-input--output-io)
11. [Essential Standard Libraries](#11-essential-standard-libraries)
12. [Advanced Pythonic Design Patterns](#12-advanced-pythonic-design-patterns)
13. [Answer Key & Explanations](#13-answer-key--explanations)

---

## 1. Python Fundamentals & Design Philosophy

Python is an interpreted, high-level, dynamically typed language created by Guido van Rossum. Its design philosophy emphasizes readability, minimalism, and expressive power—often summarized in **"The Zen of Python"** (type \`import this\` in a Python terminal to read it).

### Execution Model
Unlike fully compiled languages (like C++ or Rust) where source code is compiled directly into machine-readable binary code before execution, Python uses an **interpreter**. 
1. Source code is first compiled into intermediate **Bytecode** (stored in \`.pyc\` files in a \`__pycache__\` directory).
2. This bytecode is then executed line-by-line by the **Python Virtual Machine (PVM)**.

### CPython vs. PyPy
* **CPython**: The reference implementation of Python, written in C. It compiles Python code to bytecode and executes it in an interpreter. It is the default implementation you download from python.org.
* **PyPy**: An alternative implementation of Python written in RPython. It uses a **Just-In-Time (JIT) compiler** that compiles frequently executed bytecode into native machine code at runtime. PyPy often runs CPU-bound programs significantly faster than CPython.

> [!NOTE]
> **The Global Interpreter Lock (GIL)**
> In CPython, the GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once. This lock is necessary because CPython's memory management is not thread-safe. As a result, multi-threaded Python programs cannot utilize multiple CPU cores for CPU-bound tasks (you must use the \`multiprocessing\` module instead).

> [!NOTE]
> **The Indentation Rule**
> Python does not use curly braces \`{}\` or keywords (like \`begin\` and \`end\`) to define blocks of code. Instead, it relies on whitespace **indentation**. The standard is **4 spaces** per indentation level. Mixing tabs and spaces, or failing to maintain consistent indentation, will trigger an \`IndentationError\`.

### 🌍 Real-World Analogy
> Think of C++ compilation like **translating an entire book into Japanese** before anyone can read it — the whole book must be finished first. Python's interpreter, by contrast, is like a **live simultaneous translator** at a UN conference: it listens to one sentence at a time and translates on the fly. The CPython vs. PyPy distinction is similar: CPython is a careful human translator (accurate but methodical), while PyPy is like an AI translator that **memorizes frequently repeated phrases** (JIT-compiling hot code paths) to deliver them instantly the next time they appear.

> **💼 Industry Application:** Python powers some of the world's largest platforms. **Instagram** runs on Python/Django to serve billions of requests. **Spotify** uses Python for backend services and data analysis. **Netflix** uses it for recommendation engine pipelines. Its interpreted nature allows rapid prototyping — engineers ship features faster because they skip the compile-wait-run cycle.

### Practice Questions
* **Question 1:** Explain what happens behind the scenes when you run a Python script, detailing the role of Bytecode and the Python Virtual Machine (PVM).
* **Question 2:** What is the primary difference between CPython and PyPy in terms of code execution, and how does the GIL affect multi-threaded programs in CPython?

---

## 2. Variables, Dynamic Typing & Core Datatypes

### Variables as Pointers
In Python, variables are not labeled "boxes" that lock data inside a specific type. Instead, variables are **labels or pointers** that reference actual objects stored in system memory.

#### Syntax
\`\`\`python
variable_name = object_value
\`\`\`

### Dynamic Typing
Dynamic typing means Python checks the datatype of the object at runtime, rather than at compile time. You can assign an integer to a variable, and later assign a string to that same variable name.

\`\`\`python
x = 42            # x references an integer object
x = "Hello World" # x now references a string object. The integer 42 is orphaned and cleared by Python's Garbage Collector.
\`\`\`

> [!NOTE]
> **Garbage Collection (Reference Counting & Cycle Detection)**
> Python automatically manages memory. Each object tracks how many variables are referencing it (reference count). When an object's reference count drops to 0, Python's garbage collector deletes it immediately. Python also features a cyclic garbage collector to detect and clean up reference cycles (e.g., Object A points to Object B, and Object B points to Object A, but neither is accessible from global/local variables).

### Core Datatypes
1. **Integers (\`int\`)**: Whole numbers of arbitrary precision (limited only by your computer's RAM).
2. **Floats (\`float\`)**: Decimal numbers implemented using double-precision C doubles (64-bit).
3. **Strings (\`str\`)**: Immutable sequences of Unicode characters.
4. **Booleans (\`bool\`)**: Logical subclasses of integers (\`True\` is equivalent to \`1\`, \`False\` is equivalent to \`0\`).
5. **NoneType (\`None\`)**: A special singleton representing "null" or the absence of value.

\`\`\`python
# Declaration & Type Inspection
age = 30                    # int
gpa = 3.85                  # float
first_name = "Charlie"       # str
has_graduated = True        # bool
middle_name = None          # NoneType

print(type(age))            # Output: <class 'int'>
\`\`\`

> [!NOTE]
> **String Interning**
> As an optimization, Python caches (interns) short strings (e.g., strings matching variable identifier naming rules) and small integers (between -5 and 256) in a global pool. If you create two separate variables with the same value, they will point to the exact same object in memory, saving space.

### Type Annotations / Hints
Introduced in Python 3.5, type hints allow you to declare the expected types of variables, arguments, and return values. Type hints are ignored by Python at runtime, but static analysis tools (like \`mypy\`) use them to identify bugs.

\`\`\`python
age_annotation: int = 25
name_annotation: str = "Alice"
\`\`\`

### The \`id()\` Function
The built-in \`id()\` function returns the unique integer identity of an object. In CPython, this number corresponds to the object's physical address in RAM.

\`\`\`python
a = 250
b = 250
print(id(a) == id(b))  # True (due to small integer interning caching)
\`\`\`

> [!IMPORTANT]
> **Understanding None**
> \`None\` is a distinct data type and **not** equal to \`0\`, \`False\`, or an empty string \`""\`. It is commonly used as a default return value for functions that perform actions without returning data, or as placeholder default values in parameters.

### 🌍 Real-World Analogy
> Imagine an **airport baggage carousel**. Each suitcase (object) sits on the carousel (memory). A **variable** is just a **name tag** tied to a suitcase — it doesn't contain the suitcase, it just tells you which one is yours. Dynamic typing means you can untie your name tag from a suitcase and re-tie it to a completely different one (from a backpack to a guitar case). **Garbage collection** is like an airport cleaning crew: once a suitcase has zero name tags attached (no variable references), the crew removes it to make space. **String interning** is the airline's efficiency trick: if ten passengers all carry identical bags, the airline stores only one bag and gives everyone a tag pointing to the same one.

> **💼 Industry Application:** Dynamic typing makes Python the dominant language for **data science** (NumPy, pandas) — analysts can quickly reassign variables to different data structures without rigid type declarations. In **web development** (Django, Flask), Python's flexible typing allows rapid API prototyping where response shapes evolve frequently during development.

### Practice Questions
* **Question 3:** Predict the data type and value resulting from:
  1. \`3.0 + 5\`
  2. \`bool("False")\`
  3. \`bool("")\`
* **Question 4:** Explain string interning in Python. How does the \`id()\` function help us verify if string interning has occurred? Write a short code sample.

---

## 3. Operators & Logical Expressions

Operators allow you to combine, evaluate, and transform data objects.

### Arithmetic Operators
* \`+\` Addition, \`-\` Subtraction, \`*\` Multiplication.
* \`/\` Float Division: Always returns a float (e.g., \`4 / 2\` evaluates to \`2.0\`).
* \`//\` Floor Division: Performs division and rounds down to the nearest whole integer (e.g., \`5 // 2\` is \`2\`).
* \`%\` Modulo: Divides numbers and returns only the remainder (e.g., \`5 % 2\` is \`1\`).
* \`**\` Exponentiation: Raises the base to the power of the exponent (e.g., \`2 ** 3\` is \`8\`).

### Comparison Operators
All comparison operators evaluate to either \`True\` or \`False\`.
* \`==\` Value Equality, \`!=\` Value Inequality.
* \`>\`, \`<\`, \`>=\`, \`<=\` Greater than, Less than, Greater or equal, Less or equal.

> [!IMPORTANT]
> **Equality (\`==\`) vs. Identity (\`is\`)**
> * \`==\` checks if the **values** of the two objects are equal.
> * \`is\` checks if two variables point to the **exact same location in memory** (i.e., they are the same object).
> \`\`\`python
> list_a = [1, 2, 3]
> list_b = [1, 2, 3]
> print(list_a == list_b) # True (values match)
> print(list_a is list_b) # False (stored in different memory addresses)
> \`\`\`

### Logical Operators
Used to combine conditional statements:
* \`and\`: Evaluates to \`True\` only if both statements are \`True\`.
* \`or\`: Evaluates to \`True\` if at least one statement is \`True\`.
* \`not\`: Reverses the boolean state of the expression.

> [!NOTE]
> **Short-Circuit Evaluation**
> Python evaluates logical statements lazily. In an \`and\` statement, if the first operand is \`False\`, the second operand is skipped entirely. In an \`or\` statement, if the first operand is \`True\`, the second operand is skipped.

### The Walrus Operator (\`:=\`)
Introduced in Python 3.8, the assignment expression operator (walrus operator) allows you to assign values to variables inside larger expressions.

\`\`\`python
# Instead of:
# line = file.readline()
# while line:
#     ...
#     line = file.readline()

# You can do:
# while (line := file.readline()):
#     ...
\`\`\`

### Ternary Conditional Expressions
Python supports an inline conditional expression that returns one of two values depending on a boolean condition:
\`\`\`python
x = "Passed" if score >= 50 else "Failed"
\`\`\`

### Operator Precedence Table
Below is the order in which operators are evaluated (from highest precedence at the top to lowest precedence at the bottom):

| Precedence | Operator | Description |
| :--- | :--- | :--- |
| 1 | \`()\` | Parentheses (grouping) |
| 2 | \`**\` | Exponentiation |
| 3 | \`+x\`, \`-x\`, \`~x\` | Unary positive, negative, bitwise NOT |
| 4 | \`*\`, \`/\`, \`//\`, \`%\` | Multiplication, division, floor division, remainder |
| 5 | \`+\`, \`-\` | Addition, subtraction |
| 6 | \`<<\`, \`>>\` | Bitwise shifts |
| 7 | \`&\` | Bitwise AND |
| 8 | \`^\` | Bitwise XOR |
| 9 | \`\\|\` | Bitwise OR |
| 10 | \`in\`, \`not in\`, \`is\`, \`is not\`, \`<\`, \`<=\`, \`>\`, \`>=\`, \`!=\`, \`==\` | Comparisons, identity, membership |
| 11 | \`not\` | Logical NOT |
| 12 | \`and\` | Logical AND |
| 13 | \`or\` | Logical OR |
| 14 | \`:=\` | Walrus operator (assignment expression) |

### Membership Operators
* \`in\` and \`not in\`: Check if an item exists within a sequence (string, list, tuple, etc.).
\`\`\`python
letters = "python"
print("y" in letters)  # True
print("z" not in letters) # True
\`\`\`

### 🌍 Real-World Analogy
> **Operator precedence** follows the same logic as the **BODMAS/PEMDAS** rules from math class — multiplication happens before addition unless parentheses override the order. **Short-circuit evaluation** works like a **nightclub bouncer**: with \`and\`, if the first person in a group fails the ID check, the bouncer rejects the entire group immediately without checking anyone else. With \`or\`, if the first person passes, the bouncer waves the whole group through. The **walrus operator** (\`:=\`) is like a **drive-through window**: you simultaneously name your order ("combo #3") and receive it in one step, instead of ordering first and waiting at a second window.

> **💼 Industry Application:** Short-circuit evaluation is critical in **form validation** for web apps: \`if username and len(username) > 3:\` — Python skips the \`len()\` check entirely if \`username\` is empty, preventing a crash. **Ternary expressions** are heavily used in **template rendering** (Jinja2) to conditionally display content: \`{{ "Active" if user.is_active else "Inactive" }}\`.

### Practice Questions
* **Question 5:** What is the output of the following boolean expression?
  \`result = (10 // 3 == 3.0) and (not (5 == 5.0) or ("p" in "apple"))\`

---

## 4. Input, Output & Type Casting

### Standard Output (\`print\`)
The \`print()\` function takes zero or more expressions, converts them to strings, and writes them to standard output.

#### Syntax
\`\`\`python
print(*objects, sep=' ', end='\\n')
\`\`\`
* \`*objects\`: Any number of values separated by commas.
* \`sep\`: The character placed between objects (default is a space \`' '\`).
* \`end\`: The character appended at the very end of the output (default is a newline \`'\\n'\`).

\`\`\`python
print("Hello", "World", sep="*", end="!!!\\n") # Outputs: Hello*World!!!
\`\`\`

### Standard Input (\`input\`)
The \`input()\` function prompts the user to enter data via the keyboard and halts execution until the Enter key is pressed.

> [!WARNING]
> **The Input Type Trap**
> \`input()\` **always** returns the user's input as a string (\`str\`). If you need to perform numerical calculations, you must explicitly cast it to a numerical type (like \`int()\` or \`float()\`). Failing to do so will result in logical bugs or a \`TypeError\`.
> \`\`\`python
> raw_age = input("Enter age: ") # User types: 20
> age = int(raw_age)             # Casts string "20" to integer 20
> \`\`\`

### String Formatting Options

#### 1. F-Strings (Formatted String Literals - Recommended)
Introduced in Python 3.6, f-strings provide a concise and readable way to embed formatting expressions inside strings.
\`\`\`python
name = "Bob"
salary = 1250.756
print(f"Employee {name} earns \${salary:.2f} per month.") 
\`\`\`

#### 2. The \`str.format()\` Method
\`\`\`python
print("Employee {} earns {:.2f} per month.".format(name, salary))
print("Employee {n} earns {s:.2f} per month.".format(n=name, s=salary))
\`\`\`

#### 3. C-Style \`%\` Formatting (Legacy)
\`\`\`python
print("Employee %s earns %.2f per month." % (name, salary))
\`\`\`

### 🌍 Real-World Analogy
> The \`input()\` function is like a **waiter taking your order** at a restaurant — no matter whether you say "two" or "2", the waiter writes it down as text on a notepad. If the kitchen (your program) needs a number to cook the right quantity, you must explicitly tell the waiter to convert the text into a number (\`int()\` cast). **F-strings** work like a **fill-in-the-blank Mad Libs game**: you write the sentence structure with blank slots \`{}\`, and Python fills in the values at runtime. The three formatting methods (f-strings, \`.format()\`, \`%\`) are like three generations of form-filling: handwritten carbon copies (% formatting), typed templates (.format()), and auto-populating smart forms (f-strings).

> **💼 Industry Application:** Command-line tools like \`pip\`, \`git\`, and \`docker\` all use \`input()\` for interactive prompts. **Logging systems** in production servers rely on f-strings for structured log messages: \`logger.info(f"User {user_id} purchased {item_name} for \${price:.2f}")\`. Data export scripts use f-string formatting to generate CSV and report files with precisely formatted numeric columns.

### Practice Questions
* **Question 6:** Write a script that prompts the user to enter their birth year, calculates their approximate current age (using hardcoded current year 2026), and prints: \`"You are X years old."\` where X is the calculation. Handle potential type mismatch crashes.

---

## 5. Control Flow: Decisions & Repetitions

### Conditionals (\`if\`, \`elif\`, \`else\`)
Executes blocks of code selectively based on boolean conditions.

\`\`\`python
score = 82

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
\`\`\`

### Structural Pattern Matching (\`match-case\`)
Introduced in Python 3.10, \`match-case\` provides powerful pattern matching capabilities similar to switch statements in other languages, but with structured destructuring support.

\`\`\`python
status = 404
match status:
    case 200:
        print("OK")
    case 400 | 404:
        print("Client Error")
    case 500:
        print("Server Error")
    case _:
        print("Unknown Status")
\`\`\`

### Loops
* \`while\` loop: Executes continuously as long as its condition remains \`True\`.
* \`for\` loop: Iterates over a sequence (such as a string, list, tuple, dict, or generated range).

#### Loop Control Keywords
* \`break\`: Terminate the loop immediately.
* \`continue\`: Skip the rest of the current iteration block and jump directly to the evaluation of the next iteration cycle.
* \`pass\`: A syntactical placeholder that does nothing.

#### Loop \`else\` Clause
Both \`for\` and \`while\` loops can have an optional \`else\` block. The \`else\` block is executed when the loop finishes iterating normally (i.e., it is **not** terminated by a \`break\` statement).

\`\`\`python
for x in range(3):
    print(x)
else:
    print("Loop finished without break")
\`\`\`

### Common Iteration Helpers
* \`range(start, stop, step)\`: Generates an exclusive sequence of integers.
* \`enumerate(sequence, start=0)\`: Yields tuples of (index, value).
* \`zip(*iterables)\`: Interleaves items from multiple iterables parallelly.

### 🌍 Real-World Analogy
> - An \`if-elif-else\` conditional control flow acts like a **traffic signal**: it directs traffic down exactly one path depending on which light is active.
> - A \`for\` loop is like a **factory assembly line conveyor belt**: it processes a fixed sequence of items, one by one, performing the same operations on each.
> - A \`match-case\` block is like a **vending machine**: it matches your selection against precise slot numbers and dispenses the exact item selected (with a default fallback block \`case _\` representing an invalid selection).
>
> **💼 Industry Application:** Web servers route user requests based on control flow: \`if path == "/home": ... elif path == "/login": ... else: ...\`. Data processing libraries iterate over database rows using \`for\` loops to generate bulk analytical reports. Modern API gateways use structural pattern matching to route payload structures depending on their fields.

### Practice Questions
* **Question 7:** What is printed by the following code snippet?
  \`\`\`python
  for num in range(1, 6):
      if num == 3:
          continue
      if num == 5:
          break
      print(num, end="-")
  \`\`\`
* **Question 8:** Write a code snippet that iterates over a list of integers using a \`for\` loop. If an even number is found, print \`"Found even number X"\` and terminate the loop. If the loop completes without finding any even number, print \`"No even number found"\` using a loop \`else\` block.

---

## 6. Core Data Structures (Collections)

Python features four built-in collections.

| Collection Type | Ordered? | Mutable? | Unique Elements Only? | Syntax |
| :--- | :--- | :--- | :--- | :--- |
| **List** | Yes | Yes | No | \`[item1, item2]\` |
| **Tuple** | Yes | No | No | \`(item1, item2)\` |
| **Dictionary**| Yes (3.7+) | Yes | Yes (Keys only) | \`{"key": "value"}\`|
| **Set** | No | Yes | Yes | \`{item1, item2}\` |

---

### 1. Lists (\`list\`)
A mutable, ordered array of elements.

#### Core Operations
* \`append(x)\`: Adds \`x\` to the end.
* \`insert(index, x)\`: Places \`x\` at a specific index.
* \`pop(index)\`: Removes and returns the item at index.
* \`remove(x)\`: Deletes the first instance of value \`x\`.
* **Slicing:** \`list[start:stop:step]\` returns a shallow copy of a slice of the list.

\`\`\`python
nums = [10, 20, 30, 40]
nums.append(50)      # [10, 20, 30, 40, 50]
nums.pop(0)          # Removes 10, returns 10
slice_a = nums[1:3]  # Indexes 1 and 2: [30, 40]
\`\`\`

> [!WARNING]
> **The Mutability Assignment Trap**
> Assigning a list to a new variable (e.g., \`list_b = list_a\`) copies the reference pointer, not the list. Modifying \`list_b\` will alter \`list_a\`! Use \`list_b = list_a.copy()\` or \`list_b = list_a[:]\` to clone lists.

---

### 2. Double-Ended Queue (\`collections.deque\`)
Lists in Python are efficient for $O(1)$ operations at the end, but inserting or popping from the beginning is $O(n)$ because all other elements must be shifted in memory. \`deque\` allows $O(1)$ appends and pops from both ends.

\`\`\`python
from collections import deque
queue = deque([2, 3, 4])
queue.appendleft(1)   # O(1) insertion at head: deque([1, 2, 3, 4])
queue.popleft()       # O(1) removal from head: 1
\`\`\`

---

### 3. Tuples (\`tuple\`) & Named Tuples
Ordered, **immutable** records. Once instantiated, they cannot be modified.

\`\`\`python
point = (4, 5)
\`\`\`

> [!NOTE]
> **Tuple containing Mutables**
> If a tuple contains a mutable object, such as a list, the elements inside that list can still be modified!
> \`\`\`python
> my_tuple = (1, 2, [3, 4])
> my_tuple[2].append(5) # Valid! Result: (1, 2, [3, 4, 5])
> \`\`\`

#### Named Tuples (\`collections.namedtuple\`)
Provides tuple readability by allowing elements to be accessed by name as well as index.

\`\`\`python
from collections import namedtuple
Point2D = namedtuple('Point2D', ['x', 'y'])
pt = Point2D(10, 20)
print(pt.x, pt.y) # Access by field name: 10 20
\`\`\`

---

### 4. Dictionaries (\`dict\`)
An associative mapping of unique keys to values.

#### Core Operations
* \`dict[key] = value\`: Assigns/updates a key-value mapping.
* \`dict[key]\`: Fetches value. Raises \`KeyError\` if key does not exist.
* \`get(key, default_value)\`: Safe retrieval. Returns \`default_value\` if key is missing instead of throwing a KeyError.
* **Dictionary Merge Operator (\`|\`)**: Added in Python 3.9, combines two dicts into a new one.
* **Dictionary Update Operator (\`|=\`)**: Updates a dictionary in-place.

\`\`\`python
dict_a = {'a': 1, 'b': 2}
dict_b = {'b': 99, 'c': 3}
merged = dict_a | dict_b  # {'a': 1, 'b': 99, 'c': 3}
\`\`\`

> [!IMPORTANT]
> **Dictionary Key Hashability**
> Only **immutable** and hashable data types can be used as dictionary keys. Lists and dictionaries are mutable, therefore unhashable, and will raise a \`TypeError\` if used as keys.

---

### 5. Sets (\`set\`) & Frozen Sets (\`frozenset\`)
Unordered collections containing unique values.

#### Core Operations
* \`add(x)\`: Inserts element \`x\`.
* Math operations: Union (\`|\`), Intersection (\`&\`), Difference (\`-\`).

#### Frozen Sets (\`frozenset\`)
A \`frozenset\` is an immutable version of a \`set\`. Since it is immutable, it is hashable, meaning a \`frozenset\` can be used as a dictionary key or an element in another set.

\`\`\`python
frozen = frozenset([1, 2, 3])
# frozen.add(4) # AttributeError (immutable!)
\`\`\`

> [!NOTE]
> **Lookup Performance**
> Checking membership (\`x in collection\`) is an $O(1)$ constant time operation in Sets and Dictionaries because they use hash tables. In Lists and Tuples, it is an $O(n)$ linear time operation.

### 🌍 Real-World Analogy
> - A **list** is like a **grocery shopping list**: it keeps items in the order you write them, you can add duplicates, and you can cross off or insert items anywhere.
> - A **dictionary** is like a **phone contacts book**: you look up a person's unique name (key) to instantly find their phone number (value).
> - A **set** is like a **unique stamp collection**: you cannot have duplicates, and the order they sit in the album doesn't matter, but you can instantly check if you own a specific stamp.
> - A **deque** is like a **double-ended line at a ticket counter** where people can join or leave from both the front and the back.
>
> **💼 Industry Application:** E-commerce platforms use lists to maintain a user's shopping cart. Cache systems (like Redis) use dictionary key-value lookups for instant database queries. Tracking unique visitor IP addresses or removing duplicate logs is typically done using sets for high-performance $O(1)$ validation.

### Practice Questions
* **Question 9:** What will be the outputs of \`print(x)\` and \`print(y)\` at the end of this code block?
  \`\`\`python
  x = [1, 2, [3, 4]]
  y = x.copy()
  y[0] = 99
  y[2].append(5)
  \`\`\`
* **Question 10:** Explain why \`my_dict = {[1, 2]: "value"}\` throws an error, while \`my_dict = {(1, 2): "value"}\` does not.

---

## 7. Functions, Arguments & Variable Scope

Functions package reusable chunks of computational logic.

### Parameter Passing
* **Positional Arguments:** Matched to parameters by placement order.
* **Keyword Arguments:** Matched by parameter name.
* **Default Values:** Fallback values used if the argument is omitted.
* **Arbitrary positional arguments (\`*args\`)**: Bundles extra positional arguments into a tuple.
* **Arbitrary keyword arguments (\`**kwargs\`)**: Bundles extra keyword arguments into a dictionary.

\`\`\`python
def order_food(customer, *items, **metadata):
    print(f"Customer: {customer}")
    print(f"Dishes: {items}")
    print(f"Details: {metadata}")
\`\`\`

> [!WARNING]
> **The Mutable Default Argument Gotcha**
> Python creates default argument values **only once** at the time the function is defined, not every time the function runs. If you use a mutable object (like a list) as a default argument, all future calls will share and modify the exact same object! Use \`None\` as default and initialize inside the function.

### Type Hints in Functions
Function signatures can have type hints for parameters and the return value:
\`\`\`python
def add_numbers(a: int, b: int) -> int:
    return a + b
\`\`\`

### Docstring Best Practices
Write clear documentation for your functions inside triple quotes (\`"""\`). PEP 257 outlines docstring standards:
\`\`\`python
def calculate_area(width: float, height: float) -> float:
    """Calculate the area of a rectangle.
    
    Args:
        width: The width of the rectangle.
        height: The height of the rectangle.
        
    Returns:
        The computed area as a float.
    """
    return width * height
\`\`\`

---

### Scope Rules (LEGB Rule)
Scope determines where variables can be accessed. When looking up a variable name, Python searches memory levels in order:
1. **L - Local:** Inside the currently running function.
2. **E - Enclosing:** Inside enclosing outer nested functions (non-local).
3. **G - Global:** Module level (defined outside any functions).
4. **B - Built-in:** Built-in Python keywords/functions (like \`len\`, \`int\`, etc.).

To modify a global variable inside a local scope, you must use the \`global\` keyword. To modify an enclosing variable inside a nested scope, use the \`nonlocal\` keyword.

\`\`\`python
counter = 0 # Global

def increment():
    global counter
    counter += 1 # Modifies the global variable
\`\`\`

---

### Lambda (Anonymous) Functions
Inline, single-expression anonymous functions.
\`\`\`python
multiply = lambda x, y: x * y
print(multiply(2, 4)) # 8
\`\`\`

### Useful \`functools\` Utilities
* \`functools.partial\`: Freezes a portion of a function's arguments to create a new signature.
* \`functools.lru_cache\`: A decorator that wraps a function with a Least Recently Used (LRU) cache, memoizing return values to speed up repeated calls with the same arguments.

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=128)
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
\`\`\`

### 🌍 Real-World Analogy
> - A **function** is like a **kitchen recipe card**: it takes ingredients (arguments), performs a sequence of cooking steps, and outputs a meal (return value).
> - \`*args\` and \`**kwargs\` are like ordering a **customizable pizza**: \`*args\` lets you list any number of toppings ("mushrooms", "peppers", "olives"), and \`**kwargs\` allows you to specify custom instructions (\`extra_cheese=True\`, \`crust="thin"\`).
> - \`functools.lru_cache\` (memoization) is like a **chef using a prep table**: instead of chopping fresh onions every single time a recipe calls for them, the chef chops a big batch once and grabs them from the prep table whenever needed.
>
> **💼 Industry Application:** Serverless architectures (AWS Lambda, Google Cloud Functions) execute microservice logic using isolated functions. API endpoints handle arbitrary incoming JSON payloads using \`**kwargs\` to process dynamic user filters. Finance and heavy-calculating microservices use LRU caching to cache complex calculations.

### Practice Questions
* **Question 11:** What is the output of the two print statements in this code?
  \`\`\`python
  def build_list(val, collection=[]):
      collection.append(val)
      return collection

  first = build_list(1)
  second = build_list(2)
  print(f"First: {first}")
  print(f"Second: {second}")
  \`\`\`
* **Question 12:** Use \`functools.lru_cache\` to write a recursive Fibonacci function. Explain how memoization improves the time complexity of this function from exponential to linear.

---

## 8. Object-Oriented Programming (OOP)

OOP is a development paradigm that groups state (attributes) and behavior (methods) into cohesive objects.

### Classes, Objects, and Constructors
* **Class:** The structural blueprint (e.g., class \`Dog\`).
* **Object / Instance:** A concrete realization of the blueprint.
* **Constructor (\`__init__\`):** Initialization method executed automatically on instantiation.
* **\`self\`:** References the current object instance calling the method.

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name
\`\`\`

### \`__str__\` vs. \`__repr__\`
* \`__str__\` is intended to return a user-friendly, readable string representation of an object (called by \`print()\` and \`str()\`).
* \`__repr__\` is intended to return an unambiguous, developer-friendly string representation, ideally looking like a valid Python expression to recreate the object (called by interactive shells and \`repr()\`).

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __str__(self):
        return f"({self.x}, {self.y})"
    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"
\`\`\`

### Magic (Dunder) Methods
Dunder (double-underscore) methods allow objects to hook into core Python operations.
* \`__len__(self)\`: Custom size behavior for \`len()\`.
* \`__getitem__(self, key)\`: Indexing/bracket notation access (\`obj[key]\`).
* \`__add__(self, other)\`: Overloads the \`+\` operator.
* \`__eq__(self, other)\`: Overloads the \`==\` operator.

### Dataclasses (\`dataclasses.dataclass\`)
Introduced in Python 3.7, \`@dataclass\` automatically generates standard boilerplate methods like \`__init__\`, \`__repr__\`, \`__eq__\`, and others, based on class variable type annotations.

\`\`\`python
from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 1
\`\`\`

### Method Resolution Order (MRO)
In multiple inheritance, MRO defines the order in which Python searches base classes for a method. Python uses the **C3 Linearization** algorithm to compute MRO, which you can inspect using the \`__mro__\` attribute or \`mro()\` method on a class.

---

### The Four Pillars of OOP

#### 1. Inheritance
Subclasses inherit variables and methods from base classes, promoting reuse.

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    def sleep(self):
        return f"{self.name} is sleeping."

class Cat(Animal):
    def meow(self):
        return f"{self.name} says Meow."
\`\`\`

#### 2. Polymorphism
Polymorphism allows different class types to implement methods with the same name.

\`\`\`python
class Dog:
    def speak(self): return "Woof!"
class Duck:
    def speak(self): return "Quack!"

def animal_noise(animal):
    print(animal.speak())
\`\`\`

#### 3. Encapsulation
Hiding internal object details. Private variables are prefixed with a double underscore \`__\`. Getter and setter methods (using \`@property\`) manage access.

\`\`\`python
class Account:
    def __init__(self, starting_balance):
        self.__balance = starting_balance # Private attribute
        
    @property
    def balance(self):
        return self.__balance
        
    @balance.setter
    def balance(self, value):
        if value >= 0:
            self.__balance = value
        else:
            print("Invalid deposit amount!")
\`\`\`

> [!NOTE]
> **Name Mangling**
> Private variables prefixed with \`__\` are internally renamed to \`_ClassName__attributeName\` to prevent accidental overwrites. They can still be accessed, but convention advises against doing so.

#### 4. Abstraction
Exposing clean interface frameworks while hiding complex implementation details. This is achieved by subclassing Abstract Base Classes (ABCs).

\`\`\`python
from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process(self, amount):
        pass

class PayPal(PaymentGateway):
    def process(self, amount):
        return f"Processing \${amount} through PayPal APIs."
\`\`\`

### 🌍 Real-World Analogy
> - A **class** is like a **car blueprint** (stating features like engine type and wheel size), whereas an **object** is the **actual physical car** parked in your driveway.
> - **Inheritance** is like a **family tree**: a child inherits physical traits from parents but can also develop unique hobbies (methods).
> - **Encapsulation** is like an **ATM machine**: the money (data) is locked inside a vault; you cannot reach in and grab it directly. Instead, you must use the keypad interface (getters/setters) to deposit or withdraw safely.
> - **Polymorphism** is like a **standard USB port**: different devices (mouse, keyboard, flash drive) all fit into the same port and communicate, but each performs a completely different task when plugged in.
>
> **💼 Industry Application:** Game engines define base classes like \`GameObject\` (with coordinate properties), which are inherited by \`Player\`, \`Enemy\`, and \`Obstacle\` classes. Payment processing APIs utilize abstraction: they expose a single \`charge()\` method, but inherit different classes under the hood (e.g., Stripe, PayPal, Braintree) to connect to different APIs.

### Practice Questions
* **Question 13:** Explain the role of the \`super()\` function in OOP inheritance, and write a code example showing how a child class subclass constructor calls its parent.
* **Question 14:** Create a class \`Book\` using the \`@dataclass\` decorator with fields \`title\` (str), \`author\` (str), and \`price\` (float). Overwrite the \`__str__\` method to return: \`"[TITLE] by [AUTHOR]"\`.

---

## 9. Error & Exception Handling

Exceptions are runtime errors. Unhandled exceptions crash programs; handled exceptions allow code to respond gracefully.

### The Full Exception Handling Block
* \`try\`: Wraps the operations that could fail.
* \`except SpecificError as e\`: Runs only if a matching error is raised.
* \`else\`: Runs only if the \`try\` block executes successfully without raising errors.
* \`finally\`: Executed **always**, whether an error occurred or not. Used to release system resources.

#### Syntax
\`\`\`python
try:
    # Operations
except ZeroDivisionError as e:
    # Error resolution
else:
    # Execution if successful
finally:
    # Cleanups
\`\`\`

#### Code Example
\`\`\`python
def load_and_calculate(a, b):
    try:
        val = a / b
    except ZeroDivisionError:
        print("Calculation failed: Division by zero.")
        val = None
    else:
        print("Calculation finished successfully.")
    finally:
        print("Cleaning up resources...")
    return val
\`\`\`

> [!WARNING]
> **Catching Generic Exceptions**
> Avoid catching all exceptions using a bare \`except:\` or \`except Exception:\`. This hides critical bugs and makes troubleshooting extremely difficult.

### Custom Exception Classes
You can create custom exceptions by subclassing the built-in \`Exception\` class.
\`\`\`python
class InsufficientFundsError(Exception):
    """Exception raised when an account balance is too low."""
    pass
\`\`\`

### Exception Chaining
To raise a new exception while preserving the stack trace of a previous exception, use \`raise ... from ...\`:
\`\`\`python
try:
    # some file logic
    open("config.json")
except FileNotFoundError as e:
    raise RuntimeError("System configuration file is missing") from e
\`\`\`

### ExceptionGroup & \`except*\`
Introduced in Python 3.11, \`ExceptionGroup\` allows raising and handling multiple independent exceptions simultaneously. This is especially useful in asynchronous concurrency. You catch exceptions from an ExceptionGroup using the \`except*\` syntax.

\`\`\`python
# Example structure:
# try:
#     raise ExceptionGroup("errors", [ValueError("bad value"), TypeError("bad type")])
# except* ValueError as eg:
#     print("Handled ValueErrors")
# except* TypeError as eg:
#     print("Handled TypeErrors")
\`\`\`

### 🌍 Real-World Analogy
> - A \`try-except\` block is like a **safety net for tightrope walkers**: if the performer slips (a runtime error occurs), the safety net catches them so the show can continue, rather than the stadium closing down (crashing the program).
> - The \`finally\` block is like the **emergency fire exit** in a building: no matter what happens inside (whether the show succeeds, fails, or catches fire), the exit remains open and must be usable at the end.
>
> **💼 Industry Application:** Database clients wrap connection attempts in \`try-except\` blocks to handle network timeouts gracefully and reconnect. Production backends use \`finally\` blocks to close open file descriptors, release thread locks, and close database connections, preventing memory leaks.

### Practice Questions
* **Question 15:** In the code below, if the user inputs \`10\` and \`2\`, what is the exact print sequence? If the user inputs \`10\` and \`0\`, what is the print sequence?
  \`\`\`python
  def divide(x, y):
      try:
          print("A")
          result = x / y
      except ZeroDivisionError:
          print("B")
      else:
          print("C")
      finally:
          print("D")
  \`\`\`

---

## 10. File Input & Output (I/O)

Files allow you to save data persistently to disk.

### The Modern Path Object (\`pathlib\`)
Introduced in Python 3.4, the \`pathlib\` module offers an object-oriented API for working with file paths.
\`\`\`python
from pathlib import Path

# Create a path reference
my_path = Path("documents") / "notes.txt"
print(my_path.exists())
\`\`\`

### Opening Files with Context Managers
Always open files inside a \`with\` context manager block to ensure resources are automatically released.

\`\`\`python
with open("diary.txt", "w") as file:
    file.write("Dear Diary, today I learned Python File I/O.\\n")

with open("diary.txt", "r") as file:
    content = file.read()
    print(content)
\`\`\`

### Common Access Modes
* \`'r'\`: Read mode (default).
* \`'w'\`: Write mode (creates or **overwrites** existing file).
* \`'a'\`: Append mode (appends to end of existing file).
* \`'b'\`: Binary mode (combine with others, e.g., \`'rb'\` or \`'wb'\` for binary data like images).

### CSV & JSON File I/O
\`\`\`python
import json
import csv

# JSON Write
data = {"name": "Alice", "score": 95}
with open("data.json", "w") as f:
    json.dump(data, f)

# JSON Read
with open("data.json", "r") as f:
    loaded_data = json.load(f)

# CSV Write
with open("scores.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Score"])
    writer.writerow(["Bob", 88])
\`\`\`

### 🌍 Real-World Analogy
> - File access modes are like **handling a physical notebook**: \`'r'\` (read) is like reading pages without a pen, \`'w'\` (write) is like ripping out all pages and writing from page one, and \`'a'\` (append) is like writing a new entry starting on the first blank line.
> - A **context manager** (\`with\` statement) is like a **library book checkout system**: it automatically marks the book as returned when you leave the library table, ensuring you don't walk off with it.
>
> **💼 Industry Application:** Data pipelines write processed records to daily log files in append (\`'a'\`) mode. Configuration managers load JSON or YAML settings files at startup and deserialize them to configure server ports, database URLs, and API tokens.

### Practice Questions
* **Question 16:** Write a program that opens a file called \`numbers.txt\` containing a list of numbers (one per line), sums them up, and appends the final sum to the end of the same file. Handle potential file missing errors gracefully.
* **Question 17:** Write a python program using \`pathlib\` and \`json\` to verify if a file \`stats.json\` exists. If it does, read it, print its content, and increment a key \`'run_count'\`. Write the updated dictionary back to the file. If it doesn't exist, create it with default data \`{"run_count": 1}\`.

---

## 11. Essential Standard Libraries

Python's standard library provides built-in tools for common tasks.

### 1. \`math\`
Mathematical operations.
\`\`\`python
import math
print(math.sqrt(25)) # 5.0
\`\`\`

### 2. \`random\`
Pseudo-random generator.
\`\`\`python
import random
print(random.randint(1, 6)) # Dice roll simulation
\`\`\`

### 3. \`datetime\`
Dates and times.
\`\`\`python
from datetime import datetime, timedelta
now = datetime.now()
tomorrow = now + timedelta(days=1)
\`\`\`

### 4. \`os\` & \`sys\`
* \`os\` manipulates directories and environment variables.
* \`sys\` interacts with system configurations and command arguments.

### 5. \`json\`
Serializes and deserializes JSON payloads.

### 6. \`collections\`
* \`Counter\`: Count element frequencies.
* \`defaultdict\`: Auto-initializes missing keys.
* \`deque\`: Double-ended queues.

### 7. Regular Expressions (\`re\`)
Enables matching strings using regex patterns.
\`\`\`python
import re
pattern = r"\\d+"
text = "There are 42 apples and 100 oranges."
matches = re.findall(pattern, text) # ['42', '100']
\`\`\`

### 8. \`itertools\`
Advanced tools for iteration and combinations.
\`\`\`python
import itertools
# Permutations of elements
perms = list(itertools.permutations([1, 2, 3], 2)) # [(1, 2), (1, 3), ...]
\`\`\`

### 9. \`typing\`
Support for type annotations (e.g., \`List\`, \`Dict\`, \`Union\`, \`Optional\`, \`Any\`, \`Callable\`).
\`\`\`python
from typing import List, Union

def process_items(items: List[Union[int, str]]) -> None:
    pass
\`\`\`

### 🌍 Real-World Analogy
> - The \`random\` library is like rolling a set of **dice** or shuffling a **deck of cards** during a game.
> - The \`datetime\` library is like a **wall calendar and a stopwatch** combined, helping you measure durations and schedule dates.
> - The \`json\` format is like a **universal shipping label**: regardless of which country (programming language) sent the package, the label can be read by everyone.
>
> **💼 Industry Application:** Cryptographic systems use secure random modules (\`secrets\`) to generate passwords and verification tokens. E-commerce applications use \`datetime\` and \`timedelta\` to calculate expiration dates for discount coupons and schedule future subscription renewals. REST APIs exchange data globally using the JSON format, allowing Python backends to communicate with JavaScript frontend applications.

### Practice Questions
* **Question 18:** Which function from the \`random\` module should you use to select multiple unique random elements from a list without modifying the original list?

---

## 12. Advanced Pythonic Design Patterns

These features distinguish beginner code from clean, idiomatic Python.

### 1. Comprehensions (Lists, Dicts, Sets)
Syntactic sugar to create collections in a single line.
\`\`\`python
# List comprehension: Generate squares of even numbers
numbers = [1, 2, 3, 4, 5, 6]
even_squares = [x**2 for x in numbers if x % 2 == 0] # [4, 16, 36]

# Dictionary comprehension
names = ["Alice", "Bob"]
name_lengths = {name: len(name) for name in names} # {"Alice": 5, "Bob": 3}
\`\`\`

---

### 2. Generators & Yield
Generators yield values dynamically one at a time and save execution states, making them incredibly memory efficient for giant datasets.
\`\`\`python
def generate_even_sequence(limit):
    num = 2
    while num <= limit:
        yield num  # Pauses execution and yields value
        num += 2

for even in generate_even_sequence(10):
    print(even)
\`\`\`

---

### 3. Custom Context Managers
You can create custom context managers by implementing the \`__enter__\` and \`__exit__\` magic methods in a class, or by using the \`@contextmanager\` decorator from \`contextlib\`.

\`\`\`python
class CustomOpen:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()

# Usage
with CustomOpen("test.txt", "w") as f:
    f.write("Hello Custom Context Manager!")
\`\`\`

---

### 4. Asynchronous I/O (\`asyncio\`)
For single-threaded concurrency in I/O bound programs, \`asyncio\` allows non-blocking task execution using coroutines.

\`\`\`python
import asyncio

async def fetch_data():
    print("Fetching started...")
    await asyncio.sleep(1) # Simulated network delay
    print("Fetching completed!")
    return {"data": 123}

async def main():
    # Runs the coroutine concurrently
    result = await fetch_data()
    print(result)

# To run:
# asyncio.run(main())
\`\`\`

---

### 5. Decorators
Decorators wrap functions to dynamically intercept, modify, or extend their behavior without altering the original function's source code.

\`\`\`python
import time

def execution_timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs) # Call wrapped function
        end = time.time()
        print(f"Function {func.__name__} took {end - start:.5f} seconds.")
        return result
    return wrapper

@execution_timer
def complex_math_routine():
    sum(x**2 for x in range(100000))

complex_math_routine()
\`\`\`

### 🌍 Real-World Analogy
> - A **generator** is like a **sushi conveyor belt**: instead of a chef preparing 10,000 sushi plates and packing them into the fridge all at once (high memory usage), the chef makes one plate, places it on the belt, and makes the next one only when the previous one is consumed.
> - **Asynchronous I/O** (\`asyncio\`) is like a **professional chef cooking a multi-course dinner**: instead of standing around doing nothing while waiting for the pasta water to boil, the chef uses that time to chop vegetables or sear meat, switching tasks dynamically whenever one task is waiting.
> - **Decorators** are like **gift wrapping**: you don't change the gift inside (the function), but you add a decorative outer layer that provides extra presentation or behavior (e.g., logging execution time).
>
> **💼 Industry Application:** Data scientists use generators to stream gigabytes of logs or images into machine learning training loops without running out of RAM. Web scrapers and chat servers use \`asyncio\` to handle thousands of concurrent network connections without spinning up resource-heavy threads. Web frameworks like Flask and FastAPI use decorators (\`@app.route\`) to register functions as handlers for specific URL endpoints.

### Practice Questions
* **Question 19:** Write a list comprehension that takes a list of strings and returns a list containing only strings that are longer than 3 characters, with the strings converted to uppercase.
* **Question 20:** Write a custom context manager \`Timer\` that prints the time taken to run the block of code it wraps.

---
---

## 13. Answer Key & Explanations

Here are the answers and explanations to the practice questions throughout the guide.

### Section 1: Python Fundamentals & Design Philosophy
* **Answer 1:** When you execute a Python script:
  1. The Python compiler translates the high-level code into intermediate, bytecode instructions (saved as \`.pyc\` files).
  2. The Python Virtual Machine (PVM) reads and translates this bytecode into machine-level binary code instructions that your computer's CPU can execute.
  This hybrid process provides the portability of interpreted languages and optimizes execution speed.
* **Answer 2:** 
  * CPython compiles source code to bytecode and runs it in an interpreter. PyPy compiles frequently executed bytecode directly into native machine instructions at runtime using a Just-In-Time (JIT) compiler, yielding faster CPU performance.
  * In CPython, the GIL (Global Interpreter Lock) prevents multiple threads from running bytecode concurrently. This limits multi-threaded applications to a single CPU core, restricting performance improvements for CPU-bound tasks.

### Section 2: Variables, Dynamic Typing & Core Datatypes
* **Answer 3:**
  1. \`3.0 + 5\` evaluates to **\`8.0\`** (datatype: **\`float\`**). Adding a float and an integer converts the result to a float (implicit coercion).
  2. \`bool("False")\` evaluates to **\`True\`** (datatype: **\`bool\`**). A non-empty string always converts to \`True\`, regardless of its content.
  3. \`bool("")\` evaluates to **\`False\`** (datatype: **\`bool\`**). An empty string converts to \`False\` (truthiness evaluation).
* **Answer 4:**
  * String interning is an optimization where Python keeps only one copy of certain string values in memory. Different variables with the same value will point to the same object address.
  * The \`id()\` function returns the memory address. We can check identity using \`id(a) == id(b)\` or \`a is b\`.
  \`\`\`python
  a = "hello"
  b = "hello"
  print(id(a) == id(b))  # True (interned)
  \`\`\`

### Section 3: Operators & Logical Expressions
* **Answer 5:**
  The expression evaluates to **\`True\`**. Here is the step-by-step breakdown:
  1. \`10 // 3\` is \`3\`, so \`3 == 3.0\` is \`True\`.
  2. \`5 == 5.0\` is \`True\`, so \`not (5 == 5.0)\` is \`False\`.
  3. \`"p" in "apple"\` is \`True\`.
  4. The right side becomes: \`False or True\`, which evaluates to \`True\`.
  5. The complete statement is: \`True and True\`, which evaluates to \`True\`.

### Section 4: Input, Output & Type Casting
* **Answer 6:**
  \`\`\`python
  try:
      birth_year_str = input("Enter your birth year: ")
      birth_year = int(birth_year_str) # Cast to integer
      age = 2026 - birth_year
      print(f"You are {age} years old.")
  except ValueError:
      print("Error: Please enter a valid number for your birth year.")
  \`\`\`

### Section 5: Control Flow: Decisions & Repetitions
* **Answer 7:**
  The program prints **\`1-2-4-\`**.
  * \`num = 1\`: Prints \`1-\`.
  * \`num = 2\`: Prints \`2-\`.
  * \`num = 3\`: The \`continue\` statement skips the print step and starts the next iteration.
  * \`num = 4\`: Prints \`4-\`.
  * \`num = 5\`: The \`break\` statement exits the loop immediately, preventing the program from printing \`5-\`.
* **Answer 8:**
  \`\`\`python
  numbers = [1, 3, 5, 8, 9]
  for num in numbers:
      if num % 2 == 0:
          print(f"Found even number {num}")
          break
  else:
      print("No even number found")
  \`\`\`

### Section 6: Core Data Structures (Collections)
* **Answer 9:**
  * Output of \`print(x)\`: \`[1, 2, [3, 4, 5]]\`
  * Output of \`print(y)\`: \`[99, 2, [3, 4, 5]]\`
  * **Explanation:** \`y = x.copy()\` creates a shallow copy. Modifying a primitive item in the copy (\`y[0] = 99\`) does not affect the original list \`x\`. However, the nested list \`[3, 4]\` is copied by reference. When you append \`5\` to \`y[2]\`, both lists reflect this change.
* **Answer 10:**
  * Dictionary keys must be **hashable** (immutable).
  * A list \`[1, 2]\` is mutable, so it cannot be hashed, and using it as a key throws a \`TypeError\`.
  * A tuple \`(1, 2)\` containing only immutable values is immutable and hashable, making it a valid dictionary key.

### Section 7: Functions, Arguments & Variable Scope
* **Answer 11:**
  * Output:
    \`First: [1, 2]\`
    \`Second: [1, 2]\`
  * **Explanation:** The default list \`collection=[]\` is created once when the function is defined. Both calls (\`first = build_list(1)\` and \`second = build_list(2)\`) use and modify the same list object in memory.
* **Answer 12:**
  \`\`\`python
  from functools import lru_cache

  @lru_cache(maxsize=None)
  def fib_recursive(n: int) -> int:
      if n < 2:
          return n
      return fib_recursive(n-1) + fib_recursive(n-2)
  \`\`\`
  * **Explanation:** Standard recursive Fibonacci has an exponential time complexity of $O(2^n)$ due to redundant subproblem evaluations. \`@lru_cache\` stores the results of calls, so each Fibonacci number is computed exactly once. This reduces the time complexity to $O(n)$ (linear).

### Section 8: Object-Oriented Programming (OOP)
* **Answer 13:**
  \`super()\` references the parent class. In a subclass constructor, calling \`super().__init__(...)\` runs the parent constructor, ensuring parent class attributes are correctly initialized.
  \`\`\`python
  class Parent:
      def __init__(self, name):
          self.name = name

  class Child(Parent):
      def __init__(self, name, age):
          super().__init__(name) # Initialize parent attribute
          self.age = age
  \`\`\`
* **Answer 14:**
  \`\`\`python
  from dataclasses import dataclass

  @dataclass
  class Book:
      title: str
      author: str
      price: float
      
      def __str__(self):
          return f"{self.title} by {self.author}"
  \`\`\`

### Section 9: Error & Exception Handling
* **Answer 15:**
  * Inputs \`10\` and \`2\`: Prints **\`A\`**, then **\`C\`**, then **\`D\`**. (Runs successfully; triggers the \`else\` and \`finally\` blocks).
  * Inputs \`10\` and \`0\`: Prints **\`A\`**, then **\`B\`**, then **\`D\`**. (Division by zero raises an exception, triggers the \`except\` block, and runs the \`finally\` block).

### Section 10: File Input & Output (I/O)
* **Answer 16:**
  \`\`\`python
  try:
      # Read numbers and sum them
      with open("numbers.txt", "r") as file:
          numbers = [float(line.strip()) for line in file if line.strip()]
      total_sum = sum(numbers)
      
      # Append the sum
      with open("numbers.txt", "a") as file:
          file.write(f"\\nSum: {total_sum}\\n")
          
  except FileNotFoundError:
      print("Error: The file numbers.txt was not found.")
  except ValueError:
      print("Error: The file contains non-numeric data.")
  \`\`\`
* **Answer 17:**
  \`\`\`python
  from pathlib import Path
  import json

  path = Path("stats.json")
  if path.exists():
      with open(path, "r") as f:
          data = json.load(f)
      print(f"Current stats: {data}")
      data["run_count"] = data.get("run_count", 0) + 1
  else:
      data = {"run_count": 1}
      
  with open(path, "w") as f:
      json.dump(data, f)
  \`\`\`

### Section 11: Essential Standard Libraries
* **Answer 18:**
  You should use **\`random.sample(population, k)\`**. Unlike \`random.choices()\`, \`random.sample()\` selects elements without replacement, ensuring each selected item is unique.

### Section 12: Advanced Pythonic Design Patterns
* **Answer 19:**
  \`\`\`python
  words = ["apple", "sky", "banana", "cat", "elephant"]
  filtered_uppercased = [word.upper() for word in words if len(word) > 3]
  # Result: ['APPLE', 'BANANA', 'ELEPHANT']
  \`\`\`
* **Answer 20:**
  \`\`\`python
  import time

  class Timer:
      def __enter__(self):
          self.start = time.time()
          return self
      def __exit__(self, exc_type, exc_val, exc_tb):
          self.end = time.time()
          print(f"Elapsed time: {self.end - self.start:.5f} seconds")
  \`\`\`

---

## Made by NotAryanSinha
*(Created with care for your programming journey!)*
`,
  "java-oop": `# Java Programming & Object-Oriented Programming (OOP) Reference Notes

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

1. **Compilation:** The Java compiler (\`javac\`) translates human-readable source code (\`.java\` files) into platform-independent intermediate **Bytecode** (\`.class\` files).
2. **Execution:** The **Java Virtual Machine (JVM)** loads, verifies, and executes this bytecode on the host computer, translating it to native machine instructions on the fly.

\`\`\`
[Source Code (.java)]
        |
        v  javac (compiler)
[Bytecode (.class)]
        |
        v  JVM (interpreter + JIT compiler)
[Native Machine Code]  -->  Executed by CPU
\`\`\`

### Key JVM Components

| Component | Full Name | Role |
|:---|:---|:---|
| **JVM** | Java Virtual Machine | The core engine that loads and executes Java Bytecode. |
| **JRE** | Java Runtime Environment | Bundles the JVM with the standard class libraries needed to **run** Java programs. |
| **JDK** | Java Development Kit | A superset of the JRE: includes the compiler (\`javac\`), debugger (\`jdb\`), archiver (\`jar\`), documentation generator (\`javadoc\`), and all development utilities. |

> [!NOTE]
> **JIT Compiler Optimization**
> While interpreting bytecode, the JVM's **Just-In-Time (JIT) Compiler** monitors execution and identifies frequently executed code paths called **"hot spots."** These hot spots are compiled directly into optimized native machine code at runtime, dramatically improving performance. This is why the reference implementation of the JVM is called **HotSpot**.

### JVM Memory Model

Understanding how the JVM organizes memory is critical for writing performant applications and diagnosing issues like \`OutOfMemoryError\`.

\`\`\`
+-----------------------------------------------------+
|                     JVM MEMORY                      |
+----------------------+------------------------------+
|     HEAP (Shared)    |           NON-HEAP           |
|  +----------------+  |  +------------------------+  |
|  |   Young Gen    |  |  |       Metaspace        |  |
|  |  +----------+  |  |  |    (Class metadata,    |  |
|  |  |   Eden   |  |  |  |     method bytecode,   |  |
|  |  +----------+  |  |  |     constant pools)    |  |
|  |  |Survivor 0|  |  |  +------------------------+  |
|  |  +----------+  |  |  +------------------------+  |
|  |  |Survivor 1|  |  |  |     Thread Stacks      |  |
|  |  +----------+  |  |  | (One stack per thread:  |  |
|  +----------------+  |  |   local vars, frames)  |  |
|  |    Old Gen     |  |  +------------------------+  |
|  |   (Tenured)    |  |  +------------------------+  |
|  |                |  |  |      Code Cache        |  |
|  +----------------+  |  | (JIT-compiled hot code)  |  |
+----------------------+--+---------------------------+
\`\`\`

**Heap Regions:**

| Region | Purpose | Garbage Collection |
|:---|:---|:---|
| **Eden** (Young Gen) | Where all new objects are initially allocated. | Minor GC — fast, frequent. |
| **Survivor 0 & 1** (Young Gen) | Objects that survive one or more Minor GCs are moved here. | Minor GC — objects bounce between S0 and S1. |
| **Old Gen** (Tenured) | Long-lived objects promoted from Young Gen after surviving several GC cycles. | Major GC (Full GC) — slower, less frequent. |
| **Metaspace** (Non-Heap) | Stores class metadata, replacing the old PermGen (removed in Java 8). Grows dynamically from native memory. | Collected when classes are unloaded. |

### Class Loading Mechanism

The JVM loads classes on demand through a hierarchical **ClassLoader** delegation model:

1. **Bootstrap ClassLoader** — Loads core Java API classes from \`rt.jar\` (or the \`java.base\` module in Java 9+). Written in native code.
2. **Platform (Extension) ClassLoader** — Loads classes from the platform extensions directory.
3. **Application ClassLoader** — Loads classes from the application classpath (\`-cp\` or \`CLASSPATH\`).

\`\`\`java
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
\`\`\`

> [!IMPORTANT]
> **Delegation Model:** When asked to load a class, a ClassLoader first delegates the request to its parent. Only if the parent cannot find the class does the child attempt to load it. This prevents duplicate loading and ensures core Java classes cannot be overridden by user code.

\`\`\`java
// Standard entry point in Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
\`\`\`

### 🌍 Real-World Analogy
> - **JVM/WORA:** Think of compile-once run-anywhere like a **universal DVD player**: instead of rendering different video types for Sony, Samsung, and LG TVs, the movie is burned to a standard DVD format (bytecode \`.class\` files), and each manufacturer builds its own player (JVM) to translate standard DVD tracks to their TV's specific electronics.
> - **JIT Compiler:** The JIT compiler is like a **translator who memorizes frequent phrases**: rather than looking up the same foreign sentence in a dictionary every time (interpreting bytecode), they translate it once to native speech and memorize it (JIT-compiled native code) to repeat it instantly the next time.
> - **Class Loaders:** This system is like a **library's lookup hierarchy**: checking your desk bookshelf first (System ClassLoader), then the reference section (Platform ClassLoader), and finally calling the main library archives (Bootstrap ClassLoader).
>
> **💼 Industry Application:** Large scale systems like **Elasticsearch**, **Apache Spark**, and enterprise backend APIs run on JVM-based systems. Financial institutions use HotSpot's JIT optimization because low-latency server transactions automatically speed up over runtime as hotspots are compiled directly to machine binary.

### Practice Questions

* **Question 1:** Explain how Java achieves platform independence, highlighting the roles of \`.class\` files, Bytecode, and the JVM.
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
| \`byte\` | 1 byte | -128 | 127 | \`0\` | \`byte b = 100;\` |
| \`short\` | 2 bytes | -32,768 | 32,767 | \`0\` | \`short s = 30000;\` |
| \`int\` | 4 bytes | -2³¹ | 2³¹ − 1 | \`0\` | \`int i = 42;\` |
| \`long\` | 8 bytes | -2⁶³ | 2⁶³ − 1 | \`0L\` | \`long l = 99L;\` |
| \`float\` | 4 bytes | ±1.4E-45 | ±3.4E+38 | \`0.0f\` | \`float f = 3.14f;\` |
| \`double\` | 8 bytes | ±4.9E-324 | ±1.8E+308 | \`0.0d\` | \`double d = 2.718;\` |
| \`char\` | 2 bytes | \`\\u0000\` | \`\\uffff\` | \`\\u0000\` | \`char c = 'A';\` |
| \`boolean\` | ~1 bit* | — | — | \`false\` | \`boolean ok = true;\` |

> [!NOTE]
> **Boolean Size:** The JVM specification does not mandate a precise size for \`boolean\`. In practice, the HotSpot JVM stores a \`boolean\` as a full \`int\` (4 bytes) on the stack and as a \`byte\` (1 byte) in arrays.

\`\`\`java
// Primitive vs. Reference memory layout
int score = 100;                       // Primitive: value 100 stored directly on Stack
String name = new String("Alice");     // Reference: pointer on Stack → object on Heap
\`\`\`

### Autoboxing, Unboxing, and Wrapper Class Caching

For every primitive type, Java provides a corresponding **wrapper class** that allows primitives to be used as objects (required by Collections, Generics, etc.):

| Primitive | Wrapper Class |
|:---|:---|
| \`byte\` | \`Byte\` |
| \`short\` | \`Short\` |
| \`int\` | \`Integer\` |
| \`long\` | \`Long\` |
| \`float\` | \`Float\` |
| \`double\` | \`Double\` |
| \`char\` | \`Character\` |
| \`boolean\` | \`Boolean\` |

* **Autoboxing:** Automatic conversion from primitive → wrapper object (e.g., \`int\` → \`Integer\`).
* **Unboxing:** Automatic conversion from wrapper object → primitive (e.g., \`Integer\` → \`int\`).

\`\`\`java
Integer x = 50;    // Autoboxing: compiler converts to Integer.valueOf(50)
int y = x;         // Unboxing:   compiler converts to x.intValue()
\`\`\`

> [!WARNING]
> **Wrapper Class Caching Pitfall (-128 to 127)**
> Java caches \`Integer\` objects for values in the range **-128 to 127**. Within this range, \`Integer.valueOf()\` returns the same cached object, so \`==\` comparison works. Outside this range, new objects are created, and \`==\` will return \`false\` even for equal values. **Always use \`.equals()\` to compare wrapper objects.**
> \`\`\`java
> Integer a = 127;
> Integer b = 127;
> System.out.println(a == b);       // true  — cached, same object
>
> Integer c = 128;
> Integer d = 128;
> System.out.println(c == d);       // false — different objects!
> System.out.println(c.equals(d));  // true  — correct comparison
> \`\`\`

### The String Pool

Java maintains a special memory region within the Heap called the **String Pool** (also known as the String Intern Pool). When you create a String using a **literal**, the JVM checks the pool first:

\`\`\`
                 HEAP MEMORY
    +------------------------------------+
    |        String Pool                 |
    |   +----------+  +----------+       |
    |   | "Hello"  |  | "World"  |       |
    |   +----^-----+  +----------+       |
    |        |                           |
    |        |  (both point here)        |
    |        |                           |
    +--------+---------------------------+
    |        |   Regular Heap Objects    |
    |   +----+-----+                    |
    |   | "Hello"  | <-- new String()    |
    |   +----------+   (separate copy)  |
    +------------------------------------+

Stack:
  s1 ------+
  s2 ------+-->  Pool "Hello"  (same reference)
  s3 ---------->  Heap "Hello"  (different object)
\`\`\`

\`\`\`java
String s1 = "Hello";               // Created in String Pool
String s2 = "Hello";               // Reuses existing pool entry
String s3 = new String("Hello");   // Forces a NEW object on the regular Heap

System.out.println(s1 == s2);      // true  — same pool reference
System.out.println(s1 == s3);      // false — different objects
System.out.println(s1.equals(s3)); // true  — same character content

// You can explicitly intern a string to move it into the pool
String s4 = s3.intern();
System.out.println(s1 == s4);      // true  — now points to pool entry
\`\`\`

### Local Variable Type Inference: \`var\` (Java 10+)

Starting with Java 10, you can use the \`var\` keyword for **local variable type inference**. The compiler infers the type from the initializer expression on the right-hand side.

\`\`\`java
// Instead of explicit type declarations:
ArrayList<String> names = new ArrayList<>();

// You can write:
var names = new ArrayList<String>();  // Compiler infers ArrayList<String>

var count = 10;         // Inferred as int
var price = 19.99;      // Inferred as double
var message = "Hello";  // Inferred as String
\`\`\`

> [!CAUTION]
> **\`var\` Restrictions:**
> - \`var\` can **only** be used for local variables with an initializer — not for method parameters, return types, or fields.
> - \`var\` is **not a keyword** — it is a reserved type name. You can still use \`var\` as a variable name (though you shouldn't).
> - Avoid \`var\` when the type is not obvious from the right-hand side: \`var result = process();\` hides the return type and reduces readability.

### Java Garbage Collection

> [!IMPORTANT]
> **Automatic Memory Management**
> Java manages Heap memory automatically. The **Garbage Collector (GC)** runs inside the JVM, scanning the Heap to find and reclaim objects that are no longer reachable from any live thread's stack or static references. This prevents memory leaks that plague languages with manual memory management. However, the GC cannot collect objects that are still referenced — holding unnecessary references (e.g., in a growing \`List\`) causes **memory leaks** even in Java.

### 🌍 Real-World Analogy
> - **Stack vs. Heap:** Think of Stack vs. Heap as a **desk workspace vs. a giant warehouse**. The **Stack** is your desk: it's tiny, clean, and everything is organized in quick arms-reach (frames containing primitive local variables). The **Heap** is a huge warehouse: you rent space to store large crates of equipment (objects). You write the warehouse bin location on a sticky note (reference pointer) and keep it on your desk so you can find the crate when needed.
> - **String Pool:** This acts like a **shared office whiteboard**: if two team members want to write the exact same motivational slogan, they point to the slogan already written on the whiteboard rather than writing a new one.
> - **Wrapper Cache:** Wrapper caching is like a **store's loyalty card points**: small, common values (like integers -128 to 127) are pre-printed and cached on cards ready to hand out instantly to customers.
>
> **💼 Industry Application:** High-throughput backend APIs reuse pre-allocated string references (via interning or pooling) to prevent garbage collection pauses, which could otherwise delay transactions. Local variable type inference (\`var\`) is heavily used in modern frameworks like Spring Boot to write cleaner controller and database query code without verbose declarations.

### Practice Questions

* **Question 3:** Predict the outcome of the following statements. Which variable lives on the Stack, and which object lives on the Heap?
  \`\`\`java
  Integer x = 50;
  int y = x;
  \`\`\`
* **Question 4:** What will the following code print, and why?
  \`\`\`java
  Integer a = 200;
  Integer b = 200;
  System.out.println(a == b);
  System.out.println(a.equals(b));
  \`\`\`

---

## 3. Operators & Control Flow

### Operators in Java

#### Arithmetic Operators

| Operator | Description | Example | Notes |
|:---|:---|:---|:---|
| \`+\` | Addition | \`5 + 3\` → \`8\` | Also used for String concatenation |
| \`-\` | Subtraction | \`5 - 3\` → \`2\` | |
| \`*\` | Multiplication | \`5 * 3\` → \`15\` | |
| \`/\` | Division | \`7 / 2\` → \`3\` | Integer division truncates the fractional part |
| \`%\` | Modulus (Remainder) | \`7 % 2\` → \`1\` | Useful for even/odd checks |

#### Relational Operators

| Operator | Meaning | Example |
|:---|:---|:---|
| \`==\` | Equal to | \`a == b\` |
| \`!=\` | Not equal to | \`a != b\` |
| \`>\` | Greater than | \`a > b\` |
| \`<\` | Less than | \`a < b\` |
| \`>=\` | Greater than or equal to | \`a >= b\` |
| \`<=\` | Less than or equal to | \`a <= b\` |

#### Logical Operators

| Operator | Name | Behavior |
|:---|:---|:---|
| \`&&\` | Short-circuit AND | Evaluates right operand only if left is \`true\` |
| \`\\|\\|\` | Short-circuit OR | Evaluates right operand only if left is \`false\` |
| \`!\` | Logical NOT | Inverts boolean value |

#### Assignment & Shorthand Operators

\`=\`, \`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\`, \`<<=\`, \`>>=\`, \`&=\`, \`^=\`, \`|=\`

### The Ternary (Conditional) Operator

The ternary operator is a concise single-line replacement for simple \`if-else\` statements:

\`\`\`java
// Syntax: condition ? valueIfTrue : valueIfFalse
int age = 20;
String status = (age >= 18) ? "Adult" : "Minor";
System.out.println(status);  // Output: Adult

// Ternary can be nested (but avoid deep nesting for readability)
String category = (age < 13) ? "Child" : (age < 18) ? "Teen" : "Adult";
\`\`\`

> [!WARNING]
> **The String Comparison Pitfall**
> In Java, the \`==\` operator on reference objects checks if they point to the **exact same memory address** on the Heap, not if they have the same value. To compare the actual contents of two String objects, you must use the \`.equals()\` method.
> \`\`\`java
> String s1 = new String("Java");
> String s2 = new String("Java");
> System.out.println(s1 == s2);      // false (different references)
> System.out.println(s1.equals(s2)); // true  (identical character contents)
> \`\`\`

---

### Control Flow Structures

#### Conditionals: \`if-else\`

\`\`\`java
int score = 85;
if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 80) {
    System.out.println("Grade: B");  // This executes
} else {
    System.out.println("Grade: C");
}
\`\`\`

#### Traditional \`switch\` Statement

\`\`\`java
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
\`\`\`

#### Switch Expressions (Java 14+)

Java 14 introduced **switch expressions** with arrow syntax (\`->\`) that eliminate fall-through bugs and allow \`switch\` to return a value:

\`\`\`java
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
\`\`\`

> [!NOTE]
> **Switch Expressions Key Rules:**
> - Arrow (\`->\`) cases do **not** fall through — no \`break\` needed.
> - All possible values must be covered (use \`default\` as a catch-all).
> - Use \`yield\` to return a value from a multi-statement block.

#### \`instanceof\` Pattern Matching (Java 16+)

Traditional \`instanceof\` checks require a separate cast statement. Java 16 introduced **pattern matching** that combines the type check and variable binding into a single expression:

\`\`\`java
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
\`\`\`

### Loops

| Loop | When to Use |
|:---|:---|
| \`while\` | When the number of iterations is unknown; condition checked **before** each iteration. |
| \`do-while\` | When the body must execute **at least once**; condition checked **after** each iteration. |
| \`for\` | When the number of iterations is known in advance. |
| \`for-each\` | When iterating through all elements of an array or \`Iterable\` without needing the index. |

\`\`\`java
// Enhanced For Loop (for-each) — clean iteration over arrays/collections
String[] fruits = {"Apple", "Banana", "Cherry"};
for (String fruit : fruits) {
    System.out.println(fruit);
}
\`\`\`

### 🌍 Real-World Analogy
> - **Equality (\`==\` vs \`.equals()\`):** This is like **comparing house addresses vs. comparing house interiors**. If you check \`addressA == addressB\`, you are checking if both pointers lead to the exact same physical plot of land. If you check \`houseA.equals(houseB)\`, you are walking inside both houses to see if they have the same layout and furniture (same values), even if they are located on different streets.
> - **Ternary Operator:** A ternary operator is like a quick **coin flip decision**: "heads, we go out; tails, we stay in".
> - **Switch Expressions & Pattern Matching:** These act like a **smart sorting machine at a postal office**: looking at the package shape, size, and destination and routing it accordingly in one swift motion.
>
> **💼 Industry Application:** Web security filters and authentication protocols use \`.equals()\` to safely verify password credentials. Modern Java microservices (e.g., Quarkus, Micronaut) use pattern matching in their request routers to match incoming JSON payloads to specific service handler methods.

### Practice Questions

* **Question 5:** What is printed by this code snippet?
  \`\`\`java
  String a = "Hello";
  String b = "Hello";
  System.out.print((a == b) + " " + a.equals(b));
  \`\`\`
  *(Hint: Consider Java's internal String Pool mechanism).*
* **Question 6:** Rewrite the following \`if-else\` chain as a switch expression (Java 14+):
  \`\`\`java
  String result;
  if (code == 200) result = "OK";
  else if (code == 404) result = "Not Found";
  else if (code == 500) result = "Server Error";
  else result = "Unknown";
  \`\`\`

---

## 4. Classes, Objects & Constructors

Java is **class-centric** — every executable line of code must reside inside a class. Classes are the fundamental building blocks of all Java programs.

### Classes and Objects

* **Class:** A structural blueprint that defines the fields (data) and methods (behavior) that objects of that type will have.
* **Object:** A concrete instance of a class, allocated on the Heap at runtime using the \`new\` keyword.

\`\`\`java
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
\`\`\`

### Static vs. Instance Context

Understanding the distinction between \`static\` and instance members is essential:

| Aspect | \`static\` (Class-Level) | Instance (Object-Level) |
|:---|:---|:---|
| **Belongs to** | The class itself | A specific object |
| **Accessed via** | \`ClassName.member\` | \`objectRef.member\` |
| **Memory** | Single copy in Metaspace | One copy per object on Heap |
| **Can access** | Only other \`static\` members directly | Both \`static\` and instance members |
| **Use case** | Utility methods, constants, counters | Object-specific state and behavior |

\`\`\`java
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
\`\`\`

> [!WARNING]
> **Common Mistake:** You cannot reference \`this\` or instance variables from a \`static\` method. The \`static\` method belongs to the class, not to any particular instance. Attempting \`this.field\` inside a static method causes a compile error.

---

### Constructors

Constructors are special methods called automatically when a new object is created with \`new\`.

* They have the **exact same name** as the class.
* They have **no return type** (not even \`void\`).
* **Constructor Overloading:** Defining multiple constructors with different parameter signatures.
* **Constructor Chaining:** Using \`this()\` to call another constructor in the same class, or \`super()\` to call a parent class constructor.

\`\`\`java
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
\`\`\`

> [!NOTE]
> **The Implicit Default Constructor Rule**
> If you write a class without defining any constructors, Java automatically inserts a blank default constructor: \`public ClassName() {}\`. However, the moment you define **any** constructor (including a parameterized one), Java **stops** generating the default. If you still need a no-arg constructor, you must write it explicitly.

### Record Classes (Java 16+)

**Records** are a special kind of class designed for simple data carriers — classes whose primary purpose is to hold data. Records automatically generate the constructor, \`equals()\`, \`hashCode()\`, \`toString()\`, and accessor methods.

\`\`\`java
// Traditional approach: ~30 lines of boilerplate
// Record approach: 1 line
public record Point(int x, int y) { }

// Usage:
Point p = new Point(3, 7);
System.out.println(p.x());           // 3  — accessor method (not getX())
System.out.println(p.y());           // 7
System.out.println(p);               // Point[x=3, y=7]  — auto-generated toString()
System.out.println(p.equals(new Point(3, 7)));  // true — auto-generated equals()
\`\`\`

**Record characteristics:**
- All fields are implicitly \`private final\` — records are **immutable**.
- Records implicitly extend \`java.lang.Record\` and cannot extend other classes.
- Records can implement interfaces, have static fields, and define custom methods.
- You can define a **compact constructor** for validation:

\`\`\`java
public record Person(String name, int age) {
    // Compact constructor — parameters are implicitly assigned after this block
    public Person {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        name = name.trim();  // Normalize before assignment
    }
}
\`\`\`

### Sealed Classes (Java 17+)

**Sealed classes** restrict which classes can extend them, giving you precise control over your type hierarchy. This is especially useful for domain modeling where you want a closed set of subtypes.

\`\`\`java
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
\`\`\`

> [!IMPORTANT]
> **Sealed classes + pattern matching** work together powerfully. Because the compiler knows all permitted subtypes, it can check exhaustiveness in \`switch\` expressions — warning you if you forget to handle a subtype.

### 🌍 Real-World Analogy
> - **Class vs. Object:** A class is an **architectural blueprint**, and an object is the **physical house** built from that blueprint.
> - **Static vs. Instance Context:** A \`static\` field or method is like a **shared community bulletin board** in the building lobby: there is only one board for the entire building, and any tenant can write on it or read from it, whereas non-static fields are like the individual private bulletin boards inside each tenant's apartment.
> - **Record Classes:** These are like **pre-printed forms**: once you fill in the fields, the document is a fixed, read-only record.
> - **Sealed Classes:** These are like a **franchise agreement**: only authorized business owners (permitted subclasses) are allowed to open stores under that brand.
>
> **💼 Industry Application:** Record classes are used in modern API development to represent immutable **Data Transfer Objects (DTOs)** for JSON serialization. Sealed classes are used in domain-driven design to represent restricted data hierarchies, such as payment status results (\`Success\`, \`Pending\`, \`Failed\`).

### Practice Questions

* **Question 7:** What is constructor chaining, and how are the \`this()\` and \`super()\` keywords used to call constructors within the same class or a parent class?
* **Question 8:** Convert the following traditional class into a Java \`record\`. What methods are auto-generated?
  \`\`\`java
  public class Coordinate {
      private final double lat;
      private final double lon;
      // constructor, getters, equals, hashCode, toString...
  }
  \`\`\`

---

## 5. OOP Pillar 1: Encapsulation & Access Modifiers

**Encapsulation** is the practice of bundling data (fields) and the methods that operate on that data into a single unit (class), while restricting direct external access to the internal state. We achieve this by:

1. Declaring fields as \`private\`.
2. Providing controlled access through public **getter** and **setter** methods.

This pattern protects data integrity by allowing validation, computation, or logging inside the accessor methods.

\`\`\`java
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
\`\`\`

---

### Access Modifiers in Java

Java uses four levels of access control, from most restrictive to most permissive:

| Modifier | Class | Package | Subclass (any package) | World |
|:---|:---:|:---:|:---:|:---:|
| \`private\` | ✅ | ❌ | ❌ | ❌ |
| **Default** (no keyword) | ✅ | ✅ | ❌ | ❌ |
| \`protected\` | ✅ | ✅ | ✅ | ❌ |
| \`public\` | ✅ | ✅ | ✅ | ✅ |

> [!NOTE]
> **Package-Private (Default) vs. Protected**
> Members with \`default\` access are visible only within the same package. Members with \`protected\` access are visible within the same package **and** to subclasses in different packages (but only through inheritance, not through an arbitrary reference).

### Designing Immutable Classes

An **immutable class** is one whose instances cannot be modified after creation. Immutable objects are inherently thread-safe, can be freely shared, and make excellent keys for \`HashMap\`.

**Rules for creating an immutable class:**

1. Declare the class as \`final\` (prevents subclassing).
2. Make all fields \`private\` and \`final\`.
3. Provide no setter methods.
4. Initialize all fields via the constructor.
5. For fields referencing mutable objects (e.g., \`Date\`, \`List\`), return **defensive copies** from getters.

\`\`\`java
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
\`\`\`

### JavaBeans Conventions

The **JavaBeans** specification defines a standard naming convention used extensively by frameworks (Spring, Hibernate, Jackson, etc.):

| Convention | Rule | Example |
|:---|:---|:---|
| **Class** | Public class with a public no-arg constructor | \`public class User { }\` |
| **Fields** | Private | \`private String name;\` |
| **Getter** | \`getFieldName()\` (or \`isFieldName()\` for booleans) | \`public String getName()\` |
| **Setter** | \`setFieldName(Type value)\` | \`public void setName(String name)\` |
| **Serializable** | Implement \`java.io.Serializable\` (optional but recommended) | \`implements Serializable\` |

\`\`\`java
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
\`\`\`

### 🌍 Real-World Analogy
> - **Encapsulation:** Private fields are like a **bank vault**, and getter/setter methods are like a **bank teller**. You cannot walk into the bank vault and grab money (data) directly. Instead, you go to the teller window, and the teller checks your ID, validates your deposit/withdrawal amount (data validation in set methods), and updates the vault safely.
> - **Immutable Object:** An immutable object is like a **sealed envelope containing a letter**: once closed and sent, you cannot alter its contents without tearing it up and creating a new envelope.
>
> **💼 Industry Application:** Enterprise APIs wrap database model attributes using private fields and JavaBeans getter/setter methods to ensure that negative values (like a negative product price or age) cannot be set, keeping the system database consistent.

### Practice Questions

* **Question 9:** A class \`Parent\` in package \`A\` has a \`protected void show()\` method. Class \`Child\` in package \`B\` inherits from \`Parent\`. Can an instance of \`Child\` call \`show()\`? Can an unrelated class \`Test\` in package \`B\` call it?
* **Question 10:** Why does making a field \`final\` alone not guarantee immutability if the field references a mutable object like \`ArrayList\`? What additional step is required?

---

## 6. OOP Pillar 2: Inheritance & super Keyword

**Inheritance** allows a child class (subclass) to acquire the fields and methods of a parent class (superclass), promoting code reuse and establishing a natural hierarchy. In Java, class inheritance is declared using the \`extends\` keyword.

\`\`\`java
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
\`\`\`

---

### The \`super\` Keyword

The \`super\` keyword refers to the parent class instance, enabling three key operations:

1. **Call parent constructors** — must be the **first statement** in the subclass constructor.
2. **Call overridden parent methods** — access the parent's version when the child has overridden it.
3. **Access parent fields** — when shadowed by a child field of the same name.

\`\`\`java
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
\`\`\`

> [!IMPORTANT]
> **Single Inheritance Limitation**
> To avoid ambiguity (e.g., the **Diamond Problem**, where a class inherits identical methods from two different parents), Java does **not** support multiple inheritance of classes. A class can only extend **one** parent class. However, a class can implement **multiple interfaces**, which provides an alternative mechanism for achieving multiple inheritance of behavior.

### The \`final\` Keyword: Classes, Methods, and Variables

The \`final\` keyword serves three distinct purposes depending on where it is applied:

| Applied To | Effect | Example |
|:---|:---|:---|
| **Class** | Prevents the class from being subclassed (extended). | \`final class MathUtils { }\` |
| **Method** | Prevents the method from being overridden in subclasses. | \`final void calculate() { }\` |
| **Variable** | Makes the variable a constant — it can only be assigned once. | \`final int MAX = 100;\` |

\`\`\`java
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
\`\`\`

> [!CAUTION]
> **\`final\` on reference variables** prevents reassignment of the reference, but does **not** make the referenced object immutable. A \`final List<String>\` can still have elements added or removed — only the reference itself cannot point to a different list.
> \`\`\`java
> final List<String> names = new ArrayList<>();
> names.add("Alice");   // Legal — modifying the object's contents
> // names = new ArrayList<>();  // Compile error — reassigning the reference
> \`\`\`

### The \`Object\` Class: Root of All Java Classes

Every class in Java implicitly extends \`java.lang.Object\`. This class provides several critical methods that you should understand and often override:

| Method | Purpose | When to Override |
|:---|:---|:---|
| \`toString()\` | Returns a string representation of the object. | Always — default output like \`User@1a2b3c\` is not useful. |
| \`equals(Object o)\` | Checks logical equality between two objects. | When your class represents a value (e.g., \`Money\`, \`Coordinate\`). |
| \`hashCode()\` | Returns a hash integer for the object. | **Always** override together with \`equals()\` — required by \`HashMap\`/\`HashSet\`. |
| \`getClass()\` | Returns the runtime class of the object. | Rarely — typically used for reflection. |
| \`clone()\` | Creates a shallow copy of the object. | Rarely — prefer copy constructors or factory methods. |

\`\`\`java
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
\`\`\`

> [!WARNING]
> **The \`equals\`-\`hashCode\` Contract:** If you override \`equals()\` without overriding \`hashCode()\`, objects that are logically equal may end up in different hash buckets, causing \`HashMap\` and \`HashSet\` to malfunction. **Always override both together.**

### 🌍 Real-World Analogy
> - **Inheritance:** Inheritance is like a **family tree of vehicles**: a general \`Vehicle\` class defines properties like engine and doors; a \`Car\` subclass inherits these and adds trunk space, while a \`Motorcycle\` adds a kickstand.
> - **The \`super\` Keyword:** The \`super\` keyword is like **calling your parent for advice**: you reuse their wisdom (parent constructor/methods) to initialize your own character.
> - **The \`final\` Keyword:** The \`final\` keyword is like a **locked document**: a final class cannot be extended, a final method cannot be overridden, and a final variable is a permanent value.
>
> **💼 Industry Application:** Frameworks like JUnit rely on base test classes containing common configuration methods (\`setup()\`) which are inherited by all test suite classes. The \`final\` keyword is critical in security APIs to prevent attackers from overriding system security classes (like \`java.lang.String\`, which is final).

### Practice Questions

* **Question 11:** Explain the difference between **Method Overloading** (compile-time polymorphism) and **Method Overriding** (runtime polymorphism).
* **Question 12:** Why is it critical to override \`hashCode()\` whenever you override \`equals()\`? What can go wrong if you don't?

---

## 7. OOP Pillar 3: Polymorphism (Static vs. Dynamic Binding)

**Polymorphism** ("many forms") is the ability of an entity to take on different forms. In Java, this means a single reference variable can point to objects of different types within an inheritance hierarchy, and the correct method implementation is selected based on the actual object type.

\`\`\`java
// Upcasting: Parent reference variable pointing to a Child object on the Heap
Animal myAnimal = new Dog();
\`\`\`

---

### Compile-Time Polymorphism (Static Binding / Method Overloading)

Resolved by the compiler at **compile time** based on the method signature (name + parameter types). Multiple methods share the same name but differ in their parameter lists.

**Overloading rules:**
- Methods must have different parameter types, number of parameters, or order of parameters.
- Return type alone is **not** sufficient to distinguish overloaded methods.
- Access modifiers can differ.

\`\`\`java
class Calculator {
    int add(int a, int b)          { return a + b; }
    double add(double a, double b) { return a + b; }       // Different param types
    int add(int a, int b, int c)   { return a + b + c; }   // Different param count
}
\`\`\`

#### Var-Args in Overloading

Java supports **variable-length arguments** (\`varargs\`) using the \`...\` syntax. A varargs parameter is treated as an array internally.

\`\`\`java
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
\`\`\`

> [!NOTE]
> **Varargs Resolution Priority:** When both a specific overload and a varargs overload could match, Java **always** prefers the more specific (non-varargs) version. A varargs parameter must be the **last** parameter in the method signature, and only one varargs parameter is allowed per method.

---

### Runtime Polymorphism (Dynamic Binding / Method Overriding)

Resolved at **runtime** by the JVM based on the actual object type on the Heap, not the compile-time reference type. The child class provides its own implementation of a method defined in the parent class.

\`\`\`java
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
\`\`\`

### Covariant Return Types

When overriding a method, the return type in the child class can be a **subtype** of the return type in the parent class. This is called a **covariant return type**.

\`\`\`java
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
\`\`\`

### Method Hiding (Static Methods)

When a subclass defines a \`static\` method with the same signature as a \`static\` method in the superclass, it **hides** (does not override) the parent method. The method called depends on the **compile-time reference type**, not the runtime object type.

\`\`\`java
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
\`\`\`

> [!IMPORTANT]
> **Key Difference:** Instance methods are **overridden** (dynamic dispatch based on object type). Static methods are **hidden** (resolved based on reference type at compile time). The \`@Override\` annotation cannot be used on static methods.

### Upcasting vs. Downcasting

| Operation | Direction | Safety | Syntax |
|:---|:---|:---|:---|
| **Upcasting** | Child → Parent reference | Safe, implicit | \`Animal a = new Dog();\` |
| **Downcasting** | Parent reference → Child | Unsafe, explicit cast required | \`Dog d = (Dog) a;\` |

\`\`\`java
Animal pet = new Cat();  // Upcasting — safe, automatic

// Downcasting — must verify type first to avoid ClassCastException
if (pet instanceof Cat myCat) {     // Pattern matching (Java 16+)
    myCat.purr();                    // Safe — myCat is already typed as Cat
}
\`\`\`

### 🌍 Real-World Analogy
> - **Polymorphism:** Polymorphism is like a **universal remote control**: you can press the "Power" button on the remote, and it turns on a TV, a stereo, or a projector. The action requested is the same ("Power On"), but the behavior is different depending on which device (subclass) receives the signal.
> - **Method Overloading:** Overloading is like a **restaurant menu with size options**: you order a "Burger", but you can choose a Small, Medium, or Large version depending on your appetite (arguments).
> - **Method Overriding:** Overriding is like a **local franchise modifying a corporate menu**: the corporate headquarters defines a "Breakfast" item, but the local branch overrides it with regional specialties.
>
> **💼 Industry Application:** Logging frameworks (like SLF4J/Logback) overload log methods to accept strings, exceptions, or formatting arguments: \`log.info("Message")\`, \`log.info("Error: ", exception)\`. Polymorphic interfaces allow databases (MySQL, PostgreSQL, Oracle) to plug into the Java Database Connectivity (JDBC) API seamlessly.

### Practice Questions

* **Question 13:** Given \`Animal pet = new Cat();\` where class \`Cat\` has a child-only method \`purr()\`, can you call \`pet.purr()\` directly? Why or why not?
* **Question 14:** What is the difference between method **overriding** and method **hiding**? Write a code example demonstrating method hiding with static methods.

---

## 8. OOP Pillar 4: Abstraction (Abstract Classes vs. Interfaces)

**Abstraction** is the process of hiding internal implementation details and exposing only the essential features of an object. This is achieved using two mechanisms: **Abstract Classes** and **Interfaces**.

### Abstract Classes

* Declared using the \`abstract\` keyword.
* **Cannot be instantiated** with \`new\`.
* Can contain both **abstract methods** (no body — must be implemented by subclasses) and **concrete methods** (with a body).
* Can have constructors, instance variables, and any access modifier.

\`\`\`java
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
\`\`\`

---

### Interfaces

An Interface defines a **contract** — a set of method signatures that implementing classes must provide.

* Declared using the \`interface\` keyword. Classes adopt them via \`implements\`.
* All fields are implicitly \`public static final\` (constants).
* A class can implement **multiple interfaces**, bypassing the single-inheritance class limitation.

\`\`\`java
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
\`\`\`

### Modern Interface Features

| Java Version | Feature | Description |
|:---|:---|:---|
| **Java 8** | \`default\` methods | Methods with a body in interfaces; implementing classes can override them. |
| **Java 8** | \`static\` methods | Utility methods that belong to the interface itself; cannot be overridden. |
| **Java 9** | \`private\` methods | Helper methods for internal code reuse within the interface; not visible to implementors. |

\`\`\`java
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
\`\`\`

### Functional Interfaces and Lambda Expressions (Java 8+)

A **functional interface** is an interface with exactly **one abstract method** (SAM — Single Abstract Method). These interfaces can be implemented concisely using **lambda expressions** instead of verbose anonymous inner classes.

The \`@FunctionalInterface\` annotation is optional but recommended — it instructs the compiler to enforce the single-abstract-method rule.

\`\`\`java
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
\`\`\`

#### Built-in Functional Interfaces (\`java.util.function\`)

Java provides a rich set of pre-defined functional interfaces:

| Interface | Method | Purpose | Example |
|:---|:---|:---|:---|
| \`Predicate<T>\` | \`boolean test(T t)\` | Test a condition | \`s -> s.isEmpty()\` |
| \`Function<T,R>\` | \`R apply(T t)\` | Transform T → R | \`s -> s.length()\` |
| \`Consumer<T>\` | \`void accept(T t)\` | Perform an action (no return) | \`s -> System.out.println(s)\` |
| \`Supplier<T>\` | \`T get()\` | Produce a value (no input) | \`() -> new ArrayList<>()\` |
| \`UnaryOperator<T>\` | \`T apply(T t)\` | Transform T → T (same type) | \`s -> s.toUpperCase()\` |
| \`BinaryOperator<T>\` | \`T apply(T a, T b)\` | Combine two T → T | \`(a, b) -> a + b\` |

\`\`\`java
import java.util.function.*;

Predicate<String> isLong = s -> s.length() > 10;
Function<String, Integer> toLength = String::length;   // Method reference
Consumer<String> printer = System.out::println;         // Method reference

System.out.println(isLong.test("Hello"));         // false
System.out.println(toLength.apply("Hello World"));// 11
printer.accept("Lambda!");                        // prints: Lambda!
\`\`\`

### Abstract Classes vs. Interfaces — Comparison

| Criteria | Abstract Class | Interface |
|:---|:---|:---|
| **Keyword** | \`abstract class\` | \`interface\` |
| **Inheritance** | Single (\`extends\`) | Multiple (\`implements\`) |
| **Fields** | Any type (instance, static, mutable) | \`public static final\` only |
| **Constructors** | ✅ Yes | ❌ No |
| **Method types** | Abstract + concrete | Abstract + default + static + private |
| **When to use** | Shared state and behavior among related classes | Define a contract/capability across unrelated classes |

### 🌍 Real-World Analogy
> - **Abstract Class:** An abstract class is like an **incomplete draft** of a novel: it has the main outline and some chapters written (concrete methods), but expects someone else to finish the missing chapters (abstract methods).
> - **Interface:** An **interface** is like an **electrical outlet standard**: it defines exactly where the pins must go, but doesn't care how the power plant generates electricity.
> - **Lambda Expression:** A **lambda expression** is like a **quick sticky note with a single instruction** passed to a coworker: "here's how you sort these files."
>
> **💼 Industry Application:** GUI libraries (like JavaFX) and Web APIs utilize interfaces to define event listeners (e.g., \`OnClickListener\`). Spring Boot utilizes interfaces to define database repositories, leaving the framework to generate the actual SQL implementation at runtime.

### Practice Questions

* **Question 15:** Compare Abstract Classes and Interfaces by completing a grid across these criteria: (a) Multiple inheritance, (b) Variable modifiers, (c) Constructor presence, and (d) Method types.
* **Question 16:** Write a \`@FunctionalInterface\` called \`StringProcessor\` with a single method \`String process(String input)\`. Then use it with lambda expressions to create: (a) an uppercase converter, and (b) a string reverser.

---

## 9. Exception Handling (Checked, Unchecked, Try-With-Resources)

Exceptions are runtime events that disrupt the normal flow of program execution. Java provides a structured mechanism to handle these events gracefully.

### Exception Hierarchy

\`\`\`
                        Throwable
                       /         \\
                  Error          Exception
                  /                /         \\
         OutOfMemoryError   IOException    RuntimeException
         StackOverflowError  SQLException   /      |       \\
                             (Checked)  NullPtr  IndexOOB  ClassCast
                                       Exception Exception Exception
                                        (All Unchecked / Runtime)
\`\`\`

| Category | Superclass | Checked by Compiler? | Examples | Recovery |
|:---|:---|:---|:---|:---|
| **Error** | \`Error\` | No | \`OutOfMemoryError\`, \`StackOverflowError\` | Generally unrecoverable |
| **Checked** | \`Exception\` (not \`RuntimeException\`) | Yes | \`IOException\`, \`SQLException\`, \`FileNotFoundException\` | Must handle or declare |
| **Unchecked** | \`RuntimeException\` | No | \`NullPointerException\`, \`ArrayIndexOutOfBoundsException\` | Programming bugs — fix the code |

### Checked vs. Unchecked Exceptions

1. **Checked Exceptions:** Verified at **compile time**. The compiler forces you to handle them (using \`try-catch\`) or declare them in the method signature (\`throws\`). These represent **recoverable** conditions external to the program (file not found, network down).

2. **Unchecked Exceptions (Runtime Exceptions):** Not checked by the compiler. They occur due to **programming errors** (null dereference, array out of bounds, bad casts). Fix the code rather than catching them.

---

### Exception Handling Blocks

| Block | Purpose |
|:---|:---|
| \`try\` | Wraps code that might throw an exception. |
| \`catch\` | Catches and handles a specific exception type. |
| \`finally\` | Code that **always** executes — whether an exception was thrown, caught, or not. Used for cleanup. |

\`\`\`java
try {
    int data = 50 / 0;  // Throws ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero: " + e.getMessage());
} finally {
    System.out.println("Cleanup completed.");  // Always runs
}
\`\`\`

### Multi-Catch Blocks (Java 7+)

You can catch multiple exception types in a single \`catch\` block using the pipe (\`|\`) operator, reducing code duplication:

\`\`\`java
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
\`\`\`

> [!NOTE]
> **Multi-catch rules:**
> - The caught exception types must not be in an inheritance relationship (e.g., you cannot combine \`IOException | Exception\` because \`IOException\` is already a subtype of \`Exception\`).
> - The variable \`e\` in a multi-catch block is implicitly \`final\` — you cannot reassign it.

### \`throw\` vs. \`throws\`

| Keyword | Location | Purpose | Example |
|:---|:---|:---|:---|
| \`throw\` | Inside a method body | Manually throw a specific exception **object** | \`throw new IllegalArgumentException("Bad input");\` |
| \`throws\` | In a method signature | Declare that the method **might** throw certain exceptions, warning callers | \`public void read() throws IOException\` |

---

### Try-With-Resources (Automatic Resource Management — Java 7+)

This syntax automatically closes resources declared within the \`try\` statement, replacing explicit cleanup in \`finally\` blocks.

> [!IMPORTANT]
> **The AutoCloseable Requirement**
> To be used inside a try-with-resources statement, a resource class must implement the \`java.lang.AutoCloseable\` interface (or its subinterface \`Closeable\`).

\`\`\`java
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
\`\`\`

### Creating Custom Exceptions

You can define your own exception classes by extending \`Exception\` (for checked) or \`RuntimeException\` (for unchecked):

\`\`\`java
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
\`\`\`

### 🌍 Real-World Analogy
> - **Checked Exception:** A **checked exception** is like a **mandatory seatbelt law**: the law (compiler) forces you to buckle up before you can drive (compile) the car.
> - **Unchecked Exception:** An **unchecked exception** is like hitting a **pothole**: you cannot predict exactly where it will be, and the compiler doesn't force you to prepare for it, but you should handle the impact (try-catch) so you don't blow a tire.
> - **Try-With-Resources:** This is like **auto-locking doors** that lock themselves behind you as you walk out, ensuring you never forget to lock up.
>
> **💼 Industry Application:** Network communication frameworks (like Netty or Spring WebClient) use exception handling to catch database socket connections and retry requests or fall back to cached data.

### Practice Questions

* **Question 17:** What is the difference between \`throw\` and \`throws\` in Java exception handling?
* **Question 18:** Create a custom unchecked exception called \`InvalidAgeException\` that extends \`RuntimeException\` and includes the invalid age value. Write a method \`validateAge(int age)\` that throws it if age is negative or greater than 150.

---

## 10. File Input & Output (I/O Streams)

Java provides two primary I/O APIs: the classic \`java.io\` package (since Java 1.0) and the modern \`java.nio.file\` package (NIO.2, since Java 7). Both are important to understand.

### Classic I/O: Stream Types (\`java.io\`)

| Stream Category | Unit | Best For | Key Classes |
|:---|:---|:---|:---|
| **Byte Streams** | 8-bit bytes | Binary files (images, audio, video) | \`FileInputStream\`, \`FileOutputStream\` |
| **Character Streams** | 16-bit chars | Text files | \`FileReader\`, \`FileWriter\` |
| **Buffered Streams** | Buffered blocks | Performance optimization | \`BufferedReader\`, \`BufferedWriter\`, \`BufferedInputStream\`, \`BufferedOutputStream\` |

> [!NOTE]
> **Why Buffering Matters:** Reading one character at a time from disk requires a system call for each character — extremely slow. \`BufferedReader\` reads a large block (typically 8 KB) into an in-memory buffer in a single I/O operation. Subsequent reads are served from fast RAM, reducing disk access by orders of magnitude.

\`\`\`java
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
\`\`\`

\`\`\`java
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
\`\`\`

---

### Modern I/O: NIO.2 (\`java.nio.file\` — Java 7+)

The NIO.2 API provides a more powerful, flexible, and concise way to work with files and directories. The two central classes are:

| Class | Purpose |
|:---|:---|
| \`Path\` | Represents a file or directory path in the filesystem (replaces \`java.io.File\`). |
| \`Files\` | A utility class with static methods for file operations (read, write, copy, delete, walk). |

\`\`\`java
import java.nio.file.*;
import java.io.IOException;
import java.util.List;

public class NioDemo {
    public static void main(String[] args) throws IOException {
        Path filePath = Path.of("data", "notes.txt");  // Construct a path

        // Write lines to a file (creates file if it doesn't exist)
        Files.writeString(filePath, "Hello, NIO.2!\\nSecond line.\\n");

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
\`\`\`

### Walking Directory Trees

\`\`\`java
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
\`\`\`

### Classic I/O vs. NIO.2 Comparison

| Feature | \`java.io\` (Classic) | \`java.nio.file\` (NIO.2) |
|:---|:---|:---|
| **File reference** | \`File\` object | \`Path\` object |
| **Read/Write** | Streams (\`FileReader\`, etc.) | \`Files.readString()\`, \`Files.readAllLines()\` |
| **Directory listing** | \`File.listFiles()\` | \`Files.list()\`, \`Files.walk()\` |
| **File copy** | Manual stream copy | \`Files.copy()\` |
| **Symbolic links** | Limited support | Full support |
| **Atomic operations** | No | Yes (\`Files.move\` with \`ATOMIC_MOVE\`) |
| **Recommendation** | Legacy code | **Preferred for new code** |

### 🌍 Real-World Analogy
> - **Classic I/O Streams:** Classic I/O streams are like **water pipes**: data flows in a single direction, byte-by-byte or character-by-character.
> - **BufferedReader:** This is like **reading a book one chapter at a time**: instead of reading a single word, going to the library to fetch the next word, and returning (slow disk access), you fetch a whole chunk of text at once.
> - **NIO.2:** This is like an **express delivery courier service**: you use paths and channels to request file packages and let the system deliver them instantly.
>
> **💼 Industry Application:** Log rotation services scan directories using NIO.2 \`Files.walk()\` to archive files older than 30 days. E-commerce platforms parse uploaded CSV catalogs using stream readers to update product inventories.

### Practice Questions

* **Question 19:** Why is using \`BufferedReader\` faster than reading characters one-by-one using a plain \`FileReader\`?
* **Question 20:** Using the NIO.2 API, write a program that reads all lines from a file called \`"data.txt"\`, converts each line to uppercase, and writes the result to \`"data_upper.txt"\`.

---

## 11. Essential Java Collections Framework

The **Collections Framework** is a unified architecture for storing, retrieving, and manipulating groups of objects. It consists of interfaces, implementations (classes), and algorithms (static utility methods in \`Collections\`).

### Collection Hierarchy

\`\`\`
                       Iterable<T>
                           |
                      Collection<T>
                     /       |       \\
                List<T>    Set<T>    Queue<T>
               /    \\       |   \\        \\
        ArrayList  LinkedList HashSet TreeSet  PriorityQueue
                                                   
                       Map<K,V>  (separate hierarchy)
                      /       \\
                HashMap     TreeMap
\`\`\`

### Core Collections Comparison

| Collection | Interface | Ordering | Duplicates | Null Elements | Access Time | Insertion Time |
|:---|:---|:---|:---|:---|:---|:---|
| \`ArrayList\` | \`List\` | Insertion order | ✅ | ✅ | $O(1)$ by index | $O(n)$ (middle), $O(1)$ amortized (end) |
| \`LinkedList\` | \`List\`, \`Deque\` | Insertion order | ✅ | ✅ | $O(n)$ | $O(1)$ (head/tail) |
| \`HashSet\` | \`Set\` | No guaranteed order | ❌ | ✅ (one null) | $O(1)$ | $O(1)$ |
| \`TreeSet\` | \`SortedSet\` | Sorted (natural/comparator) | ❌ | ❌ | $O(\\log n)$ | $O(\\log n)$ |
| \`HashMap\` | \`Map\` | No guaranteed order | Keys: ❌, Values: ✅ | ✅ (one null key) | $O(1)$ | $O(1)$ |
| \`TreeMap\` | \`SortedMap\` | Sorted by keys | Keys: ❌, Values: ✅ | ❌ (null keys) | $O(\\log n)$ | $O(\\log n)$ |
| \`PriorityQueue\` | \`Queue\` | Heap-ordered (min by default) | ✅ | ❌ | $O(1)$ peek | $O(\\log n)$ |

\`\`\`java
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
\`\`\`

> [!NOTE]
> **Generics Type Safety**
> Prior to Java 5, collections stored raw \`Object\` references, requiring manual casting and causing runtime \`ClassCastException\` errors. **Generics** (e.g., \`ArrayList<String>\`) enforce type safety at compile time, eliminating the need for casting and catching type errors before the program runs.

### The \`Iterator\` Pattern

The \`Iterator\` interface provides a standard way to traverse any collection without exposing its internal structure. It also supports safe removal of elements during iteration.

\`\`\`java
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
\`\`\`

> [!WARNING]
> **ConcurrentModificationException:** You cannot use \`list.remove()\` inside a \`for-each\` loop over the same list. The enhanced for loop uses an iterator internally, and modifying the collection through any means other than the iterator's own \`remove()\` method will throw a \`ConcurrentModificationException\`. Always use \`Iterator.remove()\` or \`List.removeIf()\` instead.

### \`Comparable\` vs. \`Comparator\`

Both interfaces are used to define ordering for objects, but they serve different purposes:

| Aspect | \`Comparable<T>\` | \`Comparator<T>\` |
|:---|:---|:---|
| **Package** | \`java.lang\` | \`java.util\` |
| **Method** | \`int compareTo(T other)\` | \`int compare(T a, T b)\` |
| **Defined in** | The class itself (intrinsic natural ordering) | A separate class or lambda (external ordering) |
| **Sorting** | \`Collections.sort(list)\` | \`Collections.sort(list, comparator)\` |
| **Multiple orderings?** | One per class | Unlimited — create different comparators |

\`\`\`java
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
\`\`\`

### Stream API Basics (Java 8+)

The **Stream API** provides a declarative, functional-style approach to processing collections. A stream pipeline consists of three stages:

1. **Source:** A collection, array, or generator that creates the stream.
2. **Intermediate Operations:** Lazy, chainable transformations (\`filter\`, \`map\`, \`sorted\`, \`distinct\`, \`limit\`).
3. **Terminal Operation:** Triggers processing and produces a result (\`collect\`, \`forEach\`, \`reduce\`, \`count\`).

\`\`\`java
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
\`\`\`

> [!IMPORTANT]
> **Streams are Lazy and One-Shot:**
> - **Lazy:** Intermediate operations are not executed until a terminal operation is invoked. This allows the stream pipeline to be optimized (e.g., short-circuiting with \`findFirst()\`).
> - **One-Shot:** A stream can only be consumed once. Attempting to reuse a stream after a terminal operation throws \`IllegalStateException\`.

### The \`Optional\` Class (Java 8+)

\`Optional<T>\` is a container that may or may not hold a non-null value. It is designed to eliminate \`NullPointerException\` by forcing explicit handling of the "no value" case.

\`\`\`java
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
\`\`\`

> [!CAUTION]
> **\`Optional\` Best Practices:**
> - Use \`Optional\` as a **return type** for methods that might not have a result.
> - **Never** use \`Optional\` as a method parameter, a field type, or in collections — it adds unnecessary overhead.
> - **Never** call \`.get()\` without first checking \`.isPresent()\` — use \`orElse()\`, \`orElseGet()\`, or \`ifPresent()\` instead.

### 🌍 Real-World Analogy
> - **ArrayList:** An \`ArrayList\` is like a **dynamic bookshelf** that expands as you buy more books.
> - **HashMap:** A \`HashMap\` is like a **filing cabinet with labeled folders**: you drop the folder into the drawer labeled with its first letter (hash code) for instant retrieval.
> - **Stream API:** The **Stream API** is like a **factory conveyor belt**: items pass down the belt, and workers filter out defects, format labels (map), and box them up (collect) without altering the original raw materials.
>
> **💼 Industry Application:** Spring Boot microservices query user lists from database tables, convert them to Java Streams to filter out inactive users, map them to public profiles, and collect them into a JSON response array.

### Practice Questions

* **Question 21:** Write a program that counts the frequency of words in an array of strings using a \`HashMap<String, Integer>\`.
* **Question 22:** Using the Stream API, write a pipeline that takes a \`List<Integer>\`, filters out even numbers, squares the remaining odd numbers, and collects the result into a new list. For input \`[1, 2, 3, 4, 5, 6]\`, what is the output?

---
---

## 12. Answer Key & Explanations

### Section 1: Introduction to Java & The JVM Platform

* **Answer 1:**
  The Java compiler (\`javac\`) converts \`.java\` source code into intermediate **Bytecode** (\`.class\` files). This bytecode is not bound to any specific CPU architecture — it is a platform-neutral instruction set. Any computer with a **Java Virtual Machine (JVM)** installed can load, verify, and execute this bytecode, translating it into native machine instructions for the host operating system. The JVM abstracts away hardware differences, achieving the "Write Once, Run Anywhere" promise. Additionally, the **JIT compiler** within the JVM optimizes frequently executed code paths by compiling them to native machine code at runtime.

* **Answer 2:**
  * **Eden (Young Generation):** Where all new objects are initially allocated. When Eden fills up, a **Minor GC** is triggered — fast and frequent. Objects that survive are moved to a Survivor space.
  * **Survivor 0 & Survivor 1 (Young Generation):** Hold objects that have survived one or more Minor GCs. Objects are copied back and forth between S0 and S1 during each Minor GC cycle. After surviving a configurable number of cycles (age threshold), objects are promoted.
  * **Old Generation (Tenured):** Stores long-lived objects promoted from the Young Generation. A **Major (Full) GC** is triggered when Old Gen runs out of space. Full GCs are slower and more disruptive because they scan the entire heap.

  Minor GCs are triggered when Eden fills up. Major GCs are triggered when Old Gen cannot accommodate promoted objects.

### Section 2: Java Syntax, Core Data Types & Memory Allocation

* **Answer 3:**
  * \`Integer x = 50;\` — The primitive literal \`50\` is **autoboxed** to an \`Integer\` object via \`Integer.valueOf(50)\`. The reference variable \`x\` resides on the **Stack**, pointing to the \`Integer\` object stored on the **Heap**.
  * \`int y = x;\` — The \`Integer\` object is **unboxed** by calling \`x.intValue()\`, and the resulting primitive value \`50\` is assigned to \`y\`. Both \`y\` and its value \`50\` reside entirely on the **Stack**.

* **Answer 4:**
  \`\`\`
  false
  true
  \`\`\`
  **Explanation:** \`Integer.valueOf()\` caches values in the range **-128 to 127**. Since \`200\` is outside this range, \`Integer.valueOf(200)\` creates **two distinct** \`Integer\` objects on the Heap. The \`==\` operator compares references (memory addresses), so \`a == b\` returns \`false\` because they are different objects. The \`.equals()\` method compares the actual integer values, so \`a.equals(b)\` returns \`true\` because both hold the value \`200\`.

### Section 3: Operators & Control Flow

* **Answer 5:**
  * Output: **\`true true\`**
  * **Explanation:** Java uses a **String Pool** to optimize memory for string literals. When you write \`String a = "Hello"\` and \`String b = "Hello"\`, the JVM stores only one \`"Hello"\` object in the String Pool and points both \`a\` and \`b\` to that same object. Therefore:
    * \`a == b\` → \`true\` (same reference in the pool).
    * \`a.equals(b)\` → \`true\` (same character content).
  * *Note: If you used \`new String("Hello")\`, the \`new\` keyword forces creation of a new object outside the pool, and \`==\` would return \`false\`.*

* **Answer 6:**
  \`\`\`java
  String result = switch (code) {
      case 200 -> "OK";
      case 404 -> "Not Found";
      case 500 -> "Server Error";
      default  -> "Unknown";
  };
  \`\`\`
  The switch expression uses arrow syntax (\`->\`), which eliminates fall-through (no \`break\` needed), and returns a value directly assigned to \`result\`. All possible values must be covered — the \`default\` acts as a catch-all.

### Section 4: Classes, Objects & Constructors

* **Answer 7:**
  **Constructor Chaining** is the technique of calling one constructor from another constructor within the same class or from a parent class.
  * Use **\`this(args)\`** to call another (overloaded) constructor within the **same class**. This must be the **first statement** in the constructor body.
  * Use **\`super(args)\`** to call a **parent class** constructor from a subclass. This must also be the **first statement** in the subclass constructor.
  * You cannot use both \`this()\` and \`super()\` in the same constructor because both require being the first statement.

  \`\`\`java
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
  \`\`\`

* **Answer 8:**
  \`\`\`java
  public record Coordinate(double lat, double lon) { }
  \`\`\`
  The \`record\` declaration automatically generates:
  1. A **canonical constructor** \`Coordinate(double lat, double lon)\`.
  2. **Accessor methods** \`lat()\` and \`lon()\` (not \`getLat()\`/\`getLon()\`).
  3. An \`equals()\` method that compares all components.
  4. A \`hashCode()\` method consistent with \`equals()\`.
  5. A \`toString()\` method returning \`Coordinate[lat=..., lon=...]\`.

  All fields are implicitly \`private final\`, making records immutable.

### Section 5: OOP Pillar 1: Encapsulation & Access Modifiers

* **Answer 9:**
  * **Yes**, \`Child\` can call the inherited \`protected show()\` method because it is a subclass of \`Parent\`. Protected members are accessible to subclasses regardless of package.
  * **No**, the unrelated class \`Test\` in package \`B\` cannot call \`show()\` on a \`Parent\` instance. Even though \`Test\` is in the same package as \`Child\`, \`Test\` does not inherit from \`Parent\` and is in a different package than where \`show()\` is defined. The \`protected\` modifier only grants access to subclasses and classes within the same package as the declaring class (\`A\`).

* **Answer 10:**
  A \`final\` field prevents **reassignment** of the reference variable, but it does **not** prevent modification of the object's internal state. For example:
  \`\`\`java
  final List<String> list = new ArrayList<>();
  list.add("Hello");  // Legal — modifying the object's contents
  // list = new ArrayList<>();  // Compile error — reassigning the reference
  \`\`\`
  The list's contents can still be modified via \`add()\`, \`remove()\`, etc. To achieve true immutability with mutable fields, you must:
  1. Make a **defensive copy** of the mutable object in the constructor: \`this.list = new ArrayList<>(input)\`.
  2. Return an **unmodifiable view** from the getter: \`return Collections.unmodifiableList(list)\`.

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
    * The \`@Override\` annotation is recommended to catch errors at compile time.

* **Answer 12:**
  The \`equals\`-\`hashCode\` contract states: **If two objects are equal according to \`equals()\`, they must have the same \`hashCode()\`**. Hash-based collections (\`HashMap\`, \`HashSet\`) use \`hashCode()\` to determine the bucket where an object is stored. If \`equals()\` is overridden without \`hashCode()\`:
  * Two logically equal objects may have different hash codes (inherited from \`Object\`, which returns based on memory address).
  * They will be placed in **different buckets** in a \`HashSet\` or \`HashMap\`.
  * Looking up a logically equal key in a \`HashMap\` will fail because the lookup checks the wrong bucket.

  Example of the bug:
  \`\`\`java
  // equals() overridden, hashCode() NOT overridden
  Student s1 = new Student("Alice", 101);
  Student s2 = new Student("Alice", 101);

  Set<Student> set = new HashSet<>();
  set.add(s1);
  System.out.println(set.contains(s2));  // false! — wrong bucket
  \`\`\`

### Section 7: OOP Pillar 3: Polymorphism (Static vs. Dynamic Binding)

* **Answer 13:**
  **No**, you cannot call \`pet.purr()\` directly. The compiler performs type checking based on the **compile-time reference type** (\`Animal\`), not the runtime object type (\`Cat\`). Since the \`Animal\` class does not define a \`purr()\` method, the compilation fails with a "cannot find symbol" error. To call \`purr()\`, you must **downcast** the reference to \`Cat\`:
  \`\`\`java
  if (pet instanceof Cat myCat) {
      myCat.purr();  // Safe downcast with pattern matching
  }
  \`\`\`

* **Answer 14:**
  * **Method Overriding** applies to **instance** methods. The JVM uses **dynamic dispatch** at runtime — the method called depends on the actual object type on the heap, regardless of the reference type. The \`@Override\` annotation is used.
  * **Method Hiding** applies to **static** methods. Static methods are resolved at **compile time** based on the reference type (static binding). The parent's static method is "hidden," not overridden. The \`@Override\` annotation cannot be used.

  \`\`\`java
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
  \`\`\`

### Section 8: OOP Pillar 4: Abstraction (Abstract Classes vs. Interfaces)

* **Answer 15:**

  | Criteria | Abstract Class | Interface |
  |:---|:---|:---|
  | **(a) Multiple inheritance** | ❌ Single (one parent class via \`extends\`) | ✅ Multiple (a class can \`implement\` many interfaces) |
  | **(b) Variable modifiers** | Any: private, protected, public; mutable or final | \`public static final\` only (constants) |
  | **(c) Constructor presence** | ✅ Can have constructors | ❌ Cannot have constructors |
  | **(d) Method types** | Abstract + concrete (any access modifier) | Abstract + \`default\` + \`static\` (Java 8) + \`private\` (Java 9) |

* **Answer 16:**
  \`\`\`java
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
  \`\`\`

### Section 9: Exception Handling (Checked, Unchecked, Try-With-Resources)

* **Answer 17:**
  * **\`throw\`** is used **inside a method body** to manually create and throw a specific exception object. It transfers control to the nearest matching \`catch\` block.
    * Example: \`throw new IllegalArgumentException("Invalid input");\`
  * **\`throws\`** is used **in a method signature** to declare that the method might throw certain checked exceptions, warning callers that they must handle or propagate those exceptions.
    * Example: \`public void readFile() throws IOException, FileNotFoundException\`
  * In short: \`throw\` performs the action of throwing; \`throws\` declares the possibility.

* **Answer 18:**
  \`\`\`java
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
  \`\`\`

### Section 10: File Input & Output (I/O Streams)

* **Answer 19:**
  Reading a file character-by-character with a plain \`FileReader\` issues a **system call** (an OS-level I/O request to the disk) for every single character read. System calls are expensive because they involve context switching between user space and kernel space.

  \`BufferedReader\` reads a large block of characters (typically **8,192 characters / 8 KB**) from the disk in a **single system call**, storing them in an in-memory buffer. Subsequent \`read()\` calls are served directly from this fast RAM buffer. This reduces the number of disk reads by orders of magnitude, dramatically improving performance.

* **Answer 20:**
  \`\`\`java
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
  \`\`\`

### Section 11: Essential Java Collections Framework

* **Answer 21:**
  \`\`\`java
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
  \`\`\`
  The \`getOrDefault(word, 0)\` method returns the current count for the word, or \`0\` if the word has not been seen before. Adding \`1\` and putting it back updates the frequency.

* **Answer 22:**
  \`\`\`java
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
  \`\`\`
  **Pipeline breakdown:**
  1. \`filter(n -> n % 2 != 0)\` removes even numbers: \`[1, 3, 5]\`
  2. \`map(n -> n * n)\` squares each remaining element: \`[1, 9, 25]\`
  3. \`collect(Collectors.toList())\` gathers results into a new \`List<Integer>\`

  Output: **\`[1, 9, 25]\`**

---

## Made by NotAryanSinha
*(Created with care for your programming journey!)*
`,
  "c-dsa": `# C Programming & Data Structures (DSA) Reference Notes

This manual is a comprehensive, self-contained reference guide for learning **C Programming** and core **Data Structures and Algorithms (DSA)** in C.

Throughout this guide, you will find highlighted **Notes** pointing out compiler optimizations, memory management guidelines, and potential traps, alongside **Practice Questions** to test understanding. **The Answer Key & Explanations are placed at the absolute end of this document.**

---

## Table of Contents
1. [Introduction to C & The Compilation Process](#1-introduction-to-c--the-compilation-process)
2. [Variables, Core Data Types & Memory Sizes](#2-variables-core-data-types--memory-sizes)
3. [Operators & Control Flow](#3-operators--control-flow)
4. [Functions, Scopes & Parameter Passing](#4-functions-scopes--parameter-passing)
5. [Arrays & String Manipulation](#5-arrays--string-manipulation)
6. [Pointers: Memory Addresses & Pointer Arithmetic](#6-pointers-memory-addresses--pointer-arithmetic)
7. [Structures, Unions & Typedef](#7-structures-unions--typedef)
8. [Dynamic Memory Allocation (DMA)](#8-dynamic-memory-allocation-dma)
9. [DSA 1: Linked Lists (Singly & Doubly Linked Lists)](#9-dsa-1-linked-lists-singly--doubly-linked-lists)
10. [DSA 2: Stacks & Queues](#10-dsa-2-stacks--queues)
11. [DSA 3: Trees (Binary Search Trees & Self-Balancing Trees)](#11-dsa-3-trees-binary-search-trees--self-balancing-trees)
12. [Algorithms: Sorting & Searching](#12-algorithms-sorting--searching)
13. [Answer Key & Explanations](#13-answer-key--explanations)

---

## 1. Introduction to C & The Compilation Process

C is a compiled, statically typed, procedural programming language developed by Dennis Ritchie at Bell Labs in 1972. It provides low-level memory access while maintaining structural program organization, making it the bedrock language for operating systems, compilers, database engines, and embedded systems.

### The C Compilation Pipeline
Unlike Python, which is interpreted line-by-line, C code must be translated into machine-readable binary code before running. This pipeline consists of four distinct phases:

1. **Preprocessing:** Resolves directives starting with \`#\`. It expands headers (\`#include\`), replaces macros (\`#define\`), and strips comments. Output: Pure preprocessed source code (typically \`.i\` files).
2. **Compilation:** The compiler translates the preprocessed C source code into assembly language instructions specific to the target CPU architecture. Output: Assembly files (\`.s\` or \`.asm\`).
3. **Assembly:** The assembler converts assembly code into machine code instruction sets. Output: Object code binary files (\`.o\` or \`.obj\`).
4. **Linking:** The linker merges multiple object files and external precompiled system libraries (like \`libc\`) to resolve function references. Output: The final executable file (\`.exe\` or \`.out\`).

\`\`\`c
#include <stdio.h> // Preprocessor Directive

int main() {
    printf("Hello World\\n"); // Execution entry point
    return 0; // Return code 0 tells OS process terminated successfully
}
\`\`\`

> [!NOTE]
> **C Memory Layout Segments**
> When a compiled C program runs, it occupies four memory regions:
> * **Code Segment (Text):** Stores the read-only machine instructions.
> * **Data Segment:** Divided into *Initialized Data* (global/static variables initialized with values) and *BSS* (uninitialized global/static variables defaulted to 0).
> * **Stack Segment:** Allocates local variables and return addresses for function calls. Grows downward.
> * **Heap Segment:** Allocated dynamically at runtime by the programmer (via malloc/calloc). Grows upward.

### Common Compiler Flags (GCC/Clang)
When compiling C applications in a production setting, compiler flags configure optimization, safety, and standards behavior:
* \`-Wall\`: Enables all common compiler warnings. Essential for detecting bug patterns early.
* \`-g\`: Generates debugging information required for diagnostic tools like \`gdb\`.
* \`-O2\`: Applies a moderate level of compiler optimization for execution speed without inflating executable size.
* \`-std=c99\`: Enforces syntax compliance with the C99 standard specification.

### Makefile Basics
For projects spanning multiple source files, recompiling everything manually is tedious. **Makefiles** automate compilation by building only the source files that have changed:

\`\`\`makefile
# Simple Makefile structure
CC = gcc
CFLAGS = -Wall -g -O2

app.exe: main.o helper.o
	$(CC) $(CFLAGS) -o app.exe main.o helper.o

main.o: main.c
	$(CC) $(CFLAGS) -c main.c

helper.o: helper.c
	$(CC) $(CFLAGS) -c helper.c

clean:
	rm -f *.o app.exe
\`\`\`

### Preprocessor Macros with Parameters
Macros are simple textual replacement tokens resolved during preprocessing. While powerful, unparenthesized macros introduce dangerous precedence bugs:

\`\`\`c
#include <stdio.h>

// DANGEROUS MACRO: SQUARE(5 + 5) becomes 5 + 5 * 5 + 5 = 35!
#define SQUARE_BAD(x) x * x

// SAFE MACRO: SQUARE(5 + 5) becomes ((5 + 5) * (5 + 5)) = 100
#define SQUARE_SAFE(x) ((x) * (x))

int main() {
    printf("Bad Square: %d\\n", SQUARE_BAD(5 + 5));  // Prints 35
    printf("Safe Square: %d\\n", SQUARE_SAFE(5 + 5)); // Prints 100
    return 0;
}
\`\`\`

### 🌍 Real-World Analogy
> - **Compilation Pipeline:** Translating code is like **translating a book from English to Japanese**:
>   - **Preprocessor:** A **proofreader** that does find-and-replace text shortcuts (\`#define\`), inserts header files (\`#include\`), and cuts out draft chapters (\`#ifdef\`).
>   - **Compiler:** A **translator** who converts English sentences to standard Japanese grammar drafts (assembly code).
>   - **Assembler:** A **typesetter** who prints the drafts into raw stamped pages (machine-readable binary object files).
>   - **Linker:** A **bookbinder** who gathers the chapters, links footnotes, binds external libraries, and packages them into a single hardcover book (executable).
> - **Makefile:** A **construction foreman's checklist**: they only rebuild the sections of the building that were damaged or modified, rather than rebuilding the entire structure from scratch.
>
> **💼 Industry Application:** Large scale project build tools like the **Linux Kernel** or **Chromium** use Makefiles and compiler flags (\`-O3\`) to organize compilation of millions of lines of code efficiently, skipping unmodified files to reduce developers' build wait times.

### Practice Questions
* **Question 1:** Describe the inputs and outputs of each of the four compilation stages when compiling a C file named \`program.c\`.
* **Question 2:** Explain what a Makefile is and write a simple Makefile to compile \`main.c\` and \`helper.c\` into an executable named \`app.exe\` using \`gcc\` with warning flags.

---

## 2. Variables, Core Data Types & Memory Sizes

### Datatypes and Specifiers
Variables in C represent named storage addresses. Since C is **statically typed**, every variable's data type must be declared at write-time so the compiler knows how many bytes to allocate.

| Datatype | Description | Typical Size (bytes) | Format Specifier |
| :--- | :--- | :--- | :--- |
| \`char\` | Single ASCII Character | 1 | \`%c\` or \`%d\` (ASCII integer) |
| \`int\` | Standard integer value | 4 | \`%d\` or \`%i\` |
| \`float\` | Single-precision floating point | 4 | \`%f\` |
| \`double\` | Double-precision floating point | 8 | \`%lf\` |
| \`void\` | Represents empty/incomplete type | 0 | N/A |

### Datatype Qualifiers
* **Size Qualifiers:** \`short\`, \`long\` (e.g., \`long int\` allocates 8 bytes).
* **Sign Qualifiers:** \`signed\` (allows negative numbers), \`unsigned\` (non-negative only, doubling upper capacity limit).
* **Type Qualifiers:** 
  * \`const\`: Defines a variable whose value cannot be modified after initialization.
  * \`volatile\`: Informs the compiler that a variable's value can be changed by factors outside the program's direct control (e.g., hardware registers, interrupt service routines, or concurrent threads). This disables compiler caching optimizations on that memory address.

\`\`\`c
#include <stdio.h>

int main() {
    const double PI = 3.14159; // Cannot be reassigned
    volatile int status_register = 0; // CPU will read this from memory every time

    int score = 95;
    double price = 129.99;
    char grade = 'A';
    unsigned int counter = 50000;

    printf("Score: %d, Price: %.2lf, Grade: %c, Counter: %u\\n", score, price, grade, counter);
    printf("Size of integer: %zu bytes\\n", sizeof(score)); // sizeof returns size_t bytes
    return 0;
}
\`\`\`

### The \`sizeof\` Operator
\`sizeof\` is a **compile-time operator**, not a runtime function. It returns the size in bytes of a data type or expression. Because it evaluates during compilation, expressions inside \`sizeof\` are not executed at runtime:

\`\`\`c
int a = 5;
size_t s = sizeof(a++); // s will store 4 (size of int), but 'a' remains 5!
\`\`\`

### Type Casting: Implicit vs. Explicit
Type casting changes a value's data type.
* **Implicit Casting (Coercion):** Handled automatically by the compiler. Smaller data types are safely promoted to larger ones (e.g., \`int\` to \`double\`).
* **Explicit Casting:** Forced manually by the developer using parentheses. Crucial to prevent integer division trashing or double-to-int data truncation errors:

\`\`\`c
int sum = 17, count = 5;
double avg_bad = sum / count;          // Avg: 3.00 (Integer division first, then cast to double)
double avg_good = (double)sum / count; // Avg: 3.40 (Explicitly cast sum to double before division)
\`\`\`

> [!IMPORTANT]
> **Initialization and Garbage Values**
> Unlike Python, uninitialized local variables inside C functions do **not** default to \`0\` or \`NULL\`. Instead, they retain whatever random leftover byte data existed in that stack memory address. Printing or accessing uninitialized variables leads to **undefined behavior** and garbage outputs. Always initialize variables: \`int score = 0;\`.

### 🌍 Real-World Analogy
> - **\`sizeof\`:** This is like **measuring a shipping box's dimensions**: you do not open it or care about the items inside; you only measure the outer space it occupies to calculate shipping rates (memory footprint).
> - **\`const\`:** A variable qualified as \`const\` is like a **museum exhibit behind glass**: you can view the values, but you cannot reach in and modify them.
> - **\`volatile\`:** A \`volatile\` variable is like a **live stock market ticker on a wall screen**: the compiler cannot assume the value remains constant just because the program didn't change it; the outside world (hardware registers, interrupt handlers) can change it at any second, so the program must check the screen every time.
>
> **💼 Industry Application:** Driver developers and embedded system programmers use \`volatile\` pointers to read direct physical inputs from temperature sensors or network chips, as those values change independently of the CPU instruction execution loop.

### Practice Questions
* **Question 3:** Explain the difference in value range between a \`signed char\` and an \`unsigned char\` (both occupying 1 byte of memory).
* **Question 4:** What does the \`volatile\` keyword do in C, and why is it critical when interacting with memory-mapped I/O hardware?

---

## 3. Operators & Control Flow

### Operators in C
* **Arithmetic:** \`+\`, \`-\`, \`*\`, \`/\` (Integer division yields integer; E.g., \`5 / 2\` evaluates to \`2\`), \`%\` (Modulo, only works on integers).
* **Increment/Decrement:** \`++x\` (prefix increment: update then execute), \`x++\` (postfix increment: execute then update).
* **Relational:** \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`.
* **Logical:** \`&&\` Logical AND (short-circuiting), \`||\` Logical OR (short-circuiting), \`!\` Logical NOT.
* **Bitwise:** Operates directly on binary bits: \`&\` AND, \`|\` OR, \`^\` XOR, \`~\` NOT, \`<<\` Left Shift, \`>>\` Right Shift.
* **Comma Operator (\`,\`):** Evaluates multiple expressions from left to right, returning the value of the rightmost expression:

\`\`\`c
int a = (x = 5, y = 10, x + y); // x becomes 5, y becomes 10, a becomes 15
\`\`\`

### Operator Precedence & Associativity
Operators are evaluated based on their precedence. When operators have equal precedence, their associativity (left-to-right or right-to-left) determines the order:

| Precedence | Operator Category | Operators | Associativity |
| :--- | :--- | :--- | :--- |
| 1 | Postfix | \`()\`, \`[]\`, \`->\`, \`.\`, \`post++\`/\`post--\` | Left-to-Right |
| 2 | Unary | \`!\`, \`~\`, \`pre++\`/\`pre--\`, \`+\`, \`-\`, \`*\` (dereference), \`&\`, \`sizeof\`, casting | Right-to-Left |
| 3 | Multiplicative | \`*\`, \`/\`, \`%\` | Left-to-Right |
| 4 | Additive | \`+\`, \`-\` | Left-to-Right |
| 5 | Shift | \`<<\`, \`>>\` | Left-to-Right |
| 6 | Relational | \`<\`, \`<=\`, \`>\`, \`>=\` | Left-to-Right |
| 7 | Equality | \`==\`, \`!=\` | Left-to-Right |
| 8 | Bitwise | \`&\` then \`^\` then \`|\` | Left-to-Right |
| 9 | Logical | \`&&\` then \`||\` | Left-to-Right |
| 10 | Conditional (Ternary) | \`? :\` | Right-to-Left |
| 11 | Assignment | \`=\`, \`+=\`, \`-=\`, \`*=\`, \`/=\`, etc. | Right-to-Left |
| 12 | Comma | \`,\` | Left-to-Right |

### Control Flow (Decision Making)
C uses \`if-else\` blocks and \`switch-case\` statements to fork decisions.

\`\`\`c
// Switch statement syntax
int option = 2;
switch (option) {
    case 1:
        printf("Option 1\\n");
        break;
    case 2:
        printf("Option 2\\n");
        break; // break is required to prevent falling through to subsequent cases!
    default:
        printf("Fallback Option\\n");
}
\`\`\`

### Loops
* \`for\` loop: Used when loop iteration count is defined.
* \`while\` loop: Runs as long as a condition evaluates to non-zero (True).
* \`do-while\` loop: Executes the body block **at least once** before checking the loop condition.

\`\`\`c
// Do-While loop example
int count = 5;
do {
    printf("%d ", count);
    count++;
} while (count < 5); // Prints: 5
\`\`\`

> [!NOTE]
> **C Boolean Evaluation**
> In C, there was no native built-in boolean datatype prior to C99 (which introduced \`<stdbool.h>\`). Any numeric value that is **0** evaluates to **False**. Any **non-zero** numeric value (including negative values) evaluates to **True**.

### 🌍 Real-World Analogy
> - **Operator Precedence:** This follows the exact same logic as **mathematics order of operations (PEMDAS/BODMAS)**: multiplication and division are performed before addition and subtraction unless parentheses override the default flow.
> - **Bitwise Operators:** Flipping bits is like operating a **light switch panel on a wall**: you can toggle individual switches (\`&\`, \`|\`, \`^\`) on and off to control specific circuits without disturbing the states of any other switches.
>
> **💼 Industry Application:** Graphic rendering engines and network packet protocols pack multiple configuration flags into a single integer using bitwise operations (bitmasking) to optimize network bandwidth and memory footprint.

### Practice Questions
* **Question 5:** What is printed by this code block, and why?
  \`\`\`c
  int x = 5;
  int y = x++;
  printf("x=%d, y=%d", x, y);
  \`\`\`

---

## 4. Functions, Scopes & Parameter Passing

Functions segment programs into reusable components.

### Syntax & Declaration
C requires every function to be declared or defined before it is called. If you want to define a function below the \`main\` entry point, you must place a **function prototype** (forward declaration) at the top of the file.

\`\`\`c
#include <stdio.h>

// Function Prototype
int add(int a, int b);

int main() {
    printf("Sum: %d\\n", add(5, 7));
    return 0;
}

// Function Definition
int add(int a, int b) {
    return a + b;
}
\`\`\`

### Parameter Passing
* **Call by Value:** A copy of the arguments is passed to the function parameters. Modifying the parameter inside the function has **no effect** on the caller's variables.
* **Call by Reference (Using Pointers):** The memory addresses of variables are passed to the function. This allows the function to modify the caller's variables directly by dereferencing those pointers.

\`\`\`c
// Call by Reference Swap Function
void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}
\`\`\`

### Recursion Patterns
A recursive function is one that calls itself to solve smaller instances of the same problem. Every recursive function must contain a **base case** to halt recursion and prevent a **stack overflow** crash:

\`\`\`c
// Factorial recursion: n! = n * (n-1)!
int factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive case
}
\`\`\`

### Function Pointers & Callbacks
In C, functions reside in memory, and their entry point address can be stored in **function pointers**. This allows passing behaviors as parameters (callbacks):

\`\`\`c
#include <stdio.h>

// Callback function examples
int add(int a, int b) { return a + b; }
int subtract(int a, int b) { return a - b; }

// Function taking a function pointer as a parameter (Callback)
void execute_op(int (*op_ptr)(int, int), int x, int y) {
    printf("Result: %d\\n", op_ptr(x, y));
}

int main() {
    // Declaring function pointer matching signature: int (int, int)
    int (*calc)(int, int) = add;
    execute_op(calc, 10, 5);      // Prints 15
    execute_op(subtract, 10, 5);  // Prints 5
    return 0;
}
\`\`\`

### Variable Scopes
* **Local Variables:** Exist only within the stack frame of their declaring function.
* **Global Variables:** Declared outside all functions. Accessible throughout the entire file.
* **Static Local Variables:** Declared inside a function but retained across function calls. They are initialized once and reside in the Data Segment, preserving their value even after the function returns.

### 🌍 Real-World Analogy
> - **Functions:** A function is like a **department employee** hired to do a specific job.
> - **Call-by-Value:** This is like **photocopying a document** and giving the copy to the employee: they can scribble on the copy, but your original document on your desk remains untouched.
> - **Call-by-Reference:** Handing over pointer addresses is like **passing the original document**: any edits they make directly modify your original copy.
> - **Function Pointers:** A function pointer is like a **TV remote's programmable buttons**: you can assign different channels (functions) to the same button depending on user configuration.
>
> **💼 Industry Application:** The standard C library function \`qsort()\` utilizes function pointers as callback comparators, allowing developers to pass custom comparison criteria to sort arrays of custom structs.

### Practice Questions
* **Question 6:** What is the output of three consecutive calls to \`increment_counter()\`?
  \`\`\`c
  void increment_counter() {
      static int count = 0;
      count++;
      printf("%d ", count);
  }
  \`\`\`
* **Question 7:** Declare a function pointer variable named \`op\` that points to a function taking two \`double\` arguments and returning a \`double\`. Show how to call it.

---

## 5. Arrays & String Manipulation

### Arrays
An array is a contiguous memory block storing multiple elements of the same data type.

#### Syntax
\`\`\`c
datatype array_name[array_size];
\`\`\`

Because memory is contiguous, element indexing can be resolved instantly via math computations: \`address_of_index = base_address + index * sizeof(datatype)\`.

\`\`\`c
int scores[3] = {85, 90, 95}; // Initialized array
scores[1] = 92;               // Overwriting element index 1
\`\`\`

#### Multidimensional (2D) Arrays
2D arrays represent matrices and are stored in memory in **row-major order** (row-by-row consecutively):

\`\`\`c
int matrix[2][3] = {
    {1, 2, 3}, // Row 0
    {4, 5, 6}  // Row 1
};
// In memory: [1, 2, 3, 4, 5, 6]
\`\`\`

#### Passing Arrays to Functions
In C, when an array is passed to a function, it **decays** into a pointer referencing its first element. Therefore, inside the function, the \`sizeof\` operator will return the size of the pointer, not the array. You must pass the size as a separate parameter:

\`\`\`c
void print_array(int *arr, int size) { // or int arr[]
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
}
\`\`\`

#### Variable-Length Arrays (VLAs)
Introduced in C99, VLAs allow allocating an array on the stack whose size is determined at runtime.
* **Risk:** Large VLA sizes can easily trigger a stack overflow since stack size is highly limited compared to the heap. Avoid VLAs for large or unvalidated size limits.

\`\`\`c
void create_vla(int n) {
    int temp_arr[n]; // Stack allocated VLA
    temp_arr[0] = 42;
}
\`\`\`

> [!WARNING]
> **Array Bound Safety**
> C does not perform bound-checking on array reads or writes. If you declare an array of size 5 and attempt to write to index 10 (\`scores[10] = 100\`), the C compiler will run the instruction without warning. This overwrites whatever data exists at that memory location, resulting in memory corruption, segmentation faults, or security vulnerabilities (buffer overflows).

---

### C Strings (Character Arrays)
In C, a string is a character array terminated by a special null character (\`'\\0'\`).

#### Syntax
\`\`\`c
char message[] = "Hello"; 
// Behind the scenes: {'H', 'e', 'l', 'l', 'o', '\\0'}
\`\`\`

#### Common Library Functions (\`<string.h>\`)
* \`strlen(str)\`: Returns the number of characters in the string (excludes the null-terminator \`\\0\`).
* \`strcpy(dest, src)\`: Copies the source string to the destination array.
* \`strcat(dest, src)\`: Appends the source string to the end of the destination array.
* \`strcmp(str1, str2)\`: Compares two strings character-by-character. Returns \`0\` if they match, a positive value if \`str1\` is lexicographically greater, and a negative value if \`str2\` is greater.

\`\`\`c
#include <stdio.h>
#include <string.h>

int main() {
    char source[] = "World";
    char destination[20] = "Hello "; // Must allocate enough byte space for concats!

    strcat(destination, source);
    printf("Resulting String: %s\\n", destination); // Resulting String: Hello World
    printf("Length: %zu\\n", strlen(destination));   // Length: 11
    return 0;
}
\`\`\`

### 🌍 Real-World Analogy
> - **Arrays:** An array is like a **row of school lockers**: they are contiguously laid out in a hallway, all the same size, and if you know the starting locker number, you can find the $n$-th locker instantly by counting indices.
> - **2D Arrays:** A 2D array is like a **spreadsheet grid** with rows and columns.
> - **Buffer Overflow:** Writing past array limits is like **writing past the edge of a whiteboard**: you run out of designated space and write directly onto the wall, defacing other data.
>
> **💼 Industry Application:** High-performance graphic frame buffers and audio processing engines represent multi-channel frames as flat contiguous arrays to optimize CPU cache hits and memory access speeds.

### Practice Questions
* **Question 8:** What is the byte size of \`char word[] = "C Language";\`? Why does \`strlen(word)\` return a different value than \`sizeof(word)\`?

---

## 6. Pointers: Memory Addresses & Pointer Arithmetic

Pointers are variables that store the memory addresses of other variables.

### Declaring & Dereferencing
* \`&\` (Address-of operator): Retrieves the memory address of a variable.
* \`*\` (Dereference operator): Declares pointer variables or accesses the value stored at a pointer's target address.

\`\`\`c
int val = 10;
int *ptr = &val; // ptr stores the address of val (e.g., 0x7ffd2)

printf("Address: %p\\n", (void*)ptr);
printf("Value stored in target address: %d\\n", *ptr); // dereferencing: 10
*ptr = 20; // Modifies the value of val to 20
\`\`\`

### Pointer Arithmetic
Pointers are memory addresses (hexadecimal numbers), meaning you can perform arithmetic operations on them. When you increment a pointer (\`ptr++\`), C increments it by **\`sizeof(pointed_datatype)\` bytes**, automatically pointing to the next element in memory.

\`\`\`c
int numbers[3] = {10, 20, 30};
int *p = numbers; // Array name evaluates to the base address of its first element: &numbers[0]

printf("First element: %d\\n", *p);     // 10
p++; // Increments address pointer by 4 bytes (sizeof int)
printf("Second element: %d\\n", *p);    // 20
\`\`\`

> [!NOTE]
> **Array Name Pointer Equivalence**
> The array variable syntax \`arr[i]\` is internally evaluated by the compiler as \`*(arr + i)\`. Because addition is commutative, \`*(i + arr)\` is also valid, meaning \`i[arr]\` is syntactically equivalent to \`arr[i]\` in C!

### Pointer Qualifiers (Const Pointers)
* \`const int *ptr\`: Pointer to a constant integer. The value pointed to cannot be changed, but you can change the pointer address.
* \`int * const ptr\`: Constant pointer to an integer. The value pointed to can be changed, but the pointer address cannot.
* \`const int * const ptr\`: Constant pointer to a constant integer. Neither the address nor the value can be modified.

\`\`\`c
int x = 10, y = 20;
const int *p1 = &x; 
// *p1 = 15; // ERROR: Value is read-only
p1 = &y;     // OK: Address can change

int * const p2 = &x;
*p2 = 15;    // OK: Value can change
// p2 = &y;  // ERROR: Address is read-only
\`\`\`

### Generic Pointers (\`void*\`)
A \`void*\` is a generic pointer that can point to any data type without casting. However, it **cannot be dereferenced directly** or subjected to pointer arithmetic without first casting to a specific concrete type:

\`\`\`c
int a = 5;
void *g_ptr = &a;
// printf("%d", *g_ptr); // ERROR: Cannot dereference void*
printf("%d", *(int*)g_ptr); // OK: Cast first, then dereference
\`\`\`

### Double Pointers (Pointers to Pointers)
A double pointer stores the address of another pointer. It is commonly used to modify a pointer passed into a function or to construct dynamic 2D arrays:

\`\`\`c
int val = 42;
int *p = &val;
int **dp = &p; // dp points to p, which points to val
printf("%d\\n", **dp); // Prints 42
\`\`\`

### Common Pointer Pitfalls
* **Null Pointer:** A pointer assigned to point to address \`0\` (e.g., \`int *ptr = NULL;\`). Dereferencing a NULL pointer instantly crashes the program with a segmentation fault.
* **Dangling Pointer:** A pointer referencing a memory address that has already been deallocated (e.g., pointing to local memory returned from an exited function or freed dynamic allocation).
* **Wild Pointer:** An uninitialized pointer pointing to a random garbage memory address.

### 🌍 Real-World Analogy
> - **Pointers:** A pointer is like a **GPS coordinate** or a street address written on a card: it tells you exactly where to find a house, but it is not the house itself.
> - **Double Pointers:** A double pointer is like a **map that leads you to another map**.
> - **Generic Pointers (\`void*\`):** A generic pointer is like a **universal power adapter**: it can fit into any socket, but you must declare what device it is powering (type cast) before turning the power on.
> - **Dangling Pointer:** This is like an **eviction notice on a torn-down building**: the building is gone (freed), but you still have the address card and might try to visit it, resulting in a crash.
>
> **💼 Industry Application:** Operating systems use raw pointers to manage virtual memory tables, process stack boundaries, and write drivers that map hardware buffers directly into user space.

### Practice Questions
* **Question 9:** Predict the values printed by this program:
  \`\`\`c
  int values[4] = {11, 22, 33, 44};
  int *p = values;
  printf("%d ", *p);
  p += 2;
  printf("%d ", *p);
  printf("%d ", *(p - 1));
  \`\`\`
* **Question 10:** Categorize the pointer declarations below and state what can/cannot be modified:
  1. \`const char *ptr;\`
  2. \`char * const ptr;\`

---

## 7. Structures, Unions & Typedef

C allows you to define custom datatypes by grouping variables of different types.

### Structures (\`struct\`)
Structures represent composite datatypes that group related variables (called member fields) under a single name. Each member field has its own independent address space in memory.

\`\`\`c
struct Student {
    char name[50];
    int roll_no;
    float gpa;
}; // Semicolon is required at struct definition closure!
\`\`\`

#### Accessing Members
* Use the dot operator (\`.\`) for struct instances.
* Use the arrow operator (\`->\`) when accessing members through a pointer.

\`\`\`c
typedef struct Student Student;
Student s1 = {"Alice", 101, 3.9};
Student *ptr_s = &s1;

printf("GPA: %.2f\\n", s1.gpa);       // Using dot operator
printf("GPA: %.2f\\n", ptr_s->gpa);   // Pointer access using arrow operator
\`\`\`

### Structure Padding & Memory Alignment
The memory footprint of a struct is not always the sum of its member sizes. Compilers insert padding bytes to align members with boundaries (e.g., 4-byte boundaries for integers), optimizing CPU data read speeds.
* **Minimizing Padding:** Order members from largest to smallest size to reduce alignment gaps.
* **Disabling Padding:** Use \`#pragma pack(1)\` to force the compiler to arrange members tightly without padding, which is useful for serializing data over networks.

\`\`\`c
#include <stdio.h>

struct Unpacked {
    char a;   // 1 byte
    // 3 bytes padding
    int b;    // 4 bytes
    char c;   // 1 byte
    // 3 bytes padding
}; // Size: 12 bytes

#pragma pack(1)
struct Packed {
    char a;   // 1 byte
    int b;    // 4 bytes
    char c;   // 1 byte
}; // Size: 6 bytes
#pragma pack() // Restore default padding
\`\`\`

### Flexible Array Members (C99)
A struct can contain an unsized array as its last member. This is useful for declaring dynamic payload structures:

\`\`\`c
struct Packet {
    int length;
    char payload[]; // Flexible Array Member
};
// Allocate memory for struct + payload buffer
struct Packet *p = malloc(sizeof(struct Packet) + 100 * sizeof(char));
\`\`\`

### Bit Fields
Bit fields allow specifying the exact number of bits allocated to variables, which is useful for memory-efficient flags or hardware interfaces:

\`\`\`c
struct Flags {
    unsigned int is_visible : 1; // Occupies 1 bit
    unsigned int color_code : 3; // Occupies 3 bits (0-7 range)
};
\`\`\`

---

### Unions (\`union\`)
Unions are similar to structs but allocate only enough memory to hold their **single largest member**. All member variables share the same memory location, meaning only one member field can contain a value at any given time.

\`\`\`c
union Data {
    int i;
    float f;
    char c;
}; // Allocates 4 bytes (size of float/int). Struct would allocate 9+ bytes.
\`\`\`

---

### Type Aliasing (\`typedef\`)
\`typedef\` creates aliases for complex type names, simplifying code declarations.

\`\`\`c
typedef struct Student Student; // Now we can type "Student" instead of "struct Student"
Student student_1;
\`\`\`

### 🌍 Real-World Analogy
> - **Structs:** A struct is like a **patient medical record form**: it has designated spots for different datatypes (name, age, height) all bundled into one physical file.
> - **Unions:** A union is like a **shared hotel conference room**: it can be styled for a wedding, a lecture, or a concert — but only one event can occupy the room at any given time.
> - **Bit Fields:** Bit fields are like **checkboxes on a form**: instead of wasting a whole line of paper for a single "yes/no" question, you pack multiple checkboxes into a single line to save space.
>
> **💼 Industry Application:** Network communication protocols and disk controllers define structures with \`#pragma pack\` to match exact binary headers for network frames (e.g., TCP/IP packets) without padding.

### Practice Questions
* **Question 11:** Describe what happens to union member values when you execute this sequence:
  \`\`\`c
  union Data data;
  data.i = 10;
  data.f = 220.5;
  \`\`\`
  What will be the value of \`data.i\`?
* **Question 12:** Assuming standard 4-byte integers and 1-byte characters, what is the size of the following struct, and how can its ordering be optimized to reduce memory padding?
  \`\`\`c
  struct Record {
      char a;
      int b;
      char c;
      double d;
  };
  \`\`\`

---

## 8. Dynamic Memory Allocation (DMA)

Dynamic Memory Allocation lets you request memory from the **Heap** at runtime when variable sizes are unknown before execution. You must import \`<stdlib.h>\` to use DMA functions.

### Core DMA Functions
1. \`malloc(size_t size)\`: Allocates \`size\` bytes of uninitialized heap memory. Returns a void pointer (\`void*\`) to the base address. Returns \`NULL\` if allocation fails.
2. \`calloc(size_t num, size_t size)\`: Allocates memory for an array of \`num\` elements of \`size\` bytes. **Initializes all allocated bytes to 0**.
3. \`realloc(void *ptr, size_t new_size)\`: Resizes an existing heap allocation. It expands or contracts the memory block in place, or moves it to a new location if necessary.
4. \`free(void *ptr)\`: Returns dynamic heap memory back to the operating system.

\`\`\`c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    // Allocating array of 5 integers dynamically
    int *arr = (int*)malloc(n * sizeof(int));

    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    // Populate array
    for (int i = 0; i < n; i++) {
        arr[i] = i * 10;
    }

    // Free heap memory when finished
    free(arr);
    arr = NULL; // Prevent dangling pointer behavior
    return 0;
}
\`\`\`

### \`realloc\` Edge Cases & Safe Handling
When calling \`realloc(ptr, new_size)\`, if allocation fails, the function returns \`NULL\` **but the original memory block remains valid and allocated**. Assigning the result directly back to the original pointer creates an instant memory leak:

\`\`\`c
// DANGEROUS METHOD: If realloc fails, 'arr' becomes NULL, leaking the original block!
arr = realloc(arr, new_size);

// SAFE METHOD: Use a temporary pointer
int *temp = realloc(arr, new_size);
if (temp != NULL) {
    arr = temp;
} else {
    // Handle error; 'arr' is still allocated and must be freed eventually
}
\`\`\`
* **Note:** \`realloc(NULL, size)\` behaves exactly like \`malloc(size)\`. \`realloc(ptr, 0)\` behaves like \`free(ptr)\` (returns \`NULL\`).

### Dynamic 2D Arrays
To create a dynamic 2D array, allocate an array of pointers (rows) and then allocate columns for each row pointer:

\`\`\`c
int rows = 3, cols = 4;
int **arr = (int**)malloc(rows * sizeof(int*));
for (int i = 0; i < rows; i++) {
    arr[i] = (int*)malloc(cols * sizeof(int));
}

// Access: arr[r][c]

// Freeing sequence: Free sub-arrays first, then the row array!
for (int i = 0; i < rows; i++) {
    free(arr[i]);
}
free(arr);
\`\`\`

### Memory Debugging (Valgrind)
Valgrind is a runtime analysis tool that monitors memory allocation behaviors to detect:
* **Memory Leaks:** Allocations that were never released using \`free()\`.
* **Invalid Reads/Writes:** Accessing arrays out-of-bounds or using pointers to freed zones.
* **Uninitialized value usage:** Performing computations using uninitialized memory values.

\`\`\`bash
# Compilation and Valgrind run command
gcc -Wall -g main.c -o app.exe
valgrind --leak-check=full ./app.exe
\`\`\`

> [!WARNING]
> **Memory Leaks**
> Memory allocated on the Heap remains allocated until it is explicitly released via \`free()\`. If a program continually allocates memory without freeing it, it will eventually exhaust all available system RAM, resulting in a crash. This is known as a **Memory Leak**.

### 🌍 Real-World Analogy
> - **\`malloc\`:** Renting dynamic memory is like **booking a hotel room**: you ask the desk for a room of a certain size.
> - **\`free\`:** This is like **checking out**: you hand back the key card so the hotel can clean the room and let someone else rent it.
> - **\`realloc\`:** This is like **asking for a room upgrade**: if the room next door is empty, they expand your room; if not, they move you to a new suite and transfer your bags automatically.
> - **Memory Leak:** This is like **forgetting to check out of your hotel room**: the room remains locked and empty, but the hotel cannot rent it out, eventually running out of rooms.
>
> **💼 Industry Application:** Dynamic databases (like SQLite) allocate variable-sized page blocks on the heap at runtime using memory allocation to store incoming database rows dynamically.

### Practice Questions
* **Question 13:** Explain the differences between \`malloc()\` and \`calloc()\` regarding parameters and memory initialization.
* **Question 14:** Write a safe C function to resize a dynamic integer array pointer and handle potential failures without creating memory leaks.

---

## 9. DSA 1: Linked Lists (Singly & Doubly Linked Lists)

A **Linked List** is a linear data structure consisting of dynamic **Nodes** connected by pointers. Unlike arrays, nodes are not stored contiguously in memory, meaning elements must be traversed sequentially ($O(n)$ search access).

### Singly Linked Lists (SLL)
Each node points to the next node in the sequence. The last node points to \`NULL\`.

\`\`\`
Head -> [Data | Next] -> [Data | Next] -> [Data | NULL]
\`\`\`

\`\`\`c
typedef struct Node {
    int data;
    struct Node *next; // Self-referential pointer
} Node;
\`\`\`

#### Insertion & Traversal Functions
To modify a list's head pointer inside a function, we must pass a **double pointer** (\`Node **head_ref\`) to edit the pointer value within the caller's scope:

\`\`\`c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

// Traversal Function
void print_list(Node *head) {
    Node *current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

// Insertion at Head (Modifies original head pointer)
void insert_at_head(Node **head_ref, int new_data) {
    Node *new_node = (Node*)malloc(sizeof(Node));
    new_node->data = new_data;
    new_node->next = *head_ref; // Point to old head
    *head_ref = new_node;       // Dereference and update head pointer
}
\`\`\`

#### Reversal Algorithm (Iterative)
To reverse a singly linked list in $O(n)$ time and $O(1)$ space, adjust node pointers using three trackers: \`prev\`, \`current\`, and \`next\`:

\`\`\`c
void reverse_list(Node **head_ref) {
    Node *prev = NULL;
    Node *current = *head_ref;
    Node *next = NULL;
    while (current != NULL) {
        next = current->next;    // Save next node link
        current->next = prev;    // Reverse current node's link
        prev = current;          // Move prev step forward
        current = next;          // Move current step forward
    }
    *head_ref = prev; // Update head pointer to new list root
}
\`\`\`

---

### Doubly Linked Lists (DLL)
Each node stores pointers to both the next and the previous node, allowing bidirectional traversal at the expense of extra memory overhead:

\`\`\`
NULL <- [Prev | Data | Next] <-> [Prev | Data | Next] -> NULL
\`\`\`

\`\`\`c
typedef struct DLLNode {
    int data;
    struct DLLNode *prev;
    struct DLLNode *next;
} DLLNode;
\`\`\`

### Circular Linked Lists
In a circular list, the last node's \`next\` pointer points back to the \`head\` node rather than \`NULL\`. Useful for round-robin scheduling algorithms.

> [!IMPORTANT]
> **List Cleanup Operations**
> When deleting a linked list, you cannot simply free the head node. If you do, you lose the references to all subsequent nodes in the list, creating a massive memory leak. You must traverse the list, saving the pointer to the next node before freeing the current node.

### 🌍 Real-World Analogy
> - **Singly Linked List:** A linked list is like a **treasure hunt**: each location contains a clue (pointer) leading to the next location.
> - **Doubly Linked List:** A doubly linked list is like a **two-way train**: passengers can walk forwards or backwards between connected carriages.
> - **Circular Linked List:** A circular list is like a **merry-go-round** where the last horse sits right behind the first one.
>
> **💼 Industry Application:** Operating systems use linked lists to schedule running threads and manage free memory blocks in list structures.

### Practice Questions
* **Question 15:** Write a function \`void delete_node(Node **head_ref, int key)\` that deletes the first node containing the value \`key\` from a singly linked list.
* **Question 16:** Write a function \`void reverse_list(Node **head_ref)\` that reverses a singly linked list in-place using an iterative three-pointer algorithm.

---

## 10. DSA 2: Stacks & Queues

### Stack (LIFO: Last-In, First-Out)
A Stack limits insertion and deletion operations to one end (called the **Top**). Think of it like a stack of plates.
* \`push\`: Insert an item onto the stack.
* \`pop\`: Remove and return the top item.
* \`peek\`: Return the top item without removing it.

#### Real-World Use Cases
* Recursion management (Call Stack).
* Syntax evaluation (balanced bracket checks).
* Undo/Redo buffers.

#### Stack Implementations: Array vs. Linked List
* **Array Stack:** Fixed maximum capacity, fast $O(1)$ operations, risk of **Stack Overflow**.
* **Linked List Stack:** Dynamic capacity, no stack overflow limits, but requires extra pointer overhead ($O(1)$ operations at the head of the list).

\`\`\`c
// Linked-List Stack Implementation
typedef struct StackNode {
    int data;
    struct StackNode *next;
} StackNode;

void push(StackNode **top, int val) {
    StackNode *new_node = malloc(sizeof(StackNode));
    new_node->data = val;
    new_node->next = *top;
    *top = new_node;
}

int pop(StackNode **top) {
    if (*top == NULL) return -1; // Stack Underflow
    StackNode *temp = *top;
    int popped = temp->data;
    *top = (*top)->next;
    free(temp);
    return popped;
}
\`\`\`

---

### Queue (FIFO: First-In, First-Out)
A Queue inserts new items at one end (the **Rear**) and removes items from the opposite end (the **Front**). Think of it like a line at a store.
* \`enqueue\`: Insert an item at the Rear.
* \`dequeue\`: Remove and return the item at the Front.

#### Real-World Use Cases
* CPU task scheduling (FCFS).
* Buffering data streams (Printer queues, network routers).
* Breadth-First Search (BFS) graph traversals.

#### Circular Queues
Queue operations implemented using standard arrays can leave unused space at the beginning of the array as elements are dequeued. To prevent this, **Circular Queues** wrap indexes back to the start using the modulo operator \`%\`:

\`\`\`c
#define SIZE 5
typedef struct {
    int arr[SIZE];
    int front, rear;
} CircularQueue;

void init_queue(CircularQueue *q) {
    q->front = q->rear = -1;
}

int is_full(CircularQueue *q) {
    return (q->front == (q->rear + 1) % SIZE);
}

int is_empty(CircularQueue *q) {
    return (q->front == -1);
}

void enqueue(CircularQueue *q, int val) {
    if (is_full(q)) {
        printf("Queue Full\\n");
        return;
    }
    if (q->front == -1) q->front = 0;
    q->rear = (q->rear + 1) % SIZE;
    q->arr[q->rear] = val;
}
\`\`\`

### 🌍 Real-World Analogy
> - **Stack (LIFO):** A stack is like a **stack of cafeteria trays**: you can only place a tray on the top (push), and you must take the top tray off first (pop).
> - **Queue (FIFO):** A queue is like a **line at a ticket counter**: the first person to stand in line is the first one served.
> - **Circular Queue:** This is like a **revolving door** at a hotel entrance: people enter and exit in a continuous loop without running out of doorway space.
>
> **💼 Industry Application:** Web browser navigation history uses a stack (clicking back pops the last page). Network routers use queues (packet buffers) to process incoming packets in order of arrival.

### Practice Questions
* **Question 17:** Write out structural pseudocode or a C implementation for an array-based stack containing helper check methods: \`is_full()\` and \`is_empty()\`.

---

## 11. DSA 3: Trees (Binary Search Trees & Self-Balancing Trees)

A Tree is a non-linear, hierarchical data structure. A **Binary Search Tree (BST)** enforces a structural ordering rule:
* The left subtree of a node contains only values **less than** the node's value.
* The right subtree of a node contains only values **greater than** the node's value.

\`\`\`
        50 (Root)
       /  \\
     30    70
    /  \\
   20  40
\`\`\`

### Node Representation & Insertion
\`\`\`c
#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int data;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

// Recursive BST Insertion
TreeNode* insert(TreeNode *root, int val) {
    if (root == NULL) {
        TreeNode *new_node = (TreeNode*)malloc(sizeof(TreeNode));
        new_node->data = val;
        new_node->left = new_node->right = NULL;
        return new_node;
    }
    if (val < root->data) {
        root->left = insert(root->left, val);
    } else if (val > root->data) {
        root->right = insert(root->right, val);
    }
    return root;
}
\`\`\`

### Tree Traversals (Depth-First Search)
There are three standard depth-first methods to traverse a tree recursively:
1. **Pre-Order:** Visit Root $\\rightarrow$ Left Subtree $\\rightarrow$ Right Subtree.
2. **In-Order:** Visit Left Subtree $\\rightarrow$ Root $\\rightarrow$ Right Subtree.
3. **Post-Order:** Visit Left Subtree $\\rightarrow$ Right Subtree $\\rightarrow$ Root.

\`\`\`c
void inorder(TreeNode *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}
\`\`\`

> [!IMPORTANT]
> **In-Order Traversal Sorting Property**
> An **In-Order** traversal of a Binary Search Tree (BST) will visit nodes in **sorted, ascending order**.

### BST Deletion Algorithm
Deleting a node from a BST requires handling three scenarios:
1. **Node is a Leaf:** Delete the node and set its parent pointer to \`NULL\`.
2. **Node has One Child:** Copy the child to the node, then delete the child.
3. **Node has Two Children:** Find the **In-Order Successor** (smallest value in the right subtree), copy its value to the node, and delete the In-Order Successor.

\`\`\`c
TreeNode* find_min(TreeNode *root) {
    while (root->left != NULL) root = root->left;
    return root;
}

TreeNode* delete_node(TreeNode* root, int key) {
    if (root == NULL) return root;
    
    if (key < root->data) {
        root->left = delete_node(root->left, key);
    } else if (key > root->data) {
        root->right = delete_node(root->right, key);
    } else { // Found the node
        if (root->left == NULL) {
            TreeNode *temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            TreeNode *temp = root->left;
            free(root);
            return temp;
        }
        // Node with two children
        TreeNode* temp = find_min(root->right);
        root->data = temp->data;
        root->right = delete_node(root->right, temp->data);
    }
    return root;
}
\`\`\`

### Tree Height Calculation
The height of a tree is the length of the longest path from the root to a leaf node:

\`\`\`c
int get_height(TreeNode *root) {
    if (root == NULL) return -1; // Height of empty tree is -1
    int left_h = get_height(root->left);
    int right_h = get_height(root->right);
    return (left_h > right_h ? left_h : right_h) + 1;
}
\`\`\`

### Self-Balancing Trees (AVL Trees)
Standard BSTs can skew into linear lists ($O(n)$ search time) if values are inserted in sorted order. **AVL Trees** solve this by enforcing a balance constraint: the height difference between the left and right subtrees (the **Balance Factor**) of any node must be at most **1**.
* **Rotations:** AVL trees perform single (L, R) or double (LR, RL) rotations to rebalance themselves during insertions and deletions, guaranteeing $O(\\log n)$ search, insertion, and deletion times.

### 🌍 Real-World Analogy
> - **Binary Search Tree (BST):** A BST is like looking up a word in a **physical dictionary**: you open it in the middle, and if your word is alphabetically smaller, you look left; if larger, you look right.
> - **AVL Tree:** An AVL tree is like a **self-balancing bookshelf**: if one side gets too heavy with books, the shelf performs a quick rotation to distribute the weight evenly, preventing it from tipping over.
>
> **💼 Industry Application:** Database indexing structures (B-trees, AVL trees) are used in SQL databases (like MySQL and PostgreSQL) to perform query searches in $O(\\log n)$ time.

### Practice Questions
* **Question 18:** Write recursive traversal functions for both \`preorder()\` and \`postorder()\` methods.

---

## 12. Algorithms: Sorting & Searching

Algorithms define step-by-step instructions for solving problems.

### Sorting Algorithms
* **Bubble Sort:** Iteratively compares adjacent elements and swaps them if they are in the wrong order.
  * Time Complexity: $O(n^2)$ Average/Worst. Space: $O(1)$.
* **Selection Sort:** Divides the array into sorted and unsorted regions, repeatedly finding the minimum element in the unsorted region and swapping it with the first unsorted element.
  * Time Complexity: $O(n^2)$ Average/Worst. Space: $O(1)$. Unstable.
* **Insertion Sort:** Iteratively inserts elements from the unsorted region into their correct sorted position.
  * Time Complexity: $O(n^2)$ Average/Worst, $O(n)$ Best (sorted list). Space: $O(1)$. Stable.
* **Merge Sort:** A divide-and-conquer algorithm. It divides the array in half, recursively sorts both halves, and merges the sorted halves.
  * Time Complexity: $O(n \\log n)$ all cases. Space: $O(n)$ (requires auxiliary merge array). Stable.
* **Quick Sort:** A divide-and-conquer algorithm. It selects a pivot element, partitions the array around the pivot, and recursively sorts the sub-arrays.
  * Time Complexity: $O(n \\log n)$ Average, $O(n^2)$ Worst-case (when pivot selection is poor). Space: $O(\\log n)$ call stack space. Unstable.

\`\`\`c
// Selection Sort Implementation
void selection_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}
\`\`\`

### Searching Algorithms
* **Linear Search:** Scans elements one by one from beginning to end.
  * Time Complexity: $O(n)$. Space: $O(1)$.
* **Binary Search:** A divide-and-conquer algorithm that repeatedly divides a sorted search range in half.
  * Time Complexity: $O(\\log n)$. Space: $O(1)$.

> [!IMPORTANT]
> **Binary Search Prerequisite**
> Binary Search **requires** that the target array be sorted. If the array is unsorted, Binary Search will fail to locate elements correctly.

\`\`\`c
// Binary Search Implementation
int binary_search(int arr[], int size, int target) {
    int low = 0, high = size - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents overflow: (low+high)/2 can overflow int
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Target not found
}
\`\`\`

### Sorting Algorithm Complexity & Stability
An algorithm is **stable** if it preserves the relative order of equal elements.

| Algorithm | Best Time | Average Time | Worst Time | Space Complexity | Stability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Unstable |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable |
| **Merge Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(n)$ | Stable |
| **Quick Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n^2)$ | $O(\\log n)$ | Unstable |

### 🌍 Real-World Analogy
> - **Bubble Sort:** This is like **sorting playing cards** by repeatedly comparing adjacent cards and swapping them until the largest cards float to the end like bubbles.
> - **Binary Search:** This is like playing the **higher/lower guessing game**: with every guess, you divide the search space in half.
> - **Sorting Stability:** Stability is like **maintaining alphabetical order among students who have the same grade score**: stable sorting keeps their original relative order.
>
> **💼 Industry Application:** Database query engines use Merge Sort to sort index keys stably, and Quick Sort to sort datasets in memory quickly when stability is not required.

### Practice Questions
* **Question 19:** Why is \`low + (high - low) / 2\` preferred over \`(low + high) / 2\` when calculating the middle index in Binary Search?
* **Question 20:** Fill in the complexity table comparing Bubble, Selection, Insertion, Merge, and Quick Sort regarding time complexities (Best, Avg, Worst), Space complexities, and Stability.

---
---

## 13. Answer Key & Explanations

### Section 1: Introduction to C & The Compilation Process
* **Answer 1:**
  * **Preprocessing:** Input: \`program.c\`. Output: Preprocessed source file (\`program.i\`). (Directives resolved, macros expanded).
  * **Compilation:** Input: \`program.i\`. Output: Assembly instructions (\`program.s\`). (C code converted to assembly code).
  * **Assembly:** Input: \`program.s\`. Output: Machine-code Object file (\`program.o\` or \`.obj\`). (Assembly converted to raw binary instructions).
  * **Linking:** Input: \`program.o\` and system libraries. Output: Executable file (\`program.exe\` or \`a.out\`). (References resolved, libraries merged).
* **Answer 2:**
  * A Makefile is a file containing commands and rules that the \`make\` utility executes to automate compiler building, compiling only modified files.
  * Simple Makefile:
    \`\`\`makefile
    CC = gcc
    CFLAGS = -Wall -g

    app.exe: main.o helper.o
    	$(CC) $(CFLAGS) -o app.exe main.o helper.o

    main.o: main.c
    	$(CC) $(CFLAGS) -c main.c

    helper.o: helper.c
    	$(CC) $(CFLAGS) -c helper.c

    clean:
    	rm -f *.o app.exe
    \`\`\`

### Section 2: Variables, Core Data Types & Memory Sizes
* **Answer 3:**
  * Both occupy 1 byte (8 bits) of memory, offering $2^8 = 256$ state combinations.
  * A \`signed char\` reserves 1 bit for the sign, yielding values from **-128 to 127**.
  * An \`unsigned char\` uses all 8 bits for the magnitude, yielding values from **0 to 255**.
* **Answer 4:**
  * The \`volatile\` qualifier tells the compiler that the value of the variable can be modified at any time outside the program's control.
  * This prevents the compiler from optimizing variable accesses by caching the value in a CPU register, forcing the CPU to fetch it directly from physical RAM every time. It is vital for hardware I/O programming (registers mapped to RAM addresses) where the value can change due to hardware activities.

### Section 3: Operators & Control Flow
* **Answer 5:**
  * Output: **\`x=6, y=5\`**
  * **Explanation:** Postfix increment (\`x++\`) assigns the current value of \`x\` to \`y\` first, and then increments \`x\`. Therefore, \`y\` receives the initial value \`5\`, and \`x\` is incremented to \`6\` immediately afterward.

### Section 4: Functions, Scopes & Parameter Passing
* **Answer 6:**
  * Output: **\`1 2 3 \`**
  * **Explanation:** Because \`count\` is declared as \`static\`, it is stored in the static Data segment instead of the stack. Its state is preserved across function calls, incrementing by 1 on each execution.
* **Answer 7:**
  * Declaration: \`double (*op)(double, double);\`
  * Call using the pointer (assuming \`op\` points to a function named \`multiply\`):
    \`\`\`c
    double result = op(5.5, 2.0); // or (*op)(5.5, 2.0)
    \`\`\`

### Section 5: Arrays & String Manipulation
* **Answer 8:**
  * Byte size of \`word\` is **\`11 bytes\`**.
  * \`strlen("C Language")\` returns **\`10\`** because it counts only the visible letters.
  * \`sizeof(word)\` returns **\`11\`** because it includes the hidden null-terminator character \`'\\0'\` that terminates the string in memory.

### Section 6: Pointers: Memory Addresses & Pointer Arithmetic
* **Answer 9:**
  * Output: **\`11 33 22\`**
  * **Explanation:**
    1. \`*p\` starts at index 0: \`11\`.
    2. \`p += 2\` shifts the pointer forward by two integer steps to index 2: \`33\`.
    3. \`*(p - 1)\` dereferences the element immediately preceding the current pointer location (index 1): \`22\`.
* **Answer 10:**
  1. \`const char *ptr;\`: Pointer to a constant character. The character value pointed to cannot be modified (read-only), but the pointer address itself can be reassigned to point elsewhere.
  2. \`char * const ptr;\`: Constant pointer to a character. The character value can be modified, but the pointer address is fixed and cannot be changed.

### Section 7: Structures, Unions & Typedef
* **Answer 11:**
  * Output: \`data.i\` will print a corrupted garbage value.
  * **Explanation:** In a union, all member variables share the same memory location. Setting \`data.f = 220.5\` overwrites the bytes previously allocated to \`data.i\`, corrupting the integer value.
* **Answer 12:**
  * The size of the struct is **24 bytes**. Due to member alignment boundaries:
    * \`char a\` (1 byte) + 3 bytes padding (to align \`int b\` on a 4-byte boundary)
    * \`int b\` (4 bytes)
    * \`char c\` (1 byte) + 7 bytes padding (to align \`double d\` on an 8-byte boundary)
    * \`double d\` (8 bytes)
    * Total: 1 + 3 + 4 + 1 + 7 + 8 = 24 bytes.
  * **Optimization:** Reorder members from largest to smallest to eliminate padding:
    \`\`\`c
    struct Record {
        double d; // 8 bytes
        int b;    // 4 bytes
        char a;   // 1 byte
        char c;   // 1 byte
        // 2 bytes padding at the end to align structure size to 8 bytes
    }; // Total: 16 bytes
    \`\`\`

### Section 8: Dynamic Memory Allocation (DMA)
* **Answer 13:**
  * **\`malloc(size_t size)\`** takes a single parameter (the total bytes to allocate). It leaves the allocated memory unit initialized with garbage data.
  * **\`calloc(size_t num, size_t size)\`** takes two parameters (element count and element byte size). It automatically initializes all allocated bytes to zero.
* **Answer 14:**
  * Safe \`realloc\` handling:
    \`\`\`c
    int* safe_resize(int *arr, int new_size) {
        int *temp = (int*)realloc(arr, new_size * sizeof(int));
        if (temp == NULL) {
            // Reallocation failed, original arr is still intact
            printf("Resize failed!\\n");
            return arr;
        }
        return temp; // Return resized pointer
    }
    \`\`\`

### Section 9: DSA 1: Linked Lists (Singly Linked Lists)
* **Answer 15:**
  \`\`\`c
  void delete_node(Node **head_ref, int key) {
      Node *temp = *head_ref, *prev = NULL;
      
      // If head node itself holds the key
      if (temp != NULL && temp->data == key) {
          *head_ref = temp->next; // Changed head
          free(temp);            // free old head
          return;
      }
      
      // Search for the key to be deleted
      while (temp != NULL && temp->data != key) {
          prev = temp;
          temp = temp->next;
      }
      
      // If key was not present in linked list
      if (temp == NULL) return;
      
      // Unlink the node from linked list
      prev->next = temp->next;
      free(temp); // Free memory
  }
  \`\`\`
* **Answer 16:**
  \`\`\`c
  void reverse_list(Node **head_ref) {
      Node *prev = NULL;
      Node *current = *head_ref;
      Node *next = NULL;
      while (current != NULL) {
          next = current->next;    // Store next node link
          current->next = prev;    // Reverse current node pointer link
          prev = current;          // Move prev step forward
          current = next;          // Move current step forward
      }
      *head_ref = prev; // Update head reference pointer to new root
  }
  \`\`\`

### Section 10: DSA 2: Stacks & Queues
* **Answer 17:**
  \`\`\`c
  #include <stdio.h>
  #include <stdbool.h>
  #define MAX 5

  typedef struct {
      int arr[MAX];
      int top;
  } Stack;

  void init(Stack *s) { s->top = -1; }
  bool is_full(Stack *s) { return s->top == MAX - 1; }
  bool is_empty(Stack *s) { return s->top == -1; }

  void push(Stack *s, int val) {
      if (is_full(s)) {
          printf("Stack Overflow\\n");
          return;
      }
      s->arr[++(s->top)] = val;
  }

  int pop(Stack *s) {
      if (is_empty(s)) {
          printf("Stack Underflow\\n");
          return -1;
      }
      return s->arr[(s->top)--];
  }
  \`\`\`

### Section 11: DSA 3: Trees (Binary Search Trees)
* **Answer 18:**
  \`\`\`c
  // Pre-Order: Root -> Left -> Right
  void preorder(TreeNode *root) {
      if (root != NULL) {
          printf("%d ", root->data);
          preorder(root->left);
          preorder(root->right);
      }
  }

  // Post-Order: Left -> Right -> Root
  void postorder(TreeNode *root) {
      if (root != NULL) {
          postorder(root->left);
          postorder(root->right);
          printf("%d ", root->data);
      }
  }
  \`\`\`

### Section 12: Algorithms: Sorting & Searching
* **Answer 19:**
  * In systems with memory constraints, if variables \`low\` and \`high\` contain large integer values near the datatype limit, calculating \`(low + high)\` can exceed the maximum capacity of a signed integer, causing integer overflow.
  * Calculating mid-point index as \`low + (high - low) / 2\` mathematically achieves the identical value without ever exceeding the bound threshold of \`high\`, preventing overflow errors.
* **Answer 20:**
  * The completed sorting algorithm table is:
    * Bubble Sort: Best $O(n)$, Avg $O(n^2)$, Worst $O(n^2)$, Space $O(1)$, Stable.
    * Selection Sort: Best $O(n^2)$, Avg $O(n^2)$, Worst $O(n^2)$, Space $O(1)$, Unstable.
    * Insertion Sort: Best $O(n)$, Avg $O(n^2)$, Worst $O(n^2)$, Space $O(1)$, Stable.
    * Merge Sort: Best $O(n \\log n)$, Avg $O(n \\log n)$, Worst $O(n \\log n)$, Space $O(n)$, Stable.
    * Quick Sort: Best $O(n \\log n)$, Avg $O(n \\log n)$, Worst $O(n^2)$, Space $O(\\log n)$, Unstable.

---

## Made by NotAryanSinha
*(Created with care for your programming journey!)*
`
};
