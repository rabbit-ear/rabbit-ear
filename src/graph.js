// a mathematical graph with edges and nodes
//
// VOCABULARY:
//  "adjacent": nodes are adjacent when they are connected by an edge
//              edges are adjacent when they are both connected to the same node
//  "similar": in the case of an edge: they contain the same 2 nodes, possibly in a different order
"use strict";
var GraphNode = (function () {
    function GraphNode(graph) {
        this.graph = graph;
    }
    GraphNode.prototype.adjacentEdges = function () {
        if (this.graph == undefined) {
            throw "error: didn't set a node's parent graph. use graph.newNode()";
        }
        return this.graph.edges.filter(function (el) { return el.nodes[0] === this || el.nodes[1] === this; }, this);
    };
    GraphNode.prototype.adjacentNodes = function () {
        var first = this.graph.edges
            .filter(function (el) { return el.nodes[0] == this; }, this)
            .map(function (el) { return el.nodes[1]; }, this);
        var second = this.graph.edges
            .filter(function (el) { return el.nodes[1] == this; }, this)
            .map(function (el) { return el.nodes[0]; }, this);
        return first.concat(second);
    };
    GraphNode.prototype.isAdjacentToNode = function (node) {
        if (this.graph.getEdgeConnectingNodes(this, node) == undefined)
            return false;
        return true;
    };
    return GraphNode;
}());
var GraphEdge = (function () {
    function GraphEdge(graph, node1, node2) {
        this.graph = graph;
        this.nodes = [node1, node2];
    }
    ;
    GraphEdge.prototype.adjacentEdges = function () {
        // todo:test this
        return this.graph.edges
            .filter(function (el) {
            return el !== this &&
                (el.nodes[0] === this.nodes[0] ||
                    el.nodes[0] === this.nodes[1] ||
                    el.nodes[1] === this.nodes[0] ||
                    el.nodes[1] === this.nodes[1]);
        }, this);
        // .filter(function(el:GraphEdge){ return el !== this; }, this);
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
        // the fundamental node/edge types get switched out in subclassed instances of Graph
        this.nodeType = GraphNode;
        this.edgeType = GraphEdge;
        this.clear(); // initialize empty arrays
    }
    Graph.prototype.nodeArrayDidChange = function () { for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].index = i;
    } };
    Graph.prototype.edgeArrayDidChange = function () { for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].index = i;
    } };
    // nodeArrayDidChange(){this.nodes=this.nodes.map(function(el,i){el.index=i;return el;});}
    ///////////////////////////////////////////////
    // ADD PARTS
    ///////////////////////////////////////////////
    Graph.prototype.newNode = function () {
        return this.addNode(new this.nodeType(this));
    };
    Graph.prototype.newEdge = function (node1, node2) {
        return this.addEdge(new this.edgeType(this, node1, node2));
    };
    Graph.prototype.addNode = function (node) {
        if (node == undefined) {
            throw "addNode() requires an argument: 1 GraphNode";
        }
        node.graph = this;
        node.index = this.nodes.length;
        this.nodes.push(node);
        return node;
    };
    Graph.prototype.addEdge = function (edge) {
        // todo, make sure graph edge is valid
        // if(edge.nodes[0] >= this.nodes.length || edge.nodes[1] >= this.nodes.length ){ throw "addEdge() node indices greater than array length"; }
        edge.graph = this;
        edge.index = this.edges.length;
        this.edges.push(edge);
        return edge;
    };
    Graph.prototype.addNodes = function (nodes) {
        if (nodes == undefined || nodes.length <= 0) {
            throw "addNodes() must contain array of GraphNodes";
        }
        var len = this.nodes.length;
        var checkedNodes = nodes.filter(function (el) { return (el instanceof GraphNode); });
        this.nodes = this.nodes.concat(checkedNodes);
        // update new nodes with their indices, pointers
        for (var i = len; i < this.nodes.length; i++) {
            this.nodes[i].graph = this;
            this.nodes[i].index = i;
        }
    };
    Graph.prototype.addEdges = function (edges) {
        if (edges == undefined || edges.length <= 0) {
            throw "addEdges() must contain array of GraphEdges";
        }
        var len = this.edges.length;
        var checkedEdges = edges.filter(function (el) { return (el instanceof GraphEdge); });
        this.edges = this.edges.concat(checkedEdges);
        // update new edges with their indices, pointers
        for (var i = len; i < this.edges.length; i++) {
            this.edges[i].graph = this;
            this.edges[i].index = i;
        }
        this.clean();
    };
    ///////////////////////////////////////////////
    // REMOVE PARTS
    ///////////////////////////////////////////////
    Graph.prototype.clear = function () {
        this.nodes = [];
        this.edges = [];
    };
    Graph.prototype.removeEdgeBetween = function (node1, node2) {
        var len = this.edges.length;
        this.edges = this.edges.filter(function (el) {
            return !((el.nodes[0] == node1 && el.nodes[1] == node2) ||
                (el.nodes[0] == node2 && el.nodes[1] == node1));
        });
        this.edgeArrayDidChange();
        return len - this.edges.length;
    };
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
    Graph.prototype.removeEdge = function (edge) {
        var len = this.edges.length;
        this.edges = this.edges.filter(function (el) { return el !== edge; });
        if (len == this.edges.length)
            return false;
        return true;
    };
    // replaces all mention of one node with the other in both node and edge arrays
    // shrinks the total number of nodes
    Graph.prototype.mergeNodes = function (node1, node2) {
        if (node1 === node2) {
            return false;
        }
        this.edges = this.edges.map(function (el) {
            if (el.nodes[0] === node2)
                el.nodes[0] = node1;
            if (el.nodes[1] === node2)
                el.nodes[1] = node1;
            return el;
        });
        this.removeNode(node2);
        this.clean();
        return true;
    };
    Graph.prototype.cleanUnusedNodes = function () {
        var usedNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            usedNodes[i] = false;
        }
        for (var i = 0; i < this.edges.length; i++) {
            usedNodes[this.edges[i].nodes[0].index] = true;
            usedNodes[this.edges[i].nodes[1].index] = true;
        }
        var count = 0;
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            var index = this.nodes[i].index;
            if (usedNodes[index] == false) {
                this.nodes.splice(i, 1);
                count++;
            }
        }
        return count;
    };
    // remove circular edges (a node connecting to itself)
    Graph.prototype.cleanCircularEdges = function () {
        var edgesLength = this.edges.length;
        this.edges = this.edges.filter(function (el) { return !(el.nodes[0] === el.nodes[1]); });
        if (this.edges.length != edgesLength) {
            this.edgeArrayDidChange();
        }
        return edgesLength - this.edges.length;
    };
    // remove any duplicate edges (edges containing the same 2 nodes)
    Graph.prototype.cleanDuplicateEdges = function () {
        // (SIMPLE: does not modify NODE array)
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
    // CLEAN will change the edges, but nodes will remain unaffected
    Graph.prototype.clean = function () {
        this.edgeArrayDidChange();
        this.nodeArrayDidChange();
        return { 'duplicate': this.cleanDuplicateEdges(),
            'circular': this.cleanCircularEdges() };
    };
    ///////////////////////////////////////////////
    // GET PARTS
    ///////////////////////////////////////////////
    // getEdgeConnectingNodes in 2 parts: if graph is classical (no duplicate edges)
    //  the use "Edge" singular, else use "Edges" plural getEdgesConnectingNodes
    Graph.prototype.getEdgeConnectingNodes = function (node1, node2) {
        // for this to work, graph must be cleaned. no duplicate edges
        for (var i = 0; i < this.edges.length; i++) {
            if ((this.edges[i].nodes[0] === node1 && this.edges[i].nodes[1] === node2) ||
                (this.edges[i].nodes[0] === node2 && this.edges[i].nodes[1] === node1)) {
                return this.edges[i];
            }
        }
        // if nodes are not connected
        return undefined;
    };
    Graph.prototype.getEdgesConnectingNodes = function (node1, node2) {
        return this.edges.filter(function (el) {
            (el.nodes[0] == node1 && el.nodes[1] == node2) ||
                (el.nodes[0] == node2 && el.nodes[1] == node1);
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
    return Graph;
}());
