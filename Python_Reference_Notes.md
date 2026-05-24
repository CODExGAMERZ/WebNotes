# Python Complete Reference Notes: An Expansive Guide for Beginners

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

Python is an interpreted, high-level, dynamically typed language created by Guido van Rossum. Its design philosophy emphasizes readability, minimalism, and expressive power—often summarized in **"The Zen of Python"** (type `import this` in a Python terminal to read it).

### Execution Model
Unlike fully compiled languages (like C++ or Rust) where source code is compiled directly into machine-readable binary code before execution, Python uses an **interpreter**. 
1. Source code is first compiled into intermediate **Bytecode** (stored in `.pyc` files in a `__pycache__` directory).
2. This bytecode is then executed line-by-line by the **Python Virtual Machine (PVM)**.

### CPython vs. PyPy
* **CPython**: The reference implementation of Python, written in C. It compiles Python code to bytecode and executes it in an interpreter. It is the default implementation you download from python.org.
* **PyPy**: An alternative implementation of Python written in RPython. It uses a **Just-In-Time (JIT) compiler** that compiles frequently executed bytecode into native machine code at runtime. PyPy often runs CPU-bound programs significantly faster than CPython.

> [!NOTE]
> **The Global Interpreter Lock (GIL)**
> In CPython, the GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once. This lock is necessary because CPython's memory management is not thread-safe. As a result, multi-threaded Python programs cannot utilize multiple CPU cores for CPU-bound tasks (you must use the `multiprocessing` module instead).

> [!NOTE]
> **The Indentation Rule**
> Python does not use curly braces `{}` or keywords (like `begin` and `end`) to define blocks of code. Instead, it relies on whitespace **indentation**. The standard is **4 spaces** per indentation level. Mixing tabs and spaces, or failing to maintain consistent indentation, will trigger an `IndentationError`.

### 🌍 Real-World Analogy
> Think of C++ compilation like **translating an entire book into Japanese** before anyone can read it — the whole book must be finished first. Python's interpreter, by contrast, is like a **live simultaneous translator** at a UN conference: it listens to one sentence at a time and translates on the fly. The CPython vs. PyPy distinction is similar: CPython is a careful human translator (accurate but methodical), while PyPy is like an AI translator that **memorizes frequently repeated phrases** (JIT-compiling hot code paths) to deliver them instantly the next time they appear.

> **💼 Industry Application:** Python powers some of the world's largest platforms. **Instagram** runs on Python/Django to serve billions of requests. **Spotify** uses Python for backend services and data analysis. **Netflix** uses it for recommendation engine pipelines. Its interpreted nature allows rapid prototyping — engineers ship features faster because they skip the compile-wait-run cycle.

### ⌨️ Developer Productivity Shortcuts (VS Code & PyCharm)
To write Python code efficiently in popular IDEs like VS Code or PyCharm, master these essential keyboard shortcuts:

| Action | VS Code Shortcut | PyCharm Shortcut |
| :--- | :--- | :--- |
| **Run Code** | `Ctrl + F5` (or click play) | `Shift + F10` |
| **Debug Code** | `F5` | `Shift + F9` |
| **Toggle Comment** | `Ctrl + /` (Windows/Linux) or `Cmd + /` (macOS) | `Ctrl + /` or `Cmd + /` |
| **Format Document** | `Alt + Shift + F` (runs Black/Ruff formatter) | `Ctrl + Alt + L` |
| **Go to Definition** | `F12` or `Ctrl + Click` | `Ctrl + B` or `Ctrl + Click` |
| **Rename Symbol** | `F2` (renames all variables/functions safely) | `Shift + F6` |
| **Run Selection in REPL** | `Shift + Enter` (opens interactive window) | `Alt + Shift + E` |
| **Command Palette** | `Ctrl + Shift + P` | `Double Shift` (Search Everywhere) |

### Practice Questions
* **Question 1:** Explain what happens behind the scenes when you run a Python script, detailing the role of Bytecode and the Python Virtual Machine (PVM).
* **Question 2:** What is the primary difference between CPython and PyPy in terms of code execution, and how does the GIL affect multi-threaded programs in CPython?

---

## 2. Variables, Dynamic Typing & Core Datatypes

### Variables as Pointers
In Python, variables are not labeled "boxes" that lock data inside a specific type. Instead, variables are **labels or pointers** that reference actual objects stored in system memory.

#### Syntax
```python
variable_name = object_value
```

### Dynamic Typing
Dynamic typing means Python checks the datatype of the object at runtime, rather than at compile time. You can assign an integer to a variable, and later assign a string to that same variable name.

```python
x = 42            # x references an integer object
x = "Hello World" # x now references a string object. The integer 42 is orphaned and cleared by Python's Garbage Collector.
```

> [!NOTE]
> **Garbage Collection (Reference Counting & Cycle Detection)**
> Python automatically manages memory. Each object tracks how many variables are referencing it (reference count). When an object's reference count drops to 0, Python's garbage collector deletes it immediately. Python also features a cyclic garbage collector to detect and clean up reference cycles (e.g., Object A points to Object B, and Object B points to Object A, but neither is accessible from global/local variables).

