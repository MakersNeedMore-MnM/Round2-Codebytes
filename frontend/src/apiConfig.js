// frontend/src/apiConfig.js
// If running locally, point to FastAPI port 8000. If on Vercel, use relative paths.
export const API_BASE = 
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : '';