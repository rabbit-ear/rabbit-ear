function graphToD3(graph){
	
	// this converts a Graph() object with "nodes" [] and "edges" []
	// into the D3 object suitable for the force-directed graph

	var forceGraph = {'nodes':[], 'links':[]};

	for(var i = 0; i < graph.nodes.length; i++){
		var nameString = 'node' + i;
		forceGraph['nodes'].push( {'id' : nameString} );
	}
	for(var i = 0; i < graph.edges.length; i++){
		var nameString = 'link' + i;
		var one = graph.edges[i].a;
		var two = graph.edges[i].b;
		var node1String = 'node' + one;
		var node2String = 'node' + two;
		forceGraph['links'].push( {'id' : nameString, 'source' : node1String, 'target' : node2String} );
	}
	return forceGraph;
}