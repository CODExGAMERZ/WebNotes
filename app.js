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

// ── TOC Sidebar — Desktop collapse/expand + Mobile drawer ──
if (tocToggleBtn && tocSidebar && tocCloseBtn && sidebarOverlay) {
  const noteLayout = document.querySelector('.note-layout');
  const isMobile = () => window.innerWidth <= 1024;

  const openTOC = () => {
    if (isMobile()) {
      // Mobile: slide-in drawer
      tocSidebar.classList.add('open');
      sidebarOverlay.classList.add('active');
      document.body.classList.add('toc-open');
    } else {
      // Desktop: show the TOC column
      noteLayout && noteLayout.classList.remove('toc-collapsed');
      tocToggleBtn.textContent = '📋 Outline';
    }
  };

  const closeTOC = () => {
    if (isMobile()) {
      tocSidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
      document.body.classList.remove('toc-open');
    } else {
      // Desktop: collapse the TOC column
      noteLayout && noteLayout.classList.add('toc-collapsed');
      tocToggleBtn.textContent = '📋 Show Outline';
    }
  };

  const toggleTOC = () => {
    if (isMobile()) {
      tocSidebar.classList.contains('open') ? closeTOC() : openTOC();
    } else {
      noteLayout && noteLayout.classList.contains('toc-collapsed') ? openTOC() : closeTOC();
    }
  };

  tocToggleBtn.addEventListener('click', toggleTOC);
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
// WHY from(string) and not from(element):
//   html2pdf().from(element) positions the element itself using its existing
//   DOM geometry. If that element is off-screen (translateX, negative left, etc.)
//   html2canvas reads a blank viewport rect → blank PDF.
//   from(string) makes html2pdf create and manage its OWN container, appending
//   it at body-level with correct geometry, so html2canvas always gets a
//   visible, renderable element regardless of what the page is doing.
//
// WHY inline styles and not a <style> tag:
//   html2canvas resolves styles by reading computed values. External/CDN
//   stylesheets (highlight.js atom-one-dark) can taint the canvas on some
//   origins (localhost in particular), causing toDataURL() to throw a
//   SecurityError → blank PDF. With every colour baked in as an inline style
//   attribute there is zero dependency on external CSS and zero CORS exposure.
downloadPdfBtn.addEventListener('click', () => {
  if (!activeNote) return;

  downloadPdfBtn.disabled = true;
  const originalHTML = downloadPdfBtn.innerHTML;
  downloadPdfBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" style="display:inline-block;vertical-align:middle;
         margin-right:6px;animation:spin 1s linear infinite;">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
               M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>Generating…`;

  // ── 1. Clone rendered content, strip interactive chrome ──
  const clone = viewerContent.cloneNode(true);
  clone.querySelectorAll('.code-copy-btn, .code-header').forEach(el => el.remove());

  // ── 2. Inline highlight.js token colours ──
  // Replaces the CDN stylesheet dependency with direct colour values on each span.
  const TOKEN_COLORS = {
    'hljs-keyword':      '#c792ea', 'hljs-selector-tag': '#c792ea',
    'hljs-built_in':     '#c792ea', 'hljs-name':         '#c792ea',
    'hljs-tag':          '#c792ea',
    'hljs-string':       '#c3e88d', 'hljs-title':        '#c3e88d',
    'hljs-section':      '#c3e88d', 'hljs-attribute':    '#c3e88d',
    'hljs-literal':      '#c3e88d', 'hljs-addition':     '#c3e88d',
    'hljs-type':         '#c3e88d',
    'hljs-comment':      '#546e7a', 'hljs-quote':        '#546e7a',
    'hljs-deletion':     '#546e7a', 'hljs-meta':         '#546e7a',
    'hljs-number':       '#f78c6c', 'hljs-regexp':       '#f78c6c',
    'hljs-variable':     '#f78c6c', 'hljs-bullet':       '#f78c6c',
    'hljs-link':         '#f78c6c',
    'hljs-function':     '#82aaff', 'hljs-attr':         '#82aaff',
    'hljs-class':        '#ffcb6b',
    'hljs-params':       '#e0e0ef',
    'hljs-operator':     '#89ddff', 'hljs-punctuation':  '#89ddff',
  };
  clone.querySelectorAll('[class]').forEach(el => {
    const match = [...el.classList].find(c => TOKEN_COLORS[c]);
    if (match) el.style.color = TOKEN_COLORS[match];
  });

  // ── 3. Inline all block-level styles ──

  // pre (code blocks)
  clone.querySelectorAll('pre').forEach(pre => {
    Object.assign(pre.style, {
      background: '#1a1a2e', borderRadius: '8px', padding: '14px 16px',
      margin: '14px 0', overflow: 'hidden', pageBreakInside: 'avoid',
      border: '1px solid rgba(255,255,255,0.07)',
    });
  });
  // code inside pre
  clone.querySelectorAll('pre code').forEach(code => {
    Object.assign(code.style, {
      background: 'transparent', color: '#e0e0ef', fontSize: '0.83em',
      lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
      fontFamily: "'Courier New', Consolas, monospace", padding: '0',
    });
  });
  // inline code
  clone.querySelectorAll('code').forEach(code => {
    if (!code.closest('pre')) Object.assign(code.style, {
      background: '#f0f0fa', color: '#c0392b', padding: '2px 5px',
      borderRadius: '4px', fontFamily: "'Courier New', Consolas, monospace",
      fontSize: '0.87em',
    });
  });

  // headings
  const H_COLOR = { H1:'#1a1a2e', H2:'#2d2d6e', H3:'#3a3a8a', H4:'#4a4a9a' };
  clone.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
    Object.assign(h.style, {
      color: H_COLOR[h.tagName] || '#1a1a2e',
      fontFamily: 'system-ui,-apple-system,sans-serif',
      fontWeight: '700', marginTop: '22px', marginBottom: '6px',
    });
    if (h.tagName === 'H2') {
      h.style.borderBottom = '1px solid #d0d0e8';
      h.style.paddingBottom = '4px';
    }
  });

  // paragraphs / lists
  clone.querySelectorAll('p').forEach(p => {
    p.style.color = '#1a1a2e'; p.style.margin = '8px 0 12px';
  });
  clone.querySelectorAll('li').forEach(li => { li.style.color = '#1a1a2e'; });
  clone.querySelectorAll('a').forEach(a => { a.style.color = '#6c5ce7'; });
  clone.querySelectorAll('strong,b').forEach(s => {
    s.style.fontWeight = '700'; s.style.color = 'inherit';
  });
  clone.querySelectorAll('hr').forEach(hr => { hr.style.borderColor = '#d0d0e0'; });

  // blockquotes / callouts
  clone.querySelectorAll('blockquote,.callout').forEach(el => {
    Object.assign(el.style, {
      borderLeft: '4px solid #6c5ce7', background: '#f0eeff',
      color: '#2a2a5a', padding: '12px 16px', margin: '12px 0',
      borderRadius: '0 8px 8px 0',
    });
  });

  // tables
  clone.querySelectorAll('table').forEach(t => {
    t.style.borderCollapse = 'collapse'; t.style.width = '100%'; t.style.margin = '14px 0';
  });
  clone.querySelectorAll('th').forEach(th => Object.assign(th.style, {
    background: '#e8e8f8', color: '#1a1a2e', padding: '7px 11px',
    border: '1px solid #d0d0e0', fontWeight: '600', textAlign: 'left',
  }));
  clone.querySelectorAll('td').forEach(td => Object.assign(td.style, {
    padding: '7px 11px', border: '1px solid #d0d0e0', color: '#1a1a2e',
  }));

  // ── 4. Build self-contained HTML string ──
  // html2pdf manages positioning of the container it creates from this string,
  // so there are no viewport/transform/off-screen issues.
  const coverHTML = `
    <div style="border-bottom:3px solid #6c5ce7;padding-bottom:14px;margin-bottom:24px;">
      <h1 style="font-size:2rem;font-weight:800;color:#1a1a2e;margin:0 0 6px;
                 font-family:system-ui,-apple-system,sans-serif;">${activeNote.title}</h1>
      <div style="font-size:0.87rem;color:#546e7a;font-family:sans-serif;">
        <strong style="color:#1a1a2e;">Language:</strong> ${activeNote.language}&nbsp;|&nbsp;
        <strong style="color:#1a1a2e;">Sections:</strong> ${activeNote.sections}&nbsp;|&nbsp;
        <strong style="color:#1a1a2e;">Source:</strong> ${activeNote.builtin ? 'Built-in Reference' : 'User Uploaded'}
      </div>
    </div>`;

  const htmlString = `
    <div style="width:780px;padding:28px 32px;background:#ffffff;color:#1a1a2e;
                font-family:system-ui,-apple-system,'Segoe UI',sans-serif;
                font-size:14px;line-height:1.75;box-sizing:border-box;">
      ${coverHTML}
      ${clone.innerHTML}
    </div>`;

  // ── 5. Generate & download ──
  showToast('Building PDF…', 'info');

  html2pdf().set({
    margin:      [10, 0, 10, 0],   // top/bottom only; left/right handled by container padding
    filename:    `${activeNote.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`,
    image:       { type: 'jpeg', quality: 0.97 },
    html2canvas: {
      scale:           2,
      useCORS:         true,
      allowTaint:      true,
      logging:         false,
      backgroundColor: '#ffffff',
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(htmlString, 'string').save()
    .then(() => showToast('✅ PDF downloaded!', 'success'))
    .catch(err => {
      console.error('PDF error:', err);
      showToast('PDF generation failed — see console for details.', 'error');
    })
    .finally(() => {
      downloadPdfBtn.disabled = false;
      downloadPdfBtn.innerHTML = originalHTML;
    });
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