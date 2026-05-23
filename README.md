# WebNotes 📝 — Programming Knowledge Hub

WebNotes is a premium, interactive client-side web application designed for organizing, reading, and studying programming reference notes. It features a curated dark-mode interface, dynamic outline tracking, syntax-highlighted code blocks, local file import/upload capabilities, and professional high-contrast PDF generation.

---

## ✨ Features

### 📖 Immersive Reading Experience
- **Centered Layout**: Cohesive reading flow centering markdown notes and the table of contents sidebar.
- **Glassmorphism TOC Sidebar**: A semi-transparent card sidebar with active-state accent indicators that smoothly track scroll position and slide/scale into place on hover.
- **Progress Highlight**: Auto-scrolls the table of contents sidebar internally to keep the active section link highlighted and centered in the viewport.
- **Responsive Hash Navigation**: Auto-scrolling headings offset by `90px` to clear the sticky navbar without visual overlapping.

### 🐍 Built-in Language Bundles
Comes pre-packaged with 3 detailed reference notes:
1. **Python Complete Reference Notes**: Fundamental syntaxes, dynamic typing, OOP patterns, GIL, scope rules, and file operations.
2. **Java & OOP Reference Notes**: Master classes, objects, interfaces, inheritance, polymorphism, and abstraction.
3. **C Programming & DSA Reference Notes**: Low-level memory, pointer arithmetic, structures, and implementations of arrays, trees, linked lists, queues, and sorting algorithms.

### ⬆️ Local Markdown Imports
- **Drag & Drop / Select Uploads**: Drop any `.md`, `.txt`, or `.markdown` file directly into the browser.
- **Auto-Parsing**: Automatically extracts the title from the first heading (`#`) and calculates total sections based on secondary headings (`##`).
- **Language Detection**: Automatically assigns custom themes, cards, and icons based on file name or syntax hints.
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
├── app.js                      # Application controller, upload engine, and PDF compiler
├── notes-content.js            # Built-in note content data strings (failsafe local loading)
├── .gitignore                  # Development files ignore list
├── README.md                   # Project documentation
├── Python_Reference_Notes.md   # Original Python note markdown source
├── Java_OOP_Reference_Notes.md # Original Java note markdown source
└── C_Reference_Notes_DSA.md    # Original C note markdown source
```

---

## 📄 License

This project is open-source and free for personal and educational study. Created and designed by **NotAryanSinha**.
