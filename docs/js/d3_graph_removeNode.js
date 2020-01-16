var g03 = RabbitEar.graph();
fillGraph(g03, 7);

var d3Graph03 = graphToD3(g03);
var svgCanvas03 = d3.select("#svgTest03");
makeForceDirectedGraph(d3Graph03, svgCanvas03, undefined, undefined, true, false);

function fillGraph(graph, numNodes){
	var numEdges = numNodes*1.2;
	graph.clear();
	for(var i = 0; i < numNodes; i++) graph.newNode();
	for(var i = 0; i < graph.nodes.length; i++){
		// inverse relationship to scramble edges# with node#
		var first = parseInt(graph.nodes.length-1-i);
		var match;
		do{ match = Math.floor(Math.random()*graph.nodes.length);
		} while(match == first);
		graph.newEdge(graph.nodes[first], graph.nodes[match]);
	}
	if(numEdges > numNodes){
		for(var i = 0; i < numEdges - numNodes; i++){
			var rand1 = Math.floor(Math.random()*numNodes);
			var rand2 = Math.floor(Math.random()*numNodes);
			graph.newEdge( graph.nodes[rand1], graph.nodes[rand2] );
		}
	}
	graph.clean();
}