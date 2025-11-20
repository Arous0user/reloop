// The backend URL is configured using the REACT_APP_BACKEND_URL environment variable.
// The original value was pointing to a domain that is no longer working.
// Please update this with your actual backend URL.
// For example: 'https://your-backend-service.onrailway.app'
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://your-backend-url.com';
export default BACKEND_URL;