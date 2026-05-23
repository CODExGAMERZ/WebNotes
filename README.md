# WebNotes 📝 — Programming Knowledge Hub

WebNotes is a premium, interactive client-side web application designed for organizing, reading, and studying programming reference notes. It features a curated dark-mode interface, dynamic outline tracking, syntax-highlighted code blocks, community upload capabilities backed by Supabase, and professional high-contrast PDF generation.

---

## ✨ Features

### 📖 Immersive Reading Experience
- **Centered Layout**: Cohesive reading flow centering markdown notes and the table of contents sidebar.
- **Glassmorphism TOC Sidebar**: A semi-transparent card sidebar with active-state accent indicators that smoothly track scroll position and slide/scale into place on hover.
- **Progress Highlight**: Auto-scrolls the table of contents sidebar internally to keep the active section link highlighted and centered in the viewport.
- **Responsive Hash Navigation**: Auto-scrolling headings offset by `90px` to clear the sticky navbar without visual overlapping.
- **Deduplicated Heading IDs**: Repeated section titles (e.g. "Real World Analogy" appearing in multiple chapters) automatically get unique slugs (`-2`, `-3`, …) so TOC links always jump to the correct heading.

### 🐍 Built-in Language Bundles
Comes pre-packaged with 3 detailed reference notes:
1. **Python Complete Reference Notes**: Fundamental syntaxes, dynamic typing, OOP patterns, GIL, scope rules, and file operations.
2. **Java & OOP Reference Notes**: Master classes, objects, interfaces, inheritance, polymorphism, and abstraction.
3. **C Programming & DSA Reference Notes**: Low-level memory, pointer arithmetic, structures, and implementations of arrays, trees, linked lists, queues, and sorting algorithms.

### ☁ Community Upload & Supabase Sync
- **Anyone can upload**: Drop any `.md`, `.txt`, or `.markdown` file — it is saved locally *and* synced to the shared Supabase database so every visitor sees it immediately.
- **Live sync status**: Each uploaded file shows a real-time badge — `⏳ Saving…` while the request is in flight, `☁ Synced` on success, or `📱 Local only` if Supabase is temporarily unreachable (the note is still saved in the browser).
- **Graceful offline fallback**: If Supabase is unavailable at load time, the app falls back to the three built-in notes plus anything stored in `localStorage` — no blank page, no error screen.
- **Delete syncs too**: Removing a note with ✕ clears it from both `localStorage` and the database.
- **Built-in notes are protected**: RLS policies on the database prevent any browser from overwriting or deleting the three built-in reference notes.

### ⬆️ Local Markdown Imports
- **Drag & Drop / Select Uploads**: Drop any `.md`, `.txt`, or `.markdown` file directly into the browser.
- **Auto-Parsing**: Automatically extracts the title from the first heading (`#`) and calculates total sections based on secondary headings (`##`).
- **Language Detection**: Automatically assigns custom themes, cards, and icons based on file name or syntax hints.
- **Local Persistence**: Uploaded notes are also saved to `localStorage` as an offline cache so they survive page reloads even without a network connection.

### 💻 macOS-Style Interactive Code Blocks
- **Syntax Highlighting**: Atom One Dark theme for beautiful code readability.
- **Copy Buttons**: Instant copy-to-clipboard buttons with inline visual success status.
- **Interactive Header Control Dots**: Hovering over the top-left red, yellow, and green window controls reveals their macOS action symbols (`×`, `−`, `+`).

### 📄 High-Contrast PDF Downloads
- **Print Layout Style Sheets**: Overrides dark theme with clean, high-contrast light colors, structured callouts, and clean borders for physical printing.
- **Fixed-height Export Wrapper**: Wrapped container flow resolves height-collapse issues during document cloning.
- **Full Viewport Capture**: Passes absolute `scrollY: 0` coordinates to eliminate blank pages generated when the main window is scrolled.

---

## 🛠️ Tech Stack & Dependencies

