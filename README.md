# WebNotes 📝  
### A Modern Programming Knowledge Hub

WebNotes is a premium interactive web application designed for organizing, reading, and studying programming reference notes in a clean, immersive, and developer-focused environment.

Built entirely with **HTML, CSS, and Vanilla JavaScript**, WebNotes delivers a smooth reading experience with animated UI components, markdown rendering, dynamic navigation, cloud syncing, and beautiful dark-mode aesthetics.

---

![WebNotes Banner](https://dummyimage.com/1200x400/0f0f17/ffffff&text=WebNotes+-+Programming+Knowledge+Hub)

---

# ✨ Features

## 📖 Immersive Reading Experience

- Beautiful dark-mode UI
- Glassmorphism-inspired interface
- Smooth scrolling note viewer
- Dynamic Table of Contents tracking
- Scroll progress indicator
- Responsive reading layout
- Syntax-highlighted code blocks

---

## 🎠 Animated Carousel System

- Interactive 3-card rotating carousel
- Smooth transitions & animations
- Auto-rotation support
- Navigation controls
- Mobile responsive behavior

---

## ☁️ Supabase Cloud Sync

- Upload notes from any device
- Shared note syncing
- Local fallback when offline
- Persistent storage
- Real-time sync support

---

## 🧠 Smart Markdown Processing

Automatically:

- Parses markdown notes
- Generates heading anchors
- Creates dynamic TOC navigation
- Detects languages
- Counts sections
- Applies themed cards/icons

---

## 📄 PDF Export

Export notes into professional PDFs with:

- Structured formatting
- Readable typography
- Preserved code blocks
- Clean print layouts

---

## 📱 Fully Responsive

Optimized for:

- Desktop
- Tablets
- Mobile devices

Includes:

- Mobile navigation
- Adaptive layouts
- Touch-friendly interactions

---

# 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Database | Supabase |
| Deployment | Netlify / Vercel / GitHub Pages |
| Storage | localStorage + Supabase |

---

# 📂 Project Structure

```txt
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

# 📚 Built-in Notes

WebNotes ships with complete programming reference bundles:

## 🐍 Python Complete Reference

Includes:

- Variables & Data Types
- OOP
- Exception Handling
- File I/O
- Advanced Pythonic Patterns
- Standard Libraries

---

## ☕ Java & OOP Reference

Covers:

- JVM Internals
- Classes & Objects
- Inheritance
- Interfaces
- Collections
- Exception Handling

---

## ⚙️ C Programming & DSA

Includes:

- Memory Management
- Pointers
- Structures
- Linked Lists
- Queues
- Trees
- Sorting Algorithms

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/webnotes.git
cd webnotes
```

---

## 2️⃣ Install Node.js

Download and install:

```txt
https://nodejs.org
```

---

## 3️⃣ Start Local Development Server

### Windows

```bash
start.bat
```

### Linux / macOS

```bash
bash start.sh
```

### Using NPM

```bash
npm install
npm run dev
```

---

# 🌐 Open in Browser

```txt
http://localhost:3000
```

---

# ☁️ Supabase Setup

Create a free Supabase project:

```txt
https://supabase.com
```

Then update:

```js
const SUPABASE_URL = 'YOUR_URL'
const SUPABASE_ANON_KEY = 'YOUR_KEY'
```

inside:

```txt
supabase-config.js
```

---

# 🗄 Required SQL Setup

Run this inside the Supabase SQL Editor:

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

CREATE POLICY "Public read"
ON notes FOR SELECT
USING (true);

CREATE POLICY "Public insert"
ON notes FOR INSERT
WITH CHECK (builtin = false);

CREATE POLICY "Public delete"
ON notes FOR DELETE
USING (builtin = false);
```

---

# 🔒 .gitignore

```gitignore
# Ignore everything
*

# Allow folder traversal
!*/

# Keep repository essentials
!.gitignore
!README.md

# Main website files
!index.html
!index.css
!carousel.css

# JavaScript
!app.js
!supabase-config.js
!notes-content.js

# Markdown notes
!Python_Reference_Notes.md
!Java_OOP_Reference_Notes.md
!C_Reference_Notes_DSA.md

# Ignore unwanted folders
recordings/
node_modules/
dist/
build/

# Ignore configs/scripts
package.json
package-lock.json
netlify.toml
start.bat
start.sh
.nojekyll

# Editor/system files
.vscode/
.idea/
.DS_Store
Thumbs.db
```

---

# 🎨 UI Highlights

- Animated gradient backgrounds
- Smooth hover effects
- Glassmorphism cards
- Dynamic TOC highlighting
- Interactive transitions
- Developer-focused typography

---

# 🚀 Deployment

## Netlify

```bash
netlify deploy
```

Uses:

```txt
netlify.toml
```

configuration.

---

## Vercel

Import the repository directly into Vercel.

---

## GitHub Pages

Enable Pages inside repository settings.

---

# 🧩 Future Improvements

Planned features:

- 🔍 Full-text search
- 🏷 Note tagging system
- 🌐 Multi-user authentication
- 🧠 AI-generated summaries
- 📂 Folder organization
- 🌙 Theme customizer
- 📑 Collections & playlists
- 📤 Export/import packs

---

# 👨‍💻 Author

### Dogza / NotAryanSinha

---

# 📜 License

MIT License

Free to use, modify, and distribute.

---

# ⭐ Support

If you like this project:

- ⭐ Star the repository
- 🍴 Fork it
- 🛠 Contribute improvements
- 🚀 Share it with developers

---

# 💡 Inspiration

WebNotes was created to make programming study material:

- beautiful
- structured
- interactive
- immersive
- enjoyable

instead of messy and overwhelming.

---

# 🚀 Happy Coding