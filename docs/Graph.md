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
