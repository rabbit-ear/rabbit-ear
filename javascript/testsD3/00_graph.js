
var g = new Graph();
fillGraph(g, 20);

var d3Graph = graphToD3(g);
var svgCanvas = d3.select("#svgCanvas");
makeForceDirectedGraph(d3Graph, svgCanvas);

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

function makeForceDirectedGraph(graph, svg){
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
			didTouchNode(parseInt(index));
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
			didTouchEdge(parseInt(index));
		}
	}
}


function didTouchNode(index){
	console.log(index);
}

function didTouchEdge(index){
	console.log(index);
}
