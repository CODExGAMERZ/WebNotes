/* ========================================
   WebNotes — Application Logic
   ======================================== */

// ── Fallback Built-in Notes (used when Supabase is not configured) ──
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
    content: null,
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
    content: null,
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
    content: null,
    builtin: true
  }
];

// ── Uploaded Notes (localStorage) ──
function loadUploadedNotes() {
  try {
    const data = localStorage.getItem('webnotes_uploaded');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
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
let activeNote    = null;

// Base notes from DB (or fallback). Populated in initApp().
let baseNotes = [];

function getAllNotes() {
  return [...baseNotes, ...uploadedNotes];
}

// ── DOM References ──
const navbar          = document.getElementById('navbar');
const hamburger       = document.getElementById('hamburger');
const navLinks        = document.getElementById('nav-links');
const navLogoLink     = document.getElementById('nav-logo-link');
const searchInput     = document.getElementById('search-input');
const landingPage     = document.getElementById('landing-page');
const noteViewer      = document.getElementById('note-viewer');
const viewerTitle     = document.getElementById('viewer-title');
const viewerMeta      = document.getElementById('viewer-meta');
const viewerContent   = document.getElementById('viewer-content');
const viewerBackBtn   = document.getElementById('viewer-back-btn');
const downloadPdfBtn  = document.getElementById('download-pdf-btn');
const scrollProgress  = document.getElementById('scroll-progress');
const tocSidebar      = document.getElementById('toc-sidebar');
const tocList         = document.getElementById('toc-list');
const tocToggleBtn    = document.getElementById('toc-toggle-btn');
const tocCloseBtn     = document.getElementById('toc-close-btn');
const sidebarOverlay  = document.getElementById('sidebar-overlay');
const uploadZone      = document.getElementById('upload-zone');
const fileInput       = document.getElementById('file-upload-input');
const uploadFileList  = document.getElementById('upload-file-list');
const toastContainer  = document.getElementById('toast-container');
const statNotes       = document.getElementById('stat-notes');
const statTopics      = document.getElementById('stat-topics');
const statSections    = document.getElementById('stat-sections');

// ── Carousel DOM ──
const carouselOuter   = document.getElementById('carousel-outer');
const carouselTrack   = document.getElementById('carousel-track');
const carouselDots    = document.getElementById('carousel-dots');
const carouselEmpty   = document.getElementById('carousel-empty');
const carouselLoading = document.getElementById('carousel-loading');
const carouselPrevBtn = document.getElementById('carousel-prev');
const carouselNextBtn = document.getElementById('carousel-next');

// ── Carousel State ──
let carouselNotes  = [];   // the currently-displayed subset (filtered or all)
let carouselIdx    = 0;
let carouselTimer  = null;
let carouselBusy   = false;

// ════════════════════════════════════════════
//  CAROUSEL CORE
// ════════════════════════════════════════════

function initCarousel(notes) {
  carouselNotes = notes;
  carouselIdx   = 0;

  if (carouselLoading) carouselLoading.style.display = 'none';

  if (notes.length === 0) {
    if (carouselOuter)  carouselOuter.style.display  = 'none';
    if (carouselEmpty)  carouselEmpty.style.display  = 'block';
    if (carouselDots)   carouselDots.innerHTML        = '';
    return;
  }

  if (carouselOuter)  carouselOuter.style.display  = 'flex';
  if (carouselEmpty)  carouselEmpty.style.display  = 'none';

  renderCarouselCards();
  renderCarouselDots();
  startCarouselAuto();
}

/** Returns the [left, center, right] note objects for the current index. */
function getSlotNotes() {
  const n = carouselNotes.length;
  if (n === 0) return [null, null, null];
  if (n === 1) return [null, carouselNotes[0], null];
  if (n === 2) return [
    carouselNotes[(carouselIdx + 1) % 2],
    carouselNotes[carouselIdx],
    carouselNotes[(carouselIdx + 1) % 2]
  ];
  return [
    carouselNotes[(carouselIdx - 1 + n) % n],
    carouselNotes[carouselIdx],
    carouselNotes[(carouselIdx + 1) % n]
  ];
}

function buildCardHTML(note, pos) {
  return `
    <div class="note-card ${note.cardClass} carousel-card carousel-${pos}" data-note-id="${note.id}" tabindex="0" role="button" aria-label="${pos === 'center' ? 'Open ' : ''}${note.title}">
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
          <div class="note-card-open-btn">Open Note <span>→</span></div>
        </div>
      </div>
    </div>`;
}

function renderCarouselCards() {
  if (!carouselTrack) return;
  const [left, center, right] = getSlotNotes();

  let html = '';
  if (left)   html += buildCardHTML(left,   'left');
  if (center) html += buildCardHTML(center, 'center');
  if (right)  html += buildCardHTML(right,  'right');
  carouselTrack.innerHTML = html;

  // Attach click + keyboard events
  const leftEl   = carouselTrack.querySelector('.carousel-left');
  const centerEl = carouselTrack.querySelector('.carousel-center');
  const rightEl  = carouselTrack.querySelector('.carousel-right');

  if (leftEl)   { leftEl.addEventListener('click',   () => rotateCarousel(-1)); leftEl.addEventListener('keydown',   e => e.key === 'Enter' && rotateCarousel(-1)); }
  if (rightEl)  { rightEl.addEventListener('click',  () => rotateCarousel(1));  rightEl.addEventListener('keydown',  e => e.key === 'Enter' && rotateCarousel(1)); }
  if (centerEl && center) {
    centerEl.addEventListener('click',   () => openNote(center));
    centerEl.addEventListener('keydown', e => e.key === 'Enter' && openNote(center));
  }
}

function renderCarouselDots() {
  if (!carouselDots) return;
  carouselDots.innerHTML = carouselNotes.map((_, i) =>
    `<div class="carousel-dot${i === carouselIdx ? ' active' : ''}" data-idx="${i}" title="Note ${i + 1}"></div>`
  ).join('');
  carouselDots.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.idx, 10);
      if (target !== carouselIdx) rotateCarouselTo(target);
    });
  });
}

/** Rotate by dir (+1 = next, -1 = prev), then optionally land at targetIdx. */
function rotateCarousel(dir, targetIdx = null) {
  if (carouselBusy || carouselNotes.length <= 1) return;
  carouselBusy = true;
  resetCarouselAuto(); // reset the timer on manual interaction

  const outClass = dir > 0 ? 'anim-out' : 'anim-out-rev';
  const inClass  = dir > 0 ? 'anim-in'  : 'anim-in-rev';

  carouselTrack.classList.add(outClass);

  setTimeout(() => {
    carouselIdx = targetIdx !== null
      ? targetIdx
      : (carouselIdx + dir + carouselNotes.length) % carouselNotes.length;

    carouselTrack.classList.remove(outClass);
    renderCarouselCards();
    renderCarouselDots();

    // Force a reflow so the browser sees the class removal before we add anim-in
    carouselTrack.getBoundingClientRect();
    carouselTrack.classList.add(inClass);

    setTimeout(() => {
      carouselTrack.classList.remove(inClass);
      carouselBusy = false;
    }, 300);
  }, 280);
}

function rotateCarouselTo(targetIdx) {
  if (targetIdx === carouselIdx || carouselBusy) return;
  rotateCarousel(targetIdx > carouselIdx ? 1 : -1, targetIdx);
}

function startCarouselAuto() {
  stopCarouselAuto();
  if (carouselNotes.length <= 1) return;
  carouselTimer = setInterval(() => rotateCarousel(1), 3600);
}

function stopCarouselAuto() {
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
}

function resetCarouselAuto() {
  stopCarouselAuto();
  startCarouselAuto();
}

// Pause on hover, resume on leave
if (carouselTrack) {
  carouselTrack.addEventListener('mouseenter', stopCarouselAuto);
  carouselTrack.addEventListener('mouseleave', startCarouselAuto);
}

