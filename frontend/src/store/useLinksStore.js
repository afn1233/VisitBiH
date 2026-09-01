import { create } from 'zustand';
import * as linksApi from '../api/links';
import * as statsApi from '../api/stats';

export const useLinksStore = create((set, get) => ({
  links: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [links, stats] = await Promise.all([linksApi.getLinks(), statsApi.getStats()]);
      set({ links, stats, isLoading: false });
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

  reset: () => set({ links: [], stats: null, error: null }),
}));
