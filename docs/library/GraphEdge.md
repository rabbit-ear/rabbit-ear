
# GraphEdge

Edges are 1 of the 2 fundamental components in a graph. 1 edge connect 2 nodes.


- [adjacentEdges](#adjacentedges-1)
- [adjacentNodes](#adjacentnodes-1)
- [isAdjacentToEdge](#isadjacenttoedge)
- [isSimilarToEdge](#issimilartoedge)
- [otherNode](#othernode)
- [isCircular](#iscircular)
- [duplicateEdges](#duplicateedges)
- [commonNodeWithEdge](#commonnodewithedge)
- [uncommonNodeWithEdge](#uncommonnodewithedge)


## adjacentEdges

Get an array of edges that share a node in common with this edge

**Examples**

```javascript
var adjacent = edge.adjacentEdges()
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[GraphEdge](#graphedge)>** array of adjacent edges

## adjacentNodes

Get the two nodes of this edge

**Examples**

```javascript
var adjacent = edge.adjacentNodes()
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[GraphNode](#graphnode)>** the two nodes of this edge

## isAdjacentToEdge

Test if an edge is connected to another edge by a common node

**Parameters**

-   `edge` **[GraphEdge](#graphedge)** test adjacency between this and supplied parameter

**Examples**

```javascript
var isAdjacent = edge.isAdjacentToEdge(anotherEdge)
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true or false, adjacent or not

## isSimilarToEdge

Test if an edge contains the same nodes as another edge

**Parameters**

-   `edge` **[GraphEdge](#graphedge)** test similarity between this and supplied parameter

**Examples**

```javascript
var isSimilar = edge.isSimilarToEdge(anotherEdge)
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true or false, similar or not

## otherNode

A convenience function, supply one of the edge's incident nodes and get back the other node

**Parameters**

-   `node` **[GraphNode](#graphnode)** must be one of the edge's 2 nodes

**Examples**

```javascript
var node2 = edge.otherNode(node1)
```

Returns **[GraphNode](#graphnode)** the node that is the other node

## isCircular

Test if an edge points both at both ends to the same node

**Examples**

```javascript
var isCircular = edge.isCircular()
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true or false, circular or not

## duplicateEdges

If this is a edge with duplicate edge(s), returns an array of duplicates not including self

**Examples**

```javascript
var array = edge.duplicateEdges()
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[GraphEdge](#graphedge)>** array of duplicate GraphEdge, empty array if none

## commonNodeWithEdge

For adjacent edges, get the node they share in common

**Parameters**

-   `otherEdge` **[GraphEdge](#graphedge)** an adjacent edge

**Examples**

```javascript
var sharedNode = edge1.commonNodeWithEdge(edge2)
```

Returns **[GraphNode](#graphnode)** the node in common, undefined if not adjacent

## uncommonNodeWithEdge

For adjacent edges, get this edge's node that is not shared in common with the other edge

**Parameters**

-   `otherEdge` **[GraphEdge](#graphedge)** an adjacent edge

**Examples**

```javascript
var notSharedNode = edge1.uncommonNodeWithEdge(edge2)
```

Returns **[GraphNode](#graphnode)** the node on this edge not shared by the other edge, undefined if not adjacent
