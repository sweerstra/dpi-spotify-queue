export const debounce = (fn, time) => {
  let timeout;

  return function () {
    const call = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(call, time);
  };
};

export const getUrlHashParams = (url) => {
  try {
    const { hash } = new URL(url);

    if (!hash) {
      return;
    }

    return hash.slice(1)
      .split('&')
      .reduce((obj, pair) => {
        const [key, value] = pair.split('=');
        obj[key] = value;
        return obj;
      }, {});
  } catch (e) {
    return null;
  }
};
