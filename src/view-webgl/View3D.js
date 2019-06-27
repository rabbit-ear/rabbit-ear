/** FOLD file viewer
 * this is an THREE.js based front-end for the FOLD file format
 *  (FOLD file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - FOLD file
 *   - DOM object, or "string" DOM id to attach to
 */

import { flatten_frame } from "../fold/file_frames";
import load_file from "../files/loader";
import CreasePattern from "../objects/CreasePattern";

const CREASE_DIR = {
  "B": "boundary",
  "M": "mountain",
  "V": "valley",
  "F": "mark",
  "U": "mark"
};

// import { unitSquare } from "./OrigamiBases"
const unitSquare = {"file_spec":1.1,"file_creator":"","file_author":"","file_classes":["singleModel"],"frame_title":"","frame_attributes":["2D"],"frame_classes":["creasePattern"],"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],"vertices_vertices":[[1,3],[2,0],[3,1],[0,2]],"vertices_faces":[[0],[0],[0],[0]],"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],"edges_faces":[[0],[0],[0],[0]],"edges_assignment":["B","B","B","B"],"edges_foldAngle":[0,0,0,0],"edges_length":[1,1,1,1],"faces_vertices":[[0,1,2,3]],"faces_edges":[[0,1,2,3]]};

export default function View3D(){

  //  from arguments, get a fold file, if it exists
  let args = Array.from(arguments);

  let allMeshes = [];
  let scene = new THREE.Scene();

  // view properties
  let frame = 0; // which frame (0 ..< Inf) to display 
  let style = {
    vertex:{ radius: 0.01 },  // radius, percent of page
  };
  let _parent;

  let prop = {
    cp: undefined,
    frame: undefined,
    style: {
      vertex_radius: 0.01 // percent of page
    },
  };

  prop.cp = args.filter(arg =>
    typeof arg == "object" && arg.vertices_coords != undefined
  ).shift();
  if(prop.cp == undefined){ prop.cp = CreasePattern(unitSquare); }


  function bootThreeJS(domParent){
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


    var render = function(){
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      controls.update();
    };
    render();

    draw();
  }

  // after page load, find a parent element for the canvas in the arguments
  const attachToDOM = function(){
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
    if(numbers.length >= 2){
      // _svg.setAttributeNS(null, "width", numbers[0]);
      // _svg.setAttributeNS(null, "height", numbers[1]);
    } 
    if(functions.length >= 1){
      functions[0]();
    }
  };


  if(document.readyState === 'loading') {
    // wait until after the <body> has rendered
    document.addEventListener('DOMContentLoaded', attachToDOM);
  } else {
    attachToDOM();
  }


  function draw(){
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      flatShading:true,
      shininess:0,
      specular:0xffffff,
      reflectivity:0
    });

    let graph = prop.frame
      ? flatten_frame(prop.cp, prop.frame)
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

  const load = function(input, callback) { // epsilon
    load_file(input, function(fold) {
      setCreasePattern( CreasePattern(fold) );
      if (callback != null) { callback(); }
    });
  }

  const isFoldedState = function(){
    if(prop.cp == undefined || prop.cp.frame_classes == undefined){ return false; }
    let frame_classes = prop.cp.frame_classes;
    if(frame > 0 &&
       prop.cp.file_frames[frame - 1] != undefined &&
       prop.cp.file_frames[frame - 1].frame_classes != undefined){
      frame_classes = prop.cp.file_frames[frame - 1].frame_classes;
    }
    // try to discern folded state
    if(frame_classes.includes("foldedForm")){
      return true;
    }
    if(frame_classes.includes("creasePattern")){
      return false;
    }
    // inconclusive
    return false;
  }

  // return Object.freeze({
  return {
    set cp(c){
      setCreasePattern(c);
      draw();
    },
    get cp(){
      return prop.cp;
    },
    draw,
    load,
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




  function foldFileToThreeJSFaces(foldFile, material){
    
    var geometry = new THREE.BufferGeometry();
    let vertices = foldFile.vertices_coords
      .map(v => [v[0], v[1], (v[2] != undefined ? v[2] : 0)])
      .reduce((prev,curr) => prev.concat(curr), []);
    let normals = foldFile.vertices_coords
      .map(v => [0,0,1])
      .reduce((prev,curr) => prev.concat(curr), []);
    let colors = foldFile.vertices_coords
      .map(v => [1,1,1])
      .reduce((prev,curr) => prev.concat(curr), []);
    let faces = foldFile.faces_vertices
      .map(fv => fv.map((v,i,arr) => [arr[0], arr[i+1], arr[i+2]])
                   .slice(0, fv.length-2))
      .reduce((prev,curr) => prev.concat(curr), [])
      .reduce((prev,curr) => prev.concat(curr), []);

    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(faces);

    if(material == undefined){ material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide}); }
    return new THREE.Mesh(geometry, material);
  }

  function crossVec3(a,b){
    return [
      a[1]*b[2] - a[2]*b[1],
      a[2]*b[0] - a[0]*b[2],
      a[0]*b[1] - a[1]*b[0]
    ];
  }
  function magVec3(v){
    return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
  }
  function normalizeVec3(v){
    let mag = Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
    return [v[0] / mag, v[1] / mag, v[2] / mag];
  }
  function scaleVec3(v, scale){
    return [v[0]*scale, v[1]*scale, v[2]*scale];
  }
  function dotVec3(a,b){
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }

  function cylinderEdgeVertices(edge, radius){
    // normalized edge vector
    let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1], edge[1][2] - edge[0][2]];
    let mag = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2) + Math.pow(vec[2],2));
    if(mag < 1e-10){ throw "degenerate edge"; }
    let normalized = [vec[0] / mag, vec[1] / mag, vec[2] / mag];
    let perp = [
      normalizeVec3(crossVec3(normalized, [1,0,0])),
      normalizeVec3(crossVec3(normalized, [0,1,0])),
      normalizeVec3(crossVec3(normalized, [0,0,1]))
    ].map((v,i) => ({i:i, v:v, mag:magVec3(v)}))
     .filter(v => v.mag > 1e-10)
     .map(obj => obj.v)
     .shift()
    let rotated = [perp];
    for(var i = 1; i < 4; i++){
      rotated.push(normalizeVec3(crossVec3(rotated[i-1], normalized)));
    }
    let dirs = rotated.map(v => scaleVec3(v, radius));
    return edge
      .map(v => dirs.map(dir => [v[0]+dir[0], v[1]+dir[1], v[2]+dir[2]]))
      .reduce((prev,curr) => prev.concat(curr), []);
  }

  function foldFileToThreeJSLines(foldFile, scale=0.002){
    let edges = foldFile.edges_vertices.map(ev => ev.map(v => foldFile.vertices_coords[v]));
    // make sure they all have a z component. when z is implied it's 0
    edges.forEach(edge => {
      if(edge[0][2] == undefined){ edge[0][2] = 0; }
      if(edge[1][2] == undefined){ edge[1][2] = 0; }
    })

    let colorAssignments = {
      "B": [0.0,0.0,0.0],
   // "M": [0.9,0.31,0.16],
      "M": [0.0,0.0,0.0],//[34/255, 76/255, 117/255], //[0.6,0.2,0.11],
      "F": [0.0,0.0,0.0],//[0.25,0.25,0.25],
      "V": [0.0,0.0,0.0],//[227/255, 85/255, 54/255]//[0.12,0.35,0.50]
    };

    let colors = foldFile.edges_assignment.map(e => 
      [colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
      colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e]]
    ).reduce((prev,curr) => prev.concat(curr), [])
     .reduce((prev,curr) => prev.concat(curr), [])
     .reduce((prev,curr) => prev.concat(curr), []);

    let vertices = edges
      .map(edge => cylinderEdgeVertices(edge, scale))
      .reduce((prev,curr) => prev.concat(curr), [])
      .reduce((prev,curr) => prev.concat(curr), []);

    let normals = edges.map(edge => {
      // normalized edge vector
      let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1], edge[1][2] - edge[0][2]];
      let mag = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2) + Math.pow(vec[2],2));
      if(mag < 1e-10){ throw "degenerate edge"; }
      let normalized = [vec[0] / mag, vec[1] / mag, vec[2] / mag];
      // scale to line width
      let scaled = [normalized[0]*scale, normalized[1]*scale, normalized[2]*scale];
      let c0 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,-1])), scale);
      let c1 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,1])), scale);
      return [
        c0, [-c0[2], c0[1], c0[0]],
        c1, [-c1[2], c1[1], c1[0]],
        c0, [-c0[2], c0[1], c0[0]],
        c1, [-c1[2], c1[1], c1[0]]
      ]
    }).reduce((prev,curr) => prev.concat(curr), [])
      .reduce((prev,curr) => prev.concat(curr), []);

    let faces = edges.map((e,i) => [
      // 8 triangles making the long cylinder
      i*8+0, i*8+4, i*8+1,
      i*8+1, i*8+4, i*8+5,
      i*8+1, i*8+5, i*8+2,
      i*8+2, i*8+5, i*8+6,
      i*8+2, i*8+6, i*8+3,
      i*8+3, i*8+6, i*8+7,
      i*8+3, i*8+7, i*8+0,
      i*8+0, i*8+7, i*8+4,
      // endcaps
      i*8+0, i*8+1, i*8+3,
      i*8+1, i*8+2, i*8+3,
      i*8+5, i*8+4, i*8+7,
      i*8+7, i*8+6, i*8+5,
    ]).reduce((prev,curr) => prev.concat(curr), []);

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(faces);
    geometry.computeVertexNormals();

    var material = new THREE.MeshToonMaterial( {
        shininess: 0,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    } );
    return new THREE.Mesh(geometry, material);
  }


}
