
var cp = new CreasePattern();

var SIZE = 10;

var points = [];
for(var i = 0; i < SIZE; i++){
	var inner = [];
	for(var j = 0; j < SIZE; j++){ inner.push(j); }
	points.push(inner);
}

// points = points.map(function(row,y){
// 	return row.map(function(point,x){
// 		return new XY(x/(SIZE-1), y/(SIZE-1) + (x%2)*0.07);
// 	},this);
// },this);

points = points.map(function(row,y){
	return row.map(function(point,x){
		return new XY(x/(SIZE-1) + Math.cos(y)*0.05, y/(SIZE-1) + (x%2)*0.07);
	},this);
},this);

points.forEach(function(row,j){
	row.forEach(function(point,i){
		// crease zig zag rows
		if(i < row.length-1){
			var nextHorizPoint = row[ (i+1)%row.length ];
			var crease = cp.crease(point, nextHorizPoint);
			if(crease != undefined){
				if(j%2 == 0){ crease.mountain(); }
				else { crease.valley(); }
			}
		}
		// crease lines connecting between zig zag rows
		if(j < points.length-1){
			var nextRow = points[ (j+1)%points.length ];
			var nextVertPoint = nextRow[ i ];
			var crease = cp.crease(point, nextVertPoint);
			if(crease != undefined){
				if((i+j+1)%2 == 0){ crease.mountain(); }
				else { crease.valley(); }
			}
		}
	})
},this);

new OrigamiPaper("canvas", cp);
