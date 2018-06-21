var cp = new CreasePattern();

cp.crease(0,0,0.5,1).mountain();
var svg = cp.foldSVG();
console.log(svg);


var element = document.createElement('a');
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(svg));
element.setAttribute('download', 'folded.svg');
document.body.appendChild(element);
element.click();
document.body.removeChild(element);
