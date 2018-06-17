
# Graph

A graph contains unlimited nodes and edges and can perform operations on them

### ADD

- [copy](#copy)
- [newNode](#newnode)
- [newEdge](#newedge)
- [addNode](#addnode)
- [addEdge](#addedge)
- [addNodes](#addnodes)
- [addEdges](#addedges)
- [copyNode](#copynode)
- [copyEdge](#copyedge)

### REMOVE

- [clear](#clear)
- [removeEdge](#removeedge)
- [removeEdgeBetween](#removeedgebetween)
- [removeNode](#removenode)
- [mergeNodes](#mergenodes)
- [removeIsolatedNodes](#removeisolatednodes)
- [removeCircularEdges](#cleancircularedges)
- [removeDuplicateEdges](#cleanduplicateedges)
- [cleanGraph](#cleangraph)
- [clean](#clean)

### QUERY / LOCATE

- [getEdgeConnectingNodes](#getedgeconnectingnodes)
- [getEdgesConnectingNodes](#getedgesconnectingnodes)

## copy

Deep-copy the contents of this graph and return it as a new object

**Examples**

```javascript
var copiedGraph = graph.copy()
```

Returns **[Graph](#graph)** 

## newNode

Create a node and add it to the graph

**Examples**

```javascript
var node = graph.newNode()
```

Returns **[GraphNode](#graphnode)** pointer to the node

## newEdge

Create an edge and add it to the graph

**Parameters**

-   `node1` **[GraphNode](#graphnode)** the first node that the edge connects
-   `node2` **[GraphNode](#graphnode)** the second node that the edge connects

**Examples**

```javascript
var node1 = graph.newNode()
var node2 = graph.newNode()
graph.newEdge(node1, node2)
```

Returns **[GraphEdge](#graphedge)** if successful, pointer to the edge

## addNode

Add an already-initialized node to the graph

**Parameters**

-   `node` **[GraphNode](#graphnode)** must be already initialized

**Examples**

```javascript
// it's preferred to simply use graph.newNode()
var node = new GraphNode(graph)
graph.addNode(node)
```

Returns **[GraphNode](#graphnode)** pointer to the node

## addEdge

Add an already-initialized edge to the graph

**Parameters**

-   `edge` **[GraphEdge](#graphedge)** must be initialized, and two nodes must be already be a part of this graph

**Examples**

```javascript
// it's preferred to simply use graph.newEdge(node1, node2)
var edge = new GraphEdge(graph, node1, node2)
graph.addEdge(edge)
```

Returns **[GraphEdge](#graphedge)** if successful, pointer to the edge

## addNodes

Add already-initialized node objects from an array to the graph

**Parameters**

-   `nodes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[GraphNode](#graphnode)>** array of GraphNode

**Examples**

_Initalize 2 nodes and add them to the graph._

```javascript
var n = [new GraphNode(graph), new GraphNode(graph)];
graph.addNodes(n);
```

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of nodes added to the graph

## addEdges

Add already-initialized edge objects from an array to the graph, cleaning out any duplicate and circular edges

**Parameters**

-   `edges`  

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of edges added to the graph

## copyNode

Copies the contents of an existing node into a new node and adds it to the graph

**Parameters**

-   `node`  

Returns **[GraphNode](#graphnode)** pointer to the node

## copyEdge

Copies the contents of an existing edge into a new edge and adds it to the graph

**Parameters**

-   `edge`  

Returns **[GraphEdge](#graphedge)** pointer to the edge

## clear

Removes all nodes and edges, returning the graph to it's original state

**Examples**

```javascript
graph.clear()
```

## removeEdge

Remove an edge

**Parameters**

-   `edge`  

**Examples**

```javascript
var clean = graph.removeEdge(edge)
// clean.edges should equal 1
```

Returns **[GraphClean](#graphclean)** number of edges removed

## removeEdgeBetween

Searches and removes any edges connecting the two nodes supplied in the arguments

**Parameters**

-   `node1` **[GraphNode](#graphnode)** first node
-   `node2` **[GraphNode](#graphnode)** second node

**Examples**

```javascript
var clean = graph.removeEdgeBetween(node1, node2)
// clean.edges should be >= 1
```

Returns **[GraphClean](#graphclean)** number of edges removed. in the case of an unclean graph, there may be more than one

## removeNode

Remove a node and any edges that connect to it

**Parameters**

-   `node` **[GraphNode](#graphnode)** the node that will be removed

**Examples**

```javascript
var clean = graph.removeNode(node)
// clean.node will be 1
// clean.edges will be >= 0
```

Returns **[GraphClean](#graphclean)** number of nodes and edges removed

## mergeNodes

Remove the second node and replaces all mention of it with the first in every edge

**Parameters**

-   `node1` **[GraphNode](#graphnode)** first node to merge, this node will persist
-   `node2` **[GraphNode](#graphnode)** second node to merge, this node will be removed

**Examples**

```javascript
var clean = graph.mergeNodes(node1, node2)
// clean.node will be 1
// clean.edges will be >= 0
```

Returns **[GraphClean](#graphclean)** 1 removed node, newly duplicate and circular edges will be removed

## removeIsolatedNodes

Removes any node that isn't a part of an edge

**Examples**

```javascript
var clean = graph.removeIsolatedNodes()
// clean.node will be >= 0
```

Returns **[GraphClean](#graphclean)** the number of nodes removed

## removeCircularEdges

Remove all edges that contain the same node at both ends

**Examples**

```javascript
var clean = graph.removeCircularEdges()
// clean.edges will be >= 0
```

Returns **[GraphClean](#graphclean)** the number of edges removed

## removeDuplicateEdges

Remove edges that are similar to another edge

**Examples**

```javascript
var clean = graph.removeDuplicateEdges()
// clean.edges will be >= 0
```

Returns **[GraphClean](#graphclean)** the number of edges removed

## cleanGraph

Graph specific clean function: removes circular and duplicate edges, refreshes .index. Only modifies edges array.

**Examples**

```javascript
var clean = graph.cleanGraph()
// clean.edges will be >= 0
```

Returns **[GraphClean](#graphclean)** the number of edges removed

## clean

Clean calls cleanGraph(), gets overwritten when subclassed. Removes circular and duplicate edges, refreshes .index. Only modifies edges array.

**Examples**

```javascript
var clean = graph.clean()
// clean.edges will be >= 0
```

Returns **[GraphClean](#graphclean)** the number of edges removed

## getEdgeConnectingNodes

Searches for an edge that contains the 2 nodes supplied in the function call. Will return first edge found, if graph isn't clean it will miss any subsequent duplicate edges.

**Parameters**

-   `node1`  
-   `node2`  

**Examples**

```javascript
var edge = graph.getEdgeConnectingNodes(node1, node2)
```

Returns **[GraphEdge](#graphedge)** edge, if exists. undefined, if no edge connects the nodes (not adjacent)

## getEdgesConnectingNodes

Searches for all edges that contains the 2 nodes supplied in the function call. This is suitable for unclean graphs, graphs with duplicate edges.

**Parameters**

-   `node1`  
-   `node2`  

**Examples**

```javascript
var array = graph.getEdgesConnectingNodes(node1, node2)
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[GraphEdge](#graphedge)>** array of edges, if any exist. empty array if no edge connects the nodes (not adjacent)
