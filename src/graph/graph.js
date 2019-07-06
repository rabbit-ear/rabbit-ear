/*                              _
 *                             | |
 *         __ _ _ __ __ _ _ __ | |__
 *        / _` | '__/ _` | '_ \| '_ \
 *       | (_| | | | (_| | |_) | | | |
 *        \__, |_|  \__,_| .__/|_| |_|
 *         __/ |         | |
 *        |___/          |_|
 *
 * an undirected graph with edges and nodes, where vertex references inside
 * edges are by memory pointers, as opposed to array integer indices.
 *
 *  "adjacent": 2 nodes are adjacent when they are connected by an edge
 *              edges are adjacent when they both connect the same node
 *  "similar": edges are similar if they contain the same 2 nodes,
 *             even if in a different order
 *  "incident": an edge is incident to its two nodes
 *  "endpoints": a node is an endpoint of its edge
 *  "size" the size of a graph is the number of edges
 *  "cycle" a set of edges that form a closed circut, it's possible
 *          to walk down a cycle and end up where you began without
 *          visiting the same edge twice.
 *  "circuit" a circuit is a cycle except that it's allowed to visit
 *            the same node more than once.
 *  "multigraph": not this graph. but the special case where
 *                circular and duplicate edges are allowed
 *  "degree": the degree of a node is how many edges are incident to it
 *  "isolated": a node is isolated if it is connected to 0 edges, degree 0
 *  "leaf": a node is a leaf if it is connected to only 1 edge, degree 1
 *  "pendant": an edge incident with a leaf node
 *
 *  MIT open source license, Robby Kraft
 */

import GraphClean from "./clean";
import GraphNode from "./graph_node";
import GraphEdge from "./graph_edge";

