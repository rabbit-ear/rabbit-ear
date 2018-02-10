# CreaseNode

```
graph:PlanarGraph;
x:number;
y:number;
```

```
adjacentFaces():PlanarFace[]
```

```
interiorAngles():InteriorAngle[]
```

### Adjacent nodes sorted clockwise by angle toward adjacent node

```
moved to: PlanarJunction
```

### Locates the most clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 4.

returns {AdjacentNodes} AdjacentNodes object containing the clockwise node and the edge connecting the two.

```
adjacentNodeClockwiseFrom(node:PlanarNode):AdjacentNodes
```

# implements XY

```
values():[number, number]
position(x:number, y:number):PlanarNode
translate(dx:number, dy:number):PlanarNode
normalize():PlanarNode 
rotate90():PlanarNode 
rotate(origin:XY, angle:number):PlanarNode
dot(point:XY):number 
cross(vector:XY):number
mag():number 
equivalent(point:XY, epsilon?:number):boolean
transform(matrix):PlanarNode
```

### reflects about a line that passes through 'a' and 'b'

```
reflect(a:XY,b:XY):XY
```

```
distance(a:XY):number
```

