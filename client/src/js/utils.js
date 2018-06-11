export const debounce = (fn, time) => {
  let timeout;

  return function () {
    const call = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(call, time);
  };
};

export const getUrlParams = (url) => {
  const queryIndex = url.indexOf('?') + 1;
  const hashIndex = url.indexOf('#') + 1;

  let index = 0;

  if (queryIndex !== 0) index = queryIndex;
  else if (hashIndex !== 0) index = hashIndex;

  if (index === 0) {
    return null;
  }

  return url.slice(index).split('&')
    .reduce((params, hash) => {
      const [key, value] = hash.split('=');
      return { ...params, [key]: value };
    }, {});
};

export const formatDuration = (durationInMilliseconds) => {
  const seconds = durationInMilliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
};
