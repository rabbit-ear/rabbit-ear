const Changed = function () {
  const changed = {};
  changed.update = function (...args) {
    changed.handlers.forEach(f => f(...args));
  };
  changed.handlers = [];
  return Object.freeze(changed);
};

export default Changed;
