import { create } from 'zustand';
import * as linksApi from '../api/links';
import * as statsApi from '../api/stats';

// n8n enrichment finishes asynchronously after a link is created, so the store
// polls for updates while any link is still "pending" - there's no push
// mechanism (WebSocket/SSE) in this app, and a plain interval is enough here.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 20; // ~60s, then give up and leave the card at "pending"

export const useLinksStore = create((set, get) => ({
  links: [],
  stats: null,
  isLoading: false,
  error: null,
  _pollTimer: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [links, stats] = await Promise.all([linksApi.getLinks(), statsApi.getStats()]);
      set({ links, stats, isLoading: false });
      get()._startPollingIfNeeded();
    } catch (err) {
      set({ error: err.message || 'Failed to load your links', isLoading: false });
    }
  },

  refreshStats: async () => {
    try {
      set({ stats: await statsApi.getStats() });
    } catch {
      // stats are a secondary display; a failed refresh shouldn't block the UI
    }
  },

  addLink: async (data) => {
    const link = await linksApi.createLink(data);
    set({ links: [link, ...get().links] });
    await get().refreshStats();
    get()._startPollingIfNeeded();
  },

  editLink: async (id, data) => {
    const updated = await linksApi.updateLink(id, data);
    set({ links: get().links.map((l) => (l.id === id ? updated : l)) });
    await get().refreshStats();
  },

  removeLink: async (id) => {
    await linksApi.deleteLink(id);
    set({ links: get().links.filter((l) => l.id !== id) });
    await get().refreshStats();
  },

  reset: () => {
    get()._stopPolling();
    set({ links: [], stats: null, error: null });
  },

  // --- enrichment polling (private-ish; not meant to be called by components) ---

  _startPollingIfNeeded: () => {
    if (get()._pollTimer) return; // already polling
    if (!get().links.some((l) => l.enrichment_status === 'pending')) return;

    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const links = await linksApi.getLinks();
        set({ links });
      } catch {
        // a missed poll tick isn't worth surfacing as a page-level error
      }
      const stillPending = get().links.some((l) => l.enrichment_status === 'pending');
      if (!stillPending || attempts >= MAX_POLL_ATTEMPTS) {
        get()._stopPolling();
      }
    }, POLL_INTERVAL_MS);
    set({ _pollTimer: timer });
  },

  _stopPolling: () => {
    const timer = get()._pollTimer;
    if (timer) clearInterval(timer);
    set({ _pollTimer: null });
  },
}));
