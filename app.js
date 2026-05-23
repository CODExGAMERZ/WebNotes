/* ========================================
   WebNotes — Application Logic
   ======================================== */

// ── Notes Data Store ──
const BUILTIN_NOTES = [
  {
    id: 'python-reference',
    title: 'Python Complete Reference Notes',
    description: 'Comprehensive guide from fundamentals to advanced Pythonic patterns — variables, OOP, error handling, file I/O, and design patterns.',
    language: 'Python',
    cardClass: 'python',
    icon: '🐍',
    sections: 13,
    file: 'Python_Reference_Notes.md',
    builtin: true
  },
  {
    id: 'java-oop',
    title: 'Java & OOP Reference Notes',
    description: 'Master Java programming and Object-Oriented Programming — classes, inheritance, polymorphism, abstraction, exceptions, and collections.',
    language: 'Java',
    cardClass: 'java',
    icon: '☕',
    sections: 12,
    file: 'Java_OOP_Reference_Notes.md',
    builtin: true
  },
  {
    id: 'c-dsa',
    title: 'C Programming & DSA Reference Notes',
    description: 'C language deep dive with Data Structures & Algorithms — pointers, memory allocation, linked lists, stacks, queues, trees, and sorting.',
    language: 'C / DSA',
    cardClass: 'c-lang',
    icon: '⚙️',
    sections: 13,
    file: 'C_Reference_Notes_DSA.md',
    builtin: true
  }
];

// Load user-uploaded notes from localStorage
function loadUploadedNotes() {
  try {
    const data = localStorage.getItem('webnotes_uploaded');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUploadedNotes(notes) {
  try {
    localStorage.setItem('webnotes_uploaded', JSON.stringify(notes));
  } catch (err) {
    console.error('LocalStorage write error:', err);
    showToast('Failed to save notes: storage is full.', 'error');
  }
}

let uploadedNotes = loadUploadedNotes();
let activeNote = null;

function getAllNotes() {
  return [...BUILTIN_NOTES, ...uploadedNotes];
}

// ── DOM References ──
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLogoLink = document.getElementById('nav-logo-link');
const notesGrid = document.getElementById('notes-grid');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const landingPage = document.getElementById('landing-page');
const noteViewer = document.getElementById('note-viewer');
const viewerTitle = document.getElementById('viewer-title');
const viewerMeta = document.getElementById('viewer-meta');
const viewerContent = document.getElementById('viewer-content');
const viewerBackBtn = document.getElementById('viewer-back-btn');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const scrollProgress = document.getElementById('scroll-progress');
const tocSidebar = document.getElementById('toc-sidebar');
const tocList = document.getElementById('toc-list');
const tocToggleBtn = document.getElementById('toc-toggle-btn');
const tocCloseBtn = document.getElementById('toc-close-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-upload-input');
const uploadFileList = document.getElementById('upload-file-list');
const toastContainer = document.getElementById('toast-container');
const statNotes = document.getElementById('stat-notes');
const statTopics = document.getElementById('stat-topics');
const statSections = document.getElementById('stat-sections');

// ── Navigation ──
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// ── TOC Sidebar Mobile Drawer ──
if (tocToggleBtn && tocSidebar && tocCloseBtn && sidebarOverlay) {
  const openTOC = () => {
    tocSidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.classList.add('toc-open'); // Prevent main page scrolling when drawer is open
  };

  const closeTOC = () => {
    tocSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.classList.remove('toc-open');
  };

  tocToggleBtn.addEventListener('click', openTOC);
  tocCloseBtn.addEventListener('click', closeTOC);
  sidebarOverlay.addEventListener('click', closeTOC);
}

// Scroll detection for navbar, scroll progress, and back-to-top button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 40);

  // Toggle Back-to-Top visibility
  if (backToTopBtn) {
    backToTopBtn.classList.toggle('visible', scrollY > 400);
  }

  // Calculate scroll progress for active note
  if (activeNote && noteViewer.classList.contains('active')) {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    } else {
      scrollProgress.style.width = '0%';
    }
  } else {
    scrollProgress.style.width = '0%';
  }
});

