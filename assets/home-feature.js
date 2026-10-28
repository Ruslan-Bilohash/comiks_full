/* One preview per document; rotate after three page loads, not UI rerenders. */
(() => {
  'use strict';
  let selected;
  window.KomiksHomeFeature = { choose(comics, storage, random = Math.random) {
    if (selected) return selected;
    const list = comics.filter(c => !c._private && c.panels?.[0]?.lines?.length);
    if (!list.length) return null;
    let state;
    try { state = JSON.parse(storage.getItem('comiks.homeFeature')); } catch (_) {}
    const previous = list.find(c => c.id === state?.id);
    const retain = previous && Number.isInteger(state.loads) && state.loads > 0 && state.loads < 3;
    const pool = list.length > 1 ? list.filter(c => c !== previous) : list;
    selected = retain ? previous : pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
    try { storage.setItem('comiks.homeFeature', JSON.stringify({ id: selected.id, loads: retain ? state.loads + 1 : 1 })); } catch (_) {}
    return selected;
  }};
})();
