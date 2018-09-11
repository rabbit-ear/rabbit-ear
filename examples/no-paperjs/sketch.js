
// var origami = new OrigamiPaper();
var cp = new CreasePattern();
cp.birdBase();
var origami = new OrigamiPaper(cp);

var svg = document.getElementById('mysvg');
var NS = svg.getAttribute('xmlns');
