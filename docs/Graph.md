# Graph

## Properties

```
nodes:GraphNode[]
edges:GraphEdge[]
```

---

#### nodes `nodes:GraphNode[]`

* type: array of [`GraphNode`](GraphNode.md)

#### edges `edges:GraphEdge[]`

* type: array of [`GraphEdge`](GraphEdge.md)

## Methods

```
newNode():GraphNode
newEdge(node1:GraphNode, node2:GraphNode):GraphEdge 
addNode(node:GraphNode):GraphNode
addEdge(edge:GraphEdge):GraphEdge
clear()
removeNode(node:GraphNode):boolean
removeEdge(edge:GraphEdge):boolean
removeEdgeBetween(node1:GraphNode, node2:GraphNode):number
mergeNodes(node1:GraphNode, node2:GraphNode):boolean
cleanCircularEdges():number
cleanDuplicateEdges():number
clean():object
getEdgeConnectingNodes(node1:GraphNode, node2:GraphNode):GraphEdge
```

---

### 1. Add Components

#### newNode `newNode():GraphNode`

*pointer to the newly created node*

* returns: [`GraphNode`](GraphNode.md) 

#### newEdge `newEdge(node1:GraphNode, node2:GraphNode):GraphEdge`

* returns: [`GraphEdge`](GraphEdge.md)

#### addNode `addNode(node:GraphNode):GraphNode`

* returns: [`GraphNode`](GraphNode.md) a pointer to the newly added node

#### addEdge `addEdge(edge:GraphEdge):GraphEdge`

* returns: [`GraphEdge`](GraphEdge.md) a pointer to the newly added edge

### 2. Remove Components

#### clear `clear()`

*remove all nodes and edges*

#### removeNode `removeNode(node:GraphNode):boolean`

* returns: `boolean` true if successful remove

#### removeEdge `removeEdge(edge:GraphEdge):boolean`

* returns: `boolean` true if successful remove

#### removeEdgeBetween `removeEdgeBetween(node1:GraphNode, node2:GraphNode):number`

* returns: `boolean` true if successful remove

#### mergeNodes `mergeNodes(node1:GraphNode, node2:GraphNode):boolean`

* returns: `boolean` true if successful merge

#### cleanCircularEdges `cleanCircularEdges():number`

* returns: number of circular edges

#### cleanDuplicateEdges `cleanDuplicateEdges():number`

* returns: number of duplicate edges

#### clean `clean():object`

### 3. Query Components

#### getEdgeConnectingNodes `getEdgeConnectingNodes(node1:GraphNode, node2:GraphNode):GraphEdge`
