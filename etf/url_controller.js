var urlParams = new URLSearchParams();

function setUrlParam(key, value) {
  urlParams.set(key, value);
}

function cleanUrlParams() {
  for (const key of urlParams.keys()) {
    if (urlParams.has(key)) {
      urlParams.delete('key');
    }
  }
}

function getUrlParams(url) {
  if (typeof url === 'undefined' || url === '') {
    url = window.location;
  }

  let queryString = url.search;
  // ?product=shirt&color=blue&newuser&size=m

  urlParams = new URLSearchParams(queryString);

  return urlParams;
}

function updateUrl() {
  let queryString = urlParams.toString();
  window.history.replaceState({}, '', `${window.location.pathname}?${queryString}`);
}
