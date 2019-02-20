export function getUrlParams(url) {
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
}
