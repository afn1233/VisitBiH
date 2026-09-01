import request from './client';

export const getStats = () => request('/stats');
