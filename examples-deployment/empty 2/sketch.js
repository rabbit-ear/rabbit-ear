var cp = new CreasePattern();

cp.crease(0,0,0.5,1).mountain();
var svg = cp.foldSVG();
console.log(svg);
