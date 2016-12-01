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

function makeForceDirectedGraph(graph, svg, didTouchNodeCallback, didTouchEdgeCallback){
	var width = +svg.attr("width");
	var height = +svg.attr("height");
	var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; })
										 .distance(100))
			// .force("charge", d3.forceManyBody())
			.force("collide", d3.forceCollide()
								.radius(40))
			.force("center", d3.forceCenter(width / 2, height / 2));

	var link = svg.append("g")
				  .attr("class", "links")
				  .selectAll("line")
				  .data(graph.links)
				  .enter().append("line")
						  .call(d3.drag()
								  .on("start", edgeMouseDown));

	var node = svg.append("g")
				  .attr("class", "nodes")
				  .selectAll("circle")
				  .data(graph.nodes)
				  .enter().append("circle")
						  .attr("r", 20)
						  .call(d3.drag()
								  .on("start", dragstarted)
								  .on("drag", dragged)
								  .on("end", dragended));

	simulation
			.nodes(graph.nodes)
			.on("tick", ticked)

	simulation.force("link")
			.links(graph.links)

	function ticked() {
		link
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	}
	function dragstarted(d) {
		if(d != undefined){
			var index = d.id.slice(4);
			didTouchNodeCallback(parseInt(index));
		}
		if(!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}
	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}
	function dragended(d) {
		if(!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}
	function edgeMouseDown(d){
		if(d != undefined){
			var index = d.id.slice(4);
			didTouchEdgeCallback(parseInt(index));
		}
	}
}