# WebNotes 📝 — Programming Knowledge Hub

WebNotes is a premium, interactive client-side web application designed for organizing, reading, and studying programming reference notes. It features a curated dark-mode interface, dynamic outline tracking, syntax-highlighted code blocks, local file import/upload capabilities, keyboard navigation support, and professional high-contrast PDF generation.

---

## ✨ Features

### 📖 Immersive Reading Experience
- **Interactive 3-Card Carousel**: Browse notes using a rotating card carousel with side-card scaling, opacity dimming, custom dot indicators, and smooth sliding transitions.
- **Centered Layout**: Cohesive reading flow centering markdown notes and the table of contents sidebar.
- **Glassmorphism TOC Sidebar**: A semi-transparent card sidebar with active-state accent indicators that smoothly track scroll position and slide/scale into place on hover.
- **TOC Toggle Support**: Toggle outline visibility on both desktop (collapses the grid layout to maximize reading area) and mobile (slides the navigation drawer).
- **Progress Highlight**: Auto-scrolls the table of contents sidebar internally to keep the active section link highlighted and centered in the viewport.
- **Responsive Hash Navigation**: Auto-scrolling headings offset by `90px` to clear the sticky navbar without visual overlapping.

### 🐍 Built-in Language Bundles & Analogies
Comes pre-packaged with 3 detailed reference notes:
1. **Python Complete Reference Notes**: Fundamental syntaxes, dynamic typing, OOP patterns, GIL, scope rules, and file operations.
2. **Java & OOP Reference Notes**: Master classes, objects, interfaces, inheritance, polymorphism, and abstraction.
3. **C Programming & DSA Reference Notes**: Low-level memory, pointer arithmetic, structures, and implementations of arrays, trees, linked lists, queues, and sorting algorithms.
- **🌍 Real-World Analogies**: Abstract concepts are grounded in everyday metaphors (e.g., Stack vs. Heap as a desk vs. warehouse, or interpreters as live simultaneous translators).
- **💼 Industry Applications**: Concrete examples show how each concept translates to large production systems (e.g., Spotify backend scaling, database indexing).
- **⌨️ Developer Environment Cheat Sheets**: Section 1 of each guide lists essential productivity shortcuts for standard setups (VS Code, PyCharm, IntelliJ IDEA, Eclipse, GDB debugger, and Vim editor commands).

### ⌨️ Comprehensive Keyboard Shortcuts
- **Navigation Controls**:
  - `Alt + H` — Scroll to the Home section (closes reader and routes back to landing top).
  - `Alt + N` — Scroll to the Notes Collection (closes reader and routes back to notes grid).
  - `Alt + U` — Scroll to the Upload area (closes reader and routes back to upload dashboard).
  - `Alt + K` — Toggle the floating glassmorphic Keyboard Shortcuts Helper panel.
- **Search Focus**: Press `/` on the landing page to instantly scroll to and focus the search bar.
- **Active Note Reader**:
  - `Esc` — Close the reader and return back to the notes grid.
  - `Alt + O` — Toggle the Outline/TOC sidebar.
  - `Alt + P` — Export and download the active note as a high-contrast PDF.
- **Carousel Controls**: Press `←` or `→` on the landing page to spin the notes card selector.

### 🎨 Cross-Platform Monospaced Diagrams
- **ASCII Overhaul**: All structural illustrations (JVM Memory regions, Compilation chains, String pools, and Collection hierarchies) are written in cross-platform monospaced ASCII layout grids (`+`, `-`, `|`), eliminating font-warping and visual misalignment bugs on web browsers.

### ⬆️ Local Markdown Imports & Language Detection
- **Drag & Drop / Select Uploads**: Drop any `.md`, `.txt`, or `.markdown` file directly into the browser.
- **Auto-Parsing**: Automatically extracts the title from the first heading (`#`) and calculates total sections based on secondary headings (`##`).
- **Advanced Language Detection**: Automatically analyzes filename and file contents using deep syntax keyword scoring to assign custom themes, badges, gradient headers, and hover glows. Supports **24 languages and frameworks**:
  * *Systems & OOP*: Java, C, C++, C#, Kotlin, Swift, Scala
  * *Scripting & Web*: Python, JavaScript, TypeScript, Ruby, PHP, Dart/Flutter, Lua, HTML/CSS
  * *Functional*: Haskell, Elixir
  * *Data & DevOps*: SQL/DB, R, Shell/Bash, DevOps (Docker/Kubernetes)
  * *Low-Level & AI*: Assembly, ML/AI (TensorFlow/PyTorch)
