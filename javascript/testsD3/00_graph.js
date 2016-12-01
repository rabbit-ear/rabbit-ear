var g = new Graph();
fillGraph(g, 11);

var d3Graph = graphToD3(g);
var svgCanvas = d3.select("#svgCanvas");
makeForceDirectedGraph(d3Graph, svgCanvas, didTouchNode, didTouchEdge);

function fillGraph(graph, numNodes){
	var numEdges = numNodes*1.2;
	graph.clear();
	for(var i = 0; i < numNodes; i++) graph.addNode(i);
	for(var i = 0; i < graph.nodes.length; i++){
		// inverse relationship to scramble edges# with node#
		var first = parseInt(graph.nodes.length-1-i);
		var match;
		do{ match = Math.floor(Math.random()*graph.nodes.length);
		} while(match == first);
		graph.addEdge( {'a':first, 'b':match} );
	}
	if(numEdges > numNodes){
		for(var i = 0; i < numEdges - numNodes; i++)
			graph.addEdge( {'a':Math.floor(Math.random()*numNodes), 'b':Math.floor(Math.random()*numNodes)} );
	}
}

function didTouchNode(index){
	console.log(index);
}

function didTouchEdge(index){
	console.log(index);
}
