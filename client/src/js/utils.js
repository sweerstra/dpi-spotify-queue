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

export const formatDuration = (durationInMilliseconds) => {
  const seconds = durationInMilliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
};
