let backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://innovative-motivation-hb-kvhjmh.up.railway.app';

if (backendUrl && !/^https?:\/\//i.test(backendUrl)) {
  backendUrl = `https://${backendUrl}`;
}

const BACKEND_URL = backendUrl;
export default BACKEND_URL;
