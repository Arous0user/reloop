let backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

if (backendUrl && !/^https?:\/\//i.test(backendUrl)) {
  backendUrl = `https://${backendUrl}`;
}

const BACKEND_URL = backendUrl;
export default BACKEND_URL;
