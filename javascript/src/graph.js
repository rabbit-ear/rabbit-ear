// a mathematical graph with edges and nodes
//
// VOCABULARY:
//  "adjacent": nodes are adjacent when they are connected by an edge
//              edges are adjacent when they are both connected to the same node
//  "similar": in the case of an edge: they contain the same 2 nodes, possibly in a different order
"use strict";
var EdgeAndNode = (function () {
    function EdgeAndNode(e, n) {
        this.edge = e;
        this.node = n;
    }
    return EdgeAndNode;
}());
var GraphNode = (function () {
    function GraphNode() {
        this.adjacentEdgesAndTheirNodes = function () {
            var adjacentEdges = [];
            // iterate over all edges, if we find our node, add the edge
            for (var i = 0; i < this.graph.edges.length; i++) {
                if (this.graph.edges[i].node[0] == this.index) {
                    adjacentEdges.push(new EdgeAndNode(i, this.graph.edges[i].node[1]));
                }
                else if (this.graph.edges[i].node[1] == this.index) {
                    adjacentEdges.push(new EdgeAndNode(i, this.graph.edges[i].node[0]));
                }
            }
            return adjacentEdges;
        };
        this.adjacentNodesAndTheirEdges = function () {
            var adjacentNodes = [];
            for (var i = 0; i < this.graph.edges.length; i++) {
                // if we find our node, add the node on the other end of the edge
                if (this.graph.edges[i].node[0] == this.index) {
                    adjacentNodes.push(new EdgeAndNode(i, this.graph.edges[i].node[1]));
                }
                if (this.graph.edges[i].node[1] == this.index) {
                    adjacentNodes.push(new EdgeAndNode(i, this.graph.edges[i].node[0]));
                }
            }
            return this.graph.nodes.filter(function (el) { });
        };
    }
    GraphNode.prototype.adjacentEdges = function () {
        if (this.graph == undefined) {
            throw "error: didn't set a node's parent graph. use graph.newNode()";
        }
        var thisIndex = this.index;
        return this.graph.edges.filter(function (el) { return el.node[0] == thisIndex || el.node[1] == thisIndex; });
    };
    GraphNode.prototype.adjacentNodes = function () {
        var first = this.graph.edges
            .filter(function (el) { return el.node[0] == this.index; }, this)
            .map(function (el) { return this.graph.nodes[el.node[1]]; }, this);
        var second = this.graph.edges
            .filter(function (el) { return el.node[1] == this.index; }, this)
            .map(function (el) { return this.graph.nodes[el.node[0]]; }, this);
        return first.concat(second);
    };
    return GraphNode;
}());
var GraphEdge = (function () {
    function GraphEdge(nodeIndex1, nodeIndex2) {
        this.node = [nodeIndex1, nodeIndex2];
    }
    ;
    GraphEdge.prototype.adjacentEdges = function () {
        return this.graph.edges
            .filter(function (el) {
            return el.node[0] == this.node[0] ||
                el.node[0] == this.node[1] ||
                el.node[1] == this.node[0] ||
                el.node[1] == this.node[1];
        }, this)
            .filter(function (el) { return !(el === this); }, this);
    };
    GraphEdge.prototype.adjacentNodes = function () {
        return [this.graph.nodes[this.node[0]], this.graph.nodes[this.node[1]]];
    };
    GraphEdge.prototype.isAdjacentWithEdge = function (edge) {
        return ((this.node[0] == edge.node[0]) || (this.node[1] == edge.node[1]) ||
            (this.node[0] == edge.node[1]) || (this.node[1] == edge.node[0]));
    };
    return GraphEdge;
}());
var Graph = (function () {
    function Graph() {
        this.clear(); // initialize empty arrays
        // when you clean a graph, it will do different things based on these preferences
        this.preferences = {
            "allowDuplicate": false,
            "allowCircular": false // classic mathematical graph does not allow circular edges
        };
    }
    // removes all edges and nodes
    Graph.prototype.clear = function () {
        this.nodes = [];
        this.edges = [];
    };
    Graph.prototype.newNode = function () {
        return this.addNode(new GraphNode());
    };
    Graph.prototype.newEdge = function (nodeIndex1, nodeIndex2) {
        return this.addEdge(new GraphEdge(nodeIndex1, nodeIndex2));
    };
    Graph.prototype.addNode = function (node) {
        if (node == undefined) {
            throw "addNode() requires an argument: 1 GraphNode";
        }
        node.graph = this;
        node.index = this.nodes.length;
        this.nodes.push(node);
        return node.index;
    };
    Graph.prototype.addEdge = function (edge) {
        if (edge.node[0] >= this.nodes.length || edge.node[1] >= this.nodes.length) {
            throw "addEdge() node indices greater than array length";
        }
        edge.graph = this;
        edge.index = this.edges.length;
        this.edges.push(edge);
        return edge.index;
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
    Graph.prototype.removeEdgesBetween = function (nodeIndex1, nodeIndex2) {
        var len = this.edges.length;
        this.edges = this.edges.filter(function (el) {
            return !((el.node[0] == nodeIndex1 && el.node[1] == nodeIndex2) ||
                (el.node[0] == nodeIndex2 && el.node[1] == nodeIndex1));
        });
        this.edgeArrayDidChange();
        return len - this.edges.length;
    };
    Graph.prototype.removeNode = function (nodeIndex) {
        // (NOT SIMPLE: NODE array altered)
        if (nodeIndex >= this.nodes.length) {
            return false;
        }
        // step 1: remove the node (easy)
        this.nodes.splice(nodeIndex, 1);
        // step 2: traverse all edges, do (2) things:
        var i = 0;
        while (i < this.edges.length) {
            var didRemove = false;
            if (this.edges[i].node[0] == nodeIndex || this.edges[i].node[1] == nodeIndex) {
                // remove edges which contained that node
                this.edges.splice(i, 1);
                didRemove = true;
            }
            else {
                // [0 1 2 3 4 5 6 (removed) 8 9 10 11 12]
                // because the array looks like this,
                // node indices after the removed node are off by 1
                if (this.edges[i].node[0] > nodeIndex)
                    this.edges[i].node[0] -= 1;
                if (this.edges[i].node[1] > nodeIndex)
                    this.edges[i].node[1] -= 1;
            }
            if (!didRemove)
                i++;
        }
        this.nodeArrayDidChange();
        this.edgeArrayDidChange();
        return true;
    };
    Graph.prototype.removeEdge = function (edgeIndex) {
        if (edgeIndex > this.edges.length) {
            throw "removeEdge() index is greater than length of edge array";
        }
        this.edges.splice(edgeIndex, 1);
        this.edgeArrayDidChange();
    };
    Graph.prototype.nodeArrayDidChange = function () { for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].index = i;
    } };
    Graph.prototype.edgeArrayDidChange = function () { for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].index = i;
    } };
    // CLEAN will change the edges, but nodes will remain unaffected
    Graph.prototype.clean = function () {
        var countCircular, countDuplicate;
        if (!this.preferences.allowCircular) {
            countCircular = this.cleanCircularEdges();
        }
        if (!this.preferences.allowDuplicate) {
            countDuplicate = this.cleanDuplicateEdges();
        }
        return { 'duplicate': countDuplicate, 'circular': countCircular };
    };
    // remove circular edges (a node connecting to itself)
    Graph.prototype.cleanCircularEdges = function () {
        var len = this.edges.length;
        this.edges = this.edges.filter(function (el) { return !(el.node[0] == el.node[1]); });
        if (this.edges.length != len) {
            this.edgeArrayDidChange();
        }
        return len - this.edges.length;
    };
    // remove any duplicate edges (edges containing the same 2 nodes)
    Graph.prototype.cleanDuplicateEdges = function () {
        // N^2 time
        // (SIMPLE: does not modify NODE array)
        var count = 0;
        var i = 0;
        while (i < this.edges.length) {
            var j = i + 1;
            while (j < this.edges.length) {
                // nested loop, uniquely compare every edge, remove if edges contain same nodes
                var didRemove = false;
                if (this.areEdgesSimilar(i, j)) {
                    //console.log("clean(): found similar edges, removing last " + i + '(' + this.edges[i].node[0] + ' ' + this.edges[i].node[1] + ') ' + j + '(' + this.edges[j].node[0] + ' ' + this.edges[j].node[1] + ') ' );
                    this.edges.splice(j, 1);
                    didRemove = true;
                    count += 1;
                }
                // only iterate forward if we didn't remove an element
                //   if we did, it basically iterated forward for us, repeat the same 'j'
                // this is also possible because we know that j is always greater than i
                if (!didRemove)
                    j++;
            }
            i += 1;
        }
        this.edgeArrayDidChange();
        return count;
    };
    // TRUE FALSE QUERIES
    Graph.prototype.areNodesAdjacent = function (nodeIndex1, nodeIndex2) {
        if (this.getEdgeConnectingNodes == undefined) {
            return false;
        }
        return true;
    };
    Graph.prototype.areEdgesAdjacent = function (edgeIndex1, edgeIndex2) {
        return ((this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[0]) ||
            (this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[1]) ||
            (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[1]) ||
            (this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[0]));
    };
    Graph.prototype.areEdgesSimilar = function (edgeIndex1, edgeIndex2) {
        return ((this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[0] &&
            this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[1]) ||
            (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[1] &&
                this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[0]));
    };
    // getEdgeConnectingNodes in 2 parts: if graph is classical (no duplicate edges)
    //  the use "Edge" singular, else use "Edges" plural getEdgesConnectingNodes
    Graph.prototype.getEdgeConnectingNodes = function (nodeIndex1, nodeIndex2) {
        // for this to work, graph must be cleaned. no duplicate edges
        for (var i = 0; i < this.edges.length; i++) {
            if ((this.edges[i].node[0] == nodeIndex1 && this.edges[i].node[1] == nodeIndex2) ||
                (this.edges[i].node[0] == nodeIndex2 && this.edges[i].node[1] == nodeIndex1)) {
                return i;
            }
        }
        // if nodes are not connected
        return undefined;
    };
    Graph.prototype.getEdgesConnectingNodes = function (nodeIndex1, nodeIndex2) {
        var edges = [];
        for (var i = 0; i < this.edges.length; i++) {
            if ((this.edges[i].node[0] == nodeIndex1 && this.edges[i].node[1] == nodeIndex2) ||
                (this.edges[i].node[0] == nodeIndex2 && this.edges[i].node[1] == nodeIndex1)) {
                edges.push(i);
            }
        }
        return edges;
    };
    // replaces all mention of one node with the other in both node and edge arrays
    // shrinks the total number of nodes
    Graph.prototype.mergeNodes = function (nodeIndex1, nodeIndex2) {
        // sort the 2 indices by whichever comes first in the node array
        var first, second;
        if (nodeIndex1 == nodeIndex2) {
            return false;
        }
        if (nodeIndex1 < nodeIndex2) {
            first = nodeIndex1;
            second = nodeIndex2;
        }
        if (nodeIndex1 > nodeIndex2) {
            first = nodeIndex2;
            second = nodeIndex1;
        }
        // replace all instances in EDGE array
        // and decrement all indices greater than nodeIndex2 (node array is about to lose nodeIndex2)
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].node[0] == second)
                this.edges[i].node[0] = first;
            else if (this.edges[i].node[0] > second)
                this.edges[i].node[0] -= 1;
            if (this.edges[i].node[1] == second)
                this.edges[i].node[1] = first;
            else if (this.edges[i].node[1] > second)
                this.edges[i].node[1] -= 1;
        }
        this.cleanCircularEdges();
        this.cleanDuplicateEdges();
        // this.removeNode(second);   // the above for loop does this, we can just call below:
        this.nodes.splice(second, 1);
        this.nodeArrayDidChange();
        this.edgeArrayDidChange();
        return true;
    };
    Graph.prototype.log = function () {
        console.log('#Nodes: ' + this.nodes.length);
        console.log('#Edges: ' + this.edges.length);
        // if(detailed != undefined){
        // for(var i = 0; i < this.edges.length; i++){
        // 	console.log(i + ': ' + this.edges[i].node[0] + ' ' + this.edges[i].node[1]);
        // }
        // }
    };
    return Graph;
}());
