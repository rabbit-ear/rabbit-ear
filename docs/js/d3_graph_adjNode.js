var updateNodesAdjacentToEdge; // set these to functions to interact with DOM
var updateNodesAdjacentToNode;

window.document.addEventListener("DOMContentLoaded", () => {
  function fillGraph(graph, numVertices) {
    const numEdges = numVertices * 1.2;
    graph.clear();
    graph.edges_vertices = Array.from(Array(numVertices)).map((_, i) => [i,
      (i + 1 + Math.floor(Math.random() * (numVertices - 1))) % numVertices
    ]);
    while (graph.edges_vertices.length < numEdges) {
      graph.edges_vertices.push([
        Math.floor(Math.random() * numVertices),
        Math.floor(Math.random() * numVertices)]);
      graph.clean();
    }
    graph.complete();
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
      const adjacent = g01.vertices[index].vertices;
      for (let i = 0; i < adjacent.length; i += 1) {
        const nameString = "node" + adjacent[i];
        highlighted_id.push(nameString);
        highlighted_indices.push("<arg>" + adjacent[i] + "</arg>");
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
      const adjacent = g01.edges[index].vertices;
      for (let i = 0; i < adjacent.length; i += 1) {
        const nameString = "node" + adjacent[i];
        highlighted_id.push(nameString);
        highlighted_indices.push("<arg>" + adjacent[i] + "</arg>");
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
