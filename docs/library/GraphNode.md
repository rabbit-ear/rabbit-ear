# GraphNode

Nodes are 1 of the 2 fundamental components in a graph

- [adjacentEdges](#adjacentedges)
- [adjacentNodes](#adjacentnodes)
- [isAdjacentToNode](#isadjacenttonode)
- [degree](#degree)

## adjacentEdges

Get an array of edges that contain this node

**Examples**

```javascript
var adjacent = node.adjacentEdges()
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[GraphEdge](#graphedge)>** array of adjacent edges

## adjacentNodes

Get an array of nodes that share an edge in common with this node

**Examples**

```javascript
var adjacent = node.adjacentNodes()
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[GraphNode](#graphnode)>** array of adjacent nodes

## isAdjacentToNode

Test if a node is connected to another node by an edge

**Parameters**

-   `node` **[GraphNode](#graphnode)** test adjacency between this and the supplied parameter

**Examples**

```javascript
var isAdjacent = node.isAdjacentToNode(anotherNode);
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true or false, adjacent or not

## degree

The degree of a node is the number of adjacent edges, circular edges are counted twice

**Examples**

```javascript
var degree = node.degree();
```

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of adjacent edges