### Core Datatypes
1. **Integers (`int`)**: Whole numbers of arbitrary precision (limited only by your computer's RAM).
2. **Floats (`float`)**: Decimal numbers implemented using double-precision C doubles (64-bit).
3. **Strings (`str`)**: Immutable sequences of Unicode characters.
4. **Booleans (`bool`)**: Logical subclasses of integers (`True` is equivalent to `1`, `False` is equivalent to `0`).
5. **NoneType (`None`)**: A special singleton representing "null" or the absence of value.

```python
# Declaration & Type Inspection
age = 30                    # int
gpa = 3.85                  # float
first_name = "Charlie"       # str
has_graduated = True        # bool
middle_name = None          # NoneType

print(type(age))            # Output: <class 'int'>
```

> [!NOTE]
> **String Interning**
> As an optimization, Python caches (interns) short strings (e.g., strings matching variable identifier naming rules) and small integers (between -5 and 256) in a global pool. If you create two separate variables with the same value, they will point to the exact same object in memory, saving space.

### Type Annotations / Hints
Introduced in Python 3.5, type hints allow you to declare the expected types of variables, arguments, and return values. Type hints are ignored by Python at runtime, but static analysis tools (like `mypy`) use them to identify bugs.

```python
age_annotation: int = 25
name_annotation: str = "Alice"
```

### The `id()` Function
The built-in `id()` function returns the unique integer identity of an object. In CPython, this number corresponds to the object's physical address in RAM.

```python
a = 250
b = 250
print(id(a) == id(b))  # True (due to small integer interning caching)
```

> [!IMPORTANT]
> **Understanding None**
> `None` is a distinct data type and **not** equal to `0`, `False`, or an empty string `""`. It is commonly used as a default return value for functions that perform actions without returning data, or as placeholder default values in parameters.

### 🌍 Real-World Analogy
> Imagine an **airport baggage carousel**. Each suitcase (object) sits on the carousel (memory). A **variable** is just a **name tag** tied to a suitcase — it doesn't contain the suitcase, it just tells you which one is yours. Dynamic typing means you can untie your name tag from a suitcase and re-tie it to a completely different one (from a backpack to a guitar case). **Garbage collection** is like an airport cleaning crew: once a suitcase has zero name tags attached (no variable references), the crew removes it to make space. **String interning** is the airline's efficiency trick: if ten passengers all carry identical bags, the airline stores only one bag and gives everyone a tag pointing to the same one.

> **💼 Industry Application:** Dynamic typing makes Python the dominant language for **data science** (NumPy, pandas) — analysts can quickly reassign variables to different data structures without rigid type declarations. In **web development** (Django, Flask), Python's flexible typing allows rapid API prototyping where response shapes evolve frequently during development.

### Practice Questions
* **Question 3:** Predict the data type and value resulting from:
  1. `3.0 + 5`
  2. `bool("False")`
  3. `bool("")`
* **Question 4:** Explain string interning in Python. How does the `id()` function help us verify if string interning has occurred? Write a short code sample.

---

## 3. Operators & Logical Expressions

Operators allow you to combine, evaluate, and transform data objects.

### Arithmetic Operators
* `+` Addition, `-` Subtraction, `*` Multiplication.
* `/` Float Division: Always returns a float (e.g., `4 / 2` evaluates to `2.0`).
* `//` Floor Division: Performs division and rounds down to the nearest whole integer (e.g., `5 // 2` is `2`).
* `%` Modulo: Divides numbers and returns only the remainder (e.g., `5 % 2` is `1`).
* `**` Exponentiation: Raises the base to the power of the exponent (e.g., `2 ** 3` is `8`).

### Comparison Operators
All comparison operators evaluate to either `True` or `False`.
* `==` Value Equality, `!=` Value Inequality.
* `>`, `<`, `>=`, `<=` Greater than, Less than, Greater or equal, Less or equal.

> [!IMPORTANT]
> **Equality (`==`) vs. Identity (`is`)**
> * `==` checks if the **values** of the two objects are equal.
> * `is` checks if two variables point to the **exact same location in memory** (i.e., they are the same object).
> ```python
> list_a = [1, 2, 3]
> list_b = [1, 2, 3]
> print(list_a == list_b) # True (values match)
> print(list_a is list_b) # False (stored in different memory addresses)
> ```

### Logical Operators
Used to combine conditional statements:
* `and`: Evaluates to `True` only if both statements are `True`.
* `or`: Evaluates to `True` if at least one statement is `True`.
* `not`: Reverses the boolean state of the expression.

> [!NOTE]
> **Short-Circuit Evaluation**
> Python evaluates logical statements lazily. In an `and` statement, if the first operand is `False`, the second operand is skipped entirely. In an `or` statement, if the first operand is `True`, the second operand is skipped.

### The Walrus Operator (`:=`)
Introduced in Python 3.8, the assignment expression operator (walrus operator) allows you to assign values to variables inside larger expressions.

```python
# Instead of:
# line = file.readline()
# while line:
#     ...
#     line = file.readline()

# You can do:
# while (line := file.readline()):
#     ...
```

### Ternary Conditional Expressions
Python supports an inline conditional expression that returns one of two values depending on a boolean condition:
```python
x = "Passed" if score >= 50 else "Failed"
```

### Operator Precedence Table
Below is the order in which operators are evaluated (from highest precedence at the top to lowest precedence at the bottom):

| Precedence | Operator | Description |
| :--- | :--- | :--- |
| 1 | `()` | Parentheses (grouping) |
| 2 | `**` | Exponentiation |
| 3 | `+x`, `-x`, `~x` | Unary positive, negative, bitwise NOT |
| 4 | `*`, `/`, `//`, `%` | Multiplication, division, floor division, remainder |
| 5 | `+`, `-` | Addition, subtraction |
| 6 | `<<`, `>>` | Bitwise shifts |
| 7 | `&` | Bitwise AND |
| 8 | `^` | Bitwise XOR |
| 9 | `\|` | Bitwise OR |
| 10 | `in`, `not in`, `is`, `is not`, `<`, `<=`, `>`, `>=`, `!=`, `==` | Comparisons, identity, membership |
| 11 | `not` | Logical NOT |
| 12 | `and` | Logical AND |
| 13 | `or` | Logical OR |
| 14 | `:=` | Walrus operator (assignment expression) |

### Membership Operators
* `in` and `not in`: Check if an item exists within a sequence (string, list, tuple, etc.).
```python
letters = "python"
print("y" in letters)  # True
print("z" not in letters) # True
```

### 🌍 Real-World Analogy
> **Operator precedence** follows the same logic as the **BODMAS/PEMDAS** rules from math class — multiplication happens before addition unless parentheses override the order. **Short-circuit evaluation** works like a **nightclub bouncer**: with `and`, if the first person in a group fails the ID check, the bouncer rejects the entire group immediately without checking anyone else. With `or`, if the first person passes, the bouncer waves the whole group through. The **walrus operator** (`:=`) is like a **drive-through window**: you simultaneously name your order ("combo #3") and receive it in one step, instead of ordering first and waiting at a second window.

> **💼 Industry Application:** Short-circuit evaluation is critical in **form validation** for web apps: `if username and len(username) > 3:` — Python skips the `len()` check entirely if `username` is empty, preventing a crash. **Ternary expressions** are heavily used in **template rendering** (Jinja2) to conditionally display content: `{{ "Active" if user.is_active else "Inactive" }}`.

### Practice Questions
* **Question 5:** What is the output of the following boolean expression?
  `result = (10 // 3 == 3.0) and (not (5 == 5.0) or ("p" in "apple"))`

---

## 4. Input, Output & Type Casting

### Standard Output (`print`)
The `print()` function takes zero or more expressions, converts them to strings, and writes them to standard output.

#### Syntax
```python
print(*objects, sep=' ', end='\n')
```
* `*objects`: Any number of values separated by commas.
* `sep`: The character placed between objects (default is a space `' '`).
* `end`: The character appended at the very end of the output (default is a newline `'\n'`).

```python
print("Hello", "World", sep="*", end="!!!\n") # Outputs: Hello*World!!!
```

### Standard Input (`input`)
The `input()` function prompts the user to enter data via the keyboard and halts execution until the Enter key is pressed.

> [!WARNING]
> **The Input Type Trap**
> `input()` **always** returns the user's input as a string (`str`). If you need to perform numerical calculations, you must explicitly cast it to a numerical type (like `int()` or `float()`). Failing to do so will result in logical bugs or a `TypeError`.
> ```python
> raw_age = input("Enter age: ") # User types: 20
> age = int(raw_age)             # Casts string "20" to integer 20
> ```

### String Formatting Options

#### 1. F-Strings (Formatted String Literals - Recommended)
Introduced in Python 3.6, f-strings provide a concise and readable way to embed formatting expressions inside strings.
```python
name = "Bob"
salary = 1250.756
print(f"Employee {name} earns ${salary:.2f} per month.") 
```

#### 2. The `str.format()` Method
```python
print("Employee {} earns {:.2f} per month.".format(name, salary))
print("Employee {n} earns {s:.2f} per month.".format(n=name, s=salary))
```

#### 3. C-Style `%` Formatting (Legacy)
```python
print("Employee %s earns %.2f per month." % (name, salary))
```

### 🌍 Real-World Analogy
> The `input()` function is like a **waiter taking your order** at a restaurant — no matter whether you say "two" or "2", the waiter writes it down as text on a notepad. If the kitchen (your program) needs a number to cook the right quantity, you must explicitly tell the waiter to convert the text into a number (`int()` cast). **F-strings** work like a **fill-in-the-blank Mad Libs game**: you write the sentence structure with blank slots `{}`, and Python fills in the values at runtime. The three formatting methods (f-strings, `.format()`, `%`) are like three generations of form-filling: handwritten carbon copies (% formatting), typed templates (.format()), and auto-populating smart forms (f-strings).

> **💼 Industry Application:** Command-line tools like `pip`, `git`, and `docker` all use `input()` for interactive prompts. **Logging systems** in production servers rely on f-strings for structured log messages: `logger.info(f"User {user_id} purchased {item_name} for ${price:.2f}")`. Data export scripts use f-string formatting to generate CSV and report files with precisely formatted numeric columns.

### Practice Questions
* **Question 6:** Write a script that prompts the user to enter their birth year, calculates their approximate current age (using hardcoded current year 2026), and prints: `"You are X years old."` where X is the calculation. Handle potential type mismatch crashes.

---

## 5. Control Flow: Decisions & Repetitions

### Conditionals (`if`, `elif`, `else`)
Executes blocks of code selectively based on boolean conditions.

```python
score = 82

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

### Structural Pattern Matching (`match-case`)
Introduced in Python 3.10, `match-case` provides powerful pattern matching capabilities similar to switch statements in other languages, but with structured destructuring support.

```python
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
```

### Loops
* `while` loop: Executes continuously as long as its condition remains `True`.
* `for` loop: Iterates over a sequence (such as a string, list, tuple, dict, or generated range).

#### Loop Control Keywords
* `break`: Terminate the loop immediately.
* `continue`: Skip the rest of the current iteration block and jump directly to the evaluation of the next iteration cycle.
* `pass`: A syntactical placeholder that does nothing.

#### Loop `else` Clause
Both `for` and `while` loops can have an optional `else` block. The `else` block is executed when the loop finishes iterating normally (i.e., it is **not** terminated by a `break` statement).

```python
for x in range(3):
    print(x)
else:
    print("Loop finished without break")
```

### Common Iteration Helpers
* `range(start, stop, step)`: Generates an exclusive sequence of integers.
* `enumerate(sequence, start=0)`: Yields tuples of (index, value).
* `zip(*iterables)`: Interleaves items from multiple iterables parallelly.

### 🌍 Real-World Analogy
> - An `if-elif-else` conditional control flow acts like a **traffic signal**: it directs traffic down exactly one path depending on which light is active.
> - A `for` loop is like a **factory assembly line conveyor belt**: it processes a fixed sequence of items, one by one, performing the same operations on each.
> - A `match-case` block is like a **vending machine**: it matches your selection against precise slot numbers and dispenses the exact item selected (with a default fallback block `case _` representing an invalid selection).
>
> **💼 Industry Application:** Web servers route user requests based on control flow: `if path == "/home": ... elif path == "/login": ... else: ...`. Data processing libraries iterate over database rows using `for` loops to generate bulk analytical reports. Modern API gateways use structural pattern matching to route payload structures depending on their fields.

### Practice Questions
* **Question 7:** What is printed by the following code snippet?
  ```python
  for num in range(1, 6):
      if num == 3:
          continue
      if num == 5:
          break
      print(num, end="-")
  ```
* **Question 8:** Write a code snippet that iterates over a list of integers using a `for` loop. If an even number is found, print `"Found even number X"` and terminate the loop. If the loop completes without finding any even number, print `"No even number found"` using a loop `else` block.

---

## 6. Core Data Structures (Collections)

Python features four built-in collections.

| Collection Type | Ordered? | Mutable? | Unique Elements Only? | Syntax |
| :--- | :--- | :--- | :--- | :--- |
| **List** | Yes | Yes | No | `[item1, item2]` |
| **Tuple** | Yes | No | No | `(item1, item2)` |
| **Dictionary**| Yes (3.7+) | Yes | Yes (Keys only) | `{"key": "value"}`|
| **Set** | No | Yes | Yes | `{item1, item2}` |

---

### 1. Lists (`list`)
A mutable, ordered array of elements.

#### Core Operations
* `append(x)`: Adds `x` to the end.
* `insert(index, x)`: Places `x` at a specific index.
* `pop(index)`: Removes and returns the item at index.
* `remove(x)`: Deletes the first instance of value `x`.
* **Slicing:** `list[start:stop:step]` returns a shallow copy of a slice of the list.

```python
nums = [10, 20, 30, 40]
nums.append(50)      # [10, 20, 30, 40, 50]
nums.pop(0)          # Removes 10, returns 10
slice_a = nums[1:3]  # Indexes 1 and 2: [30, 40]
```

> [!WARNING]
> **The Mutability Assignment Trap**
> Assigning a list to a new variable (e.g., `list_b = list_a`) copies the reference pointer, not the list. Modifying `list_b` will alter `list_a`! Use `list_b = list_a.copy()` or `list_b = list_a[:]` to clone lists.

---

### 2. Double-Ended Queue (`collections.deque`)
Lists in Python are efficient for $O(1)$ operations at the end, but inserting or popping from the beginning is $O(n)$ because all other elements must be shifted in memory. `deque` allows $O(1)$ appends and pops from both ends.

```python
from collections import deque
queue = deque([2, 3, 4])
queue.appendleft(1)   # O(1) insertion at head: deque([1, 2, 3, 4])
queue.popleft()       # O(1) removal from head: 1
```

---

### 3. Tuples (`tuple`) & Named Tuples
Ordered, **immutable** records. Once instantiated, they cannot be modified.

```python
point = (4, 5)
```

> [!NOTE]
> **Tuple containing Mutables**
> If a tuple contains a mutable object, such as a list, the elements inside that list can still be modified!
> ```python
> my_tuple = (1, 2, [3, 4])
> my_tuple[2].append(5) # Valid! Result: (1, 2, [3, 4, 5])
> ```

#### Named Tuples (`collections.namedtuple`)
Provides tuple readability by allowing elements to be accessed by name as well as index.

```python
from collections import namedtuple
Point2D = namedtuple('Point2D', ['x', 'y'])
pt = Point2D(10, 20)
print(pt.x, pt.y) # Access by field name: 10 20
```

---

### 4. Dictionaries (`dict`)
An associative mapping of unique keys to values.

#### Core Operations
* `dict[key] = value`: Assigns/updates a key-value mapping.
* `dict[key]`: Fetches value. Raises `KeyError` if key does not exist.
* `get(key, default_value)`: Safe retrieval. Returns `default_value` if key is missing instead of throwing a KeyError.
* **Dictionary Merge Operator (`|`)**: Added in Python 3.9, combines two dicts into a new one.
* **Dictionary Update Operator (`|=`)**: Updates a dictionary in-place.

```python
dict_a = {'a': 1, 'b': 2}
dict_b = {'b': 99, 'c': 3}
merged = dict_a | dict_b  # {'a': 1, 'b': 99, 'c': 3}
```

> [!IMPORTANT]
> **Dictionary Key Hashability**
> Only **immutable** and hashable data types can be used as dictionary keys. Lists and dictionaries are mutable, therefore unhashable, and will raise a `TypeError` if used as keys.

---

### 5. Sets (`set`) & Frozen Sets (`frozenset`)
Unordered collections containing unique values.

#### Core Operations
* `add(x)`: Inserts element `x`.
* Math operations: Union (`|`), Intersection (`&`), Difference (`-`).

#### Frozen Sets (`frozenset`)
A `frozenset` is an immutable version of a `set`. Since it is immutable, it is hashable, meaning a `frozenset` can be used as a dictionary key or an element in another set.

```python
frozen = frozenset([1, 2, 3])
# frozen.add(4) # AttributeError (immutable!)
```

> [!NOTE]
> **Lookup Performance**
> Checking membership (`x in collection`) is an $O(1)$ constant time operation in Sets and Dictionaries because they use hash tables. In Lists and Tuples, it is an $O(n)$ linear time operation.

### 🌍 Real-World Analogy
> - A **list** is like a **grocery shopping list**: it keeps items in the order you write them, you can add duplicates, and you can cross off or insert items anywhere.
> - A **dictionary** is like a **phone contacts book**: you look up a person's unique name (key) to instantly find their phone number (value).
> - A **set** is like a **unique stamp collection**: you cannot have duplicates, and the order they sit in the album doesn't matter, but you can instantly check if you own a specific stamp.
> - A **deque** is like a **double-ended line at a ticket counter** where people can join or leave from both the front and the back.
>
> **💼 Industry Application:** E-commerce platforms use lists to maintain a user's shopping cart. Cache systems (like Redis) use dictionary key-value lookups for instant database queries. Tracking unique visitor IP addresses or removing duplicate logs is typically done using sets for high-performance $O(1)$ validation.

### Practice Questions
* **Question 9:** What will be the outputs of `print(x)` and `print(y)` at the end of this code block?
  ```python
  x = [1, 2, [3, 4]]
  y = x.copy()
  y[0] = 99
  y[2].append(5)
  ```
* **Question 10:** Explain why `my_dict = {[1, 2]: "value"}` throws an error, while `my_dict = {(1, 2): "value"}` does not.

---

## 7. Functions, Arguments & Variable Scope

Functions package reusable chunks of computational logic.

### Parameter Passing
* **Positional Arguments:** Matched to parameters by placement order.
* **Keyword Arguments:** Matched by parameter name.
* **Default Values:** Fallback values used if the argument is omitted.
* **Arbitrary positional arguments (`*args`)**: Bundles extra positional arguments into a tuple.
* **Arbitrary keyword arguments (`**kwargs`)**: Bundles extra keyword arguments into a dictionary.

```python
def order_food(customer, *items, **metadata):
    print(f"Customer: {customer}")
    print(f"Dishes: {items}")
    print(f"Details: {metadata}")
```

> [!WARNING]
> **The Mutable Default Argument Gotcha**
> Python creates default argument values **only once** at the time the function is defined, not every time the function runs. If you use a mutable object (like a list) as a default argument, all future calls will share and modify the exact same object! Use `None` as default and initialize inside the function.

### Type Hints in Functions
Function signatures can have type hints for parameters and the return value:
```python
def add_numbers(a: int, b: int) -> int:
    return a + b
```

### Docstring Best Practices
Write clear documentation for your functions inside triple quotes (`"""`). PEP 257 outlines docstring standards:
```python
def calculate_area(width: float, height: float) -> float:
    """Calculate the area of a rectangle.
    
    Args:
        width: The width of the rectangle.
        height: The height of the rectangle.
        
    Returns:
        The computed area as a float.
    """
    return width * height
```

---

### Scope Rules (LEGB Rule)
Scope determines where variables can be accessed. When looking up a variable name, Python searches memory levels in order:
1. **L - Local:** Inside the currently running function.
2. **E - Enclosing:** Inside enclosing outer nested functions (non-local).
3. **G - Global:** Module level (defined outside any functions).
4. **B - Built-in:** Built-in Python keywords/functions (like `len`, `int`, etc.).

To modify a global variable inside a local scope, you must use the `global` keyword. To modify an enclosing variable inside a nested scope, use the `nonlocal` keyword.

```python
counter = 0 # Global

def increment():
    global counter
    counter += 1 # Modifies the global variable
```

---

### Lambda (Anonymous) Functions
Inline, single-expression anonymous functions.
```python
multiply = lambda x, y: x * y
print(multiply(2, 4)) # 8
```

### Useful `functools` Utilities
* `functools.partial`: Freezes a portion of a function's arguments to create a new signature.
* `functools.lru_cache`: A decorator that wraps a function with a Least Recently Used (LRU) cache, memoizing return values to speed up repeated calls with the same arguments.

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
```

### 🌍 Real-World Analogy
> - A **function** is like a **kitchen recipe card**: it takes ingredients (arguments), performs a sequence of cooking steps, and outputs a meal (return value).
> - `*args` and `**kwargs` are like ordering a **customizable pizza**: `*args` lets you list any number of toppings ("mushrooms", "peppers", "olives"), and `**kwargs` allows you to specify custom instructions (`extra_cheese=True`, `crust="thin"`).
> - `functools.lru_cache` (memoization) is like a **chef using a prep table**: instead of chopping fresh onions every single time a recipe calls for them, the chef chops a big batch once and grabs them from the prep table whenever needed.
>
> **💼 Industry Application:** Serverless architectures (AWS Lambda, Google Cloud Functions) execute microservice logic using isolated functions. API endpoints handle arbitrary incoming JSON payloads using `**kwargs` to process dynamic user filters. Finance and heavy-calculating microservices use LRU caching to cache complex calculations.

### Practice Questions
* **Question 11:** What is the output of the two print statements in this code?
  ```python
  def build_list(val, collection=[]):
      collection.append(val)
      return collection

  first = build_list(1)
  second = build_list(2)
  print(f"First: {first}")
  print(f"Second: {second}")
  ```
* **Question 12:** Use `functools.lru_cache` to write a recursive Fibonacci function. Explain how memoization improves the time complexity of this function from exponential to linear.

---

## 8. Object-Oriented Programming (OOP)

OOP is a development paradigm that groups state (attributes) and behavior (methods) into cohesive objects.

### Classes, Objects, and Constructors
* **Class:** The structural blueprint (e.g., class `Dog`).
* **Object / Instance:** A concrete realization of the blueprint.
* **Constructor (`__init__`):** Initialization method executed automatically on instantiation.
* **`self`:** References the current object instance calling the method.

```python
class Dog:
    def __init__(self, name):
        self.name = name
```

### `__str__` vs. `__repr__`
* `__str__` is intended to return a user-friendly, readable string representation of an object (called by `print()` and `str()`).
* `__repr__` is intended to return an unambiguous, developer-friendly string representation, ideally looking like a valid Python expression to recreate the object (called by interactive shells and `repr()`).

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __str__(self):
        return f"({self.x}, {self.y})"
    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"
```

### Magic (Dunder) Methods
Dunder (double-underscore) methods allow objects to hook into core Python operations.
* `__len__(self)`: Custom size behavior for `len()`.
* `__getitem__(self, key)`: Indexing/bracket notation access (`obj[key]`).
* `__add__(self, other)`: Overloads the `+` operator.
* `__eq__(self, other)`: Overloads the `==` operator.

### Dataclasses (`dataclasses.dataclass`)
Introduced in Python 3.7, `@dataclass` automatically generates standard boilerplate methods like `__init__`, `__repr__`, `__eq__`, and others, based on class variable type annotations.

```python
from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 1
```

### Method Resolution Order (MRO)
In multiple inheritance, MRO defines the order in which Python searches base classes for a method. Python uses the **C3 Linearization** algorithm to compute MRO, which you can inspect using the `__mro__` attribute or `mro()` method on a class.

---

### The Four Pillars of OOP

#### 1. Inheritance
Subclasses inherit variables and methods from base classes, promoting reuse.

```python
class Animal:
    def __init__(self, name):
        self.name = name
    def sleep(self):
        return f"{self.name} is sleeping."

class Cat(Animal):
    def meow(self):
        return f"{self.name} says Meow."
```

#### 2. Polymorphism
Polymorphism allows different class types to implement methods with the same name.

```python
class Dog:
    def speak(self): return "Woof!"
class Duck:
    def speak(self): return "Quack!"

def animal_noise(animal):
    print(animal.speak())
```

#### 3. Encapsulation
Hiding internal object details. Private variables are prefixed with a double underscore `__`. Getter and setter methods (using `@property`) manage access.

```python
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
```

> [!NOTE]
> **Name Mangling**
> Private variables prefixed with `__` are internally renamed to `_ClassName__attributeName` to prevent accidental overwrites. They can still be accessed, but convention advises against doing so.

#### 4. Abstraction
Exposing clean interface frameworks while hiding complex implementation details. This is achieved by subclassing Abstract Base Classes (ABCs).

```python
from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process(self, amount):
        pass

class PayPal(PaymentGateway):
    def process(self, amount):
        return f"Processing ${amount} through PayPal APIs."
```

### 🌍 Real-World Analogy
> - A **class** is like a **car blueprint** (stating features like engine type and wheel size), whereas an **object** is the **actual physical car** parked in your driveway.
> - **Inheritance** is like a **family tree**: a child inherits physical traits from parents but can also develop unique hobbies (methods).
> - **Encapsulation** is like an **ATM machine**: the money (data) is locked inside a vault; you cannot reach in and grab it directly. Instead, you must use the keypad interface (getters/setters) to deposit or withdraw safely.
> - **Polymorphism** is like a **standard USB port**: different devices (mouse, keyboard, flash drive) all fit into the same port and communicate, but each performs a completely different task when plugged in.
>
> **💼 Industry Application:** Game engines define base classes like `GameObject` (with coordinate properties), which are inherited by `Player`, `Enemy`, and `Obstacle` classes. Payment processing APIs utilize abstraction: they expose a single `charge()` method, but inherit different classes under the hood (e.g., Stripe, PayPal, Braintree) to connect to different APIs.

### Practice Questions
* **Question 13:** Explain the role of the `super()` function in OOP inheritance, and write a code example showing how a child class subclass constructor calls its parent.
* **Question 14:** Create a class `Book` using the `@dataclass` decorator with fields `title` (str), `author` (str), and `price` (float). Overwrite the `__str__` method to return: `"[TITLE] by [AUTHOR]"`.

---

## 9. Error & Exception Handling

Exceptions are runtime errors. Unhandled exceptions crash programs; handled exceptions allow code to respond gracefully.

### The Full Exception Handling Block
* `try`: Wraps the operations that could fail.
* `except SpecificError as e`: Runs only if a matching error is raised.
* `else`: Runs only if the `try` block executes successfully without raising errors.
* `finally`: Executed **always**, whether an error occurred or not. Used to release system resources.

#### Syntax
```python
try:
    # Operations
except ZeroDivisionError as e:
    # Error resolution
else:
    # Execution if successful
finally:
    # Cleanups
```

#### Code Example
```python
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
```

> [!WARNING]
> **Catching Generic Exceptions**
> Avoid catching all exceptions using a bare `except:` or `except Exception:`. This hides critical bugs and makes troubleshooting extremely difficult.

### Custom Exception Classes
You can create custom exceptions by subclassing the built-in `Exception` class.
```python
class InsufficientFundsError(Exception):
    """Exception raised when an account balance is too low."""
    pass
```

### Exception Chaining
To raise a new exception while preserving the stack trace of a previous exception, use `raise ... from ...`:
```python
try:
    # some file logic
    open("config.json")
except FileNotFoundError as e:
    raise RuntimeError("System configuration file is missing") from e
```

### ExceptionGroup & `except*`
Introduced in Python 3.11, `ExceptionGroup` allows raising and handling multiple independent exceptions simultaneously. This is especially useful in asynchronous concurrency. You catch exceptions from an ExceptionGroup using the `except*` syntax.

```python
# Example structure:
# try:
#     raise ExceptionGroup("errors", [ValueError("bad value"), TypeError("bad type")])
# except* ValueError as eg:
#     print("Handled ValueErrors")
# except* TypeError as eg:
#     print("Handled TypeErrors")
```

### 🌍 Real-World Analogy
> - A `try-except` block is like a **safety net for tightrope walkers**: if the performer slips (a runtime error occurs), the safety net catches them so the show can continue, rather than the stadium closing down (crashing the program).
> - The `finally` block is like the **emergency fire exit** in a building: no matter what happens inside (whether the show succeeds, fails, or catches fire), the exit remains open and must be usable at the end.
>
> **💼 Industry Application:** Database clients wrap connection attempts in `try-except` blocks to handle network timeouts gracefully and reconnect. Production backends use `finally` blocks to close open file descriptors, release thread locks, and close database connections, preventing memory leaks.

### Practice Questions
* **Question 15:** In the code below, if the user inputs `10` and `2`, what is the exact print sequence? If the user inputs `10` and `0`, what is the print sequence?
  ```python
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
  ```

---

## 10. File Input & Output (I/O)

Files allow you to save data persistently to disk.

### The Modern Path Object (`pathlib`)
Introduced in Python 3.4, the `pathlib` module offers an object-oriented API for working with file paths.
```python
from pathlib import Path

# Create a path reference
my_path = Path("documents") / "notes.txt"
print(my_path.exists())
```

### Opening Files with Context Managers
Always open files inside a `with` context manager block to ensure resources are automatically released.

```python
with open("diary.txt", "w") as file:
    file.write("Dear Diary, today I learned Python File I/O.\n")

with open("diary.txt", "r") as file:
    content = file.read()
    print(content)
```

### Common Access Modes
* `'r'`: Read mode (default).
* `'w'`: Write mode (creates or **overwrites** existing file).
* `'a'`: Append mode (appends to end of existing file).
* `'b'`: Binary mode (combine with others, e.g., `'rb'` or `'wb'` for binary data like images).

### CSV & JSON File I/O
```python
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
```

### 🌍 Real-World Analogy
> - File access modes are like **handling a physical notebook**: `'r'` (read) is like reading pages without a pen, `'w'` (write) is like ripping out all pages and writing from page one, and `'a'` (append) is like writing a new entry starting on the first blank line.
> - A **context manager** (`with` statement) is like a **library book checkout system**: it automatically marks the book as returned when you leave the library table, ensuring you don't walk off with it.
>
> **💼 Industry Application:** Data pipelines write processed records to daily log files in append (`'a'`) mode. Configuration managers load JSON or YAML settings files at startup and deserialize them to configure server ports, database URLs, and API tokens.

### Practice Questions
* **Question 16:** Write a program that opens a file called `numbers.txt` containing a list of numbers (one per line), sums them up, and appends the final sum to the end of the same file. Handle potential file missing errors gracefully.
* **Question 17:** Write a python program using `pathlib` and `json` to verify if a file `stats.json` exists. If it does, read it, print its content, and increment a key `'run_count'`. Write the updated dictionary back to the file. If it doesn't exist, create it with default data `{"run_count": 1}`.

---

## 11. Essential Standard Libraries

Python's standard library provides built-in tools for common tasks.

### 1. `math`
Mathematical operations.
```python
import math
print(math.sqrt(25)) # 5.0
```

### 2. `random`
Pseudo-random generator.
```python
import random
print(random.randint(1, 6)) # Dice roll simulation
```

### 3. `datetime`
Dates and times.
```python
from datetime import datetime, timedelta
now = datetime.now()
tomorrow = now + timedelta(days=1)
```

### 4. `os` & `sys`
* `os` manipulates directories and environment variables.
* `sys` interacts with system configurations and command arguments.

### 5. `json`
Serializes and deserializes JSON payloads.

### 6. `collections`
* `Counter`: Count element frequencies.
* `defaultdict`: Auto-initializes missing keys.
* `deque`: Double-ended queues.

### 7. Regular Expressions (`re`)
Enables matching strings using regex patterns.
```python
import re
pattern = r"\d+"
text = "There are 42 apples and 100 oranges."
matches = re.findall(pattern, text) # ['42', '100']
```

### 8. `itertools`
Advanced tools for iteration and combinations.
```python
import itertools
# Permutations of elements
perms = list(itertools.permutations([1, 2, 3], 2)) # [(1, 2), (1, 3), ...]
```

### 9. `typing`
Support for type annotations (e.g., `List`, `Dict`, `Union`, `Optional`, `Any`, `Callable`).
```python
from typing import List, Union

def process_items(items: List[Union[int, str]]) -> None:
    pass
```

### 🌍 Real-World Analogy
> - The `random` library is like rolling a set of **dice** or shuffling a **deck of cards** during a game.
> - The `datetime` library is like a **wall calendar and a stopwatch** combined, helping you measure durations and schedule dates.
> - The `json` format is like a **universal shipping label**: regardless of which country (programming language) sent the package, the label can be read by everyone.
>
> **💼 Industry Application:** Cryptographic systems use secure random modules (`secrets`) to generate passwords and verification tokens. E-commerce applications use `datetime` and `timedelta` to calculate expiration dates for discount coupons and schedule future subscription renewals. REST APIs exchange data globally using the JSON format, allowing Python backends to communicate with JavaScript frontend applications.

### Practice Questions
* **Question 18:** Which function from the `random` module should you use to select multiple unique random elements from a list without modifying the original list?

---

## 12. Advanced Pythonic Design Patterns

These features distinguish beginner code from clean, idiomatic Python.

### 1. Comprehensions (Lists, Dicts, Sets)
Syntactic sugar to create collections in a single line.
```python
# List comprehension: Generate squares of even numbers
numbers = [1, 2, 3, 4, 5, 6]
even_squares = [x**2 for x in numbers if x % 2 == 0] # [4, 16, 36]

# Dictionary comprehension
names = ["Alice", "Bob"]
name_lengths = {name: len(name) for name in names} # {"Alice": 5, "Bob": 3}
```

---

### 2. Generators & Yield
Generators yield values dynamically one at a time and save execution states, making them incredibly memory efficient for giant datasets.
```python
def generate_even_sequence(limit):
    num = 2
    while num <= limit:
        yield num  # Pauses execution and yields value
        num += 2

for even in generate_even_sequence(10):
    print(even)
```

---

### 3. Custom Context Managers
You can create custom context managers by implementing the `__enter__` and `__exit__` magic methods in a class, or by using the `@contextmanager` decorator from `contextlib`.

```python
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
```

---

### 4. Asynchronous I/O (`asyncio`)
For single-threaded concurrency in I/O bound programs, `asyncio` allows non-blocking task execution using coroutines.

```python
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
```

---

### 5. Decorators
Decorators wrap functions to dynamically intercept, modify, or extend their behavior without altering the original function's source code.

```python
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
```

### 🌍 Real-World Analogy
> - A **generator** is like a **sushi conveyor belt**: instead of a chef preparing 10,000 sushi plates and packing them into the fridge all at once (high memory usage), the chef makes one plate, places it on the belt, and makes the next one only when the previous one is consumed.
> - **Asynchronous I/O** (`asyncio`) is like a **professional chef cooking a multi-course dinner**: instead of standing around doing nothing while waiting for the pasta water to boil, the chef uses that time to chop vegetables or sear meat, switching tasks dynamically whenever one task is waiting.
> - **Decorators** are like **gift wrapping**: you don't change the gift inside (the function), but you add a decorative outer layer that provides extra presentation or behavior (e.g., logging execution time).
>
> **💼 Industry Application:** Data scientists use generators to stream gigabytes of logs or images into machine learning training loops without running out of RAM. Web scrapers and chat servers use `asyncio` to handle thousands of concurrent network connections without spinning up resource-heavy threads. Web frameworks like Flask and FastAPI use decorators (`@app.route`) to register functions as handlers for specific URL endpoints.

### Practice Questions
* **Question 19:** Write a list comprehension that takes a list of strings and returns a list containing only strings that are longer than 3 characters, with the strings converted to uppercase.
* **Question 20:** Write a custom context manager `Timer` that prints the time taken to run the block of code it wraps.

---
---

## 13. Answer Key & Explanations

Here are the answers and explanations to the practice questions throughout the guide.

### Section 1: Python Fundamentals & Design Philosophy
* **Answer 1:** When you execute a Python script:
  1. The Python compiler translates the high-level code into intermediate, bytecode instructions (saved as `.pyc` files).
  2. The Python Virtual Machine (PVM) reads and translates this bytecode into machine-level binary code instructions that your computer's CPU can execute.
  This hybrid process provides the portability of interpreted languages and optimizes execution speed.
* **Answer 2:** 
  * CPython compiles source code to bytecode and runs it in an interpreter. PyPy compiles frequently executed bytecode directly into native machine instructions at runtime using a Just-In-Time (JIT) compiler, yielding faster CPU performance.
  * In CPython, the GIL (Global Interpreter Lock) prevents multiple threads from running bytecode concurrently. This limits multi-threaded applications to a single CPU core, restricting performance improvements for CPU-bound tasks.

### Section 2: Variables, Dynamic Typing & Core Datatypes
* **Answer 3:**
  1. `3.0 + 5` evaluates to **`8.0`** (datatype: **`float`**). Adding a float and an integer converts the result to a float (implicit coercion).
  2. `bool("False")` evaluates to **`True`** (datatype: **`bool`**). A non-empty string always converts to `True`, regardless of its content.
  3. `bool("")` evaluates to **`False`** (datatype: **`bool`**). An empty string converts to `False` (truthiness evaluation).
* **Answer 4:**
  * String interning is an optimization where Python keeps only one copy of certain string values in memory. Different variables with the same value will point to the same object address.
  * The `id()` function returns the memory address. We can check identity using `id(a) == id(b)` or `a is b`.
  ```python
  a = "hello"
  b = "hello"
  print(id(a) == id(b))  # True (interned)
  ```

### Section 3: Operators & Logical Expressions
* **Answer 5:**
  The expression evaluates to **`True`**. Here is the step-by-step breakdown:
  1. `10 // 3` is `3`, so `3 == 3.0` is `True`.
  2. `5 == 5.0` is `True`, so `not (5 == 5.0)` is `False`.
  3. `"p" in "apple"` is `True`.
  4. The right side becomes: `False or True`, which evaluates to `True`.
  5. The complete statement is: `True and True`, which evaluates to `True`.

### Section 4: Input, Output & Type Casting
* **Answer 6:**
  ```python
  try:
      birth_year_str = input("Enter your birth year: ")
      birth_year = int(birth_year_str) # Cast to integer
      age = 2026 - birth_year
      print(f"You are {age} years old.")
  except ValueError:
      print("Error: Please enter a valid number for your birth year.")
  ```

### Section 5: Control Flow: Decisions & Repetitions
* **Answer 7:**
  The program prints **`1-2-4-`**.
  * `num = 1`: Prints `1-`.
  * `num = 2`: Prints `2-`.
  * `num = 3`: The `continue` statement skips the print step and starts the next iteration.
  * `num = 4`: Prints `4-`.
  * `num = 5`: The `break` statement exits the loop immediately, preventing the program from printing `5-`.
* **Answer 8:**
  ```python
  numbers = [1, 3, 5, 8, 9]
  for num in numbers:
      if num % 2 == 0:
          print(f"Found even number {num}")
          break
  else:
      print("No even number found")
  ```

### Section 6: Core Data Structures (Collections)
* **Answer 9:**
  * Output of `print(x)`: `[1, 2, [3, 4, 5]]`
  * Output of `print(y)`: `[99, 2, [3, 4, 5]]`
  * **Explanation:** `y = x.copy()` creates a shallow copy. Modifying a primitive item in the copy (`y[0] = 99`) does not affect the original list `x`. However, the nested list `[3, 4]` is copied by reference. When you append `5` to `y[2]`, both lists reflect this change.
* **Answer 10:**
  * Dictionary keys must be **hashable** (immutable).
  * A list `[1, 2]` is mutable, so it cannot be hashed, and using it as a key throws a `TypeError`.
  * A tuple `(1, 2)` containing only immutable values is immutable and hashable, making it a valid dictionary key.

### Section 7: Functions, Arguments & Variable Scope
* **Answer 11:**
  * Output:
    `First: [1, 2]`
    `Second: [1, 2]`
  * **Explanation:** The default list `collection=[]` is created once when the function is defined. Both calls (`first = build_list(1)` and `second = build_list(2)`) use and modify the same list object in memory.
* **Answer 12:**
  ```python
  from functools import lru_cache

  @lru_cache(maxsize=None)
  def fib_recursive(n: int) -> int:
      if n < 2:
          return n
      return fib_recursive(n-1) + fib_recursive(n-2)
  ```
  * **Explanation:** Standard recursive Fibonacci has an exponential time complexity of $O(2^n)$ due to redundant subproblem evaluations. `@lru_cache` stores the results of calls, so each Fibonacci number is computed exactly once. This reduces the time complexity to $O(n)$ (linear).

### Section 8: Object-Oriented Programming (OOP)
* **Answer 13:**
  `super()` references the parent class. In a subclass constructor, calling `super().__init__(...)` runs the parent constructor, ensuring parent class attributes are correctly initialized.
  ```python
  class Parent:
      def __init__(self, name):
          self.name = name

  class Child(Parent):
      def __init__(self, name, age):
          super().__init__(name) # Initialize parent attribute
          self.age = age
  ```
* **Answer 14:**
  ```python
  from dataclasses import dataclass

  @dataclass
  class Book:
      title: str
      author: str
      price: float
      
      def __str__(self):
          return f"{self.title} by {self.author}"
  ```

### Section 9: Error & Exception Handling
* **Answer 15:**
  * Inputs `10` and `2`: Prints **`A`**, then **`C`**, then **`D`**. (Runs successfully; triggers the `else` and `finally` blocks).
  * Inputs `10` and `0`: Prints **`A`**, then **`B`**, then **`D`**. (Division by zero raises an exception, triggers the `except` block, and runs the `finally` block).

### Section 10: File Input & Output (I/O)
* **Answer 16:**
  ```python
  try:
      # Read numbers and sum them
      with open("numbers.txt", "r") as file:
          numbers = [float(line.strip()) for line in file if line.strip()]
      total_sum = sum(numbers)
      
      # Append the sum
      with open("numbers.txt", "a") as file:
          file.write(f"\nSum: {total_sum}\n")
          
  except FileNotFoundError:
      print("Error: The file numbers.txt was not found.")
  except ValueError:
      print("Error: The file contains non-numeric data.")
  ```
* **Answer 17:**
  ```python
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
  ```

### Section 11: Essential Standard Libraries
* **Answer 18:**
  You should use **`random.sample(population, k)`**. Unlike `random.choices()`, `random.sample()` selects elements without replacement, ensuring each selected item is unique.

### Section 12: Advanced Pythonic Design Patterns
* **Answer 19:**
  ```python
  words = ["apple", "sky", "banana", "cat", "elephant"]
  filtered_uppercased = [word.upper() for word in words if len(word) > 3]
  # Result: ['APPLE', 'BANANA', 'ELEPHANT']
  ```
* **Answer 20:**
  ```python
  import time

  class Timer:
      def __enter__(self):
          self.start = time.time()
          return self
      def __exit__(self, exc_type, exc_val, exc_tb):
          self.end = time.time()
          print(f"Elapsed time: {self.end - self.start:.5f} seconds")
  ```

---

## Made by NotAryanSinha
*(Created with care for your programming journey!)*
