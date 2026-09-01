import request from './client';

// Login is unauthenticated by definition - it's how you get the token.
export const login = (email) => request('/auth/login', { method: 'POST', body: { email }, auth: false });
