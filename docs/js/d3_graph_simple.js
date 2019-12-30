window.document.addEventListener("DOMContentLoaded", () => {
  function fillGraph(graph, numNodes) {
    const numEdges = numNodes * 1.2;
    graph.clear();
    for (let i = 0; i < numNodes; i += 1) graph.newNode();
    for (let i = 0; i < graph.nodes.length; i += 1) {
      // inverse relationship to scramble edges# with node#
      const first = Math.floor(graph.nodes.length - 1 - i);
      let match;
      do {
        match = Math.floor(Math.random() * graph.nodes.length);
      } while (match === first);
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

  const g0 = RabbitEar.graph();
  fillGraph(g0, 5);

  const d3Graph = graphToD3(g0);
  const svgCanvas = d3.select("#svgTest00");
  makeForceDirectedGraph(d3Graph, svgCanvas);
});
