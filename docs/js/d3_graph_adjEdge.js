var updateEdgesAdjacentToNode; // set these to functions to interact with DOM
var updateEdgesAdjacentToEdge;

window.document.addEventListener("DOMContentLoaded", () => {
  function fillGraph(graph, numNodes) {
    let numEdges = numNodes * 1.2;
    graph.clear();
    for (let i = 0; i < numNodes; i += 1) {
      graph.newNode();
    }
    for (let i = 0; i < graph.nodes.length; i += 1) {
      // inverse relationship to scramble edges# with node#
      let first = Math.floor(graph.nodes.length - 1 - i);
      let match;
      do {
        match = Math.floor(Math.random() * graph.nodes.length);
      } while (match == first);
      graph.newEdge(graph.nodes[first], graph.nodes[match]);
    }
    if (numEdges > numNodes) {
      for (let i = 0; i < numEdges - numNodes; i += 1) {
        let rand1 = Math.floor(Math.random() * numNodes);
        let rand2 = Math.floor(Math.random() * numNodes);
        graph.newEdge(graph.nodes[rand1], graph.nodes[rand2]);
      }
    }
    graph.clean();
    for (let i = 0; i < graph.nodes.length; i += 1) { graph.nodes[i].index = i; }
    for (let i = 0; i < graph.edges.length; i += 1) { graph.edges[i].index = i; }
  }

  let g02 = RabbitEar.graph();
  fillGraph(g02, 7);

  let d3Graph02 = graphToD3(g02);
  let svgCanvas02 = d3.select("#svgTest02");
  makeForceDirectedGraph(d3Graph02, svgCanvas02, didTouchNode02, didTouchEdge02);


  function didTouchNode02(index, circles, links) {
    let highlighted_id = [];
    let highlighted_indices = [];
    if (index != undefined) {
      // let adjacent = g02.getEdgesAdjacentToNode(index);
      let adjacent = g02.nodes[index].adjacent.edges;
      for (let i = 0; i < adjacent.length; i += 1) {
        let nameString = "link" + adjacent[i].index;
        highlighted_id.push(nameString);
        highlighted_indices.push("<arg>" + adjacent[i].index + "</arg>");
      }
    }
    updateSelection("node" + index, circles, links, highlighted_id);
    if (updateEdgesAdjacentToNode != undefined) { updateEdgesAdjacentToNode(index, highlighted_indices); }
    if (updateEdgesAdjacentToEdge != undefined) { updateEdgesAdjacentToEdge(undefined); }
    return highlighted_id;
  }


  function didTouchEdge02(index, circles, links) {
    let highlighted_id = [];
    let highlighted_indices = [];
    if (index != undefined) {
      // let adjacent = g02.getEdgesAdjacentToEdge(index);
      let adjacent = g02.edges[index].adjacent.edges;
      for (let i = 0; i < adjacent.length; i += 1) {
        let nameString = "link" + adjacent[i].index;
        highlighted_id.push(nameString);
        highlighted_indices.push("<arg>" + adjacent[i].index + "</arg>");
      }
    }
    updateSelection("link" + index, circles, links, highlighted_id);
    if (updateEdgesAdjacentToEdge != undefined){ updateEdgesAdjacentToEdge(index, highlighted_indices); }
    if (updateEdgesAdjacentToNode != undefined){ updateEdgesAdjacentToNode(undefined); }
    return highlighted_id;
  }

  function updateSelection(id, circles, links, highlighted_id) {
    for (let i = 0; i < circles.length; i += 1) {
      if (id == circles[i].id)                          circles[i].style.stroke = "#F00";
      else if (contains(circles[i].id, highlighted_id)) circles[i].style.stroke = "#09F";
      else                                             circles[i].style.stroke = "#000";
    }
    for (let i = 0; i < links.length; i += 1) {
      if (id == links[i].id)                          links[i].style.stroke = "#F00";
      else if (contains(links[i].id, highlighted_id)) links[i].style.stroke = "#09F";
      else                                           links[i].style.stroke = "#000";
    }
  }

  function contains(obj, list) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }
});