// Back-to-top click handler
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Nav link clicks
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    // If we're viewing a note, go back to landing
    if (noteViewer.classList.contains('active')) {
      e.preventDefault();
      closeNoteViewer();
      const target = link.getAttribute('data-nav');
      setTimeout(() => {
        if (target === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
        else {
          const section = document.getElementById(target === 'upload-btn' ? 'upload' : target);
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 350); // Wait for transition
    }
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

navLogoLink.addEventListener('click', (e) => {
  e.preventDefault();
  if (noteViewer.classList.contains('active')) {
    closeNoteViewer();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Render Note Cards ──
function renderNoteCards(filter = '') {
  const notes = getAllNotes();
  const filtered = filter
    ? notes.filter(n =>
        n.title.toLowerCase().includes(filter) ||
        n.language.toLowerCase().includes(filter) ||
        n.description.toLowerCase().includes(filter)
      )
    : notes;

  notesGrid.innerHTML = '';
  emptyState.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach((note, i) => {
    const card = document.createElement('div');
    card.className = `note-card ${note.cardClass}`;
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="note-card-banner">
        <span class="note-card-banner-icon">${note.icon}</span>
      </div>
      <div class="note-card-body">
        <div class="note-card-lang-badge">${note.icon} ${note.language}</div>
        <h3 class="note-card-title">${note.title}</h3>
        <p class="note-card-desc">${note.description}</p>
        <div class="note-card-meta">
          <div class="note-card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            ${note.sections} Sections
          </div>
          <div class="note-card-arrow">→</div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openNote(note));
    notesGrid.appendChild(card);
  });

  // Update stats
  const allNotes = getAllNotes();
  statNotes.textContent = allNotes.length;
  const langs = new Set(allNotes.map(n => n.language));
  statTopics.textContent = langs.size;
  statSections.textContent = allNotes.reduce((sum, n) => sum + (n.sections || 0), 0);
}

// ── Search ──
searchInput.addEventListener('input', (e) => {
  renderNoteCards(e.target.value.toLowerCase().trim());
});

// ── Open Note Viewer ──
async function openNote(note) {
  activeNote = note;
  scrollProgress.style.width = '0%';

  // Transition: Fade out landing page
  landingPage.classList.add('page-fade-out');

  setTimeout(async () => {
    landingPage.style.display = 'none';
    
    // Setup and show note viewer with fade out initially, then transition in
    noteViewer.classList.add('page-fade-out');
    noteViewer.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });

    viewerTitle.textContent = note.title;
    viewerMeta.innerHTML = `
      <div class="note-viewer-meta-item">${note.icon} ${note.language}</div>
      <div class="note-viewer-meta-item">📖 ${note.sections} Sections</div>
      <div class="note-viewer-meta-item">${note.builtin ? '📁 Built-in' : '⬆ Uploaded'}</div>
    `;

    viewerContent.innerHTML = '<div style="text-align:center;padding:60px 0;"><div class="spinner"></div><p style="margin-top:16px;">Loading notes...</p></div>';

    let markdown = '';
    if (note.builtin) {
      // Use local JavaScript bundle content if available to prevent CORS failures locally
      if (typeof BUILTIN_NOTES_CONTENT !== 'undefined' && BUILTIN_NOTES_CONTENT[note.id]) {
        markdown = BUILTIN_NOTES_CONTENT[note.id];
      } else {
        try {
          const resp = await fetch(note.file);
          if (!resp.ok) throw new Error('File not found');
          markdown = await resp.text();
        } catch (err) {
          viewerContent.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Failed to load note</h3><p>${err.message}</p></div>`;
          noteViewer.classList.remove('page-fade-out');
          return;
        }
      }
    } else {
      markdown = note.content || '';
    }

    renderMarkdown(markdown);
    buildTOC();

    // Trigger transition-in for note viewer
    setTimeout(() => {
      noteViewer.classList.remove('page-fade-out');
    }, 50);
  }, 350);
}

function closeNoteViewer() {
  // Fade out note viewer
  noteViewer.classList.add('page-fade-out');

  // Close TOC drawer if open
  if (tocSidebar && tocSidebar.classList.contains('open')) {
    tocSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.classList.remove('toc-open');
  }

  setTimeout(() => {
    noteViewer.classList.remove('active');
    noteViewer.classList.remove('page-fade-out');
    
    // Prepare and show landing page
    landingPage.classList.add('page-fade-out');
    landingPage.style.display = 'block';

    // Scroll back to where the card is (Notes section or Upload section)
    if (activeNote) {
      const targetId = activeNote.builtin ? 'notes' : 'upload';
      const section = document.getElementById(targetId);
      if (section) section.scrollIntoView({ behavior: 'instant' });
    }

    // Trigger transition-in for landing page
    setTimeout(() => {
      landingPage.classList.remove('page-fade-out');
    }, 50);

    activeNote = null;
    scrollProgress.style.width = '0%';
  }, 350);
}

viewerBackBtn.addEventListener('click', closeNoteViewer);

// ── Markdown Renderer ──
function renderMarkdown(md) {
  // Configure marked
  const renderer = new marked.Renderer();

  // Custom heading renderer to add IDs
  renderer.heading = function(data) {
    const text = typeof data === 'object' ? data.text : data;
    const depth = typeof data === 'object' ? data.depth : arguments[1];
    const slug = text.toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `<h${depth} id="${slug}">${text}</h${depth}>`;
  };

  // Custom code block renderer
  renderer.code = function(data) {
    const code = typeof data === 'object' ? data.text : data;
    const lang = typeof data === 'object' ? (data.lang || '') : (arguments[1] || '');
    const escapedCode = escapeHtml(code);
    const langLabel = lang || 'code';
    return `
      <pre>
        <div class="code-header">
          <div class="code-header-left">
            <span class="code-dot red"></span>
            <span class="code-dot yellow"></span>
            <span class="code-dot green"></span>
            <span class="code-lang">${langLabel}</span>
          </div>
          <button class="code-copy-btn" onclick="copyCode(this)">Copy</button>
        </div>
        <code class="language-${lang}">${escapedCode}</code>
      </pre>
    `;
  };

  // Custom table renderer
  renderer.table = function(data) {
    if (typeof data === 'object' && data.header && data.rows) {
      const headerCells = data.header.map(cell => `<th>${cell.text}</th>`).join('');
      const bodyRows = data.rows.map(row => {
        const cells = row.map(cell => `<td>${cell.text}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    }
    // Fallback for string-based API
    const header = typeof data === 'string' ? data : '';
    const body = arguments[1] || '';
    return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`;
  };

  // marked v12+: use marked.use() to set renderer; marked.setOptions() is deprecated.
  marked.use({
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false
  });

  // Pre-process GFM alerts: > [!NOTE], > [!WARNING], etc.
  const processedMd = preprocessAlerts(md);
  
  let html = marked.parse(processedMd);

  viewerContent.innerHTML = html;

  // Apply highlight.js to code blocks
  viewerContent.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });
}

function preprocessAlerts(md) {
  // Convert GitHub-style alerts into custom HTML callouts
  // This handles multi-line alerts with code blocks, lists, etc.
  const alertTypes = {
    'NOTE': { icon: 'ℹ️', cssClass: 'callout-note' },
    'TIP': { icon: '💡', cssClass: 'callout-tip' },
    'IMPORTANT': { icon: '⚡', cssClass: 'callout-important' },
    'WARNING': { icon: '⚠️', cssClass: 'callout-warning' },
    'CAUTION': { icon: '🔴', cssClass: 'callout-caution' }
  };

  const lines = md.split('\n');
  const result = [];
  let inAlert = false;
  let alertType = '';
  let alertContent = [];

  function flushAlert() {
    if (!inAlert) return;
    const info = alertTypes[alertType];
    // Join the collected content lines and parse as full markdown
    const contentMd = alertContent.join('\n');
    // Use marked.parse for full markdown support (code blocks, lists, bold, etc.)
    let contentHtml;
    try {
      contentHtml = marked.parse(contentMd);
    } catch {
      contentHtml = contentMd;
    }
    result.push(`<div class="callout ${info.cssClass}"><div class="callout-title">${info.icon} ${alertType}</div>${contentHtml}</div>`);
    inAlert = false;
    alertType = '';
    alertContent = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for alert start: > [!TYPE]
    const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);
    if (alertMatch) {
      if (inAlert) {
        flushAlert();
      }
      inAlert = true;
      alertType = alertMatch[1];
      alertContent = [];
      // Check if there's content after the [!TYPE] tag on the same line
      const afterTag = line.replace(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, '');
      if (afterTag.trim()) {
        alertContent.push(afterTag);
      }
      continue;
    }

    if (inAlert) {
      // Check if this line continues the blockquote
      if (line.startsWith('>')) {
        // Remove the > prefix
        let content = line.replace(/^>\s?/, '');
        alertContent.push(content);
      } else if (line.trim() === '') {
        // Empty line could end the alert or be part of it
        // Look ahead to see if the next line continues with >
        if (i + 1 < lines.length && lines[i + 1].startsWith('>')) {
          alertContent.push('');
        } else {
          flushAlert();
          result.push(line);
        }
      } else {
        // Non-blockquote line — alert ended
        flushAlert();
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }

  // Close any open alert at end of file
  flushAlert();

  return result.join('\n');
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ── Table of Contents ──
let _tocObserver = null; // module-level reference so we can disconnect on re-open

function buildTOC() {
  tocList.innerHTML = '';

  // Disconnect any observer left over from the previous note
  if (_tocObserver) {
    _tocObserver.disconnect();
    _tocObserver = null;
  }

  const headings = viewerContent.querySelectorAll('h2, h3');
  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent;
    if (h.tagName === 'H3') a.classList.add('toc-h3');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile TOC drawer if open
      if (tocSidebar && tocSidebar.classList.contains('open')) {
        tocSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Active TOC highlighting on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const activeLink = tocList.querySelector(`a[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          
          // Smoothly scroll the active TOC item into view inside the sidebar container
          const sidebar = document.getElementById('toc-sidebar');
          if (sidebar) {
            const sidebarRect = sidebar.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();
            
            if (linkRect.top < sidebarRect.top) {
              sidebar.scrollTo({
                top: sidebar.scrollTop - (sidebarRect.top - linkRect.top + 15),
                behavior: 'smooth'
              });
            } else if (linkRect.bottom > sidebarRect.bottom) {
              sidebar.scrollTo({
                top: sidebar.scrollTop + (linkRect.bottom - sidebarRect.bottom + 15),
                behavior: 'smooth'
              });
            }
          }
        }
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 });

  headings.forEach(h => observer.observe(h));
  _tocObserver = observer; // save reference for cleanup on next note open
}

// ── Copy Code Button ──
window.copyCode = function(btn) {
  const codeBlock = btn.closest('pre').querySelector('code');
  const text = codeBlock.textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ Copied!';
    btn.style.color = 'var(--accent-success)';
    btn.style.borderColor = 'var(--accent-success)';
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  }).catch(() => {
    btn.textContent = 'Failed';
    setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
  });
};

// ── Upload Zone ──
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
  fileInput.value = '';
});

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (file.name.toLowerCase() === 'readme.md') {
      showToast('README.md cannot be loaded as a study note', 'warning');
      return;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['md', 'txt', 'markdown'].includes(ext)) {
      showToast(`${file.name} is not a supported file type`, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      
      // Extract title from first heading or filename
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].replace(/[*_`]/g, '') : file.name.replace(/\.[^.]+$/, '');

      // Count sections (h2 headings)
      const sectionCount = (content.match(/^##\s+/gm) || []).length;

      // Detect language from content
      const langInfo = detectLanguage(content, file.name);

      const noteId = 'uploaded-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
      const newNote = {
        id: noteId,
        title: title,
        description: content.substring(0, 200).replace(/[#*_`\n\r]/g, ' ').trim() + '...',
        language: langInfo.lang,
        cardClass: langInfo.cardClass,
        icon: langInfo.icon,
        sections: sectionCount || 1,
        content: content,
        builtin: false
      };

      uploadedNotes.push(newNote);
      saveUploadedNotes(uploadedNotes);
      renderNoteCards(searchInput.value.toLowerCase().trim());
      renderUploadedFileEntry(file, newNote);
      showToast(`"${title}" uploaded successfully!`, 'success');
    };
    reader.readAsText(file);
  });
}

