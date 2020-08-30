// this method allows you to attach an outside library to this one

const use = function (library) {
  if (typeof library !== "function"
    || library === null
    || typeof library.attach !== "function") {
    return;
  }
  library.attach(this);
};

export default use;
