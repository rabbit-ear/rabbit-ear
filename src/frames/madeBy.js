
const axiom1 = function () {

};

const construction = function () {
  if ("re:construction" in this === true) {
    if (objects.length > 0 && "axiom" in objects[0] === true) {
      this["re:construction"].axiom = objects[0].axiom;
      this["re:construction"].parameters = objects[0].parameters;
    }
  }
};

const madeBy = function () {
  const made = {};
  made.axiom1 = function () {};
  return made;
};


export default madeBy;
