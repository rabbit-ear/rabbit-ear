const QueryWatcher = function (queryKey) {
  const { LZString } = window;
  const app = {};
  const url = new URL(window.location.href);

  const getURLQuery = function () {
    // do we need to call url = new URL(window.location.href);
    const c = url.searchParams.get(queryKey);
    if (c !== null) {
      const decoded = LZString.decompressFromEncodedURIComponent(c);
      if (decoded == null) {
        // bad decoding. user error.
      }
      return decoded;
    }
    return "";
  };

  const makeURLWithQueryValue = function (string) {
    const encoded = LZString.compressToEncodedURIComponent(string);
    return (encoded == null || string == null || string === "")
      ? `${url.origin}${url.pathname}`
      : `${url.origin}${url.pathname}?${queryKey}=${encoded}`;
  };

  const setURLQuery = function (rawText) {
    const newURL = makeURLWithQueryValue(rawText);
    window.history.replaceState(null, null, newURL);
  };

  Object.defineProperty(app, "value", {
    get: () => getURLQuery(),
    set: (newValue) => { setURLQuery(newValue); }
  });
  app.compress = (...args) => LZString.compressToEncodedURIComponent(...args);
  app.uncompress = (...args) => LZString.decompressFromEncodedURIComponent(...args);
  app.makeURLWithQueryValue = makeURLWithQueryValue;

  return app;
};