// Touch swipe support
let _touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  if (e.target.closest('#carousel-track')) {
    _touchStartX = e.touches[0].clientX;
    stopCarouselAuto();
  }
}, { passive: true });
document.addEventListener('touchend', (e) => {
  if (e.target.closest('#carousel-track')) {
    const dx = e.changedTouches[0].clientX - _touchStartX;
    if (Math.abs(dx) > 50) rotateCarousel(dx < 0 ? 1 : -1);
    startCarouselAuto();
  }
}, { passive: true });

// Arrow button clicks
if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', () => rotateCarousel(-1));
if (carouselNextBtn) carouselNextBtn.addEventListener('click', () => rotateCarousel(1));

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const isViewerActive = noteViewer.classList.contains('active');
  const isInputFocused = document.activeElement === searchInput || 
                         document.activeElement.tagName === 'INPUT' || 
                         document.activeElement.tagName === 'TEXTAREA';

  // 1. Universal Shortcuts:
  // "/" focuses search bar (if searchInput is on the page and not already focused on an input)
  if (e.key === '/' && !isInputFocused) {
    if (!isViewerActive) {
      e.preventDefault();
      const searchSec = document.getElementById('notes');
      if (searchSec) {
        searchSec.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => searchInput.focus(), 300);
    }
  }

  // Alt + K toggles the shortcuts helper modal
  if (e.altKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    toggleShortcutsModal();
  }

  // 2. Note Viewer specific shortcuts:
  if (isViewerActive) {
    // Escape goes back
    if (e.key === 'Escape') {
      e.preventDefault();
      closeNoteViewer();
    }
    // Alt + H closes reader and returns to Home Page top
    if (e.altKey && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      closeNoteViewer('home');
    }
    // Alt + N closes reader and returns to Notes collection
    if (e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      closeNoteViewer('notes');
    }
    // Alt + U closes reader and returns to Upload section
    if (e.altKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      closeNoteViewer('upload');
    }
    // Alt + O toggles Outline (TOC)
    if (e.altKey && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      toggleTOC();
    }
    // Alt + P triggers PDF download
    if (e.altKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      if (downloadPdfBtn) downloadPdfBtn.click();
    }
  } else {
    // 3. Landing page specific shortcuts:
    if (!isInputFocused) {
      if (e.key === 'ArrowLeft')  rotateCarousel(-1);
      if (e.key === 'ArrowRight') rotateCarousel(1);
      
      // Alt + H scrolls to Home (Hero)
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // Alt + N scrolls to Notes
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const section = document.getElementById('notes');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }
      // Alt + U scrolls to Upload
      if (e.altKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        const section = document.getElementById('upload');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
});

// ════════════════════════════════════════════
//  SEARCH — filters carousel notes in real time
// ════════════════════════════════════════════
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase().trim();
  stopCarouselAuto();

  if (!term) {
    initCarousel(getAllNotes());
    return;
  }

  const filtered = getAllNotes().filter(n =>
    n.title.toLowerCase().includes(term)       ||
    n.language.toLowerCase().includes(term)    ||
    n.description.toLowerCase().includes(term)
  );

  carouselNotes = filtered;
  carouselIdx   = 0;

  if (filtered.length === 0) {
    if (carouselOuter)  carouselOuter.style.display = 'none';
    if (carouselEmpty)  carouselEmpty.style.display = 'block';
    if (carouselDots)   carouselDots.innerHTML = '';
  } else {
    if (carouselOuter)  carouselOuter.style.display = 'flex';
    if (carouselEmpty)  carouselEmpty.style.display = 'none';
    renderCarouselCards();
    renderCarouselDots();
    // Don't auto-rotate during an active search
  }
});

// Resume auto-rotate when search is cleared
searchInput.addEventListener('blur', () => {
  if (!searchInput.value.trim()) startCarouselAuto();
});

// ════════════════════════════════════════════
//  STATS
// ════════════════════════════════════════════
function updateStats() {
  const all = getAllNotes();
  statNotes.textContent    = all.length;
  statTopics.textContent   = new Set(all.map(n => n.language)).size;
  statSections.textContent = all.reduce((s, n) => s + (n.sections || 0), 0);
}

// ════════════════════════════════════════════
//  APP INIT — fetch from Supabase or fallback
// ════════════════════════════════════════════
async function initApp() {
  // Show loading state
  if (carouselLoading) carouselLoading.style.display = 'flex';
  if (carouselOuter)   carouselOuter.style.display   = 'none';

  let dbNotes = null;

  if (typeof fetchNotesFromSupabase === 'function') {
    dbNotes = await fetchNotesFromSupabase();
  }

  // Use DB notes if available; otherwise fall back to the hardcoded built-ins
  baseNotes = dbNotes && dbNotes.length > 0 ? dbNotes : [...BUILTIN_NOTES];

  updateStats();
  initCarousel(getAllNotes());
  renderExistingUploads();
}

// ════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// ── TOC Sidebar Toggle Drawer & Layout ──
const isMobile = () => window.innerWidth <= 1024;
const openTOC  = () => { tocSidebar.classList.add('open'); sidebarOverlay.classList.add('active'); document.body.classList.add('toc-open'); };
const closeTOC = () => { tocSidebar.classList.remove('open'); sidebarOverlay.classList.remove('active'); document.body.classList.remove('toc-open'); };

const toggleTOC = () => {
  if (isMobile()) {
    if (tocSidebar.classList.contains('open')) {
      closeTOC();
    } else {
      openTOC();
    }
  } else {
    const noteLayout = document.querySelector('.note-layout');
    if (noteLayout) {
      noteLayout.classList.toggle('toc-collapsed');
    }
  }
};

if (tocToggleBtn && tocSidebar && tocCloseBtn && sidebarOverlay) {
  tocToggleBtn.addEventListener('click', toggleTOC);
  tocCloseBtn.addEventListener('click', closeTOC);
  sidebarOverlay.addEventListener('click', closeTOC);
}

// ── Keyboard Shortcuts Help Modal ──
const shortcutsModal = document.getElementById('shortcuts-modal');
const shortcutsBtn   = document.getElementById('keyboard-shortcuts-btn');
const shortcutsClose = document.getElementById('shortcuts-close-btn');

const toggleShortcutsModal = () => {
  if (shortcutsModal) {
    shortcutsModal.classList.toggle('open');
  }
};

if (shortcutsBtn && shortcutsClose && shortcutsModal) {
  shortcutsBtn.addEventListener('click', toggleShortcutsModal);
  shortcutsClose.addEventListener('click', () => shortcutsModal.classList.remove('open'));
  shortcutsModal.addEventListener('click', (e) => {
    if (e.target === shortcutsModal) {
      shortcutsModal.classList.remove('open');
    }
  });
}

const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 40);
  if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollY > 400);

  if (activeNote && noteViewer.classList.contains('active')) {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress.style.width = height > 0 ? (winScroll / height) * 100 + '%' : '0%';
  } else {
    scrollProgress.style.width = '0%';
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
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
      }, 350);
    }
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

