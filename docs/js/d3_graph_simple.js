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
  }

  const graph = RabbitEar.graph();
  fillGraph(graph, 5);

  const d3Graph = graphToD3(graph);
  const svgCanvas = d3.select("#svgTest00");
  makeForceDirectedGraph(d3Graph, svgCanvas);
});
