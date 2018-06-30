function testClockwiseInteriorAngles(){
	for(var i = 0; i < 100; i++){
		var a = Math.random()*Math.PI;
		var b = Math.random()*Math.PI;
		var vecA = new XY(Math.cos(a), Math.sin(a));
		var vecB = new XY(Math.cos(b), Math.sin(b));
		var computedVec = clockwiseInteriorAngle(vecA, vecB);
		var computedAngle = clockwiseInteriorAngleRadians(a,b);
		var related = computedVec == computedAngle;
		if(!epsilonEqual(computedVec, computedAngle)){ return false; }
	}
	return true;	
}


if(testClockwiseInteriorAngles()){
	document.body.innerHTML += "passed: clockwiseInteriorAngle and clockwiseInteriorAngleRadians";
} else{
	document.body.innerHTML += "clockwiseInteriorAngle and clockwiseInteriorAngleRadians are not in sync";
}


function testFragmentOrder(){
	var graph = new PlanarGraph();
	graph.clear();
	for(var i = 0; i < 40; i++){
		graph.newPlanarEdge(Math.random(), Math.random(), Math.random(), Math.random());
	}
	var report = graph.fragment();
	var intersections = report.nodes.fragment;
}
