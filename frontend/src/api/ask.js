import request from './client';

export const askQuestion = (question) => request('/ask', { method: 'POST', body: { question } });
