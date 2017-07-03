# Graph

contains

* class GraphNode
* class GraphEdge

### GraphNode

* graph:Graph
* index:number

```typescript
adjacentEdges():GraphEdge[]
adjacentNodes():GraphNode[]
```

### GraphEdge

* graph:Graph
* index:number
* node:[number,number]

```typescript
adjacentEdges():GraphEdge[]
adjacentNodes():GraphNode[]
isAdjacentWithEdge(edge:GraphEdge):boolean
```

# Planar Graph

contains

* class PlanarNode
* class PlanarEdge
* class PlanarFace

and

* class PlanarPair
* class XYPoint
* class Intersection


### PlanarNode

* x:number
* y:number

```typescript
planarAdjacent():PlanarPair[] // adjacency as in Graph, but with angle connecting edges
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


### PlanarPair

node adjacent to node, with angle offset and connecting edge

* node:PlanarNode
* edge:PlanarEdge
* angle:number
