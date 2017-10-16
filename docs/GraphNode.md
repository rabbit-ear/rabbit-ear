# GraphNode

### constructor

```
constructor(graph:Graph){ this.graph = graph; }
```

### pointer to the graph this node is a member. required for adjacent calculations

```
graph:Graph;
```

### the index of this node in the graph's node array

```
index:number;
```

### Get an array of edges that contain this node

returns {GraphEdge[]} array of adjacent edges

```
adjacentEdges():GraphEdge[]
```

### Get an array of nodes that share an edge in common with this node

returns {GraphNode[]} array of adjacent nodes

```
adjacentNodes():GraphNode[]
```

### Test if a node is connected to another node by an edge

returns {boolean} true or false, adjacent or not

```
isAdjacentToNode(node:GraphNode):boolean
```

### The degree of a node is the number of adjacent edges

returns {number} number of adjacent edges

```
degree():number
```
