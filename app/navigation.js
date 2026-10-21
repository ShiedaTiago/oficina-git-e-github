(function () {
  'use strict';

  function resolveSlide(hash, ids) {
    try {
      const id = decodeURIComponent(String(hash).replace(/^#/, ''));
      return Math.max(0, ids.indexOf(id));
    } catch {
      return 0;
    }
  }

  function moveSlide(index, delta, total) {
    return Math.max(0, Math.min(Math.max(0, total - 1), index + delta));
  }

  window.Oficina = { ...window.Oficina, resolveSlide, moveSlide };
}());
