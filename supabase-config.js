/* ========================================
   WebNotes — Supabase Configuration
   ========================================

   SETUP STEPS:
   1. Go to https://supabase.com → create a free project
   2. In your project: Settings → API
      - Copy "Project URL"      → paste as SUPABASE_URL below
      - Copy "anon / public" key → paste as SUPABASE_ANON_KEY below

   3. Go to SQL Editor in Supabase and run this ONCE to create the table
      and enable public read + write:

   ────────────────────────────────────────
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

   -- Anyone can read
   CREATE POLICY "Public read"   ON notes FOR SELECT USING (true);
   -- Anyone can insert (public uploads)
   CREATE POLICY "Public insert" ON notes FOR INSERT WITH CHECK (builtin = false);
   -- Anyone can delete their own uploaded note (by id)
   CREATE POLICY "Public delete" ON notes FOR DELETE USING (builtin = false);
   ────────────────────────────────────────

   4. Seed the 3 built-in notes (run once in SQL Editor):

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

   ======================================== */

const SUPABASE_URL      = 'https://rtidqlsztwvfjspzygst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWRxbHN6dHd2ZmpzcHp5Z3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzMyNTQsImV4cCI6MjA5NTEwOTI1NH0.r5wzDDufY8mjDS3VVVYk-pOpSyOSArmPoZeXt6errAQ';

/** Returns true if Supabase credentials look configured. */
function _supabaseReady() {
  return !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
         !SUPABASE_ANON_KEY.includes('YOUR_ANON');
}

/** Shared headers for every Supabase REST call. */
function _supabaseHeaders() {
  return {
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation'
  };
}

/**
 * Fetches all notes from Supabase.
 * Returns an array of note objects, or null on failure (app falls back to built-ins).
 */
async function fetchNotesFromSupabase() {
  if (!_supabaseReady()) {
    console.info('WebNotes: Supabase not configured — using built-in notes. See supabase-config.js for setup.');
    return null;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/notes?select=*&order=created_at.asc`,
      { headers: _supabaseHeaders() }
    );

    if (!res.ok) throw new Error(`Supabase responded with HTTP ${res.status}`);

    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;

    return rows.map(r => ({
      id:          r.id,
      title:       r.title       || 'Untitled Note',
      description: r.description || '',
      language:    r.language    || 'Notes',
      cardClass:   r.card_class  || 'uploaded',
      icon:        r.icon        || '📄',
      sections:    r.sections    || 0,
      content:     r.content     || null,
      builtin:     r.builtin     || false
    }));

  } catch (err) {
    console.error('WebNotes: Supabase fetch failed, falling back to built-in notes.', err);
    return null;
  }
}

/**
 * Inserts a user-uploaded note into Supabase.
 * @param {Object} note  - The note object built by handleFiles()
 * @returns {boolean}    - true on success, false on failure
 */
async function insertNoteToSupabase(note) {
  if (!_supabaseReady()) return false;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/notes`,
      {
        method:  'POST',
        headers: _supabaseHeaders(),
        body: JSON.stringify({
          id:          note.id,
          title:       note.title,
          description: note.description,
          language:    note.language,
          card_class:  note.cardClass,
          icon:        note.icon,
          sections:    note.sections,
          content:     note.content,
          builtin:     false
        })
      }
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status}: ${body}`);
    }

    return true;
  } catch (err) {
    console.error('WebNotes: Failed to save note to Supabase.', err);
    return false;
  }
}

/**
 * Deletes a user-uploaded note from Supabase by id.
 * Only rows where builtin = false can be deleted (enforced by RLS policy).
 * @param {string} noteId
 * @returns {boolean} - true on success, false on failure
 */
async function deleteNoteFromSupabase(noteId) {
  if (!_supabaseReady()) return false;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/notes?id=eq.${encodeURIComponent(noteId)}&builtin=eq.false`,
      {
        method:  'DELETE',
        headers: _supabaseHeaders()
      }
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status}: ${body}`);
    }

    return true;
  } catch (err) {
    console.error('WebNotes: Failed to delete note from Supabase.', err);
    return false;
  }
}
