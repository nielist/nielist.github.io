function getUrlParams(url) {
  if (typeof url === 'undefined' || url === '') {
    url = window.location;
  }

  let queryString = url.search;
  // ?product=shirt&color=blue&newuser&size=m

  urlParams = new URLSearchParams(queryString);

  return urlParams;
}

function updateUrl(params) {
  let urlParams = new URLSearchParams();
  for (const key of Object.keys(params)) {
    for (const value of Object.values(params[key])) {
      //urlParams.set(key, value);
      urlParams.append(key, value);
    }
  }

  let queryString = urlParams.toString();
  window.history.replaceState({}, '', `${window.location.pathname}?${queryString}`);
}
