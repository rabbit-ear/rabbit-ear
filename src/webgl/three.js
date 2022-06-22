/**
 * Rabbit Ear (c) Kraft
 */
/** FOLD file viewer
 * this is an THREE.js based front-end for the FOLD file format
 *  (FOLD file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - FOLD file
 *   - DOM object, or "string" DOM id to attach to
 */
import {
	make_faces_geometry,
	make_edges_geometry,
} from "./fold-to-three";

// use CameraControls https://github.com/yomotsu/camera-controls

import { flattenFrame } from "../graph/fileFrames";
// import load_file from "../../convert/load_async";

// import { unitSquare } from "./OrigamiBases"
const unitSquare = {"file_spec":1.1,"file_creator":"","file_author":"","file_classes":["singleModel"],"frame_title":"","frame_attributes":["2D"],"frame_classes":["creasePattern"],"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],"vertices_vertices":[[1,3],[2,0],[3,1],[0,2]],"vertices_faces":[[0],[0],[0],[0]],"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],"edges_faces":[[0],[0],[0],[0]],"edges_assignment":["B","B","B","B"],"edges_foldAngle":[0,0,0,0],"edges_length":[1,1,1,1],"faces_vertices":[[0,1,2,3]],"faces_edges":[[0,1,2,3]]};

const View3D = function (...args) {
	//  from arguments, get a fold file, if it exists
	let allMeshes = [];
	let scene = new THREE.Scene();

	// view properties
	let frame = 0; // which frame (0 ..< Inf) to display
	let style = {
		vertex: { radius: 0.01 }, // radius, percent of page
	};
	let _parent;

	let prop = {
		cp: undefined,
		frame: undefined,
		style: {
			vertex_radius: 0.01 // percent of page
		},
	};

	prop.cp = args
		.filter(arg => typeof arg === "object" && arg.vertices_coords != null)
		.shift();
	if (prop.cp == null) { prop.cp = CreasePattern(unitSquare); }


	function bootThreeJS(domParent) {
		var camera = new THREE.PerspectiveCamera(45, domParent.clientWidth/domParent.clientHeight, 0.1, 1000);
		var controls = new THREE.OrbitControls(camera, domParent);
		controls.enableZoom = false;
//    camera.position.set(0.5, 0.5, 1.5);
		camera.position.set(-0.75, 2, -0.025);
		// controls.target.set(0.5, 0.5, 0.0);
		controls.target.set(0.0, 0.0, 0.0);
		// camera.position.set(0.0, 0.0, 1.5 );
		// controls.target.set(0.0, 0.0, 0.0);
		controls.addEventListener('change', render);
		var renderer = new THREE.WebGLRenderer({antialias:true});

		if (window.devicePixelRatio !== 1) {
			renderer.setPixelRatio(window.devicePixelRatio);
		}
		
		renderer.setClearColor("#FFFFFF");
		renderer.setSize(domParent.clientWidth, domParent.clientHeight);
		domParent.appendChild(renderer.domElement);
		// shining from below
		var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
		directionalLight2.position.set(20, 20, -100);
		scene.add(directionalLight2);
		// above
		var spotLight1 = new THREE.SpotLight(0xffffff, 0.3);
		spotLight1.position.set(50, -200, 100);
		scene.add(spotLight1)
		var spotLight2 = new THREE.SpotLight(0xffffff, 0.3);
		spotLight2.position.set(100, 50, 200);
		scene.add(spotLight2)
		var ambientLight = new THREE.AmbientLight(0xffffff, 0.48);
		scene.add(ambientLight);


		var render = function() {
			requestAnimationFrame(render);
			renderer.render(scene, camera);
			controls.update();
		};
		render();

		draw();
	}

	// after page load, find a parent element for the canvas in the arguments
	const attachToDOM = function() {
		let functions = args.filter((arg) => typeof arg === "function");
		let numbers = args.filter((arg) => !isNaN(arg));
		let element = args.filter((arg) =>
				arg instanceof HTMLElement)
			.shift();
		let idElement = args.filter((a) =>
				typeof a === "string" || a instanceof String)
			.map(str => document.getElementById(str))
			.shift();
		_parent = (element != null
			? element
			: (idElement != null
				? idElement
				: document.body));
		bootThreeJS(_parent);
		if (numbers.length >= 2) {
			// _svg.setAttributeNS(null, "width", numbers[0]);
			// _svg.setAttributeNS(null, "height", numbers[1]);
		} 
		if (functions.length >= 1) {
			functions[0]();
		}
	};


	if (document.readyState === 'loading') {
		// wait until after the <body> has rendered
		document.addEventListener('DOMContentLoaded', attachToDOM);
	} else {
		attachToDOM();
	}


	function draw() {
		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			side: THREE.DoubleSide,
			flatShading:true,
			shininess:0,
			specular:0xffffff,
			reflectivity:0
		});

		let graph = prop.frame
			? flattenFrame(prop.cp, prop.frame)
			: prop.cp;
		let faces = foldFileToThreeJSFaces(graph, material);
		let lines = foldFileToThreeJSLines(graph);
		allMeshes.forEach(mesh => scene.remove(mesh));
		allMeshes = [];
		allMeshes.push(faces);
		allMeshes.push(lines);
		allMeshes.forEach(mesh => scene.add(mesh));
	}

	const setCreasePattern = function(cp) {
		// todo: check if cp is a CreasePattern type
		prop.cp = cp;
		draw();
		prop.cp.onchange = draw;
	}

	// const load = function(input, callback) { // epsilon
	//   load_file(input, function(fold) {
	//     setCreasePattern( CreasePattern(fold) );
	//     if (callback != null) { callback(); }
	//   });
	// }

	const isFoldedState = function() {
		if (prop.cp == undefined || prop.cp.frame_classes == undefined) { return false; }
		let frame_classes = prop.cp.frame_classes;
		if (frame > 0 &&
			 prop.cp.file_frames[frame - 1] != undefined &&
			 prop.cp.file_frames[frame - 1].frame_classes != undefined) {
			frame_classes = prop.cp.file_frames[frame - 1].frame_classes;
		}
		// try to discern folded state
		if (frame_classes.includes("foldedForm")) {
			return true;
		}
		if (frame_classes.includes("creasePattern")) {
			return false;
		}
		// inconclusive
		return false;
	}

	// return Object.freeze({
	return {
		set cp(c) {
			setCreasePattern(c);
			draw();
		},
		get cp() {
			return prop.cp;
		},
		draw,
		// load,
		get frame() { return prop.frame; },
		set frame(newValue) {
			prop.frame = newValue;
			draw();
		},
		get frames() {
			let frameZero = JSON.parse(JSON.stringify(prop.cp));
			delete frameZero.file_frames;
			return [frameZero].concat(JSON.parse(JSON.stringify(prop.cp.file_frames)));
		}
	// });
	};

	function foldFileToThreeJSFaces(foldFile, material) {
		var geometry = make_faces_geometry(foldFile);
		if (material == undefined) { material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide}); }
		return new THREE.Mesh(geometry, material);
	}

	function foldFileToThreeJSLines(foldFile, scale=0.002) {
		const geometry = make_edges_geometry(foldFile, scale);
		var material = new THREE.MeshToonMaterial( {
				shininess: 0,
				side: THREE.DoubleSide, vertexColors: THREE.VertexColors
		} );
		return new THREE.Mesh(geometry, material);
	}
};

export default View3D;
