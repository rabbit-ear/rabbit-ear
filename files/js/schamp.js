var pleats = 16;

cp.pleat(pleats, cp.edges[0], cp.edges[1]);

// the origins of each ray
var o = [0,0,0,0,1/pleats,1/pleats,-1/pleats,-1/pleats];

// the directions of each ray
[[1,0],[0,1],[-1,0],[0,-1],[1,0],[0,-1],[-1,0],[0,1]]
.map(function(el,i){
	return new Ray(0.5+o[i], 0.5-o[i], el[0], el[1]);
},this).map(function(ray){
	return new Polyline().rayReflectRepeat(ray, this.cp.edges);
},this).forEach(function(polyline){
	polyline.edges().forEach(function(edge){
		cp.crease(edge);
	},this);
},this);