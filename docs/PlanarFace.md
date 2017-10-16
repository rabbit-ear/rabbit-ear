# PlanarFace

### this library is counting on the edges and nodes to be stored in clockwise winding

```
graph:PlanarGraph
nodes:PlanarNode[]
edges:PlanarEdge[]
angles:number[]
index:number
```

```
constructor(graph:PlanarGraph)
equivalent(face:PlanarFace):boolean
commonEdge(face:PlanarFace):PlanarEdge
commonEdges(face:PlanarFace):PlanarEdge[]
uncommonEdges(face:PlanarFace):PlanarEdge[]
edgeAdjacentFaces():PlanarFace[]
contains(point:XY):boolean
transform(matrix)
```