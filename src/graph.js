// graph.js
// a mathematical undirected graph with edges and nodes
// mit open source license, robby kraft
//
//  "adjacent": 2 nodes are adjacent when they are connected by an edge
//              edges are adjacent when they are both connected to the same node
//  "similar": edges are similar if they contain the same 2 nodes, even if in a different order
//  "incident": an edge is incident to its two nodes
//  "endpoints": a node is an endpoint of its edge
//  "new"/"add": functions like "newNode" vs. "addNode", easy way to remember is that the "new" function will use the javascript "new" object initializer. Objects are created in the "new" functions.
//  "size" the size of a graph is the number of edges
//  "cycle" a set of edges that form a closed circut, it's possible to walk down a cycle and end up where you began without visiting the same edge twice.
//  "multigraph": not this graph. but the special case where circular and duplicate edges are allowed
//  "degree": the degree of a node is how many edges are incident to it
//  "isolated": a node is isolated if it is connected to 0 edges, degree 0
//  "leaf": a node is a leaf if it is connected to only 1 edge, degree 1
"use strict";
var GraphNode = (function () {
    function GraphNode(graph) {
        this.graph = graph;
    }
    GraphNode.prototype.adjacentEdges = function () {
        return this.graph.edges.filter(function (el) { return el.nodes[0] === this || el.nodes[1] === this; }, this);
    };
    GraphNode.prototype.adjacentNodes = function () {
        var first = this.graph.edges
            .filter(function (el) { return el.nodes[0] === this; }, this)
            .map(function (el) { return el.nodes[1]; }, this);
        var second = this.graph.edges
            .filter(function (el) { return el.nodes[1] === this; }, this)
            .map(function (el) { return el.nodes[0]; }, this);
        return first.concat(second);
    };
    GraphNode.prototype.isAdjacentToNode = function (node) {
        if (this.graph.getEdgeConnectingNodes(this, node) == undefined)
            return false;
        return true;
    };
    GraphNode.prototype.degree = function () { return this.adjacentEdges().length; };
    return GraphNode;
}());
var GraphEdge = (function () {
    function GraphEdge(graph, node1, node2) {
        this.graph = graph;
        this.nodes = [node1, node2];
    }
    GraphEdge.prototype.adjacentEdges = function () {
        return this.graph.edges
            .filter(function (el) {
            return el !== this &&
                (el.nodes[0] === this.nodes[0] ||
                    el.nodes[0] === this.nodes[1] ||
                    el.nodes[1] === this.nodes[0] ||
                    el.nodes[1] === this.nodes[1]);
        }, this);
    };
    GraphEdge.prototype.adjacentNodes = function () {
        return [this.nodes[0], this.nodes[1]];
    };
    GraphEdge.prototype.isAdjacentToEdge = function (edge) {
        return ((this.nodes[0] === edge.nodes[0]) || (this.nodes[1] === edge.nodes[1]) ||
            (this.nodes[0] === edge.nodes[1]) || (this.nodes[1] === edge.nodes[0]));
    };
    GraphEdge.prototype.isSimilarToEdge = function (edge) {
        return ((this.nodes[0] === edge.nodes[0] && this.nodes[1] === edge.nodes[1]) ||
            (this.nodes[0] === edge.nodes[1] && this.nodes[1] === edge.nodes[0]));
    };
    GraphEdge.prototype.commonNodeWithEdge = function (otherEdge) {
        // only for adjacent edges
        if (this === otherEdge)
            return undefined;
        if (this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1])
            return this.nodes[0];
        if (this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
            return this.nodes[1];
        return undefined;
    };
    GraphEdge.prototype.uncommonNodeWithEdge = function (otherEdge) {
        // only for adjacent edges
        if (this === otherEdge)
            return undefined;
        if (this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1])
            return this.nodes[1];
        if (this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
            return this.nodes[0];
        // optional ending: returning both of its two nodes, as if to say all are uncommon
        return undefined;
    };
    return GraphEdge;
}());
var Graph = (function () {
    function Graph() {
        // for subclassing (ie. PlanarGraph) the node/edge types get reset to new types (PlanarNode)
        this.nodeType = GraphNode;
        this.edgeType = GraphEdge;
        this.clear();
    }
    ///////////////////////////////////////////////
    // ADD PARTS
    ///////////////////////////////////////////////
    /** Create a node and add it to the graph
     * @returns {GraphNode} pointer to the node
     */
    Graph.prototype.newNode = function () {
        return this.addNode(new this.nodeType(this));
    };
    /** Create an edge and add it to the graph
     * @param {GraphNode} two nodes that the edge connects
     * @returns {GraphEdge} if successful, pointer to the edge
     */
    Graph.prototype.newEdge = function (node1, node2) {
        return this.addEdge(new this.edgeType(this, node1, node2));
    };
    /** Copies the contents of an existing node into a new node and adds it to the graph
     * @returns {GraphNode} pointer to the node
     */
    Graph.prototype.copyNode = function (node) {
        var nodeClone = Object.assign(this.newNode(), node);
        return this.addNode(nodeClone);
    };
    /** Copies the contents of an existing edge into a new edge and adds it to the graph
     * @returns {GraphEdge} pointer to the edge
     */
    Graph.prototype.copyEdge = function (edge) {
        var edgeClone = Object.assign(this.newEdge(edge.nodes[0], edge.nodes[1]), edge);
        return this.addEdge(edgeClone);
    };
    /** Add an already-initialized node to the graph
     * @param {GraphNode} must be already initialized
     * @returns {GraphNode} pointer to the node
     */
    Graph.prototype.addNode = function (node) {
        if (node == undefined) {
            throw "addNode() requires an argument: 1 GraphNode";
        }
        node.graph = this;
        node.index = this.nodes.length;
        this.nodes.push(node);
        return node;
    };
    /** Add an already-initialized edge to the graph
     * @param {GraphEdge} must be initialized, and two nodes must be already be a part of this graph
     * @returns {GraphEdge} if successful, pointer to the edge
     */
    Graph.prototype.addEdge = function (edge) {
        if (edge.nodes[0] === undefined ||
            edge.nodes[1] === undefined ||
            edge.nodes[0].graph !== this ||
            edge.nodes[1].graph !== this) {
            return undefined;
        }
        edge.graph = this;
        edge.index = this.edges.length;
        this.edges.push(edge);
        return edge;
    };
    /** Add already-initialized node objects from an array to the graph
     * @returns {number} number of nodes added to the graph
     */
    Graph.prototype.addNodes = function (nodes) {
        if (nodes == undefined || nodes.length <= 0) {
            throw "addNodes() must contain array of GraphNodes";
        }
        var len = this.nodes.length;
        var checkedNodes = nodes.filter(function (el) { return (el instanceof GraphNode); });
        this.nodes = this.nodes.concat(checkedNodes);
        for (var i = len; i < this.nodes.length; i++) {
            this.nodes[i].graph = this;
            this.nodes[i].index = i;
        }
        return this.nodes.length - len;
    };
    /** Add already-initialized edge objects from an array to the graph, cleaning out any duplicate and circular edges
     * @returns {number} number of edges added to the graph
     */
    Graph.prototype.addEdges = function (edges) {
        if (edges == undefined || edges.length <= 0) {
            throw "addEdges() must contain array of GraphEdges";
        }
        var len = this.edges.length;
        var checkedEdges = edges.filter(function (el) { return (el instanceof GraphEdge); });
        this.edges = this.edges.concat(checkedEdges);
        for (var i = len; i < this.edges.length; i++) {
            this.edges[i].graph = this;
        }
        this.cleanGraph();
        return this.edges.length - len;
    };
    ///////////////////////////////////////////////
    // REMOVE PARTS
    ///////////////////////////////////////////////
    /** Removes all nodes and edges, returning the graph to it's original state */
    Graph.prototype.clear = function () {
        this.nodes = [];
        this.edges = [];
    };
    /** Remove an edge
     * @returns {boolean} if the edge was removed
     */
    Graph.prototype.removeEdge = function (edge) {
        var len = this.edges.length;
        this.edges = this.edges.filter(function (el) { return el !== edge; });
        this.edgeArrayDidChange();
        return (len !== this.edges.length);
    };
    /** Searches and removes any edges connecting the two nodes supplied in the arguments
     * @returns {number} number of edges removed. in the case of an unclean graph, there may be more than one
     */
    Graph.prototype.removeEdgeBetween = function (node1, node2) {
        var len = this.edges.length;
        this.edges = this.edges.filter(function (el) {
            return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
                (el.nodes[0] === node2 && el.nodes[1] === node1));
        });
        this.edgeArrayDidChange();
        return len - this.edges.length;
    };
    /** Remove a node and any edges that connect to it
     * @returns {boolean} if the node was removed
     */
    Graph.prototype.removeNode = function (node) {
        var nodesLength = this.nodes.length;
        var edgesLength = this.edges.length;
        this.nodes = this.nodes.filter(function (el) { return el !== node; });
        this.edges = this.edges.filter(function (el) { return el.nodes[0] !== node && el.nodes[1] !== node; });
        if (this.edges.length != edgesLength) {
            this.edgeArrayDidChange();
        }
        if (this.nodes.length != nodesLength) {
            this.nodeArrayDidChange();
            return true;
        }
        return false;
    };
    /** Removes any node that isn't a part of an edge
     * @returns {number} the number of nodes removed
     */
    Graph.prototype.removeIsolatedNodes = function () {
        this.nodeArrayDidChange(); // this function depends on .index values, run this to be safe
        var nodeDegree = [];
        for (var i = 0; i < this.nodes.length; i++) {
            nodeDegree[i] = false;
        }
        for (var i = 0; i < this.edges.length; i++) {
            nodeDegree[this.edges[i].nodes[0].index] = true;
            nodeDegree[this.edges[i].nodes[1].index] = true;
        }
        var count = 0;
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            var index = this.nodes[i].index;
            if (nodeDegree[index] == false) {
                this.nodes.splice(i, 1);
                count++;
            }
        }
        if (count > 0) {
            this.nodeArrayDidChange();
        }
        return count;
    };
    /** Remove the second node and replaces all mention of it with the first in every edge
     * @returns {GraphNode} undefined if no merge, otherwise returns a pointer to the remaining node
     */
    Graph.prototype.mergeNodes = function (node1, node2) {
        if (node1 === node2) {
            return undefined;
        }
        this.edges = this.edges.map(function (el) {
            if (el.nodes[0] === node2)
                el.nodes[0] = node1;
            if (el.nodes[1] === node2)
                el.nodes[1] = node1;
            return el;
        });
        this.nodes = this.nodes.filter(function (el) { return el !== node2; });
        this.cleanGraph();
        return node1;
    };
    /** Remove all edges that contain the same node at both ends
     * @returns {number} the number of edges removed
     */
    Graph.prototype.cleanCircularEdges = function () {
        var edgesLength = this.edges.length;
        this.edges = this.edges.filter(function (el) { return !(el.nodes[0] === el.nodes[1]); });
        if (this.edges.length != edgesLength) {
            this.edgeArrayDidChange();
        }
        return edgesLength - this.edges.length;
    };
    /** Remove edges that are similar to another edge
     * @returns {number} the number of edges removed
     */
    Graph.prototype.cleanDuplicateEdges = function () {
        var count = 0;
        for (var i = 0; i < this.edges.length - 1; i++) {
            for (var j = this.edges.length - 1; j > i; j--) {
                if (this.edges[i].isSimilarToEdge(this.edges[j])) {
                    this.edges.splice(j, 1);
                    count += 1;
                }
            }
        }
        if (count > 0) {
            this.edgeArrayDidChange();
        }
        return count;
    };
    // internally to this Graph class, we have to call this function instead of clean()
    // even though they are the same. during subclassing, clean() gets overwritten by new methods
    Graph.prototype.cleanGraph = function () {
        this.edgeArrayDidChange();
        this.nodeArrayDidChange();
        return this.cleanDuplicateEdges() + this.cleanCircularEdges();
    };
    /** Only modifies edges array. Removes circular and duplicate edges, refreshes .index values of both edges and nodes arrays
     * @returns {number} the number of edges removed
     */
    Graph.prototype.clean = function () {
        return this.cleanGraph();
    };
    ///////////////////////////////////////////////
    // GET PARTS
    ///////////////////////////////////////////////
    /** Searches for an edge that contains the 2 nodes supplied in the function call. Will return first edge found, if graph isn't clean it will miss any subsequent duplicate edges.
     * @returns {GraphEdge} edge, if exists. undefined, if no edge connects the nodes (not adjacent)
     */
    Graph.prototype.getEdgeConnectingNodes = function (node1, node2) {
        // for this to work, graph must be cleaned. no duplicate edges
        for (var i = 0; i < this.edges.length; i++) {
            if ((this.edges[i].nodes[0] === node1 && this.edges[i].nodes[1] === node2) ||
                (this.edges[i].nodes[0] === node2 && this.edges[i].nodes[1] === node1)) {
                return this.edges[i];
            }
        }
        // nodes are not adjacent
        return undefined;
    };
    /** Searches for all edges that contains the 2 nodes supplied in the function call. This is suitable for unclean graphs, graphs with duplicate edges.
     * @returns {GraphEdge[]} array of edges, if any exist. empty array if no edge connects the nodes (not adjacent)
     */
    Graph.prototype.getEdgesConnectingNodes = function (node1, node2) {
        return this.edges.filter(function (el) {
            return (el.nodes[0] === node1 && el.nodes[1] === node2) ||
                (el.nodes[0] === node2 && el.nodes[1] === node1);
        });
    };
    Graph.prototype.log = function (verbose) {
        console.log('#Nodes: ' + this.nodes.length);
        console.log('#Edges: ' + this.edges.length);
        if (verbose != undefined && verbose == true) {
            for (var i = 0; i < this.edges.length; i++) {
                console.log(i + ': ' + this.edges[i].nodes[0] + ' ' + this.edges[i].nodes[1]);
            }
        }
    };
    Graph.prototype.nodeArrayDidChange = function () { for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].index = i;
    } };
    Graph.prototype.edgeArrayDidChange = function () { for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].index = i;
    } };
    return Graph;
}());
var EdgeNodeCount = (function () {
    function EdgeNodeCount(edgeCount, nodeCount) {
        this.edges = edgeCount;
        this.nodes = nodeCount;
    }
    return EdgeNodeCount;
}());
