# GraphNode

## Variables

#### graph

*pointer to the graph this node is a member. required for adjacent calculations*

```
graph:Graph;
```

#### index

*the index of this node in the graph's node array*

```
index:number;
```

## Methods

#### constructor

```
constructor(graph:Graph){ this.graph = graph; }
```

#### adjacentEdges

*Get an array of edges that contain this node*

* returns: `GraphEdge[]` array of adjacent edges

```
adjacentEdges():GraphEdge[]
```

#### adjacentNodes

*Get an array of nodes that share an edge in common with this node*

* returns: `GraphNode[]` array of adjacent nodes

```
adjacentNodes():GraphNode[]
```

#### isAdjacentToNode

*Test if a node is connected to another node by an edge*

* returns: `boolean` true or false, adjacent or not

```
isAdjacentToNode(node:GraphNode):boolean
```

#### degree

*The degree of a node is the number of adjacent edges*

* returns: `number` number of adjacent edges

```
degree():number
```
