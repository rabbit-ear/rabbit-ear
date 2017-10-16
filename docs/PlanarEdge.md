# PlanarEdge

```
graph:PlanarGraph;
nodes:[PlanarNode,PlanarNode];
```

```
midpoint():XY
intersection(edge:PlanarEdge):EdgeIntersection
crossingEdges():EdgeIntersection[]
```

### startNode is one of this edge's 2 nodes

```
absoluteAngle(startNode?:PlanarNode):number
adjacentFaces():PlanarFace[]
transform(matrix)
```

### returns the matrix representation form of this edge as the line of reflection

```
reflectionMatrix():Matrix
```