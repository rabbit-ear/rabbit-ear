# PlanarGraph

## Properties

```
nodes:PlanarNode[]
edges:PlanarEdge[]
faces:PlanarFace[]
```

---

#### nodes

```
nodes:PlanarNode[]
```

#### edges

```
edges:PlanarEdge[]
```

#### faces

```
faces:PlanarFace[]
```

## Methods

```
constructor()
duplicate():PlanarGraph
width():number
height():number
newPlanarNode(x:number, y:number):PlanarNode
newPlanarEdge(x1:number, y1:number, x2:number, y2:number):PlanarEdge
newPlanarEdgeFromNode(node:PlanarNode, x:number, y:number):PlanarEdge
newPlanarEdgeBetweenNodes(a:PlanarNode, b:PlanarNode):PlanarEdge
newPlanarEdgeRadiallyFromNode(node:PlanarNode, angle:number, length:number):PlanarEdge
clear():PlanarGraph
removeEdge(edge:GraphEdge):number
removeEdgeBetween(node1:GraphNode, node2:GraphNode):number
cleanNodeIfUseless(node):number
cleanAllUselessNodes():PlanarCleanReport
cleanDuplicateNodes(epsilon?:number):PlanarCleanReport
clean(epsilon?:number):PlanarCleanReport
fragment():PlanarCleanReport
fragmentEdge(edge:PlanarEdge):PlanarCleanReport
getEdgeIntersections():XY[]
getNearestNode(x:any, y:any):PlanarNode
getNearestNodes(x:any, y:any, howMany:number):PlanarNode[]
getNearestEdge(x:any, y:any):EdgeIntersection
getNearestEdges(x:any, y:any, howMany:number):any[]
getNearestFace(x:any, y:any):PlanarFace
getNearestInteriorAngle(x:any, y:any):InteriorAngle
```

---

#### constructor

```
constructor()
```

#### duplicate

*This will deep-copy the contents of this graph and return it as a new object*

* returns: [PlanarGraph](PlanarGraph.md)

```
duplicate():PlanarGraph
```

#### width height

*calculates the width and height of the bounding box around the nodes*

* returns: number

```
width():number
```

```
height():number
```

### 1. ADD PARTS

#### newPlanarNode

*Create a new isolated planar node at x,y*

* returns: [PlanarNode](PlanarNode.md) pointer to the node

```
newPlanarNode(x:number, y:number):PlanarNode
```

#### newPlanarEdge

*Create two new nodes each with x,y locations and an edge between them*

* returns: {PlanarEdge} pointer to the edge

```
newPlanarEdge(x1:number, y1:number, x2:number, y2:number):PlanarEdge
```

#### newPlanarEdgeFromNode

*Create one node with an x,y location and an edge between it and an existing node*

* returns: {PlanarEdge} pointer to the edge

```
newPlanarEdgeFromNode(node:PlanarNode, x:number, y:number):PlanarEdge
```

#### newPlanarEdgeBetweenNodes

*Create one node with an x,y location and an edge between it and an existing node*

* returns: {PlanarEdge} pointer to the edge

```
newPlanarEdgeBetweenNodes(a:PlanarNode, b:PlanarNode):PlanarEdge
```

#### newPlanarEdgeRadiallyFromNode

*Create one node with an angle and distance away from an existing node and make an edge between them*

* returns: {PlanarEdge} pointer to the edge

```
newPlanarEdgeRadiallyFromNode(node:PlanarNode, angle:number, length:number):PlanarEdge
```

### 2. REMOVE PARTS

#### clear

*Removes all nodes, edges, and faces, returning the graph to it's original state*

```
clear():PlanarGraph
```

#### removeEdge

*Removes an edge and also attempt to remove the two nodes left behind if they are otherwise unused*

* returns: `boolean` if the edge was removed

```
removeEdge(edge:GraphEdge):number
```

#### removeEdgeBetween

*Attempt to remove an edge if one is found that connects the 2 nodes supplied, and also attempt to remove the two nodes left behind if they are otherwise unused*

* returns: `number` how many edges were removed

```
removeEdgeBetween(node1:GraphNode, node2:GraphNode):number
```

#### cleanNodeIfUseless

*Remove a node if it is either unconnected to any edges, or is in the middle of 2 collinear edges*

* returns: `number` how many nodes were removed

```
cleanNodeIfUseless(node):number
```

### 3. SEARCH AND REMOVE

#### cleanAllUselessNodes

*Removes all isolated nodes and performs cleanNodeIfUseless() on every node*

* returns: [PlanarCleanReport](PlanarCleanReport.md)

```
cleanAllUselessNodes():PlanarCleanReport
```

#### cleanDuplicateNodes

* returns: [PlanarCleanReport](PlanarCleanReport.md)

```
cleanDuplicateNodes(epsilon?:number):PlanarCleanReport
```

### clean

*Removes circular and duplicate edges, merges and removes duplicate nodes, and refreshes .index values*

* returns: [PlanarCleanReport](PlanarCleanReport.md) the number and details of each edge and node removed

```
clean(epsilon?:number):PlanarCleanReport
```

### 4. FRAGMENT, EDGE INTERSECTION

#### fragment

*Fragment looks at every edge and one by one removes 2 crossing edges and replaces them with a node at their intersection and 4 edges connecting their original endpoints to the intersection.*

* returns: [PlanarCleanReport](PlanarCleanReport.md) 

```
fragment():PlanarCleanReport
```

#### fragmentEdge

*This function targets a single edge and performs the fragment operation on all crossing edges.*

* returns: [PlanarCleanReport](PlanarCleanReport.md)

```
fragmentEdge(edge:PlanarEdge):PlanarCleanReport
```

### 5. GET PARTS

#### getEdgeIntersections

*Without changing the graph, this function collects the XY locations of every point that two edges cross each other.*

* returns: array of [XY](XY.md) locations of all the intersection locations

```
getEdgeIntersections():XY[]
```

#### getNearestNode

* param: {XY} either two numbers (x,y) or one XY point object (XY)
* returns: {PlanarNode} nearest node to the point

```
getNearestNode(x:any, y:any):PlanarNode
getNearestNodes(x:any, y:any, howMany:number):PlanarNode[]
getNearestEdge(x:any, y:any):EdgeIntersection
getNearestEdges(x:any, y:any, howMany:number):any[]
```

```
getNearestFace(x:any, y:any):PlanarFace
```

```
getNearestInteriorAngle(x:any, y:any):InteriorAngle
```

# FACE

```
faceArrayDidChange()
```

```
generateFaces():PlanarFace[]
```

```
findClockwiseCircut(node1:PlanarNode, node2:PlanarNode):AdjacentNodes[]
```

```
makeFace(circut:AdjacentNodes[]):PlanarFace
```

```
adjacentFaceTree(start:PlanarFace):any
```


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
