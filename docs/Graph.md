# Graph

## Properties

#### nodes

* type: array of [`GraphNode`](GraphNode.md)

```
nodes:GraphNode[]
```

#### edges

* type: array of [`GraphEdge`](GraphEdge.md)

```
edges:GraphEdge[]
```

## Methods

### 1. Add Components

#### newNode

*pointer to the newly created node*

* returns: [`GraphNode`](GraphNode.md) 

```
newNode():GraphNode
```

#### newEdge

* returns: [`GraphEdge`](GraphEdge.md)

```
newEdge(node1:GraphNode, node2:GraphNode):GraphEdge 
```

#### addNode

* returns: [`GraphNode`](GraphNode.md) a pointer to the newly added node

```
addNode(node:GraphNode):GraphNode
```

#### addEdge

* returns: [`GraphEdge`](GraphEdge.md) a pointer to the newly added edge

```
addEdge(edge:GraphEdge):GraphEdge
```

### 2. Remove Components

#### clear

*remove all nodes and edges*

```
clear()
```

#### removeNode

* returns: `boolean` true if successful remove

```
removeNode(node:GraphNode):boolean
```

#### removeEdge

* returns: `boolean` true if successful remove

```
removeEdge(edge:GraphEdge):boolean
```

#### removeEdgeBetween

* returns: `boolean` true if successful remove

```
removeEdgeBetween(node1:GraphNode, node2:GraphNode):number
```

#### mergeNodes

* returns: `boolean` true if successful merge

```
mergeNodes(node1:GraphNode, node2:GraphNode):boolean
```

#### cleanCircularEdges

* returns: number of circular edges

```
cleanCircularEdges():number
```

#### cleanDuplicateEdges

* returns: number of duplicate edges

```
cleanDuplicateEdges():number
```

#### clean

```
clean():object
```

### 3. Query Components

#### getEdgeConnectingNodes

```
getEdgeConnectingNodes(node1:GraphNode, node2:GraphNode):GraphEdge
```