navLogoLink.addEventListener('click', (e) => {
  e.preventDefault();
  if (noteViewer.classList.contains('active')) closeNoteViewer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ════════════════════════════════════════════
//  NOTE VIEWER
// ════════════════════════════════════════════
async function openNote(note) {
  activeNote = note;
  scrollProgress.style.width = '0%';
  stopCarouselAuto();

  landingPage.classList.add('page-fade-out');

  setTimeout(async () => {
    landingPage.style.display = 'none';
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

    if (note.content) {
      // Content stored directly (DB note or uploaded)
      markdown = note.content;
    } else if (note.builtin) {
      // Try JS bundle first (fast, no CORS issues)
      if (typeof BUILTIN_NOTES_CONTENT !== 'undefined' && BUILTIN_NOTES_CONTENT[note.id]) {
        markdown = BUILTIN_NOTES_CONTENT[note.id];
      } else {
        // Fallback to fetch from file
        try {
          const resp = await fetch(note.file || `${note.id}.md`);
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

    setTimeout(() => noteViewer.classList.remove('page-fade-out'), 50);
  }, 350);
}

function closeNoteViewer(scrollToSectionId = null) {
  if (typeof stopSpeaking === 'function') stopSpeaking();
  noteViewer.classList.add('page-fade-out');

  if (tocSidebar && tocSidebar.classList.contains('open')) {
    tocSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.classList.remove('toc-open');
  }

  setTimeout(() => {
    noteViewer.classList.remove('active');
    noteViewer.classList.remove('page-fade-out');

    landingPage.classList.add('page-fade-out');
    landingPage.style.display = 'block';

    const targetSection = typeof scrollToSectionId === 'string' ? scrollToSectionId : null;

    if (targetSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      const targetId = targetSection || (activeNote?.builtin ? 'notes' : 'upload');
      const section  = document.getElementById(targetId);
      if (section) section.scrollIntoView({ behavior: 'instant' });
    }

    setTimeout(() => landingPage.classList.remove('page-fade-out'), 50);

    activeNote = null;
    scrollProgress.style.width = '0%';
    startCarouselAuto(); // resume carousel when back on landing
  }, 350);
}

viewerBackBtn.addEventListener('click', closeNoteViewer);

// ════════════════════════════════════════════
//  MARKDOWN RENDERER
// ════════════════════════════════════════════
function renderMarkdown(md) {
  const renderer = new marked.Renderer();
  const _seenSlugs = {};   // tracks used IDs to deduplicate

  renderer.heading = function(data) {
    const text  = typeof data === 'object' ? data.text  : data;
    const depth = typeof data === 'object' ? data.depth : arguments[1];
    const base  = text.toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    // Deduplicate: append -2, -3… for repeated slugs
    let slug = base;
    if (_seenSlugs[base] !== undefined) {
      _seenSlugs[base]++;
      slug = `${base}-${_seenSlugs[base]}`;
    } else {
      _seenSlugs[base] = 1;
    }
    return `<h${depth} id="${slug}">${text}</h${depth}>`;
  };

  renderer.code = function(data) {
    const code      = typeof data === 'object' ? data.text    : data;
    const lang      = typeof data === 'object' ? (data.lang || '') : (arguments[1] || '');
    const escaped   = escapeHtml(code);
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
        <code class="language-${lang}">${escaped}</code>
      </pre>
    `;
  };

  renderer.table = function(data) {
    if (typeof data === 'object' && data.header && data.rows) {
      const headerCells = data.header.map(cell => `<th>${cell.text}</th>`).join('');
      const bodyRows    = data.rows.map(row => {
        const cells = row.map(cell => `<td>${cell.text}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    }
    const header = typeof data === 'string' ? data : '';
    const body   = arguments[1] || '';
    return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`;
  };

  marked.use({ renderer, gfm: true, breaks: false, pedantic: false });

  const processedMd = preprocessAlerts(md);
  viewerContent.innerHTML = marked.parse(processedMd);

  viewerContent.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
}

function preprocessAlerts(md) {
  const alertTypes = {
    'NOTE':      { icon: 'ℹ️',  cssClass: 'callout-note' },
    'TIP':       { icon: '💡', cssClass: 'callout-tip' },
    'IMPORTANT': { icon: '⚡', cssClass: 'callout-important' },
    'WARNING':   { icon: '⚠️', cssClass: 'callout-warning' },
    'CAUTION':   { icon: '🔴', cssClass: 'callout-caution' }
  };

  const lines = md.split('\n');
  const result = [];
  let inAlert = false, alertType = '', alertContent = [];

  function flushAlert() {
    if (!inAlert) return;
    const info        = alertTypes[alertType];
    const contentMd   = alertContent.join('\n');
    let contentHtml;
    try { contentHtml = marked.parse(contentMd); } catch { contentHtml = contentMd; }
    result.push(`<div class="callout ${info.cssClass}"><div class="callout-title">${info.icon} ${alertType}</div>${contentHtml}</div>`);
    inAlert = false; alertType = ''; alertContent = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line       = lines[i];
    const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);

    if (alertMatch) {
      if (inAlert) flushAlert();
      inAlert = true; alertType = alertMatch[1]; alertContent = [];
      const afterTag = line.replace(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, '');
      if (afterTag.trim()) alertContent.push(afterTag);
      continue;
    }

    if (inAlert) {
      if (line.startsWith('>')) {
        alertContent.push(line.replace(/^>\s?/, ''));
      } else if (line.trim() === '') {
        if (i + 1 < lines.length && lines[i + 1].startsWith('>')) alertContent.push('');
        else { flushAlert(); result.push(line); }
      } else { flushAlert(); result.push(line); }
    } else {
      result.push(line);
    }
  }
  flushAlert();
  return result.join('\n');
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ════════════════════════════════════════════
//  TABLE OF CONTENTS
// ════════════════════════════════════════════
let _tocObserver = null;

function buildTOC() {
  tocList.innerHTML = '';
  if (_tocObserver) { _tocObserver.disconnect(); _tocObserver = null; }

  const allHeadings = Array.from(viewerContent.querySelectorAll('h2, h3'));

  const makeLink = (h) => {
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent.trim();
    if (h.tagName === 'H3') a.classList.add('toc-h3');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (tocSidebar && tocSidebar.classList.contains('open')) {
        tocSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    return a;
  };

  let currentSubList = null;
  allHeadings.forEach(h => {
    if (h.tagName === 'H2') {
      const li = document.createElement('li');
      li.appendChild(makeLink(h));
      currentSubList = document.createElement('ul');
      currentSubList.className = 'toc-sublist';
      li.appendChild(currentSubList);
      tocList.appendChild(li);
    } else if (h.tagName === 'H3' && currentSubList) {
      const li = document.createElement('li');
      li.appendChild(makeLink(h));
      currentSubList.appendChild(li);
    }
  });

  const headings = allHeadings;
  let _rafPending = false, _activeHeadingId = null;
  const NAVBAR_HEIGHT = 100;

  const updateActiveTOC = () => {
    let best = null;
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= NAVBAR_HEIGHT + 8) best = h;
      // No `else break` — headings inside callout divs may sit out of
      // strict visual order in the DOM, which would cause an early exit
      // and freeze the active highlight.
    }
    const targetId = best ? best.id : (headings[0] ? headings[0].id : null);
    if (!targetId || targetId === _activeHeadingId) return;
    _activeHeadingId = targetId;

    const links = tocList.querySelectorAll('a');
    let activeLink = null;
    links.forEach(a => {
      const isActive = a.getAttribute('href') === `#${targetId}`;
      a.classList.toggle('active', isActive);
      if (isActive) activeLink = a;
    });
    if (activeLink && tocSidebar) {
      setTimeout(() => {
        const sr = tocSidebar.getBoundingClientRect();
        const lr = activeLink.getBoundingClientRect();
        if (lr.top < sr.top + 8)       tocSidebar.scrollBy({ top: lr.top - sr.top - 16,   behavior: 'smooth' });
        else if (lr.bottom > sr.bottom - 8) tocSidebar.scrollBy({ top: lr.bottom - sr.bottom + 16, behavior: 'smooth' });
      }, 0);
    }
  };

  const onScroll = () => {
    if (_rafPending) return;
    _rafPending = true;
    requestAnimationFrame(() => { updateActiveTOC(); _rafPending = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  updateActiveTOC();
  _tocObserver = { disconnect: () => window.removeEventListener('scroll', onScroll) };
}

// ── Copy Code ──
window.copyCode = function(btn) {
  const codeBlock = btn.closest('pre').querySelector('code');
  navigator.clipboard.writeText(codeBlock.textContent).then(() => {
    btn.textContent = '✓ Copied!';
    btn.style.color = 'var(--accent-success)';
    btn.style.borderColor = 'var(--accent-success)';
    setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; btn.style.borderColor = ''; }, 2000);
  }).catch(() => { btn.textContent = 'Failed'; setTimeout(() => { btn.textContent = 'Copy'; }, 1500); });
};

// ════════════════════════════════════════════
//  UPLOAD ZONE
// ════════════════════════════════════════════
uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', (e) => { e.preventDefault(); uploadZone.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
fileInput.addEventListener('change', (e) => { handleFiles(e.target.files); fileInput.value = ''; });

function handleFiles(files) {
  Array.from(files).forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['md', 'txt', 'markdown'].includes(ext)) {
      showToast(`${file.name} is not a supported file type`, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = async function(e) {
      const content    = e.target.result;
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title      = titleMatch ? titleMatch[1].replace(/[*_`]/g, '') : file.name.replace(/\.[^.]+$/, '');
      const sections   = (content.match(/^##\s+/gm) || []).length;
      const langInfo   = detectLanguage(content, file.name);
      const noteId     = 'uploaded-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);

      const newNote = {
        id: noteId, title, sections,
        description: (() => {
          const bodyText = content
            .split('\n')
            .filter(l => !l.match(/^#{1,6}\s/) && l.trim() !== '' && !l.match(/^```/) && !l.match(/^\|/) && !l.match(/^---/))
            .slice(0, 6)                          // first meaningful lines only
            .join(' ')
            .replace(/[*_`\[\]#>!|\\]/g, '')
            .replace(/\(https?:\/\/[^\)]+\)/g, '')// strip URLs
            .replace(/\s+/g, ' ')
            .trim();
          const trimmed = bodyText.length > 130 ? bodyText.substring(0, 127).replace(/\s+\S*$/, '') + '…' : bodyText;
          return trimmed || 'No description available.';
        })(),
        language: langInfo.lang, cardClass: langInfo.cardClass, icon: langInfo.icon,
        content, builtin: false
      };

      // Always save locally first so the note is available immediately
      uploadedNotes.push(newNote);
      saveUploadedNotes(uploadedNotes);
      updateStats();

      // Add immediately to the carousel rotation
      if (!searchInput.value.trim()) {
        carouselNotes = getAllNotes();
        renderCarouselCards();
        renderCarouselDots();
        if (carouselOuter) carouselOuter.style.display = 'flex';
        if (carouselEmpty) carouselEmpty.style.display = 'none';
      }

      // Render entry with "Saving…" status while we talk to Supabase
      const entry = renderUploadedFileEntry(file, newNote, 'saving');
      showToast(`"${title}" added!`, 'success');

      // Attempt to persist to Supabase (non-blocking)
      if (typeof insertNoteToSupabase === 'function') {
        const ok = await insertNoteToSupabase(newNote);
        if (entry) {
          const statusEl = entry.querySelector('.upload-file-status');
          if (statusEl) {
            if (ok) {
              statusEl.textContent = '☁ Synced';
              statusEl.style.color = 'var(--accent-success, #00b894)';
            } else {
              statusEl.textContent = '📱 Local only';
              statusEl.style.color = 'var(--text-muted)';
              statusEl.title = 'Supabase unavailable — note saved in this browser only';
            }
          }
        }
      }
    };
    reader.readAsText(file);
  });
}

function detectLanguage(content, filename) {
  const fname = filename.toLowerCase();
  const lower = content.toLowerCase();

  // ── 1. Filename first — most reliable ────────────────────────
  if (fname.includes('python') || fname.endsWith('.py'))
    return { lang: 'Python',     cardClass: 'python',     icon: '🐍' };
  if ((fname.includes('java') && !fname.includes('javascript')) || fname.endsWith('.java'))
    return { lang: 'Java',       cardClass: 'java',       icon: '☕' };
  if (fname.endsWith('.cpp') || fname.endsWith('.cc') || fname.endsWith('.cxx') || fname.includes('cpp') || fname.includes('c++'))
    return { lang: 'C++',        cardClass: 'cpp-lang',   icon: '⚙️' };
  if (fname.includes('_c_') || fname.startsWith('c_') || fname.endsWith('.c') || fname.endsWith('.h') || fname.includes('dsa') || fname.includes('c_reference'))
    return { lang: 'C / DSA',    cardClass: 'c-lang',     icon: '⚙️' };
  if (fname.includes('typescript') || fname.endsWith('.ts') || fname.endsWith('.tsx'))
    return { lang: 'TypeScript', cardClass: 'ts-lang',    icon: '🔷' };
  if (fname.includes('javascript') || fname.endsWith('.js') || fname.endsWith('.jsx'))
    return { lang: 'JavaScript', cardClass: 'js-lang',    icon: '🌐' };
  if (fname.includes('rust')   || fname.endsWith('.rs'))
    return { lang: 'Rust',       cardClass: 'rust-lang',  icon: '🦀' };
  if (fname.includes('golang') || fname.includes('_go') || fname.endsWith('.go'))
    return { lang: 'Go',         cardClass: 'go-lang',    icon: '🐹' };
  if (fname.includes('kotlin') || fname.endsWith('.kt') || fname.endsWith('.kts'))
    return { lang: 'Kotlin',     cardClass: 'kotlin-lang',icon: '🎯' };
  if (fname.includes('swift')  || fname.endsWith('.swift'))
    return { lang: 'Swift',      cardClass: 'swift-lang', icon: '🍎' };
  if (fname.includes('ruby')   || fname.endsWith('.rb'))
    return { lang: 'Ruby',       cardClass: 'ruby-lang',  icon: '💎' };
  if (fname.includes('php')    || fname.endsWith('.php'))
    return { lang: 'PHP',        cardClass: 'php-lang',   icon: '🐘' };
  if (fname.includes('sql') || fname.includes('database') || fname.includes('postgres') || fname.includes('mysql') || fname.endsWith('.sql'))
    return { lang: 'SQL / DB',   cardClass: 'sql-lang',   icon: '🗄️' };
  if (fname.includes('shell') || fname.includes('bash') || fname.endsWith('.sh') || fname.endsWith('.zsh') || fname.endsWith('.fish'))
    return { lang: 'Shell',      cardClass: 'shell-lang', icon: '🖥️' };
  if (fname.includes('web') || fname.includes('html') || fname.includes('css') || fname.endsWith('.html') || fname.endsWith('.css'))
    return { lang: 'Web Dev',    cardClass: 'web-lang',   icon: '🌍' };
  if (fname.includes('dart') || fname.endsWith('.dart') || fname.includes('flutter'))
    return { lang: 'Dart',       cardClass: 'dart-lang',  icon: '🎯' };
  if (fname.includes('scala')  || fname.endsWith('.scala') || fname.endsWith('.sc'))
    return { lang: 'Scala',      cardClass: 'scala-lang', icon: '🔺' };
  if (fname.includes('haskell') || fname.endsWith('.hs') || fname.endsWith('.lhs'))
    return { lang: 'Haskell',    cardClass: 'haskell-lang', icon: 'λ' };
  if (fname.includes('_r_') || fname.startsWith('r_') || fname.endsWith('.r') || fname.endsWith('.rmd') || fname.includes('r-lang') || fname.includes('rlang'))
    return { lang: 'R',          cardClass: 'r-lang',     icon: '📊' };
  if (fname.includes('lua')    || fname.endsWith('.lua'))
    return { lang: 'Lua',        cardClass: 'lua-lang',   icon: '🌙' };
  if (fname.includes('elixir') || fname.endsWith('.ex') || fname.endsWith('.exs'))
    return { lang: 'Elixir',     cardClass: 'elixir-lang',icon: '💜' };
  if (fname.includes('docker') || fname.includes('devops') || fname.includes('kubernetes') || fname.includes('k8s') || fname.endsWith('.dockerfile'))
    return { lang: 'DevOps',     cardClass: 'devops-lang',icon: '🐳' };
  if (fname.includes('ml') || fname.includes('ai') || fname.includes('deep_learning') || fname.includes('neural'))
    return { lang: 'ML / AI',    cardClass: 'ml-lang',    icon: '🤖' };
  if (fname.includes('asm') || fname.endsWith('.asm') || fname.endsWith('.s') || fname.includes('assembly'))
    return { lang: 'Assembly',   cardClass: 'asm-lang',   icon: '⚡' };
  if (fname.includes('csharp') || fname.includes('c_sharp') || fname.endsWith('.cs') || fname.includes('dotnet') || fname.includes('.net'))
    return { lang: 'C#',         cardClass: 'csharp-lang',icon: '💠' };

  // ── 2. Score content — accumulate language-specific signals ──
  const scores = {
    python: 0, java: 0, c: 0, cpp: 0, javascript: 0, typescript: 0,
    rust: 0, go: 0, kotlin: 0, swift: 0, ruby: 0, php: 0,
    sql: 0, shell: 0, web: 0,
    dart: 0, scala: 0, haskell: 0, r: 0, lua: 0, elixir: 0,
    devops: 0, ml: 0, csharp: 0
  };

  // Python
  if (lower.includes('def ') && lower.includes(':'))          scores.python += 3;
  if (lower.includes('print('))                               scores.python += 2;
  if (lower.includes('elif '))                                scores.python += 4;
  if (lower.includes('__init__'))                             scores.python += 4;
  if (lower.includes('self.'))                                scores.python += 3;
  if (lower.includes('pip install'))                          scores.python += 4;
  if (lower.includes('#!/usr/bin/env python'))                scores.python += 5;
  if (/from\s+\w+\s+import\s+/m.test(lower))                 scores.python += 3;
  if (/import\s+(numpy|pandas|flask|django|os|sys|re|requests|matplotlib)\b/.test(lower)) scores.python += 5;

  // Java
  if (lower.includes('public class '))                        scores.java += 4;
  if (lower.includes('public static void main'))              scores.java += 5;
  if (lower.includes('system.out.println'))                   scores.java += 4;
  if (lower.includes('import java.'))                         scores.java += 5;
  if (lower.includes('@override'))                            scores.java += 4;
  if (lower.includes('new arraylist') || lower.includes('new hashmap')) scores.java += 3;
  if (lower.includes('throws ') || lower.includes('implements ')) scores.java += 2;

  // C
  if (lower.includes('#include <stdio') || lower.includes('#include <stdlib')) scores.c += 6;
  if (lower.includes('#include'))                             scores.c += 3;
  if (lower.includes('int main('))                            scores.c += 5;
  if (lower.includes('printf(') || lower.includes('scanf(')) scores.c += 4;
  if (lower.includes('malloc(') || lower.includes('free('))  scores.c += 4;
  if (lower.includes('struct ') && lower.includes('typedef ')) scores.c += 3;

  // C++
  if (lower.includes('#include <iostream'))                   scores.cpp += 6;
  if (lower.includes('std::') || lower.includes('cout <<'))  scores.cpp += 5;
  if (lower.includes('namespace '))                           scores.cpp += 3;
  if (lower.includes('vector<') || lower.includes('map<'))   scores.cpp += 4;
  if (lower.includes('class ') && lower.includes('public:')) scores.cpp += 4;
  if (lower.includes('template<') || lower.includes('template <')) scores.cpp += 5;

  // JavaScript
  if (lower.includes('console.log'))                         scores.javascript += 4;
  if (lower.includes('document.') || lower.includes('window.')) scores.javascript += 3;
  if (lower.includes('addeventlistener'))                    scores.javascript += 3;
  if (/=>\s*[\({]/.test(lower))                              scores.javascript += 3;
  if (lower.includes('require(') || lower.includes("from '") || lower.includes('from "')) scores.javascript += 2;
  if (lower.includes('node.js') || lower.includes('nodejs') || lower.includes('npm ')) scores.javascript += 3;
  if (lower.includes('promise') || lower.includes('async/await') || lower.includes('async ')) scores.javascript += 2;

  // TypeScript
  if (lower.includes(': string') || lower.includes(': number') || lower.includes(': boolean')) scores.typescript += 4;
  if (lower.includes('interface ') || lower.includes('type ') && lower.includes('= {')) scores.typescript += 4;
  if (lower.includes(': void') || lower.includes(': any'))   scores.typescript += 3;
  if (lower.includes('enum '))                               scores.typescript += 4;
  if (lower.includes('tsc ') || lower.includes('tsconfig'))  scores.typescript += 5;
  if (lower.includes('generic') && lower.includes('<t>'))    scores.typescript += 3;

  // Rust
  if (lower.includes('fn main()') || lower.includes('fn main(') ) scores.rust += 5;
  if (lower.includes('let mut '))                            scores.rust += 5;
  if (lower.includes('println!(') || lower.includes('vec![')) scores.rust += 5;
  if (lower.includes('ownership') || lower.includes('borrowing') || lower.includes('lifetime')) scores.rust += 4;
  if (lower.includes('cargo ') || lower.includes('cargo.toml')) scores.rust += 5;
  if (lower.includes('impl ') && lower.includes('trait '))   scores.rust += 4;
  if (lower.includes('match ') && lower.includes('=>'))      scores.rust += 3;

  // Go
  if (lower.includes('func main()'))                         scores.go += 5;
  if (lower.includes('fmt.println') || lower.includes('fmt.printf')) scores.go += 5;
  if (lower.includes('goroutine') || lower.includes('go func')) scores.go += 5;
  if (lower.includes(':= '))                                 scores.go += 3;
  if (lower.includes('package main') || lower.includes('import (')) scores.go += 4;
  if (lower.includes('channel') || lower.includes('chan '))  scores.go += 4;

  // Kotlin
  if (lower.includes('fun main(') || lower.includes('fun main()')) scores.kotlin += 5;
  if (lower.includes('val ') || lower.includes('var ') && lower.includes('fun ')) scores.kotlin += 3;
  if (lower.includes('data class'))                          scores.kotlin += 5;
  if (lower.includes('coroutine') || lower.includes('suspend fun')) scores.kotlin += 5;
  if (lower.includes('kotlin') || lower.includes('.kts'))    scores.kotlin += 3;
  if (lower.includes('null safety') || lower.includes('?.') && lower.includes('?:')) scores.kotlin += 3;

  // Swift
  if (lower.includes('import uikit') || lower.includes('import swiftui')) scores.swift += 6;
  if (lower.includes('var ') && lower.includes('let ') && lower.includes('func ')) scores.swift += 3;
  if (lower.includes('optionals') || lower.includes('guard let') || lower.includes('if let ')) scores.swift += 4;
  if (lower.includes('xcodeproj') || lower.includes('xcode'))scores.swift += 4;
  if (lower.includes('@state') || lower.includes('@binding') || lower.includes('@published')) scores.swift += 5;
  if (lower.includes('protocol ') && lower.includes('extension ')) scores.swift += 4;

  // Ruby
  if (lower.includes('def ') && lower.includes('end'))       scores.ruby += 4;
  if (lower.includes('puts ') || lower.includes('p "') || lower.includes("p '")) scores.ruby += 4;
  if (lower.includes('rails') || lower.includes('activerecord') || lower.includes('gemfile')) scores.ruby += 5;
  if (lower.includes('gem ') || lower.includes('bundle exec')) scores.ruby += 4;
  if (lower.includes('.each') || lower.includes('.map') || lower.includes('.select')) scores.ruby += 3;
  if (lower.includes('attr_accessor') || lower.includes('attr_reader')) scores.ruby += 5;

  // PHP
  if (lower.includes('<?php') || lower.includes('echo '))    scores.php += 5;
  if (lower.includes('$_get') || lower.includes('$_post') || lower.includes('$_session')) scores.php += 5;
  if (lower.includes('->') && lower.includes('$'))           scores.php += 4;
  if (lower.includes('laravel') || lower.includes('symfony') || lower.includes('wordpress')) scores.php += 5;
  if (lower.includes('composer') || lower.includes('artisan')) scores.php += 4;

  // SQL / Database
  if (/\bselect\b.*\bfrom\b/i.test(lower))                  scores.sql += 5;
  if (/\binsert into\b/i.test(lower) || /\bupdate\b.*\bset\b/i.test(lower)) scores.sql += 4;
  if (/\bcreate table\b/i.test(lower) || /\balter table\b/i.test(lower)) scores.sql += 5;
  if (lower.includes('primary key') || lower.includes('foreign key')) scores.sql += 4;
  if (lower.includes('join ') || lower.includes('inner join') || lower.includes('left join')) scores.sql += 3;
  if (lower.includes('postgresql') || lower.includes('mysql') || lower.includes('sqlite')) scores.sql += 4;

  // Shell / Bash
  if (lower.includes('#!/bin/bash') || lower.includes('#!/bin/sh')) scores.shell += 6;
  if (lower.includes('chmod ') || lower.includes('chown '))  scores.shell += 4;
  if (lower.includes('grep ') || lower.includes('awk ') || lower.includes('sed ')) scores.shell += 4;
  if (lower.includes('$home') || lower.includes('$path') || lower.includes('$user')) scores.shell += 3;
  if (lower.includes('if [ ') || lower.includes('fi\n') || lower.includes('done\n')) scores.shell += 4;
  if (lower.includes('apt-get') || lower.includes('brew install') || lower.includes('yum ')) scores.shell += 4;
  if (lower.includes('.bashrc') || lower.includes('.zshrc') || lower.includes('alias ')) scores.shell += 3;

  // Web Dev (HTML/CSS)
  if (lower.includes('<!doctype html') || lower.includes('<html'))  scores.web += 5;
  if (lower.includes('<div') || lower.includes('<body') || lower.includes('<header')) scores.web += 3;
  if (lower.includes('css') && (lower.includes('flex') || lower.includes('grid'))) scores.web += 4;
  if (lower.includes('media query') || lower.includes('@media'))    scores.web += 4;
  if (lower.includes('react') || lower.includes('vue') || lower.includes('angular')) scores.web += 4;
  if (lower.includes('dom ') || lower.includes('css selector') || lower.includes('flexbox')) scores.web += 3;
  if (lower.includes('responsive') || lower.includes('bootstrap') || lower.includes('tailwind')) scores.web += 3;

  // Dart / Flutter
  if (lower.includes('flutter') || lower.includes('dart:'))        scores.dart += 6;
  if (lower.includes('widget') && lower.includes('build('))        scores.dart += 5;
  if (lower.includes('statefulwidget') || lower.includes('statelesswidget')) scores.dart += 6;
  if (lower.includes('pubspec') || lower.includes('pub.dev'))      scores.dart += 5;
  if (/void main\(\)/.test(lower) && lower.includes('runapp'))     scores.dart += 5;

  // Scala
  if (lower.includes('object ') && lower.includes('extends app'))  scores.scala += 6;
  if (lower.includes('case class') || lower.includes('sealed trait')) scores.scala += 5;
  if (lower.includes('akka') || lower.includes('spark') || lower.includes('play framework')) scores.scala += 6;
  if (lower.includes('implicit ') || lower.includes('def ') && lower.includes('=>')) scores.scala += 3;
  if (lower.includes('sbt ') || lower.includes('scala build tool')) scores.scala += 5;

  // Haskell
  if (lower.includes('module main') || lower.includes('import data.')) scores.haskell += 5;
  if (lower.includes('haskell') || lower.includes('ghc') || lower.includes('cabal')) scores.haskell += 6;
  if (lower.includes('monad') || lower.includes('functor') || lower.includes('applicative')) scores.haskell += 5;
  if (/\blet\b.*\bin\b/.test(lower) && lower.includes('where'))    scores.haskell += 4;
  if (lower.includes('pattern matching') || lower.includes('lazy evaluation')) scores.haskell += 4;
  if (lower.includes('type class') || lower.includes('type classes')) scores.haskell += 5;

  // R
  if (lower.includes('<-') && (lower.includes('ggplot') || lower.includes('tidyverse') || lower.includes('dplyr'))) scores.r += 7;
  if (lower.includes('library(') || lower.includes('require('))    scores.r += 4;
  if (lower.includes('data.frame') || lower.includes('tibble'))     scores.r += 5;
  if (lower.includes('ggplot2') || lower.includes('shiny') || lower.includes('rmarkdown')) scores.r += 6;
  if (lower.includes('vector()') || lower.includes('c(') && lower.includes('data.frame')) scores.r += 3;
  if (lower.includes('r programming') || lower.includes('r language') || lower.includes('cran')) scores.r += 5;

  // Lua
  if (lower.includes('function ') && lower.includes('end') && lower.includes('local ')) scores.lua += 5;
  if (lower.includes('print(') && lower.includes('--') && !lower.includes('public class')) scores.lua += 3;
  if (lower.includes('love2d') || lower.includes('roblox') || lower.includes('openresty')) scores.lua += 6;
  if (lower.includes('table.insert') || lower.includes('table.remove') || lower.includes('ipairs')) scores.lua += 6;
  if (lower.includes('coroutine.') || lower.includes('require "'))  scores.lua += 4;

  // Elixir
  if (lower.includes('defmodule ') || lower.includes('defp ') || lower.includes('def ') && lower.includes('do\n')) scores.elixir += 5;
  if (lower.includes('phoenix') || lower.includes('mix ') || lower.includes('ecto')) scores.elixir += 6;
  if (lower.includes('|>') && lower.includes('elixir'))             scores.elixir += 6;
  if (lower.includes('iex>') || lower.includes('genserver'))        scores.elixir += 6;
  if (lower.includes('pattern matching') && lower.includes('pipe operator')) scores.elixir += 5;

  // DevOps / Docker / K8s
  if (lower.includes('dockerfile') || lower.includes('docker-compose') || lower.includes('from ubuntu') || lower.includes('from alpine')) scores.devops += 6;
  if (lower.includes('kubernetes') || lower.includes('kubectl') || lower.includes('helm ')) scores.devops += 6;
  if (lower.includes('ci/cd') || lower.includes('github actions') || lower.includes('jenkins')) scores.devops += 5;
  if (lower.includes('terraform') || lower.includes('ansible') || lower.includes('infrastructure as code')) scores.devops += 5;
  if (lower.includes('container') && (lower.includes('image') || lower.includes('orchestration'))) scores.devops += 4;

  // ML / AI
  if (lower.includes('neural network') || lower.includes('deep learning') || lower.includes('machine learning')) scores.ml += 6;
  if (lower.includes('tensorflow') || lower.includes('pytorch') || lower.includes('keras')) scores.ml += 7;
  if (lower.includes('gradient descent') || lower.includes('backpropagation') || lower.includes('loss function')) scores.ml += 6;
  if (lower.includes('transformer') || lower.includes('attention mechanism') || lower.includes('llm')) scores.ml += 6;
  if (lower.includes('scikit-learn') || lower.includes('sklearn') || lower.includes('pandas') && lower.includes('model')) scores.ml += 5;
  if (lower.includes('epoch') || lower.includes('batch size') || lower.includes('overfitting') || lower.includes('underfitting')) scores.ml += 4;

  // C# / .NET
  if (lower.includes('using system') || lower.includes('namespace ') && lower.includes('class ')) scores.csharp += 5;
  if (lower.includes('console.writeline') || lower.includes('console.write(')) scores.csharp += 5;
  if (lower.includes('.net') || lower.includes('asp.net') || lower.includes('xamarin') || lower.includes('unity')) scores.csharp += 5;
  if (lower.includes('async task') || lower.includes('await ') && lower.includes('using (')) scores.csharp += 4;
  if (lower.includes('linq') || lower.includes('ienumerable') || lower.includes('list<')) scores.csharp += 4;
  if (lower.includes('nuget') || lower.includes('dotnet '))         scores.csharp += 4;

  // ── 3. Pick winner if score ≥ 4, else generic fallback ──────
  const [winner, topScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (topScore >= 4) {
    const map = {
      python:     { lang: 'Python',     cardClass: 'python',      icon: '🐍' },
      java:       { lang: 'Java',       cardClass: 'java',        icon: '☕' },
      c:          { lang: 'C / DSA',    cardClass: 'c-lang',      icon: '⚙️' },
      cpp:        { lang: 'C++',        cardClass: 'cpp-lang',    icon: '⚙️' },
      javascript: { lang: 'JavaScript', cardClass: 'js-lang',     icon: '🌐' },
      typescript: { lang: 'TypeScript', cardClass: 'ts-lang',     icon: '🔷' },
      rust:       { lang: 'Rust',       cardClass: 'rust-lang',   icon: '🦀' },
      go:         { lang: 'Go',         cardClass: 'go-lang',     icon: '🐹' },
      kotlin:     { lang: 'Kotlin',     cardClass: 'kotlin-lang', icon: '🎯' },
      swift:      { lang: 'Swift',      cardClass: 'swift-lang',  icon: '🍎' },
      ruby:       { lang: 'Ruby',       cardClass: 'ruby-lang',   icon: '💎' },
      php:        { lang: 'PHP',        cardClass: 'php-lang',    icon: '🐘' },
      sql:        { lang: 'SQL / DB',   cardClass: 'sql-lang',    icon: '🗄️' },
      shell:      { lang: 'Shell',      cardClass: 'shell-lang',  icon: '🖥️' },
      web:        { lang: 'Web Dev',    cardClass: 'web-lang',    icon: '🌍' },
      dart:       { lang: 'Dart',       cardClass: 'dart-lang',   icon: '🎯' },
      scala:      { lang: 'Scala',      cardClass: 'scala-lang',  icon: '🔺' },
      haskell:    { lang: 'Haskell',    cardClass: 'haskell-lang',icon: 'λ' },
      r:          { lang: 'R',          cardClass: 'r-lang',      icon: '📊' },
      lua:        { lang: 'Lua',        cardClass: 'lua-lang',    icon: '🌙' },
      elixir:     { lang: 'Elixir',     cardClass: 'elixir-lang', icon: '💜' },
      devops:     { lang: 'DevOps',     cardClass: 'devops-lang', icon: '🐳' },
      ml:         { lang: 'ML / AI',    cardClass: 'ml-lang',     icon: '🤖' },
      csharp:     { lang: 'C#',         cardClass: 'csharp-lang', icon: '💠' }
    };
    return map[winner];
  }

  return { lang: 'Notes', cardClass: 'uploaded', icon: '📄' };
}

function renderUploadedFileEntry(file, note, status) {
  status = status || 'saved';
  const sizeKB = (file.size / 1024).toFixed(1);
  const entry  = document.createElement('div');
  entry.className      = 'upload-file-item';
  entry.dataset.noteId = note.id;
  const statusText  = status === 'saving' ? '⏳ Saving…' : '✓ Added';
  const statusColor = status === 'saving' ? 'var(--text-muted)' : '';
  entry.innerHTML = `
    <div class="upload-file-icon">${note.icon}</div>
    <div class="upload-file-info">
      <div class="upload-file-name">${note.title}</div>
      <div class="upload-file-size">${sizeKB} KB · ${note.language}</div>
    </div>
    <div class="upload-file-status" style="color:${statusColor}">${statusText}</div>
    <button class="upload-file-remove" title="Remove note" onclick="removeUploadedNote('${note.id}', this)">✕</button>
  `;
  uploadFileList.appendChild(entry);
  return entry;
}

window.removeUploadedNote = async function(noteId, btn) {
  uploadedNotes = uploadedNotes.filter(n => n.id !== noteId);
  saveUploadedNotes(uploadedNotes);
  const entry = btn.closest('.upload-file-item');
  if (entry) entry.remove();
  updateStats();

  // Also remove from Supabase (best-effort, silent on failure)
  if (typeof deleteNoteFromSupabase === 'function') {
    await deleteNoteFromSupabase(noteId);
  }

  // Remove from carousel rotation
  carouselNotes = getAllNotes();
  carouselIdx   = Math.min(carouselIdx, Math.max(0, carouselNotes.length - 1));
  if (carouselNotes.length === 0) {
    if (carouselOuter) carouselOuter.style.display = 'none';
    if (carouselEmpty) carouselEmpty.style.display = 'block';
  } else {
    renderCarouselCards();
    renderCarouselDots();
  }

  showToast('Note removed', 'info');
};

function renderExistingUploads() {
  uploadedNotes.forEach(note => {
    const sizeKB = note.content ? (new Blob([note.content]).size / 1024).toFixed(1) : '?';
    const entry  = document.createElement('div');
    entry.className    = 'upload-file-item';
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

// ════════════════════════════════════════════
//  TOAST NOTIFICATIONS
// ════════════════════════════════════════════
function showToast(message, type = 'info') {
  const icons  = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast  = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-message">${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(120%)';
    toast.style.transition = 'all 0.4s ease-in';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ════════════════════════════════════════════
//  SCROLL ANIMATIONS
// ════════════════════════════════════════════
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-in').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  animateObserver.observe(el);
});

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (noteViewer && noteViewer.classList.contains('active') && this.closest('.nav-links')) return;
    const href = this.getAttribute('href');
    if (href === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const target = document.getElementById(href.substring(1));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ════════════════════════════════════════════
//  PDF DOWNLOAD
// ════════════════════════════════════════════
downloadPdfBtn.addEventListener('click', () => {
  if (!activeNote) return;
  downloadPdfBtn.disabled = true;
  const originalHTML = downloadPdfBtn.innerHTML;
  downloadPdfBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Opening…`;

  const contentClone = document.createElement('div');
  contentClone.innerHTML = viewerContent.innerHTML;
  contentClone.querySelectorAll('.code-copy-btn, .code-header').forEach(el => el.remove());

  const printHTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>${activeNote.title}</title>
<style>
@page { margin: 15mm 18mm; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 13.5px; line-height: 1.75; color: #1a1a2e; background: #fff; max-width: 780px; margin: 0 auto; padding: 24px 28px; }
.pdf-cover { border-bottom: 3px solid #6c5ce7; padding-bottom: 14px; margin-bottom: 26px; }
.pdf-cover h1 { font-size: 1.9rem; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
.pdf-meta { font-size: 0.85rem; color: #546e7a; }
.pdf-meta strong { color: #1a1a2e; }
h1,h2,h3,h4,h5,h6 { color: #1a1a2e; font-weight: 700; margin: 22px 0 8px; line-height: 1.3; page-break-after: avoid; }
h2 { font-size: 1.25rem; color: #2d2d6e; border-bottom: 1px solid #d0d0e8; padding-bottom: 4px; }
h3 { font-size: 1.05rem; color: #3a3a8a; }
h4 { font-size: 0.95rem; color: #4a4a9a; }
p  { margin: 8px 0 12px; color: #1a1a2e; }
a  { color: #6c5ce7; }
hr { border: none; border-top: 1px solid #d0d0e0; margin: 18px 0; }
strong, b { font-weight: 700; } em { font-style: italic; }
code { background: #f0f0fa; color: #c0392b; padding: 2px 5px; border-radius: 4px; font-family: 'Courier New', Consolas, monospace; font-size: 0.87em; }
pre { background: #1a1a2e; border-radius: 8px; padding: 14px 16px; margin: 14px 0; page-break-inside: avoid; overflow: hidden; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
pre code { background: transparent; color: #e0e0ef; font-size: 0.82em; line-height: 1.55; white-space: pre-wrap; word-break: break-all; padding: 0; border-radius: 0; }
.hljs-keyword,.hljs-selector-tag,.hljs-built_in,.hljs-name,.hljs-tag { color: #c792ea; }
.hljs-string,.hljs-title,.hljs-section,.hljs-attribute,.hljs-literal,.hljs-addition,.hljs-type { color: #c3e88d; }
.hljs-comment,.hljs-quote,.hljs-deletion,.hljs-meta { color: #7a8a99; font-style: italic; }
.hljs-number,.hljs-regexp,.hljs-variable,.hljs-bullet,.hljs-link { color: #f78c6c; }
.hljs-function,.hljs-attr { color: #82aaff; }
.hljs-class { color: #ffcb6b; }
.hljs-params { color: #e0e0ef; }
.hljs-operator,.hljs-punctuation { color: #89ddff; }
ul, ol { padding-left: 24px; margin: 8px 0 12px; }
li { margin: 4px 0; color: #1a1a2e; }
table { border-collapse: collapse; width: 100%; margin: 14px 0; page-break-inside: avoid; }
thead { background: #e8e8f8; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
th { padding: 8px 12px; text-align: left; font-weight: 600; color: #1a1a2e; border: 1px solid #d0d0e0; }
td { padding: 8px 12px; border: 1px solid #d0d0e0; color: #1a1a2e; }
tr:nth-child(even) td { background: #f6f6fc; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
blockquote, .callout { border-left: 4px solid #6c5ce7; background: #f0eeff; color: #2a2a5a; padding: 12px 16px; margin: 14px 0; border-radius: 0 8px 8px 0; page-break-inside: avoid; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
.callout-note { border-left-color:#0ea5e9; background:#e0f2fe; color:#0c4a6e; }
.callout-tip  { border-left-color:#22c55e; background:#dcfce7; color:#14532d; }
.callout-warning { border-left-color:#f59e0b; background:#fef9c3; color:#713f12; }
.callout-caution { border-left-color:#ef4444; background:#fee2e2; color:#7f1d1d; }
.callout-important { border-left-color:#8b5cf6; background:#ede9fe; color:#3b0764; }
@media print { body { padding: 0; } pre, table, blockquote, .callout { page-break-inside: avoid; } }
</style></head><body>
  <div class="pdf-cover">
    <h1>${activeNote.title}</h1>
    <div class="pdf-meta"><strong>Language:</strong> ${activeNote.language} &nbsp;|&nbsp; <strong>Sections:</strong> ${activeNote.sections} &nbsp;|&nbsp; <strong>Source:</strong> ${activeNote.builtin ? 'Built-in Reference' : 'User Uploaded'}</div>
  </div>
  ${contentClone.innerHTML}
</body></html>`;

  const printWin = window.open('', '_blank', 'width=860,height=720');
  if (!printWin) {
    showToast('⚠ Allow pop-ups for this site, then try again.', 'error');
    downloadPdfBtn.disabled = false;
    downloadPdfBtn.innerHTML = originalHTML;
    return;
  }
  printWin.document.open();
  printWin.document.write(printHTML);
  printWin.document.close();
  printWin.addEventListener('load', () => {
    setTimeout(() => {
      printWin.focus();
      printWin.print();
      printWin.addEventListener('afterprint', () => printWin.close());
    }, 350);
  });
  showToast('Print dialog opened — choose "Save as PDF"', 'success');
  downloadPdfBtn.disabled = false;
  downloadPdfBtn.innerHTML = originalHTML;
});

// ════════════════════════════════════════════
//  SPEECH SYNTHESIS NARRATOR ENGINE
// ════════════════════════════════════════════
let speechUtterances = [];
let speechIndex = 0;
let isSpeaking = false;
let isPaused = false;
const synth = window.speechSynthesis;

function stopSpeaking() {
  if (synth) {
    synth.cancel();
  }
  isSpeaking = false;
  isPaused = false;
  updateSpeechButtons();
  removeSpeechHighlights();
}

function removeSpeechHighlights() {
  document.querySelectorAll('.speech-highlight').forEach(el => {
    el.classList.remove('speech-highlight');
  });
}

function speakNote() {
  if (isPaused) {
    synth.resume();
    isPaused = false;
    updateSpeechButtons();
    return;
  }
  
  stopSpeaking();
  
  // Gather speakable elements inside note viewer content
  const speakableElements = Array.from(viewerContent.querySelectorAll('h1, h2, h3, h4, p, li, td'));
  if (speakableElements.length === 0) return;
  
  speechUtterances = speakableElements.map(el => {
    if (el.closest('pre') || el.closest('code') || el.closest('.code-header') || el.closest('.toc-sidebar')) {
      return null;
    }
    return {
      text: el.textContent.trim(),
      element: el
    };
  }).filter(item => item !== null && item.text.length > 0);
  
  if (speechUtterances.length === 0) return;
  
  speechIndex = 0;
  isSpeaking = true;
  updateSpeechButtons();
  speakNext();
}

function speakNext() {
  if (!isSpeaking || speechIndex >= speechUtterances.length) {
    stopSpeaking();
    return;
  }
  
  const item = speechUtterances[speechIndex];
  removeSpeechHighlights();
  item.element.classList.add('speech-highlight');
  
  // Center spoken element in view
  item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  const speed = parseFloat(document.getElementById('speech-speed').value) || 1;
  const utter = new SpeechSynthesisUtterance(item.text);
  utter.rate = speed;
  
  utter.onend = () => {
    if (isSpeaking && !isPaused) {
      speechIndex++;
      speakNext();
    }
  };
  
  utter.onerror = (e) => {
    console.error('Speech error', e);
    stopSpeaking();
  };
  
  synth.speak(utter);
}

function pauseSpeaking() {
  if (synth && isSpeaking) {
    synth.pause();
    isPaused = true;
    updateSpeechButtons();
  }
}

function updateSpeechButtons() {
  const playBtn = document.getElementById('btn-speech-play');
  const pauseBtn = document.getElementById('btn-speech-pause');
  const stopBtn = document.getElementById('btn-speech-stop');
  const speedSlider = document.getElementById('speech-speed');
  
  if (isSpeaking) {
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    stopBtn.style.display = 'inline-block';
    speedSlider.style.display = 'inline-block';
    
    if (isPaused) {
      pauseBtn.innerHTML = '▶ Resume';
    } else {
      pauseBtn.innerHTML = '⏸ Pause';
    }
  } else {
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    speedSlider.style.display = 'none';
  }
}

// Attach TTS Listeners
document.getElementById('btn-speech-play').addEventListener('click', speakNote);
document.getElementById('btn-speech-pause').addEventListener('click', pauseSpeaking);
document.getElementById('btn-speech-stop').addEventListener('click', stopSpeaking);

// ── Theme Switcher ──
const setReaderTheme = (theme) => {
  noteViewer.setAttribute('data-theme', theme);
  localStorage.setItem('webnotes_reader_theme', theme);
};

document.getElementById('btn-theme-dark').addEventListener('click', () => setReaderTheme('dark'));
document.getElementById('btn-theme-light').addEventListener('click', () => setReaderTheme('light'));
document.getElementById('btn-theme-sepia').addEventListener('click', () => setReaderTheme('sepia'));

// ── Font Sizer ──
let readerFontSize = parseFloat(localStorage.getItem('webnotes_font_size')) || 1.0;
const updateFontSizer = () => {
  noteViewer.style.setProperty('--reader-font-size', `${readerFontSize}rem`);
  localStorage.setItem('webnotes_font_size', readerFontSize);
};

document.getElementById('btn-font-dec').addEventListener('click', () => {
  readerFontSize = Math.max(0.7, readerFontSize - 0.1);
  updateFontSizer();
});

document.getElementById('btn-font-inc').addEventListener('click', () => {
  readerFontSize = Math.min(1.6, readerFontSize + 0.1);
  updateFontSizer();
});

// Load preferences on viewer launch
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('webnotes_reader_theme') || 'dark';
  setReaderTheme(savedTheme);
  updateFontSizer();
});

// Expose stopSpeaking to window
window.stopSpeaking = stopSpeaking;

// ════════════════════════════════════════════
//  BOOT
// ════════════════════════════════════════════
initApp();