function detectLanguage(content, filename) {
  const lower = (content + ' ' + filename).toLowerCase();
  if (lower.includes('python') || lower.includes('.py') || lower.includes('def ') || lower.includes('import ')) {
    return { lang: 'Python', cardClass: 'python', icon: '🐍' };
  }
  if (lower.includes('java') || lower.includes('class ') || lower.includes('public static void')) {
    return { lang: 'Java', cardClass: 'java', icon: '☕' };
  }
  if (lower.includes('#include') || lower.includes('malloc') || lower.includes('printf') || lower.includes('int main')) {
    return { lang: 'C / DSA', cardClass: 'c-lang', icon: '⚙️' };
  }
  if (lower.includes('javascript') || lower.includes('const ') || lower.includes('function ')) {
    return { lang: 'JavaScript', cardClass: 'uploaded', icon: '🌐' };
  }
  return { lang: 'Notes', cardClass: 'uploaded', icon: '📄' };
}

function renderUploadedFileEntry(file, note) {
  const sizeKB = (file.size / 1024).toFixed(1);
  const entry = document.createElement('div');
  entry.className = 'upload-file-item';
  entry.dataset.noteId = note.id;
  entry.innerHTML = `
    <div class="upload-file-icon">${note.icon}</div>
    <div class="upload-file-info">
      <div class="upload-file-name">${note.title}</div>
      <div class="upload-file-size">${sizeKB} KB · ${note.language}</div>
    </div>
    <div class="upload-file-status">✓ Added</div>
    <button class="upload-file-remove" title="Remove note" onclick="removeUploadedNote('${note.id}', this)">✕</button>
  `;
  uploadFileList.appendChild(entry);
}

