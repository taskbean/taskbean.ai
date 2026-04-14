/* ═══════════════════════════════════════════════════════════════════
   taskbean.ai — Interactions
   ═══════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── Nav scroll state ──────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav toggle ─────────────────────────────────────────────
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // ── Active nav link ───────────────────────────────────────────────
  const path = location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '').split('/').pop() || 'index';
    if (href === path || (href === 'index.html' && (path === 'index' || path === ''))) {
      link.classList.add('active');
    }
  });

  // ── Scroll reveal (IntersectionObserver) ──────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ── Smooth scroll for anchor links ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Copy code blocks ──────────────────────────────────────────────
  document.querySelectorAll('.code-block').forEach(block => {
    const pre = block.querySelector('pre');
    if (!pre) return;
    const btn = document.createElement('button');
    btn.className = 'code-block__copy';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    Object.assign(btn.style, {
      position: 'absolute', top: '10px', right: '12px',
      background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
      color: 'var(--c-text-3)', padding: '3px 10px', borderRadius: 'var(--r-sm)',
      fontSize: 'var(--fs-xs)', cursor: 'pointer', fontFamily: 'var(--f-mono)',
      transition: 'all 150ms ease'
    });
    block.style.position = 'relative';
    block.appendChild(btn);
    btn.addEventListener('click', async () => {
      const text = pre.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied!';
        btn.style.color = 'var(--c-success)';
        setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 1500);
      } catch { /* clipboard not available */ }
    });
  });

  // ── Initialize Lucide icons inside mockup ──────────────────────
  if (window.lucide) {
    lucide.createIcons();
  }

  // ── Showcase scroll observer ─────────────────────────────────────
  const showcase = document.querySelector('.showcase');
  if (showcase) {
    const panels = showcase.querySelectorAll('.showcase__panel');
    const scenes = showcase.querySelectorAll('.mockup-scene');
    const dots   = showcase.querySelectorAll('.showcase__dot');
    const appbar = showcase.querySelector('.mockup-appbar');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let activeScene = 1;

    function switchScene(num) {
      if (num === activeScene) return;
      activeScene = num;

      // Update panels
      panels.forEach(p => {
        p.classList.toggle('panel-active', +p.dataset.scene === num);
      });

      // Cross-fade scenes
      scenes.forEach(s => {
        const isTarget = +s.dataset.scene === num;
        s.classList.toggle('scene-active', isTarget);
        // Reset scene-el animations for the incoming scene
        if (isTarget) {
          s.querySelectorAll('.scene-el').forEach(el => {
            el.style.transitionDelay = reducedMotion ? '0ms' : `${el.dataset.delay || 0}ms`;
          });
        }
      });

      // Sync dots
      dots.forEach(d => {
        const isActive = +d.dataset.scene === num;
        d.classList.toggle('dot-active', isActive);
        d.setAttribute('aria-selected', isActive);
      });

      // Switch active app bar tab (Projects for scene 4, Tasks for 1-3)
      if (appbar) {
        const activeTab = num === 4 ? 'projects' : 'tasks';
        appbar.querySelectorAll('.mockup-appbar__tab[data-tab]').forEach(t => {
          t.classList.toggle('mockup-appbar__tab--active', t.dataset.tab === activeTab);
        });
      }

      // Re-render Lucide icons in newly visible scene
      if (window.lucide) lucide.createIcons();
    }

    // Activate first panel immediately
    panels[0]?.classList.add('panel-active');

    // Set initial scene-el delays for scene 1
    scenes[0]?.querySelectorAll('.scene-el').forEach(el => {
      el.style.transitionDelay = reducedMotion ? '0ms' : `${el.dataset.delay || 0}ms`;
    });

    // Observe panels entering viewport center
    if ('IntersectionObserver' in window) {
      const panelObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const sceneNum = +entry.target.dataset.scene;
              switchScene(sceneNum);
            }
          });
        },
        { threshold: 0.4, rootMargin: '-20% 0px -30% 0px' }
      );
      panels.forEach(p => panelObserver.observe(p));
    }

    // Dot click handlers
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const num = +dot.dataset.scene;
        switchScene(num);
        // Scroll the matching panel into view
        const targetPanel = showcase.querySelector(`.showcase__panel[data-scene="${num}"]`);
        if (targetPanel) {
          targetPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // ── Docs sidebar active tracking ──────────────────────────────────
  const docsSidebar = document.querySelector('.docs-sidebar');
  if (docsSidebar) {
    const headings = document.querySelectorAll('.docs-content h2[id], .docs-content h3[id]');
    const sidebarLinks = docsSidebar.querySelectorAll('a');
    if (headings.length && sidebarLinks.length) {
      const headingObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              sidebarLinks.forEach(l => l.classList.remove('active'));
              const match = docsSidebar.querySelector(`a[href="#${entry.target.id}"]`);
              if (match) match.classList.add('active');
            }
          });
        },
        { rootMargin: '-80px 0px -60% 0px' }
      );
      headings.forEach(h => headingObserver.observe(h));
    }
  }
})();
