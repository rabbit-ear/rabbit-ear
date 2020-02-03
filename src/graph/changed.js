const Changed = function () {
  let isPaused = false;
  const changed = {};
  changed.update = function (...args) {
    if (isPaused) { return; }
    changed.handlers.forEach(f => f(...args));
  };
  changed.handlers = [];
  Object.defineProperty(changed, "pause", {
    get: () => isPaused,
    set: (pause) => {
      isPaused = pause;
      if (!isPaused) {
        changed.update();
      }
    }
  })
  return Object.freeze(changed);
};

export default Changed;
