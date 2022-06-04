# FOLD to SVG extension

```javascript
ear.graph.svg
```

methods in this extension will render FOLD objects into SVG. This includes features such as:

- style differentiating edges by mountain/valley, faces by front/back
- 


## API

these two methods target the same draw call:

```javascript
// render of a FOLD object as an <svg> element
ear.graph.svg(FOLD, options)

// render of a FOLD object as an <g> element
mySVG.origami(FOLD, options)
```

the first is called without any preparation, the second requires you first create an `<svg>` using this library but the advantage is that it will automatically append the FOLD rendering as a child.

```javascript
// given an svg (made by this library)
const mySVG = ear.svg()
mySVG.origami(FOLD)
```

this is the main draw subroutine which draws and appends the components onto the `element`:

```javascript
ear.graph.svg.drawInto(element, FOLD, options)
```

these subroutines are made available to the user which draw individual components and return one `<g>` group container:

```javascript
ear.graph.svg.boundaries(FOLD, options)
ear.graph.svg.faces(FOLD, options)
ear.graph.svg.edges(FOLD, options)
ear.graph.svg.vertices(FOLD, options)
```

convenience method, return the string value for a viewBox which contains the FOLD object, for example: "-10 -15 310 310"

```javascript
ear.graph.svg.getViewBox(FOLD)
```

## options object

```javascript
options = {
	// component level
	vertices: false,
	edges: {},
	faces: {},
	boundaries: {},
	// top level
	viewBox: true,
	strokeWidth: 0.01,
	radius: 0.2,
};
```

All top level methods accept the same options object. The subroutines which draw individual components take the individual component entries from this example options object (for example, drawing edges takes the "edges:" options entry only).

### component level

vertices, edges, faces, boundaries: these can be either an `object` or a `boolean`

- `boolean` with a "false" will turn skip rendering this layer
- `object` with css-style tags (kebab-case keys) will apply style as attribute tags.

"edges" and "faces" contains special subcategories. Edges can target any of the FOLD-spec edges_assignment classes: mountain, valley, boundary, flat, unassigned. Faces can target front and back, which 

```javascript
options = {
	edges: {
		mountain: { stroke: "red" },
		valley: { stroke: "blue" },
	},
	faces: {
		front: { fill: "#369" },
		back: { fill: "white" },
	},
};
```

### top level

viewBox: `boolean`, if this is present, the SVG viewbox will be reset to fit the x-y coordinates from the FOLD object. If the element being draw into is not an `<svg>` (like a `<g>` for example), this will crawl up the parent-tree until it finds an `<svg>`, there the viewBox is set.

strokeWidth, radius: either `number` or `boolean`. "radius" means the radius of all circles (vertices):

- `number`: set this attribute to be a scale of the vmax (max length of x or y axis) of the FOLD object. I remember it as a "percentage of the longest length".
- `boolean`: set the attribute to its default: `stroke-width: 1/100` `radius: 1/50` factors of vmax, the longest side-length of the FOLD object.

stroke-width will be set to the top level group, radius needs to be set on each individual `<circle>` element.
