import request from './client';

export const getLinks = () => request('/links');
export const createLink = (data) => request('/links', { method: 'POST', body: data });
export const updateLink = (id, data) => request(`/links/${id}`, { method: 'PUT', body: data });
export const deleteLink = (id) => request(`/links/${id}`, { method: 'DELETE' });