- **Local Persistence**: Uploaded notes are saved to `localStorage` (safely handled with error-recovery blocks) to persist between sessions.

### 💻 macOS-Style Interactive Code Blocks
- **Syntax Highlighting**: Atom One Dark theme for beautiful code readability.
- **Copy Buttons**: Instant copy-to-clipboard buttons with inline visual success status.
- **Interactive Header Control Dots**: Hovering over the top-left red, yellow, and green window controls reveals their macOS actions symbols (`×`, `−`, `+`).

### 📄 High-Contrast PDF Downloads
- **Print Layout Style Sheets**: Overrides dark theme with clean, high-contrast light colors, structured callouts, and clean borders for physical printing.
- **Fixed-height Export Wrapper**: Wrapped container flow resolves height-collapse issues during document cloning.
- **Full Viewport Capture**: Passes absolute `scrollY: 0` coordinates to eliminate blank pages generated when the main window is scrolled.

---

## 🛠️ Tech Stack & Dependencies
- **HTML5 & CSS3**: Custom dark-mode design system with pure CSS transitions (vanilla HSL tailored variables).
- **JavaScript (ES6)**: Vanilla DOM event listener structure (no heavy frameworks).
- **Marked.js (v12.0.1)**: Blazing-fast markdown parsing.
- **Highlight.js (v11.9.0)**: Automatic code syntax highlighting.
- **Html2pdf.js (v0.10.2)**: Direct client-side HTML-to-PDF rendering engine.

---

## 🚀 How to Run Locally
Since WebNotes runs purely client-side, you can host it locally with a simple web server:
1. **Clone or download** this repository to your local machine.
2. **Navigate into the directory**:
   ```bash
   cd WebNotes
   ```
3. **Start an HTTP Server** (using Python):
   ```bash
   python -m http.server 8000
   ```
4. **Open your browser** and go to:
   [http://localhost:8000](http://localhost:8000)

---

## 📂 Project Structure
```
WebNotes/
├── index.html                  # Main application structure and DOM elements
├── index.css                   # Custom responsive variables, keyframes & animations
├── carousel.css                # Card browsing carousel styling, transforms & layouts
├── app.js                      # Application controller, upload engine, and PDF compiler
├── notes-content.js            # Built-in note content data strings (failsafe local loading)
├── .gitignore                  # Development files ignore list
├── README.md                   # Project documentation
├── Python_Reference_Notes.md   # Original Python note markdown source
├── Java_OOP_Reference_Notes.md # Original Java note markdown source
└── C_Reference_Notes_DSA.md    # Original C note markdown source
```

---

## 📅 Recent Updates & Changelog

### 🚀 Version 1.1.0
- **Real-World Metaphors & Applications**: Elaborated C/DSA, Java OOP, and Python guides with dynamic analogies and production system use cases.
- **Vibrant Language Styling**: Built CSS classes and header gradients mapping to 24 languages with matching badges and hover glows.
- **Cross-Platform Monospaced Diagrams**: Replaced warping Unicode box graphics in study guides with Standard Monospaced ASCII drawings.
- **Interactive Browsing Carousel**: Implemented a 3-card rotating notes carousel with scale/opacity adjustments and smooth transition animations.
- **Keyboard Shortcuts Helper UI**: Designed an Alt+K keymap cheat sheet overlay panel containing reader, carousel, search, and navigation controls.
- **Developer Environment Cheat Sheets**: Appended VS Code, PyCharm, IntelliJ Live Templates, Eclipse, GDB, and Vim shortcut tables into Section 1 of the notes.
- **Intelligent Navigation Routing**: Enhanced `closeNoteViewer` redirection to properly handle landing page scroll placement when returning from an open note viewer.

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

Created and designed by **NotAryanSinha**.

---

## ⭐ Support

If you like this project, please consider:
- **⭐ Star** the repository to show your support.
- **🍴 Fork** it to start customizing your own guides.
- **🛠 Contribute** improvements or new feature suggestions.
- **🚀 Share** it with other developers and students.

---

## 💡 Inspiration

WebNotes was created to make programming study material:
- 🎨 **Beautiful** — vibrant modern interfaces.
- 🗂️ **Structured** — clear outline and navigation.
- 🖱️ **Interactive** — dynamic search and layout tools.
- 🌌 **Immersive** — real-world analogies and application scenarios.
- 🚀 **Enjoyable** — engaging and rewarding to read.

...instead of messy and overwhelming.