var updateNodesAdjacentToEdge; // set these to functions to interact with DOM
var updateNodesAdjacentToNode;

window.document.addEventListener("DOMContentLoaded", () => {
  function fillGraph(graph, numNodes) {
    const numEdges = numNodes * 1.2;
    graph.clear();
    for (let i = 0; i < numNodes; i += 1) {
      graph.newNode();
    }
    for (let i = 0; i < graph.nodes.length; i += 1) {
      // inverse relationship to scramble edges# with node#
      const first = Math.floor(graph.nodes.length - 1 - i);
      let match;
      do {
        match = Math.floor(Math.random() * graph.nodes.length);
      } while (match == first);
      graph.newEdge(graph.nodes[first], graph.nodes[match]);
    }
    if (numEdges > numNodes) {
      for (let i = 0; i < numEdges - numNodes; i += 1) {
        const rand1 = Math.floor(Math.random() * numNodes);
        const rand2 = Math.floor(Math.random() * numNodes);
        graph.newEdge(graph.nodes[rand1], graph.nodes[rand2]);
      }
    }
    graph.clean();
  }

  const g01 = RabbitEar.graph();
  fillGraph(g01, 7);

  const d3Graph01 = graphToD3(g01);
  const svgCanvas01 = d3.select("#svgTest01");
  makeForceDirectedGraph(d3Graph01, svgCanvas01, didTouchNode01, didTouchEdge01);

  function didTouchNode01(index, circles, links) {
    const highlighted_id = [];
    const highlighted_indices = [];
    if (index != undefined) {
      // let adjacent = g01.getNodesAdjacentToNode(index);
      const adjacent = g01.nodes[index].adjacent.nodes;
      for (let i = 0; i < adjacent.length; i += 1) {
        const nameString = "node" + adjacent[i].index;
        highlighted_id.push(nameString);
        highlighted_indices.push("<arg>" + adjacent[i].index + "</arg>");
      }
    }
    updateSelection("node" + index, circles, links, highlighted_id);
    if (updateNodesAdjacentToNode != undefined) { updateNodesAdjacentToNode(index, highlighted_indices); }
    if (updateNodesAdjacentToEdge != undefined) { updateNodesAdjacentToEdge(undefined); }
    return highlighted_id;
  }

  function didTouchEdge01(index, circles, links) {
    const highlighted_id = [];
    const highlighted_indices = [];
    if (index != undefined) {
      // let adjacent = g01.getNodesAdjacentToEdge(index);
      const adjacent = g01.edges[index].adjacent.nodes;
      for (const i = 0; i < adjacent.length; i += 1) {
        const nameString = "node" + adjacent[i].index;
        highlighted_id.push(nameString);
        highlighted_indices.push("<arg>" + adjacent[i].index + "</arg>");
      }
    }
    updateSelection("link" + index, circles, links, highlighted_id);
    if (updateNodesAdjacentToEdge != undefined) { updateNodesAdjacentToEdge(index, highlighted_indices); }
    if (updateNodesAdjacentToNode != undefined) { updateNodesAdjacentToNode(undefined); }
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
