const Storage = {
  getToken() {
    return localStorage.getItem('access_token');
  },
  setToken(token, expireTime) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('expiring', (Date.now() / 1000) + expireTime);
  },
  removeToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiring');
  },
  hasExpiredToken() {
    const expiring = localStorage.getItem('expiring');
    const now = Date.now() / 1000;

    return expiring && parseFloat(expiring) < now;
  },
  setGroup(group) {
    localStorage.setItem('group', group);
  },
  getGroup() {
    return localStorage.getItem('group');
  }
};

export default Storage;