- **HTML5 & CSS3**: Custom dark-mode design system with pure CSS transitions (vanilla HSL tailored variables).
- **JavaScript (ES6)**: Vanilla DOM event listener structure (no heavy frameworks).
- **Supabase**: Postgres database with REST API for shared note storage (public read + insert + delete via RLS).
- **Marked.js (v12.0.1)**: Blazing-fast markdown parsing.
- **Highlight.js (v11.9.0)**: Automatic code syntax highlighting.
- **Html2pdf.js (v0.10.2)**: Direct client-side HTML-to-PDF rendering engine.

---

## 🗄️ Supabase Setup

### 1. Create the table
Go to your Supabase project → **SQL Editor** and run:

```sql
CREATE TABLE notes (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  language    TEXT DEFAULT 'Notes',
  card_class  TEXT DEFAULT 'uploaded',
  icon        TEXT DEFAULT '📄',
  sections    INTEGER DEFAULT 0,
  content     TEXT,
  builtin     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Anyone can read all notes
CREATE POLICY "Public read"   ON notes FOR SELECT USING (true);
-- Anyone can upload new notes (builtin notes cannot be inserted this way)
CREATE POLICY "Public insert" ON notes FOR INSERT WITH CHECK (builtin = false);
-- Anyone can delete uploaded notes (builtin notes are protected)
CREATE POLICY "Public delete" ON notes FOR DELETE USING (builtin = false);
```

### 2. Seed the built-in notes

```sql
INSERT INTO notes (id, title, description, language, card_class, icon, sections, builtin) VALUES
('python-reference',
 'Python Complete Reference Notes',
 'Comprehensive guide from fundamentals to advanced Pythonic patterns — variables, OOP, error handling, file I/O, and design patterns.',
 'Python', 'python', '🐍', 13, true),
('java-oop',
 'Java & OOP Reference Notes',
 'Master Java programming and Object-Oriented Programming — classes, inheritance, polymorphism, abstraction, exceptions, and collections.',
 'Java', 'java', '☕', 12, true),
('c-dsa',
 'C Programming & DSA Reference Notes',
 'C language deep dive with Data Structures & Algorithms — pointers, memory allocation, linked lists, stacks, queues, trees, and sorting.',
 'C / DSA', 'c-lang', '⚙️', 13, true);
```

### 3. Add your credentials
Open `supabase-config.js` and paste your project URL and anon key:

```js
const SUPABASE_URL      = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 4. Add admin notes directly (optional)
To publish a note yourself without going through the upload UI:

```sql
INSERT INTO notes (id, title, description, language, card_class, icon, sections, content, builtin)
VALUES (
  'my-note-id',
  'My Note Title',
  'Short description.',
  'JavaScript', 'uploaded', '🌐', 5,
  '# My Note\n\n## Section 1\nContent here...',
  false
);
```

---

## 🚀 How to Run Locally

Since WebNotes runs purely client-side, any static file server works:

1. **Clone or download** this repository.
2. **Navigate into the directory**:
   ```bash
   cd WebNotes
   ```
3. **Start the server** — pick whichever you have:
   ```bash
   # Node.js (recommended — also used by start.sh / start.bat)
   npm start

   # Python 3
   python -m http.server 3000
   ```
4. **Open your browser** at [http://localhost:3000](http://localhost:3000)

On macOS/Linux you can also just double-click `start.sh`; on Windows double-click `start.bat` — both auto-detect Node, Python, or PowerShell and open the browser for you.

---

## 📂 Project Structure

```
WebNotes/
├── index.html                  # App shell — nav, hero, carousel, upload zone, note viewer
├── index.css                   # Design system — variables, keyframes, component styles
├── carousel.css                # 3-card rotating carousel styles and animations
├── app.js                      # All app logic — carousel, TOC, markdown renderer,
│                               #   upload handler, Supabase sync, PDF export
├── supabase-config.js          # Supabase REST helpers — fetch, insert, delete
├── notes-content.js            # Built-in note content bundle (fast, no-fetch load)
├── Python_Reference_Notes.md   # Python note markdown source
├── Java_OOP_Reference_Notes.md # Java note markdown source
└── C_Reference_Notes_DSA.md    # C / DSA note markdown source
```

---

## 📄 License

This project is open-source and free for personal and educational study. Created and designed by **NotAryanSinha**.