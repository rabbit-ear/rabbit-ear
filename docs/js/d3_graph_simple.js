var g0 = RabbitEar.Graph();
fillGraph(g0, 5);

var d3Graph = graphToD3(g0);
var svgCanvas = d3.select("#svgTest00");
makeForceDirectedGraph(d3Graph, svgCanvas);

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
	
	// fill DOM
	var nodeString = '';
	for(var i = 0; i < graph.nodes.length-1; i++){
		nodeString += i + ', ';
	}
	nodeString += graph.nodes.length-1;
	var edgeString = '';
	for(var i = 0; i < graph.edges.length-1; i++){
		edgeString += '[' + graph.edges[i].nodes[0].index + ',' + graph.edges[i].nodes[1].index + '], ';
	}
	edgeString += '[' + graph.edges[graph.edges.length-1].nodes[0].index + ',' + graph.edges[graph.edges.length-1].nodes[1].index + ']';
	var graphString = '{nodes: [' + nodeString + '],<br>&nbsp;edges: [ ' + edgeString + ' ]}';
}