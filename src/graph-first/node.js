/** Nodes are 1 of the 2 fundamental components in a graph */
const Node = function (graph) {
  const node = Object.create(null);
  node.graph = graph;

  /**
   * Get an array of edges that contain this node
   * @returns {GraphEdge[]} array of adjacent edges
   * @example
   * var adjacent = node.adjacentEdges()
   */
  const adjacentEdges = function () {
    return node.graph.edges
      .filter(el => el.nodes[0] === node || el.nodes[1] === node);
  };
  /**
   * Get an array of nodes that share an edge in common with this node
   * @returns {Node[]} array of adjacent nodes
   * @example
   * var adjacent = node.adjacentNodes()
   */
  const adjacentNodes = function () {
    const checked = []; // the last step, to remove duplicate nodes
    return adjacentEdges()
      .filter(el => !el.isCircular)
      .map(el => (el.nodes[0] === node
        ? el.nodes[1]
        : el.nodes[0]))
      .filter(el => (checked.indexOf(el) >= 0 ? false : checked.push(el)));
  };
  /**
   * Get both adjacent edges and nodes.
   */
  const adjacent = function () {
    const adj = Object.create(null);
    adj.edges = adjacentEdges();
    const checked = []; // the last step, to remove duplicate nodes
    adj.nodes = adj.edges.filter(el => !el.isCircular)
      .map(el => (el.nodes[0] === node
        ? el.nodes[1]
        : el.nodes[0]))
      .filter(el => (checked.indexOf(el) >= 0
        ? false
        : checked.push(el)));
    return adj;
  };
  /** Test if a node is connected to another node by an edge
   * @param {Node} node test adjacency between this and parameter node
   * @returns {boolean} true or false, adjacent or not
   * @example
   * var isAdjacent = node.isAdjacentToNode(anotherNode);
   */
  const isAdjacentToNode = function (n) {
    return adjacentNodes.filter(el => el === n).length > 0;
  };
  /** The degree of a node is the number of adjacent edges
   *   circular edges are counted twice
   * @returns {number} number of adjacent edges
   * @example
   * var degree = node.degree();
   */
  const degree = function () {
    // circular edges are counted twice
    return node.graph.edges
      .map(el => el.nodes
        .map(n => (n === node ? 1 : 0))
        .reduce((a, b) => a + b, 0))
      .reduce((a, b) => a + b, 0);
  };
  Object.defineProperty(node, "adjacent", {
    get: function () { return adjacent(); }
  });
  // Object.defineProperty(node, "adjacentEdges", {
  //  get:function () { return adjacentEdges(); }
  // });
  // Object.defineProperty(node, "adjacentNodes", {
  //  get:function () { return adjacentNodes(); }
  // });
  Object.defineProperty(node, "degree", { get: () => degree() });
  Object.defineProperty(node, "isAdjacentToNode", { value: isAdjacentToNode });
  return node;
};

export default Node;
