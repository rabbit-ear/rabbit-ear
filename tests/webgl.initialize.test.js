import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../src/index.js";

ear.window = xmldom;

test("webgl cannot be tested server side", () => expect(true).toBe(true));

// here is a test that can be done in the browser.

// test("initialize webgl", () => {
// 	const FOLD = ear.graph.bird();

// 	const canvas = window.document.createElement("canvas");
// 	document.body.appendChild(canvas);

// 	// gl is the WebGL context. version is either 1 or 2.
// 	const { gl, version } = ear.webgl.initializeWebGL(canvas);

// 	// Initialize a WebGL viewport based on the dimensions of the canvas
// 	ear.webgl.rebuildViewport(gl, canvas);

// 	// draw creasePattern style, or foldedForm style
// 	const models = ear.webgl.creasePattern(gl, version, FOLD);
// 	// program = ear.webgl.foldedForm(gl, version, FOLD);

// 	const projectionMatrix = ear.webgl.makeProjectionMatrix(canvas, "orthographic");
// 	const modelViewMatrix = ear.webgl.makeModelMatrix(FOLD);

// 	gl.enable(gl.BLEND);
// 	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
// 	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// 	models.forEach(model => {
// 		ear.webgl.drawModel(gl, version, model, model.makeUniforms(gl, {
// 			projectionMatrix,
// 			modelViewMatrix
// 		}));
// 	});

// 	models.forEach(model => ear.webgl.deallocModel(gl, model));
// });
