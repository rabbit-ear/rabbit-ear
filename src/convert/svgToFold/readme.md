# SVG to FOLD

Convert an SVG image into a FOLD object.

```typescript
function svgToFold(svg: (string | SVGElement), options?: (number | object)) : object
```

This only works for crease patterns `frame_classes: ["creasePattern"]`. This will not work for SVG renderings of a folded origami model `frame_classes: ["foldedForm"]`.

# api

```javascript
ear.convert.svgToFold(svg);
```

use an optional *epsilon* as a second parameter:

```javascript
ear.convert.svgToFold(svg, 1e-2);
```

use an *options object* as a second parameter:

```javascript
ear.convert.svgToFold(svg, options);
```

where options can contain:

```javascript
let options = {
	epsilon: 1e-2,
	assignments: {
		"#888": "F",
		"black": "C",
	},
	boundary: false,
};
```

- options.epsilon: *(default: computed)* specify the vertex-merge distance
- options.assignment: *(default: see below)* which color is to convert into which assignment
- options.boundary: *(default: true)* should the boundary be discovered via walking?

assignment object should be:

- keys: any parseable CSS color (rgb, hsl, hex, named)
- value: any FOLD spec edges_assignment key (B, M, V, F, J, C, U)

# algorithm

> presently, this only supports straight lines (this includes the parts of an svg &lt;path&gt; which are straight).

1. the endpoints of the straight line elements are extracted after transforms are applied.
2. two edge attributes are attempted to be discovered: **assignment** and **foldAngle**. see below.
3. if an epsilon is not provided, one is inferred.
4. the graph is planarized, new edges/vertices are potentially made, nearby vertices are merged, faces are discovered.
5. the boundary is discovered by walking, these edges are assigned with "B". Also, before this runs, any pre-existing "B" creases will be reset to "F" (flat) so that only the walked edges will be "B".

### assignment

1. if the attribute "data-assignment" exists, return this value
2. otherwise, find the stroke color via window.getComputedStyle or style or attributes

once the stroke color is found, if the user has specified an `options.assignments` table, if a match is found (via conversion to #hex and string matching), this assignment is returned. Otherwise, the distances to each of these colors is computed and the nearest one is returned:

- **boundary**: black #000
- **mountain**: red #f00
- **valley**: blue #00f
- **join**: yellow #ff0
- **unassigned**: magenta #f0f
- **cut**: green #0f0
- **flat**: gray #888

### foldAngle

1. if the attribute "data-foldAngle" exists, return this value
2. otherwise, find the opacity via window.getComputedStyle or style or attributes

the opacity relates to fold angle:

```javascript
abs(foldAngle) = opacity * 180
```

then the assignment modifies the result:

- **valley**: positive
- **mountain**: negative
- **else**: 0
