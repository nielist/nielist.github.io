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
  for (const key of params.keys()) {
    for (const value of params[key].values()) {
      //urlParams.set(key, value);
      urlParams.append(key, value);
    }
  }

  let queryString = urlParams.toString();
  window.history.replaceState({}, '', `${window.location.pathname}?${queryString}`);
}
