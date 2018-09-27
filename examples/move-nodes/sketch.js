// example
// split screen: crease pattern and folded form

var div = document.getElementsByClassName('row')[0];
var cp = new CreasePattern().frogBase();
var origami = new OrigamiPaper(div, cp);
var folded = new OrigamiFold(div, cp);

origami.onMouseMove = function(event){
	origami.draw();
	origami.nearest = origami.cp.nearest(event.point);
	this.addClass(this.get(origami.nearest.node), 'fill-yellow');
	if(origami.selected){
		origami.selected.x = event.point.x;
		origami.selected.y = event.point.y;
		folded.draw();
	}
}
origami.onMouseDown = function(event){ origami.selected = origami.nearest.node; }
origami.onMouseUp = function(){ origami.selected = undefined; }
