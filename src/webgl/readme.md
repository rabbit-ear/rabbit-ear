# FOLD in WebGL

Create and manage a simple WebGL instance and draw a FOLD format object with support for different drawing styles.

```javascript
ear.webgl
```

# usage

1. initialize the WebGL context
2. create a program with your FOLD file and customize it with options.
3. set the shader uniforms and draw to the screen

where step 3 can go inside an animation loop if you choose.

# example

these variables are a [FOLD format](https://github.com/edemaine/fold) object and an HTML canvas:

```javascript
var FOLD;
var canvas;
```

initialize and draw:

```javascript
// gl is the WebGL context. version is either 1 or 2.
const { gl, version } = ear.webgl.initializeWebGL(canvas);

// Initialize a WebGL viewport based on the dimensions of the canvas
ear.webgl.rebuildViewport(gl, canvas);

// draw creasePattern style, or foldedForm style
const models = ear.webgl.creasePattern(gl, version, FOLD);
// models = ear.webgl.foldedForm(gl, version, FOLD);

const projectionMatrix = ear.webgl.makeProjectionMatrix(canvas);
const modelViewMatrix = ear.webgl.makeModelMatrix(FOLD);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// prepare the uniforms and draw the frame
const modelUniforms = models.map(model => model.makeUniforms(gl, {
	projectionMatrix,
	modelViewMatrix,
	canvas,
	frontColor: "#369",
	backColor: "white",
	cpColor: "white",
	strokeWidth: 0.05,
	opacity: 1,
}));

models.forEach((model, i) => {
	ear.webgl.drawModel(gl, version, model, modelUniforms[i]);
});
```

dealloc:

```javascript
models.forEach(model => ear.webgl.deallocModel(gl, model));
```

# uniforms

These uniforms are **required**, although foldedForm and creasePattern require a different set

- **projectionMatrix**: `{number[]}` an array of 16 numbers, the projection matrix
- **modelViewMatrix**: `{number[]}` an array of 16 numbers, the modelView matrix
- **canvas**: `{number[]}` an array of 2 numbers, the width and height in pixels of the canvas
- **frontColor**: `{number[]}` the color of the front of the mesh
- **backColor**: `{number[]}` the color of the back of the mesh
- **cpColor**: `{number[]}` the color of the space inside the crease pattern
- **strokeWidth**: `{number[]}` stroke width of the crease pattern and foldedForm edges
- **opacity**: `{number[]}` opacity of the mesh faces

required by **foldedForm**: projectionMatrix, modelViewMatrix, canvas, frontColor, backColor, strokeWidth, opacity

required by **creasePattern**: projectionMatrix, modelViewMatrix, canvas, cpColor, strokeWidth

# options

```javascript
ear.webgl.creasePattern(gl, version, FOLD, options);
ear.webgl.foldedForm(gl, version, FOLD, options);
```

at initialization, both programs can take an optional 4th parameter, an options object. The object itself can contain any number of the following:

```javascript
const options = {
	layerNudge: 1e-5,
	outlines: true,
	edges: false,
	faces: true,
	dark: true,
	B: [0.5, 0.5, 0.5],
	b: [0.5, 0.5, 0.5],
	V: [0.2, 0.4, 0.6],
	v: [0.2, 0.4, 0.6],
	M: [0.75, 0.25, 0.15],
	m: [0.75, 0.25, 0.15],
	F: [0.3, 0.3, 0.3],
	f: [0.3, 0.3, 0.3],
	J: [0.3, 0.2, 0.0],
	j: [0.3, 0.2, 0.0],
	C: [0.5, 0.8, 0.1],
	c: [0.5, 0.8, 0.1],
	U: [0.6, 0.25, 0.9],
	u: [0.6, 0.25, 0.9],
};
```

- **layerNudge**: for foldedForm, if there is faceOrders present this is the space between faces
- **outlines**: for foldedForm, a dark outline around every face (excluding "J" edges)
- **edges**: for foldedForm, show the creasePattern style colored edges but on the foldedForm
- **faces**: for foldedForm, show or hide the mesh faces
- **dark**: both creasePattern and foldedForm, render colors appropriate for dark mode.

and finally, any crease assignment's RGB values can be specified (for foldedForm be sure to turn on "edges" option). because FOLD spec supports both capital and lowercase, unless you know the contents of your FOLD format, you should duplicate the color for every assignment.

# design notes

the *options* (given at initialization) and the *uniforms* (given each draw frame) both include similar information; options can be moved to the uniforms, and visa-versa. Consider however that the uniforms is *required* and the options isn't, so making all fields like this in the uniforms isn't necessarily desirable.
