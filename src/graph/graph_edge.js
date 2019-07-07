/**
 * Edges are 1 of the 2 fundamental components in a graph.
 * 1 edge connect 2 nodes.
 */
const GraphEdge = function (graph, node1, node2) {
  const edge = Object.create(null);
  edge.graph = graph; // pointer to the graph. required for adjacency tests
  edge.nodes = [node1, node2]; // required. every edge must connect 2 nodes

  /** Get an array of edges that share a node in common with this edge
   * @returns {GraphEdge[]} array of adjacent edges
   * @example
   * var adjacent = edge.adjacentEdges()
   */
  const adjacentEdges = function () {
    return edge.graph.edges.filter(e => e !== edge
      && (e.nodes[0] === edge.nodes[0]
      || e.nodes[0] === edge.nodes[1]
      || e.nodes[1] === edge.nodes[0]
      || e.nodes[1] === edge.nodes[1]));
  };
  /** Get the two nodes of this edge
   * @returns {GraphNode[]} the two nodes of this edge
   * @example
   * var adjacent = edge.adjacentNodes()
   */
  const adjacentNodes = function () { return [...edge.nodes]; };
  /**
   * Get both adjacent edges and nodes. saves on computation time
   */
  const adjacent = function () {
    const adj = Object.create(null);
    adj.nodes = adjacentNodes();
    adj.edges = adjacentEdges();
    return adj;
  };

  /** Test if an edge is connected to another edge by a common node
   * @param {GraphEdge} edge test adjacency between this and supplied parameter
   * @returns {boolean} true or false, adjacent or not
   * @example
   * var isAdjacent = edge.isAdjacentToEdge(anotherEdge)
   */
  const isAdjacentToEdge = function (e) {
    return ((edge.nodes[0] === e.nodes[0]) || (edge.nodes[1] === e.nodes[1])
      || (edge.nodes[0] === e.nodes[1]) || (edge.nodes[1] === e.nodes[0]));
  };
  /** Test if an edge contains the same nodes as another edge
   * @param {GraphEdge} edge test similarity between this and parameter
   * @returns {boolean} true or false, similar or not
   * @example
   * var isSimilar = edge.isSimilarToEdge(anotherEdge)
   */
  const isSimilarToEdge = function (e) {
    return ((edge.nodes[0] === e.nodes[0] && edge.nodes[1] === e.nodes[1])
      || (edge.nodes[0] === e.nodes[1] && edge.nodes[1] === e.nodes[0]));
  };
  /** Supply one of the edge's incident nodes and get back the other node
   * @param {GraphNode} node must be one of the edge's 2 nodes
   * @returns {GraphNode} the node that is the other node
   * @example
   * var node2 = edge.otherNode(node1)
   */
  const otherNode = function (n) {
    if (edge.nodes[0] === n) { return edge.nodes[1]; }
    if (edge.nodes[1] === n) { return edge.nodes[0]; }
    return undefined;
  };
  /** Test if an edge points both at both ends to the same node
   * @returns {boolean} true or false, circular or not
   * @example
   * var isCircular = edge.isCircular
   */
  const isCircular = function () {
    return edge.nodes[0] === edge.nodes[1];
  };
  // do we need to test for invalid edges?
    // && this.nodes[0] !== undefined;
  /** If this is a edge with duplicate edge(s),
   * returns an array of duplicates not including self
   * @returns {GraphEdge[]} array of duplicate GraphEdge, empty array if none
   * @example
   * var array = edge.duplicateEdges()
   */
  const duplicateEdges = function () {
    return edge.graph.edges.filter(el => edge.isSimilarToEdge(el));
  };
  /** For adjacent edges, get the node they share in common
   * @param {GraphEdge} otherEdge an adjacent edge
   * @returns {GraphNode} the node in common, undefined if not adjacent
   * @example
   * var sharedNode = edge1.commonNodeWithEdge(edge2)
   */
  const commonNodeWithEdge = function (otherEdge) {
    // only for adjacent edges
    if (edge === otherEdge) {
      return undefined;
    }
    if (edge.nodes[0] === otherEdge.nodes[0]
      || edge.nodes[0] === otherEdge.nodes[1]) {
      return edge.nodes[0];
    }
    if (edge.nodes[1] === otherEdge.nodes[0]
      || edge.nodes[1] === otherEdge.nodes[1]) {
      return edge.nodes[1];
    }
    return undefined;
  };
  /** For adjacent edges, get this edge's node that is not
   *   shared in common with the other edge
   * @param {GraphEdge} otherEdge an adjacent edge
   * @returns {GraphNode} the node on this edge not shared
   *   by the other edge, undefined if not adjacent
   * @example
   * var notSharedNode = edge1.uncommonNodeWithEdge(edge2)
   */
  const uncommonNodeWithEdge = function (otherEdge) {
    // only for adjacent edges
    if (edge === otherEdge) { return undefined; }
    if (edge.nodes[0] === otherEdge.nodes[0]
      || edge.nodes[0] === otherEdge.nodes[1]) {
      return edge.nodes[1];
    }
    if (edge.nodes[1] === otherEdge.nodes[0]
      || edge.nodes[1] === otherEdge.nodes[1]) {
      return edge.nodes[0];
    }
    return undefined;
    // consider another alternative ending,
    // returning both of its two nodes, as if to say all are uncommon
  };

  Object.defineProperty(edge, "adjacent", {
    get: function () { return adjacent(); }
  });
  // Object.defineProperty(edge, "adjacentEdges", {
  //  get:function () { return adjacentEdges(); }
  // });
  // Object.defineProperty(edge, "adjacentNodes", {
  //  get:function () { return adjacentNodes(); }
  // });
  Object.defineProperty(edge, "isAdjacentToEdge", { value: isAdjacentToEdge });
  Object.defineProperty(edge, "isSimilarToEdge", { value: isSimilarToEdge });
  Object.defineProperty(edge, "otherNode", { value: otherNode });
  Object.defineProperty(edge, "isCircular", {
    get: function () { return isCircular(); }
  });
  Object.defineProperty(edge, "duplicateEdges", { value: duplicateEdges });
  Object.defineProperty(edge, "commonNodeWithEdge", {
    value: commonNodeWithEdge
  });
  Object.defineProperty(edge, "uncommonNodeWithEdge", {
    value: uncommonNodeWithEdge
  });

  return edge;
};

export default GraphEdge;