window.removeUploadedNote = function(noteId, btn) {
  uploadedNotes = uploadedNotes.filter(n => n.id !== noteId);
  saveUploadedNotes(uploadedNotes);
  const entry = btn.closest('.upload-file-item');
  if (entry) entry.remove();
  renderNoteCards(searchInput.value.toLowerCase().trim());
  showToast('Note removed', 'info');
};

// ── Toast Notifications ──
function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    toast.style.transition = 'all 0.4s ease-in';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Scroll Animations (Intersection Observer) ──
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-in').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  animateObserver.observe(el);
});

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    // If note viewer is active and this anchor is a header nav link, let the nav link handler manage it
    if (noteViewer && noteViewer.classList.contains('active') && this.closest('.nav-links')) {
      return;
    }
    const href = this.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Render previously uploaded notes in file list ──
function renderExistingUploads() {
  uploadedNotes.forEach(note => {
    const sizeKB = note.content ? (new Blob([note.content]).size / 1024).toFixed(1) : '?';
    const entry = document.createElement('div');
    entry.className = 'upload-file-item';
    entry.dataset.noteId = note.id;
    entry.innerHTML = `
      <div class="upload-file-icon">${note.icon}</div>
      <div class="upload-file-info">
        <div class="upload-file-name">${note.title}</div>
        <div class="upload-file-size">${sizeKB} KB · ${note.language}</div>
      </div>
      <div class="upload-file-status">✓ Saved</div>
      <button class="upload-file-remove" title="Remove note" onclick="removeUploadedNote('${note.id}', this)">✕</button>
    `;
    uploadFileList.appendChild(entry);
  });
}