/** A graph is a set of nodes and edges connecting them */
const Graph = function () {
  const graph = Object.create(null);

  graph.nodes = [];
  graph.edges = [];

  // if this Graph is subclassed, member types are overwritten with new types
  graph.types = {
    node: GraphNode,
    edge: GraphEdge
  };

  // todo: callback for when properties of the graph have been altered
  // graph.didChange = undefined;

  // /////////////////////////////////////////////
  // ADD PARTS
  // /////////////////////////////////////////////

  /** Create a node and add it to the graph
   * @returns {GraphNode} pointer to the node
   * @example
   * var node = graph.newNode()
   */
  const newNode = function (...args) {
    const node = graph.types.node(graph);
    Object.assign(node, ...args);
    node.graph = graph;
    graph.nodes.push(node);
    return node;
  };

  /** Create an edge and add it to the graph
   * @param {GraphNode} node1 the first node that the edge connects
   * @param {GraphNode} node2 the second node that the edge connects
   * @returns {GraphEdge} if successful, pointer to the edge
   * @example
   * var node1 = graph.newNode()
   * var node2 = graph.newNode()
   * graph.newEdge(node1, node2)
   */
  const newEdge = function (node1, node2) {
    const edge = graph.types.edge(graph, node1, node2);
    edge.graph = graph;
    graph.edges.push(edge);
    return edge;
  };

  /** Shallow copies the contents of an existing node into a new node
  *     and adds it to the graph
   * @returns {GraphNode} pointer to the node
   */
  const copyNode = function (node) {
    return Object.assign(graph.newNode(), node);
  };

  /** Shallow copies the contents of an existing edge into a new edge
   *    and adds it to the graph
   * @returns {GraphEdge} pointer to the edge
   */
  const copyEdge = function (edge) {
    return Object.assign(graph.newEdge(edge.nodes[0], edge.nodes[1]), edge);
  };

  // /////////////////////////////////////////////
  // REMOVE PARTS (TARGETS KNOWN)
  // /////////////////////////////////////////////

  /** Removes all nodes and edges, returning the graph to it's original state
   * @example
   * graph.clear()
   */
  const clear = function () {
    graph.nodes = [];
    graph.edges = [];
    return graph;
  };

  /** Remove an edge
   * @returns {GraphClean} number of edges removed
   * @example
   * var result = graph.removeEdge(edge)
   * // result.edges should equal 1
   */
  const removeEdge = function (edge) {
    const edgesLength = graph.edges.length;
    graph.edges = graph.edges.filter(el => el !== edge);
    return GraphClean(undefined, edgesLength - graph.edges.length);
  };

  /** Removes any edges which connect the two nodes supplied in the arguments
   * @param {GraphNode} node1 first node
   * @param {GraphNode} node2 second node
   * @returns {GraphClean} number of edges removed. in the case of
   *    an unclean graph, there may be more than one
   * @example
   * var result = graph.removeEdgeBetween(node1, node2)
   * // result.edges should be >= 1
   */
  const removeEdgeBetween = function (node1, node2) {
    const edgesLength = graph.edges.length;
    graph.edges = graph.edges.filter(el => !((el.nodes[0] === node1
      && el.nodes[1] === node2) || (el.nodes[0] === node2
      && el.nodes[1] === node1)));
    return GraphClean(undefined, edgesLength - graph.edges.length);
  };

  /** Remove a node and any edges that connect to it
   * @param {GraphNode} node the node that will be removed
   * @returns {GraphClean} number of nodes and edges removed
   * @example
   * var result = graph.removeNode(node)
   * // result.node will be 1
   * // result.edges will be >= 0
   */
  const removeNode = function (node) {
    const nodesLength = graph.nodes.length;
    const edgesLength = graph.edges.length;
    graph.nodes = graph.nodes.filter(n => n !== node);
    graph.edges = graph.edges
      .filter(e => e.nodes[0] !== node && e.nodes[1] !== node);
    // todo: a graphDidChange object like graphClean but
    return GraphClean(
      nodesLength - graph.nodes.length,
      edgesLength - graph.edges.length
    );
  };

  /** Remove the second node, replaces any occurences in edges with the first
   * @param {GraphNode} node1 first node to merge, this node will persist
   * @param {GraphNode} node2 second node to merge, this node will be removed
   * @returns {GraphClean} 1 removed node, newly duplicate and
   *    circular edges will be removed
   * @example
   * var result = graph.mergeNodes(node1, node2)
   * // result.node will be 1
   * // result.edges will be >= 0
   */
  const mergeNodes = function (node1, node2) {
    if (node1 === node2) { return undefined; }
    graph.edges.forEach((edge) => {
      if (edge.nodes[0] === node2) { edge.nodes[0] = node1; }
      if (edge.nodes[1] === node2) { edge.nodes[1] = node1; }
    });
    // this potentially created circular edges
    const nodesLength = graph.nodes.length;
    graph.nodes = graph.nodes.filter(n => n !== node2);
    return GraphClean(nodesLength - graph.nodes.length).join(clean());
  };

  // /////////////////////////////////////////////
  // REMOVE PARTS (SEARCH REQUIRED TO LOCATE)
  // /////////////////////////////////////////////

  /** Removes any node that isn't a part of an edge
   * @returns {GraphClean} the number of nodes removed
   * @example
   * var result = graph.removeIsolatedNodes()
   * // result.node will be >= 0
   */
  const removeIsolatedNodes = function () {
    // build an array containing T/F if a node is NOT isolated
    const nodeDegree = Array(graph.nodes.length).fill(false);
    graph.nodes.forEach((n, i) => { n._memo = i; });
    graph.edges.forEach((e) => {
      nodeDegree[e.nodes[0]._memo] = true;
      nodeDegree[e.nodes[1]._memo] = true;
    });
    graph.nodes.forEach(n => delete n._memo);
    // filter out isolated nodes
    const nodeLength = graph.nodes.length;
    graph.nodes = graph.nodes.filter((el, i) => nodeDegree[i]);
    return GraphClean().isolatedNodes(nodeLength - graph.nodes.length);
  };

  /** Remove all edges that contain the same node at both ends
   * @returns {GraphClean} the number of edges removed
   * @example
   * var result = graph.removeCircularEdges()
   * // result.edges will be >= 0
   */
  const removeCircularEdges = function () {
    const edgesLength = graph.edges.length;
    graph.edges = graph.edges.filter(el => el.nodes[0] !== el.nodes[1]);
    return GraphClean().circularEdges(edgesLength - graph.edges.length);
  };

  /** Remove edges that are similar to another edge
   * @returns {GraphClean} the number of edges removed
   * @example
   * var result = graph.removeDuplicateEdges()
   * // result.edges will be >= 0
   */
  const removeDuplicateEdges = function () {
    let count = 0;
    const spliceIndex = [];
    for (let i = 0; i < graph.edges.length - 1; i += 1) {
      for (let j = graph.edges.length - 1; j > i; j -= 1) {
        if (graph.edges[i].isSimilarToEdge(graph.edges[j])) {
          // console.log("duplicate edge found");
          graph.edges.splice(j, 1);
          spliceIndex.push(j);
          count += 1;
        }
      }
    }
    return GraphClean().duplicateEdges(count);
  };

  /**
   * Removes circular and duplicate edges, only modifies edges array.
   * @returns {GraphClean} the number of edges removed
   * @example
   * var result = graph.clean()
   * // result.edges will be >= 0
   */
  const clean = function () {
    // should we remove isolated nodes as a part of clean()?
    return removeDuplicateEdges()
      .join(removeCircularEdges());
    // .join(removeIsolatedNodes());
  };

  // /////////////////////////////////////////////
  // GET PARTS
  // /////////////////////////////////////////////

  /** Searches for an edge that contains the 2 nodes supplied in the
   * function call. Will return first edge found, if graph isn't clean it
   * will miss any subsequent duplicate edges.
   * @returns {GraphEdge} edge if exists. undefined if nodes are not adjacent
   * @example
   * var edge = graph.getEdgeConnectingNodes(node1, node2)
   */
  const getEdgeConnectingNodes = function (node1, node2) {
    const { edges } = graph;
    // for this to work, graph must be cleaned. no duplicate edges
    for (let i = 0; i < edges.length; i += 1) {
      if ((edges[i].nodes[0] === node1 && edges[i].nodes[1] === node2)
        || (edges[i].nodes[0] === node2 && edges[i].nodes[1] === node1)) {
        return edges[i];
      }
    }
    // nodes are not adjacent
    return undefined;
  };

  /**
   * Searches for all edges that contains the 2 nodes supplied in the
   * function call. This is suitable for unclean graphs, graphs with
   * duplicate edges.
   * @returns {GraphEdge[]} array of edges, if any exist. empty array if
   * no edge connects the nodes (not adjacent)
   * @example
   * var array = graph.getEdgesConnectingNodes(node1, node2)
   */
  const getEdgesConnectingNodes = function (node1, node2) {
    return graph.edges.filter(e => (e.nodes[0] === node1
      && e.nodes[1] === node2) || (e.nodes[0] === node2
      && e.nodes[1] === node1));
  };

  // /////////////////////////////////////////////
  // COPY
  // /////////////////////////////////////////////

  /**
   * Deep-copy the contents of this graph and return it as a new object
   * @returns {Graph}
   * @example
   * var copiedGraph = graph.copy()
   */
  const copy = function () {
    graph.nodes.forEach((node, i) => { node._memo = i; });
    const g = Graph();
    for (let i = 0; i < graph.nodes.length; i += 1) {
      const n = g.newNode();
      Object.assign(n, graph.nodes[i]);
      n.graph = g;
    }
    for (let i = 0; i < graph.edges.length; i += 1) {
      const indices = graph.edges[i].nodes.map(n => n._memo);
      const e = g.newEdge(g.nodes[indices[0]], g.nodes[indices[1]]);
      Object.assign(e, graph.edges[i]);
      e.graph = g;
      e.nodes = [g.nodes[indices[0]], g.nodes[indices[1]]];
    }
    graph.nodes.forEach(node => delete node._memo);
    g.nodes.forEach(node => delete node._memo);
    return g;
  };

  /**
   * Convert this graph into an array of subgraphs, making
   * as few Eulerian path possible covering all edges without duplicates.
   * Connected edges in each edge array are sequentially-indexed.
   * @returns {Graph[]}
   */
  const eulerianPaths = function () {
    const cp = copy();
    cp.clean();
    cp.removeIsolatedNodes();
    // _memo every node's adjacent edge #
    cp.nodes.forEach((node, i) => {
      node._memo = {
        index: i,
        adj: node.adjacent.edges.length
      };
    });
    const graphs = [];
    while (cp.edges.length > 0) {
      const subGraph = Graph();
      // create a duplicate set of nodes in the new emptry graph,
      // remove unused nodes at the end
      subGraph.nodes = cp.nodes.map(node => Object
        .assign(subGraph.types.node(subGraph), node));
      subGraph.nodes.forEach((n) => { n.graph = subGraph; });

      // select the node with most adjacentEdges
      let node = cp.nodes.slice().sort((a, b) => b._memo.adj - a._memo.adj)[0];
      let adj = node.adjacent.edges;
      while (adj.length > 0) {
        // approach 1
        // var nextEdge = adj[0];
        // approach 2
        // var nextEdge = adj.sort(function (a,b) {
        //  return b.otherNode(node)._memo.adj
        //    - a.otherNode(node)._memo.adj;
        // })[0];
        // approach 3, prioritize nodes with even number of adjacencies
        const smartList = adj
          .filter(el => el.otherNode(node)._memo.adj % 2 === 0);
        if (smartList.length === 0) { smartList = adj; }
        const nextEdge = smartList.sort((a, b) => b.otherNode(node)._memo.adj
          - a.otherNode(node)._memo.adj)[0];
        const nextNode = nextEdge.otherNode(node);
        // create new edge on other graph with pointers to its nodes
        const makeEdge = Object.assign(subGraph.types
          .edge(subGraph, undefined, undefined), nextEdge);
        makeEdge.nodes = [
          subGraph.nodes[node._memo.index],
          subGraph.nodes[nextNode._memo.index]
        ];
        subGraph.edges.push(makeEdge);
        // update this graph with
        node._memo.adj -= 1;
        nextNode._memo.adj -= 1;
        cp.edges = cp.edges.filter((el) => el !== nextEdge);
        // prepare loop for next iteration. increment objects
        node = nextNode;
        adj = node.adjacent.edges;
      }
      // remove unused nodes
      subGraph.removeIsolatedNodes();
      graphs.push(subGraph);
    }
    return graphs;
  };

  Object.defineProperty(graph, "newNode", { value: newNode });
  Object.defineProperty(graph, "newEdge", { value: newEdge });
  Object.defineProperty(graph, "copyNode", { value: copyNode });
  Object.defineProperty(graph, "copyEdge", { value: copyEdge });
  Object.defineProperty(graph, "clear", { value: clear });
  Object.defineProperty(graph, "removeEdge", { value: removeEdge });
  Object.defineProperty(graph, "removeEdgeBetween", {
    value: removeEdgeBetween
  });
  Object.defineProperty(graph, "removeNode", { value: removeNode });
  Object.defineProperty(graph, "mergeNodes", { value: mergeNodes });
  Object.defineProperty(graph, "removeIsolatedNodes", {
    value: removeIsolatedNodes
  });
  Object.defineProperty(graph, "removeCircularEdges", {
    value: removeCircularEdges
  });
  Object.defineProperty(graph, "removeDuplicateEdges", {
    value: removeDuplicateEdges
  });
  Object.defineProperty(graph, "clean", { value: clean });
  Object.defineProperty(graph, "getEdgeConnectingNodes", {
    value: getEdgeConnectingNodes
  });
  Object.defineProperty(graph, "getEdgesConnectingNodes", {
    value: getEdgesConnectingNodes
  });
  Object.defineProperty(graph, "copy", { value: copy });
  Object.defineProperty(graph, "eulerianPaths", { value: eulerianPaths });

  return graph;
};

export default Graph;
