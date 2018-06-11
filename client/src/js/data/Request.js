class Request {
  get(url, token) {
    return this._request(url, token);
  }

  post(url, data, token) {
    return this._request(url, token, {
      method: 'post',
      body: JSON.stringify(data)
    });
  }

  put(url, data, token) {
    return this._request(url, token, {
      method: 'put',
      body: JSON.stringify(data)
    });
  }

  _request(url, token, options = {}) {
    const headers = { ...options.headers, 'Content-Type': 'application/json' };

    if (token) {
      headers.Authorization = token;
    }

    return fetch(url, { ...options, headers });
  };
}

export default new Request();
