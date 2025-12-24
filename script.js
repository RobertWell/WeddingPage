/**
 * Active Elegant Garden Wedding Site
 * JavaScript for configuration loading, language switching,
 * RSVP form handling, and scroll reveal animations
 */

(function () {
  'use strict';

  // ==========================================
  // Configuration & State
  // ==========================================

  const bodyEl = document.body;
  const CONFIG_SOURCE_URL =
    (bodyEl && bodyEl.dataset.configSrc) ||
    (typeof window !== 'undefined' && window.CONFIG_SOURCE_URL) ||
    'config.csv';
  const FALLBACK_CONFIG_URL =
    (typeof window !== 'undefined' && window.CONFIG_FALLBACK_URL) ||
    'config.csv';
  const DEFAULT_LANG = (bodyEl && bodyEl.dataset.defaultLang) || 'zh';
  const STORAGE_KEY = 'forest-wedding-lang';

  const state = {
    languages: [],
    data: {},
    currentLang: DEFAULT_LANG,
  };

  // ==========================================
  // Scroll Position Reset
  // ==========================================

  const resetScrollPosition = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      resetScrollPosition();
    }
  });

  // ==========================================
  // RSVP Endpoint
  // ==========================================

  const getRSVPEndpoint = () =>
    (bodyEl && bodyEl.dataset.rsvpEndpoint) ||
    (typeof window !== 'undefined' && window.RSVP_ENDPOINT) ||
    '';

  // ==========================================
  // CSV Parsing
  // ==========================================

  function parseCSVLine(line) {
    const cells = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current);
    return cells;
  }

  function parseConfig(text) {
    const cleaned = text.replace(/^\uFEFF/, '');
    const lines = cleaned
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return { languages: [], data: {} };
    }

    const headerCells = parseCSVLine(lines.shift());
    const langHeaders = headerCells
      .slice(1)
      .map((cell) => cell.trim() || 'value');

    if (!langHeaders.length) {
      langHeaders.push('value');
    }

    const data = {};
    langHeaders.forEach((lang) => {
      data[lang] = {};
    });

    lines.forEach((line) => {
      const cells = parseCSVLine(line);
      const key = (cells[0] || '').trim();
      if (!key) return;

      langHeaders.forEach((lang, idx) => {
        const value = (cells[idx + 1] || '').trim();
        if (!data[lang]) data[lang] = {};
        data[lang][key] = value;
      });
    });

    const languages = Array.from(new Set(langHeaders.filter(Boolean)));
    return { languages, data };
  }

  function mergeConfig(primary, fallback) {
    if (!fallback.languages.length) return primary;

    const languages = Array.from(
      new Set([...primary.languages, ...fallback.languages])
    );
    const data = {};

    languages.forEach((lang) => {
      const primaryBucket = primary.data[lang] || {};
      const fallbackBucket = fallback.data[lang] || {};
      const merged = { ...fallbackBucket, ...primaryBucket };

      Object.keys(merged).forEach((key) => {
        if (primaryBucket[key] === '' && fallbackBucket[key]) {
          merged[key] = fallbackBucket[key];
        }
      });

      data[lang] = merged;
    });

    return { languages, data };
  }

  // ==========================================
  // Language Storage
  // ==========================================

  function getStoredLang() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      // Ignore errors
    }
  }

  function updateDocumentLang(lang) {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : lang;
  }

  // ==========================================
  // Configuration Application
  // ==========================================

  function getValueForKey(key, fallback = '', lang = state.currentLang) {
    const order = [];
    const enqueue = (code) => {
      if (code && !order.includes(code)) order.push(code);
    };

    enqueue(lang);
    enqueue(DEFAULT_LANG);
    state.languages.forEach(enqueue);
    enqueue('value');

    for (const code of order) {
      const bucket = state.data[code];
      if (bucket && Object.prototype.hasOwnProperty.call(bucket, key)) {
        const value = bucket[key];
        if (value !== '') return value;
      }
    }

    return fallback;
  }

  function applyLanguage(lang) {
    document.querySelectorAll('[data-config]').forEach((el) => {
      const key = el.dataset.config;
      if (!key) return;

      const value = getValueForKey(key, '', lang);
      if (value === '') return;

      const attr = el.dataset.configAttr;
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });
  }

  function applyVisualConfig(lang = state.currentLang) {
    const rootStyle = document.documentElement.style;
    const bodyBackground = getValueForKey('body.background', '', lang);

    if (bodyBackground) {
      rootStyle.setProperty('--page-background', bodyBackground);
    } else {
      rootStyle.removeProperty('--page-background');
    }
  }

  function refreshLangButtons() {
    const available = new Set(state.languages);
    const buttons = document.querySelectorAll('[data-lang-button]');

    buttons.forEach((btn) => {
      const lang = btn.dataset.langButton;
      const isActive = lang === state.currentLang;
      const isAvailable = available.has(lang);

      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
      btn.disabled = !isAvailable;

      if (!isAvailable) {
        btn.style.opacity = '0.4';
      } else {
        btn.style.opacity = '';
      }
    });

    const switcher = document.querySelector('[data-lang-switch]');
    if (switcher) {
      switcher.style.display = available.size <= 1 ? 'none' : '';
    }
  }

  function setLanguage(lang) {
    if (!state.languages.includes(lang)) return;
    if (lang === state.currentLang) return;

    state.currentLang = lang;
    applyLanguage(lang);
    applyVisualConfig(lang);
    refreshLangButtons();
    updateDocumentLang(lang);
    storeLang(lang);
    updateLocaleField();
  }

  // ==========================================
  // Loading State
  // ==========================================

  function setLoading(isLoading) {
    if (!bodyEl) return;
    bodyEl.classList.toggle('is-loading', isLoading);
  }

  // ==========================================
  // Configuration Loading
  // ==========================================

  async function loadConfig() {
    try {
      const res = await fetch(CONFIG_SOURCE_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load config');

      const raw = await res.text();
      let parsed = parseConfig(raw);

      if (!parsed.languages.length) return;

      // Try to load fallback config
      if (FALLBACK_CONFIG_URL && FALLBACK_CONFIG_URL !== CONFIG_SOURCE_URL) {
        try {
          const fallbackRes = await fetch(FALLBACK_CONFIG_URL, {
            cache: 'no-store',
          });
          if (fallbackRes.ok) {
            const fallbackRaw = await fallbackRes.text();
            const fallbackParsed = parseConfig(fallbackRaw);
            parsed = mergeConfig(parsed, fallbackParsed);
          }
        } catch (err) {
          console.warn('Unable to load fallback config', err);
        }
      }

      state.languages = parsed.languages;
      state.data = parsed.data;

      const storedLang = getStoredLang();
      const preferred = [storedLang, DEFAULT_LANG].find(
        (code) => code && state.languages.includes(code)
      );

      state.currentLang = preferred || state.languages[0];

      applyLanguage(state.currentLang);
      applyVisualConfig(state.currentLang);
      refreshLangButtons();
      updateDocumentLang(state.currentLang);
      storeLang(state.currentLang);
      updateLocaleField();
    } catch (err) {
      console.error('Unable to load config', err);
    }
  }

  // ==========================================
  // RSVP Form
  // ==========================================

  function updateLocaleField() {
    const input = document.querySelector('[data-rsvp-locale]');
    if (input) {
      input.value = state.currentLang || DEFAULT_LANG;
    }
  }

  function showRSVPStatus(type, fallback = '') {
    const statusEl = document.querySelector('[data-rsvp-status]');
    if (!statusEl) return;

    const message =
      getValueForKey(`survey.message.${type}`, fallback) || fallback;

    if (!message) {
      statusEl.style.display = 'none';
      return;
    }

    statusEl.textContent = message;
    statusEl.dataset.status = type;
    statusEl.style.display = 'block';
  }

  function setupRSVPForm() {
    const form = document.querySelector('[data-rsvp-form]');
    if (!form) return;

    const endpoint = getRSVPEndpoint();
    const frame = document.querySelector('[data-rsvp-frame]');
    let isSubmitting = false;

    if (frame && !frame.name) {
      frame.name = 'rsvp-frame';
    }

    if (frame) {
      frame.addEventListener('load', () => {
        if (!isSubmitting) return;
        isSubmitting = false;
        showRSVPStatus('success');
        form.reset();
        updateLocaleField();
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!endpoint) {
        showRSVPStatus('error', 'RSVP endpoint not configured');
        return;
      }

      showRSVPStatus('sending');
      form.action = endpoint;
      form.method = 'POST';

      if (frame) {
        form.target = frame.name;
        isSubmitting = true;
        form.submit();
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
        });
        if (!response.ok) throw new Error('Request failed');
        showRSVPStatus('success');
        form.reset();
        updateLocaleField();
      } catch (error) {
        console.error('RSVP submission error:', error);
        showRSVPStatus('error', '提交失敗，請稍後再試');
      }
    });
  }

  // ==========================================
  // Scroll Reveal Animation
  // ==========================================

  function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((item) => observer.observe(item));
  }

  // ==========================================
  // Initialization
  // ==========================================

  document.addEventListener('DOMContentLoaded', () => {
    resetScrollPosition();

    // Setup language switcher
    document.querySelectorAll('[data-lang-button]').forEach((btn) => {
      btn.addEventListener('click', () =>
        setLanguage(btn.dataset.langButton)
      );
    });

    // Setup RSVP form
    setupRSVPForm();

    // Setup scroll reveal
    setupReveal();

    // Load configuration and remove loading state
    loadConfig().finally(() => setLoading(false));
  });

  window.addEventListener('load', resetScrollPosition);
})();
