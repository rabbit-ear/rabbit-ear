const origami = OrigamiCodeEditor("origami-container", "editor", "console");

var touches = RabbitEar.draw.svg.controls(origami.svg, 1, { radius: 0.02 });
touches[0].onMouseMove = function (e) {

  if (touches[0]) {
    touches[0].position = e;
    // touches[0].circle.setAttribute("x", e[0]);
    // touches[0].circle.setAttribute("y", e[1]);
    console.log(touches[0]);
    // console.log(touches[0], e);
    origami.compile();
  }
};

// bind things to the window
Object.defineProperty(window, "cp", { get: function () { return origami.cp; } });

// inspecting an object and doing something with it
// function getAllMethods(object) {
//  return Object.getOwnPropertyNames(object)
//    .filter(property => typeof object[property] == 'function');
// }
// console.log(getAllMethods(RabbitEar));

window.onload = function () {
  eval(origami.editor.getValue());
  origami.draw();
};
