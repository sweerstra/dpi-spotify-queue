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

export const formatDuration = (durationInMilliseconds, timeFormat = true) => {
  const seconds = durationInMilliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.round(seconds % 60);

  return `${minutes}${timeFormat ? ':' : 'm '}${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}${timeFormat ? '' : 's'}`;
};

export const formatDurationWithAddedMilliseconds = (date, milliseconds) => {
  date.setSeconds(date.getSeconds() + (milliseconds / 1000));
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#', i = 0;
  for (; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
