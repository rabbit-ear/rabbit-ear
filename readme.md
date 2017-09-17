# Origami Code

This **Crease Pattern** class is built on top of a **Planar Graph** class, which is built on top of a **Graph** class. Details follow:

# Graph

### Add Components

```typescript
newNode():GraphNode 
newEdge(node1:GraphNode, node2:GraphNode):GraphEdge 
addNode(node:GraphNode):GraphNode
addEdge(edge:GraphEdge):GraphEdge
```

### Remove Components

```typescript
clear()
removeNode(node:GraphNode):boolean
removeEdge(edge:GraphEdge):boolean
removeEdgeBetween(node1:GraphNode, node2:GraphNode):number
mergeNodes(node1:GraphNode, node2:GraphNode):boolean
cleanCircularEdges():number
cleanDuplicateEdges():number
clean():object
```

### Query Components

```typescript
getEdgeConnectingNodes(node1:GraphNode, node2:GraphNode):GraphEdge
```

## Components

### GraphNode

```typescript
adjacentEdges():GraphEdge[]
adjacentNodes():GraphNode[]
isAdjacentToNode(node:GraphNode):boolean
```

### GraphEdge

```typescript
adjacentEdges():GraphEdge[]
adjacentNodes():GraphNode[]
isAdjacentToEdge(edge:GraphEdge):boolean
isSimilarToEdge(edge:GraphEdge):boolean
commonNodeWithEdge(otherEdge:GraphEdge):GraphNode
uncommonNodeWithEdge(otherEdge:GraphEdge):GraphNode
```

# Planar Graph

## Components

### PlanarNode

* x:number
* y:number

```typescript
planarAdjacent():AdjacentNodes[] // adjacency as in Graph, but with angle connecting edges
translate(dx:number, dy:number)
rotateAroundNode(node:PlanarNode, angle:number)
```

### PlanarEdge

```typescript
endPoints():PlanarNode[]
adjacentNodes():PlanarNode[]
adjacentEdges():PlanarEdge[]
```

### PlanarFace

* nodes:PlanarNode[]
* edges:PlanarEdge[]

### Intersection

intersection of 2 edges - contains 1 intersection point, 2 edges, 4 nodes (2 edge 2 endpoints)

* exists:boolean
* edges:[PlanarEdge, PlanarEdge]
* nodes:[PlanarNode, PlanarNode, PlanarNode, PlanarNode]


### AdjacentNodes

node adjacent to node, with angle offset and connecting edge

* parent:PlanarNode
* node:PlanarNode
* edge:PlanarEdge
* angle:number

# TODO

* issues arise using a non-convex polygon of paper. like checking if edge crosses outside the paper fails.
