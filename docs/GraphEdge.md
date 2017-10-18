# GraphEdge

## Variables

#### graph

*pointer to the graph this edge is a member. required for adjacent calculations*

* type: [`GraphNode`](GraphNode.md)

```
graph:Graph
```

#### index

*the index of this edge in the graph's edge array*

```
index:number
```

#### nodes

*not optional. every edge must connect 2 nodes*

```
nodes:[GraphNode,GraphNode]
```

## Methods

#### constructor

```
constructor(graph:Graph, node1:GraphNode, node2:GraphNode)
```

#### adjacentEdges

* returns: array of [GraphEdge](GraphEdge.md)

```
adjacentEdges():GraphEdge[]
```

#### adjacentNodes

* returns: array of [GraphNode](GraphNode.md)

```
adjacentNodes():GraphNode[]
```

#### isAdjacentToEdge

* returns: boolean

```
isAdjacentToEdge(edge:GraphEdge):boolean
```

#### isSimilarToEdge

* returns: boolean

```
isSimilarToEdge(edge:GraphEdge):boolean
```

#### commonNodeWithEdge

* returns: [GraphNode](GraphNode.md)

```
commonNodeWithEdge(otherEdge:GraphEdge):GraphNode
```

#### uncommonNodeWithEdge

* returns: [GraphNode](GraphNode.md)

```
uncommonNodeWithEdge(otherEdge:GraphEdge):GraphNode
```