// ── PDF Download Logic ──
// Uses a dedicated print window instead of html2canvas, which silently produces
// blank PDFs when cross-origin stylesheets (e.g. highlight.js from cdnjs) taint
// the canvas and block toDataURL(). The print window approach is reliable in all
// browsers and produces vector (not raster) output — much crisper text.
downloadPdfBtn.addEventListener('click', () => {
  if (!activeNote) return;

  // Clone the rendered content and strip interactive UI elements
  const contentClone = document.createElement('div');
  contentClone.innerHTML = viewerContent.innerHTML;
  contentClone.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());

  const filename = activeNote.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.pdf';

  // Build a self-contained HTML document for the print window.
  // All styles are inlined — no external fetches needed — so there are zero
  // CORS issues and the window renders instantly even on localhost.
  const printHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${activeNote.title}</title>
  <style>
    /* ── Page setup ── */
    @page { margin: 15mm 18mm; }
    * { box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.75;
      color: #1a1a2e;
      background: #fff;
      max-width: 780px;
      margin: 0 auto;
      padding: 24px;
    }

    /* ── Cover block ── */
    .pdf-cover {
      border-bottom: 3px solid #6c5ce7;
      padding-bottom: 16px;
      margin-bottom: 28px;
    }
    .pdf-cover h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #1a1a2e;
      margin: 0 0 8px;
    }
    .pdf-meta {
      font-size: 0.88rem;
      color: #546e7a;
    }
    .pdf-meta strong { color: #1a1a2e; }

    /* ── Headings ── */
    h1, h2, h3, h4, h5, h6 {
      color: #1a1a2e;
      margin-top: 28px;
      margin-bottom: 8px;
      break-after: avoid;
      font-weight: 700;
    }
    h2 { font-size: 1.35rem; color: #2d2d6e; border-bottom: 1px solid #d0d0e8; padding-bottom: 4px; }
    h3 { font-size: 1.1rem;  color: #3a3a8a; }
    h4 { font-size: 1rem;    color: #4a4a9a; }

    /* ── Paragraphs & text ── */
    p { margin: 8px 0 12px; }
    strong { font-weight: 700; }
    em { font-style: italic; }
    a { color: #6c5ce7; text-decoration: underline; }
    hr { border: none; border-top: 1px solid #d0d0e0; margin: 20px 0; }

    /* ── Inline code ── */
    code {
      background: #f0f0fa;
      color: #c0392b;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', 'Consolas', monospace;
      font-size: 0.87em;
    }

    /* ── Code blocks ── */
    pre {
      background: #1e1e2e;
      border-radius: 8px;
      padding: 16px;
      margin: 14px 0;
      overflow: hidden;
      break-inside: avoid;
    }
    pre code {
      background: transparent;
      color: #cdd6f4;
      font-size: 0.84em;
      line-height: 1.55;
      white-space: pre-wrap;
      word-break: break-all;
      padding: 0;
      border-radius: 0;
    }

    /* ── Code block header (dots + lang label) ── */
    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    /* The dots + lang label live inside .code-header-left */
    .code-header-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .code-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
    .code-dot.red    { background: #ff5f57; }
    .code-dot.yellow { background: #febc2e; }
    .code-dot.green  { background: #28c840; }
    .code-lang { color: #999; font-size: 0.78em; font-family: monospace; }
    /* Hide decorative header in print — wastes space and adds no info */
    @media print { .code-header { display: none; } }

    /* ── highlight.js token colors (subset, inline) ── */
    .hljs-keyword, .hljs-selector-tag, .hljs-built_in, .hljs-name, .hljs-tag { color: #cba6f7; }
    .hljs-string, .hljs-title, .hljs-section, .hljs-attribute, .hljs-literal,
    .hljs-template-tag, .hljs-template-variable, .hljs-type, .hljs-addition { color: #a6e3a1; }
    .hljs-comment, .hljs-quote, .hljs-deletion, .hljs-meta { color: #6c7086; }
    .hljs-number, .hljs-regexp, .hljs-variable, .hljs-bullet, .hljs-link { color: #fab387; }
    .hljs-function, .hljs-attr { color: #89b4fa; }
    .hljs-class, .hljs-title.class_ { color: #f9e2af; }
    .hljs-params { color: #cdd6f4; }
    .hljs-operator, .hljs-punctuation { color: #89dceb; }

    /* ── Lists ── */
    ul, ol { padding-left: 24px; margin: 8px 0 12px; }
    li { margin: 4px 0; }

    /* ── Tables ── */
    table { border-collapse: collapse; width: 100%; margin: 16px 0; break-inside: avoid; }
    thead { background: #e8e8f8; }
    th { padding: 8px 12px; text-align: left; font-weight: 600; color: #1a1a2e; border: 1px solid #d0d0e0; }
    td { padding: 8px 12px; border: 1px solid #d0d0e0; color: #1a1a2e; }
    tr:nth-child(even) td { background: #f6f6fc; }

    /* ── Callouts & blockquotes ── */
    blockquote, .callout {
      border-left: 4px solid #6c5ce7;
      background: #f0eeff;
      color: #2a2a5a;
      padding: 12px 16px;
      margin: 14px 0;
      border-radius: 0 8px 8px 0;
      break-inside: avoid;
    }
    .callout-title { font-weight: 700; margin-bottom: 6px; }
    .callout-note      { border-color: #0ea5e9; background: #e0f2fe; color: #0c4a6e; }
    .callout-tip       { border-color: #22c55e; background: #dcfce7; color: #14532d; }
    .callout-warning   { border-color: #f59e0b; background: #fef9c3; color: #713f12; }
    .callout-caution   { border-color: #ef4444; background: #fee2e2; color: #7f1d1d; }
    .callout-important { border-color: #8b5cf6; background: #ede9fe; color: #3b0764; }

    /* ── Print-only: hide nothing (everything is already clean) ── */
    @media print {
      body { padding: 0; }
      pre { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="pdf-cover">
    <h1>${activeNote.title}</h1>
    <div class="pdf-meta">
      <strong>Language:</strong> ${activeNote.language} &nbsp;|&nbsp;
      <strong>Sections:</strong> ${activeNote.sections} &nbsp;|&nbsp;
      <strong>Source:</strong> ${activeNote.builtin ? 'Built-in Reference' : 'User Uploaded'}
    </div>
  </div>
  ${contentClone.innerHTML}
</body>
</html>`;

  // Open the print window
  const printWin = window.open('', '_blank', 'width=900,height=700');
  if (!printWin) {
    showToast('⚠ Allow pop-ups for this site, then try again.', 'error');
    return;
  }

  printWin.document.open();
  printWin.document.write(printHTML);
  printWin.document.close();

  // Wait for the window to fully render before triggering print.
  // 'load' fires after all inline resources are ready.
  printWin.addEventListener('load', () => {
    // Small delay so fonts/layout settle before the dialog opens
    setTimeout(() => {
      printWin.focus();
      printWin.print();
      // Close the helper window after the user dismisses the dialog
      printWin.addEventListener('afterprint', () => printWin.close());
    }, 400);
  });

  showToast('Print dialog opened — choose "Save as PDF"', 'success');
});

// ── Initialize ──
renderNoteCards();
renderExistingUploads();

// Auto-download helper for testing
if (window.location.search.includes('autodownload=true')) {
  console.log('Auto-download mode active');
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const pythonCard = Array.from(document.querySelectorAll('.note-card')).find(card => 
        card.querySelector('.note-card-title').textContent.includes('Python')
      );
      if (pythonCard) {
        console.log('Clicking Python card...');
        pythonCard.click();
        setTimeout(() => {
          const downloadBtn = document.getElementById('download-pdf-btn');
          if (downloadBtn) {
            console.log('Clicking Download PDF button...');
            downloadBtn.click();
          } else {
            console.error('Download button not found');
          }
        }, 2000);
      } else {
        console.error('Python card not found');
      }
    }, 2000);
  });
}