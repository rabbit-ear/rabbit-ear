// this method allows ou to attach an outside library to this one

const use = function (library) {
  if (typeof library !== "function"
    || library === null
    || typeof library.append !== "function") {
    return;
  }
  library.append(this);
};

export default use;
