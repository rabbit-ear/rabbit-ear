function graphToD3(graph) {
  // this converts a Graph() object with "vertices" [] and "edges" []
  // into the D3 object suitable for the force-directed graph
  var forceGraph = { nodes: [], links: [] };
  var verticesLength = 1 + graph.edges_vertices
    .map(ev => ev[0] > ev[1] ? ev[0] : ev[1])
    .reduce((a, b) => a > b ? a : b);
  for (var i = 0; i < verticesLength; i += 1) {
    var nameString = "node" + i;
    forceGraph.nodes.push({ id: nameString });
  }
  for (var i = 0; i < graph.edges_vertices.length; i += 1) {
    var nameString = "link" + i;
    var one = graph.edges_vertices[i][0];
    var two = graph.edges_vertices[i][1];
    var node1String = "node" + one;
    var node2String = "node" + two;
    forceGraph["links"].push({ id: nameString, source: node1String, target: node2String });
  }
  return forceGraph;
}

function makeForceDirectedGraph(graph, svg, didTouchNodeCallback, didTouchEdgeCallback, touchNodeToRemoveNode, touchLinkToRemoveLink) {
  // options
  var radius = 15;
  var forceDistance = 40;

  // for selection
  var circles = [];
  var lines = [];
  var selected_id = undefined;
  var highlighted_id = [];

  var width = +svg.attr("width");
  var height = +svg.attr("height");
  if (width === 0 && height === 0) {
    var rect = svg._groups[0][0].getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; })
      .distance(forceDistance))
    // .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide()
      .radius(radius * 2))
    .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("id", function (d) { return d.id; })
      .call(d3.drag()
        .on("start", edgeMouseDown));

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", radius)
      .attr("id", function (d) { return d.id; })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  circles = svg.selectAll("circle")["_groups"][0];
  lines = svg.selectAll("line")["_groups"][0];

  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; });
  }
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    if (d != undefined){
      if (d.id === selected_id) {selected_id = undefined; highlighted_id = [];}
      else selected_id = d.id;
      var index = undefined;
      if (selected_id != undefined) 
        index = parseInt(d.id.slice(4));
      if (didTouchNodeCallback != undefined)
        highlighted_id = didTouchNodeCallback(index, circles, lines);
      if (touchNodeToRemoveNode){
        // remove edges that touch node
        for (var i = graph.links.length - 1; i >= 0; i -= 1){
          if (graph.links[i].source.id == d.id || graph.links[i].target.id == d.id)
            graph.links.splice(i, 1);
        }
        // remove node upon touching
        var foundIndex = undefined;
        for (var i = 0; i < graph.nodes.length; i += 1){
          if (graph.nodes[i].id == d.id) foundIndex = i;
        }
        if (foundIndex != undefined) graph.nodes.splice(foundIndex, 1);
        restart();
      }
    }
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  function edgeMouseDown(d) {
    if (d != undefined) {
      if (d.id === selected_id) {
        selected_id = undefined;
        highlighted_id = [];
      } else { selected_id = d.id; }
      var index = undefined;
      if (selected_id != undefined) {
        index = parseInt(d.id.slice(4));
      }
      if (didTouchEdgeCallback != undefined) {
        highlighted_id = didTouchEdgeCallback(index, circles, lines);
      }
      if (touchLinkToRemoveLink) {
        // remove link upon touching
        var foundIndex = undefined;
        for (var i = 0; i < graph.links.length; i += 1) {
          if (graph.links[i].id == d.id) { foundIndex = i; }
        }
        if (foundIndex != undefined) { graph.links.splice(foundIndex, 1); }
        restart();
      }
    }
  }

  function restart() {
    // Apply the general update pattern to the nodes.
    node = node.data(graph.nodes, function (d) { return d.id; });
    node.exit().remove();
    node = node.enter().append("circle")
      .attr("fill", function (d) { return color(d.id); })
      .attr("r", 8)
      .merge(node);

    // Apply the general update pattern to the links.
    link = link.data(graph.links, function (d) { return d.source.id + "-" + d.target.id; });
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    // Update and restart the simulation.
    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
    simulation.alpha(1).restart();
  }

  // on boot
  if (typeof didTouchNodeCallback === "function") {
    didTouchNodeCallback(0, circles, lines);
  }
}
