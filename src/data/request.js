class Request {
  static parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    return response.json();
  }

  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }

  get(url, token) {
    return this._request(url, token);
  }

  post(url, data, token) {
    return this._request(url, token, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  put(url, data, token) {
    return this._request(url, token, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  delete(url, data, token) {
    return this._request(url, token, {
      method: 'delete',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  _request(url, token, options = {}) {
    const headers = options.headers || {};

    if (token) {
      headers.Authorization = token;
    }

    options.headers = headers;

    return fetch(url, options)
      .then(Request.checkStatus)
      .then(Request.parseJSON);
  }
}

export default new Request();
