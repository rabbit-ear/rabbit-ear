/* Origami Simulator (c) Amanda Ghassaei, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.OrigamiSimulator = factory());
}(this, (function () { 'use strict';

  /**
   * Created by ghassaei on 10/7/16.
   */

  /**
   * careful, no object pointers. this object gets copied (parse/stringify)
   * before it's deployed
   */

  const globalDefaults = {
    navMode: "simulation",
    scale: 1,

    // view
    colorMode: "color",
    calcFaceStrain: false,
    color1: "ec008b",
    color2: "ffffff",
    edgesVisible: true,
    mtnsVisible: true,
    valleysVisible: true,
    panelsVisible: false,
    passiveEdgesVisible: false,
    boundaryEdgesVisible: true,
    meshVisible: true,
    ambientOcclusion: false,

    // flags
    simulationRunning: true,
    fixedHasChanged: false,
    forceHasChanged: false,
    materialHasChanged: false,
    creaseMaterialHasChanged: false,
    shouldResetDynamicSim: false, // not used
    shouldChangeCreasePercent: false,
    nodePositionHasChanged: false,
    shouldZeroDynamicVelocity: false,
    shouldCenterGeo: false,
    needsSync: false,
    simNeedsSync: false,

    menusVisible: true,

    url: null,

    // 3d vis
    simType: "dynamic",

    // compliant sim settings
    creasePercent: 0.6,
    axialStiffness: 20,
    creaseStiffness: 0.7,
    panelStiffness: 0.7,
    faceStiffness: 0.2,

    // dynamic sim settings
    percentDamping: 0.45, // damping ratio
    density: 1,
    integrationType: "euler",

    strainClip: 5.0, // for strain visualization, % strain that is drawn red

    // import pattern settings
    vertTol: 0.001, // vertex merge tolerance
    foldUseAngles: true, // import current angles from fold format as target angles

    // save stl settings
    filename: null,
    extension: null,
    doublesidedSTL: false,
    doublesidedOBJ: false,
    exportScale: 1,
    thickenModel: true,
    thickenOffset: 5,
    polyFacesOBJ: true,

    // save fold settings
    foldUnits: "unit",
    triangulateFOLDexport: false,
    exportFoldAngle: true,

    pausedForPatternView: false,

    userInteractionEnabled: false,
    vrEnabled: false,

    numSteps: 100,

    backgroundColor: "ffffff",

    capturer: null,
    capturerQuality: 63,
    capturerFPS: 60,
    gifFPS: 20,
    currentFPS: null,
    capturerScale: 1,
    capturerFrames: 0,
    shouldScaleCanvas: false,
    isGif: false,
    shouldAnimateFoldPercent: false,

    // new options for node module
    // the <canvas> will be appended to this element
    append: null, // to be set to document.body
    // this is duplicating userInteractionEnabled, but i'd like to transition
    // to this since it's more clear what it means
    touchMode: "rotate" // what to do on mouse drag, options: ["rotate", "grab"]
  };

  /**
   * Created by ghassaei on 9/16/16.
   */

  const THREE = window.THREE || require("three");
  const TrackballControls = window.TrackballControls || require("three-trackballcontrols");
  // import * as THREE from "../import/three.module";
  // import { TrackballControls } from "../import/trackballcontrols";

  function initThreeView(globals) {
    // todo, make sure whatever is calling this is waiting for DOM to load
    // to get the client rect below
    const container = globals.append;
    const rect = (container != null
      ? container.getBoundingClientRect()
      : { x: 0, y: 0, width: 320, height: 240 });

    const scene = new THREE.Scene();
    const modelWrapper = new THREE.Object3D();

    const camera = new THREE.PerspectiveCamera(60, rect.width / rect.height, 0.1, 500);
    // var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
    // window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);//-40, 40);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // var svgRenderer = new THREE.SVGRenderer();
    let controls;

    function setCameraX(sign) {
      controls.reset(new THREE.Vector3(sign, 0, 0));
    }
    function setCameraY(sign) {
      controls.reset(new THREE.Vector3(0, sign, 0));
    }
    function setCameraZ(sign) {
      controls.reset(new THREE.Vector3(0, 0, sign));
    }
    function setCameraIso() {
      controls.reset(new THREE.Vector3(1, 1, 1));
    }

    function resetCamera() {
      camera.zoom = 7;
      camera.fov = 100;
      // camera.lookAt(new THREE.Vector3(0,10,0));
      // camera.up = new THREE.Vector3(0,1,0);

      camera.updateProjectionMatrix();
      camera.position.x = 4;
      camera.position.y = 4;
      camera.position.z = 4;
      // camera.lookAt.x = 0;
      // camera.lookAt.y = 10;
      // camera.lookAt.z = 0;
      // camera.lookAt(new THREE.Vector3(100,100,100));
      // camera.lookAt({x:0, y:100, z:0});
      if (controls) setCameraIso();
    }

    function render() {
      if (globals.vrEnabled) {
        globals.vive.render();
        return;
      }
      renderer.render(scene, camera);
      if (globals.capturer) {
        if (globals.capturer === "png") {
          const canvas = globals.threeView.renderer.domElement;
          canvas.toBlob((blob) => {
            saveAs(blob, `${globals.screenRecordFilename}.png`);
          }, "image/png");
          globals.capturer = null;
          globals.shouldScaleCanvas = false;
          globals.shouldAnimateFoldPercent = false;
          globals.threeView.onWindowResize();
          return;
        }
        globals.capturer.capture(renderer.domElement);
      }
    }

    function loop() {
      if (globals.needsSync) {
        globals.model.sync();
      }
      if (globals.simNeedsSync) {
        globals.model.syncSolver();
      }
      if (globals.simulationRunning) globals.model.step();
      if (globals.vrEnabled) {
        render();
        return;
      }
      controls.update();
      render();
    }

    function startAnimation() {
      console.log("starting animation");
      renderer.setAnimationLoop(loop);
    }

    function pauseSimulation() {
      globals.simulationRunning = false;
      console.log("pausing simulation");
    }

    function startSimulation() {
      console.log("starting simulation");
      globals.simulationRunning = true;
    }

    function sceneAddModel(object) {
      modelWrapper.add(object);
    }

    function onWindowResize() {
      if (globals.vrEnabled) {
        globals.warn("Can't resize window when in VR mode.");
        return;
      }
      // camera.aspect = window.innerWidth / window.innerHeight;
      // const rect = document.getElementById("simulator-container")
      //   .getBoundingClientRect();
      // camera.aspect = rect.width / rect.height;
      camera.aspect = window.innerWidth / window.innerHeight;
      // camera.left = -window.innerWidth / 2;
      // camera.right = window.innerWidth / 2;
      // camera.top = window.innerHeight / 2;
      // camera.bottom = -window.innerHeight / 2;
      camera.updateProjectionMatrix();

      let scale = 1;
      if (globals.shouldScaleCanvas) scale = globals.capturerScale;
      // renderer.setSize(scale*window.innerWidth, scale*window.innerHeight);
      renderer.setSize(scale * window.innerWidth * 0.5, scale * window.innerHeight * 0.5);
      // console.log("new rect", rect.width, rect.height, scale);
      // renderer.setSize(scale*rect.width, scale*rect.height);
      controls.handleResize();
    }

    function enableCameraRotate(state) {
      controls.enabled = state;
      controls.enableRotate = state;
    }

    // function saveSVG() {
    //     // svgRenderer.setClearColor(0xffffff);
    //     svgRenderer.setSize(window.innerWidth,window.innerHeight);
    //     svgRenderer.sortElements = true;
    //     svgRenderer.sortObjects = true;
    //     svgRenderer.setQuality('high');
    //     svgRenderer.render(scene,camera);
    //     //get svg source.
    //     var serializer = new XMLSerializer();
    //     var source = serializer.serializeToString(svgRenderer.domElement);
    //
    //     //add name spaces.
    //     if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    //         source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    //     }
    //     if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    //         source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    //     }
    //
    //     //add xml declaration
    //     source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    //
    //     var svgBlob = new Blob([source], {type:"image/svg+xml;charset=utf-8"});
    //     var svgUrl = URL.createObjectURL(svgBlob);
    //     var downloadLink = document.createElement("a");
    //     downloadLink.href = svgUrl;
    //     downloadLink.download = globals.filename + " : "
    //       + parseInt(globals.creasePercent*100) +  "PercentFolded.svg";
    //     document.body.appendChild(downloadLink);
    //     downloadLink.click();
    //     document.body.removeChild(downloadLink);
    // }

    function resetModel() {
      modelWrapper.rotation.set(0, 0, 0);
    }

    function setBackgroundColor(color = globals.backgroundColor) {
      scene.background.setStyle(`#${color}`);
    }

    function init() {
      // const container = $("#simulator-container");
      // const rect = document.querySelector("#simulator-container")
      //   .getBoundingClientRect();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(rect.width, rect.height);
      container.append(renderer.domElement);

      scene.background = new THREE.Color(0xffffff); // new THREE.Color(0xe6e6e6);
      setBackgroundColor();
      scene.add(modelWrapper);

      // shining from above
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
      directionalLight1.position.set(100, 100, 100);
      scene.add(directionalLight1);

      // shining from below
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight2.position.set(0, -100, 0);
      scene.add(directionalLight2);

      const spotLight1 = new THREE.SpotLight(0xffffff, 0.3);
      spotLight1.position.set(0, 100, 200);
      scene.add(spotLight1);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);

      scene.add(camera);

      resetCamera();

      controls = new TrackballControls(camera, renderer.domElement);
      controls.rotateSpeed = 4.0;
      controls.zoomSpeed = 15;
      controls.noPan = true;
      controls.staticMoving = true;
      controls.dynamicDampingFactor = 0.3;
      controls.minDistance = 0.1;
      controls.maxDistance = 30;

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      render(); // render before model loads

      directionalLight1.castShadow = true;
      directionalLight1.shadow.mapSize.width = 2048;
      directionalLight1.shadow.mapSize.height = 2048;
      directionalLight1.shadow.camera.near = 0.5;
      directionalLight1.shadow.camera.far = 500;
    }

    init();

    return {
      sceneAddModel,
      onWindowResize,

      startAnimation,
      startSimulation,
      pauseSimulation,

      enableCameraRotate, // user interaction
      scene,
      camera, // needed for user interaction
      renderer, // needed for VR
      modelWrapper,

      // saveSVG, // svg screenshot

      setCameraX,
      setCameraY,
      setCameraZ,
      setCameraIso,

      resetModel, // reset model orientation
      resetCamera,
      setBackgroundColor
    };
  }

  /**
   * Created by ghassaei on 9/16/16.
   */

  // import * as THREE from "../import/three.module";
  const THREE$1 = window.THREE || require("three");

  const nodeMaterial = new THREE$1.MeshBasicMaterial({ color: 0x000000, side:THREE$1.DoubleSide });
  const transparentMaterial = new THREE$1.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
  const transparentVRMaterial = new THREE$1.MeshBasicMaterial({ color: 0xffffff, opacity: 0.8, transparent: true });

  const nodeGeo = new THREE$1.SphereGeometry(0.02, 20);

  function Node(globals, position, index) {
    this.type = "node";
    this.index = index;
    this.globals = globals;
    this._originalPosition = position.clone();

    this.beams = [];
    this.creases = [];
    this.invCreases = [];
    this.externalForce = null;
    this.fixed = false;

    // this.render(new THREE.Vector3(0,0,0));
  }

  Node.prototype.setFixed = function (fixed) {
    this.fixed = fixed;
    // if (fixed) {
    //     this.object3D.material = nodeMaterialFixed;
    //     this.object3D.geometry = nodeFixedGeo;
    //     if (this.externalForce) this.externalForce.hide();
    // }
    // else {
    //     this.object3D.material = nodeMaterial;
    //     this.object3D.geometry = nodeGeo;
    //     if (this.externalForce) this.externalForce.show();
    // }
  };

  Node.prototype.isFixed = function () {
    return this.fixed;
  };


  // forces

  Node.prototype.addExternalForce = function (force) {
    // this.externalForce = force;
    // var position = this.getOriginalPosition();
    // this.externalForce.setOrigin(position);
    // if (this.fixed) this.externalForce.hide();
  };

  Node.prototype.getExternalForce = function () {
    if (!this.externalForce) return new THREE$1.Vector3(0, 0, 0);
    return this.externalForce.getForce();
  };

  Node.prototype.addCrease = function (crease) {
    this.creases.push(crease);
  };

  Node.prototype.removeCrease = function (crease) {
    if (this.creases === null) return;
    const index = this.creases.indexOf(crease);
    if (index >= 0) this.creases.splice(index, 1);
  };

  Node.prototype.addInvCrease = function (crease) {
    this.invCreases.push(crease);
  };

  Node.prototype.removeInvCrease = function (crease) {
    if (this.invCreases === null) return;
    const index = this.invCreases.indexOf(crease);
    if (index >= 0) this.invCreases.splice(index, 1);
  };


  Node.prototype.addBeam = function (beam) {
    this.beams.push(beam);
  };

  Node.prototype.removeBeam = function (beam) {
    if (this.beams === null) return;
    const index = this.beams.indexOf(beam);
    if (index >= 0) this.beams.splice(index, 1);
  };

  Node.prototype.getBeams = function () {
    return this.beams;
  };

  Node.prototype.numBeams = function () {
    return this.beams.length;
  };

  Node.prototype.isConnectedTo = function (node) {
    for (let i = 0; i < this.beams.length; i += 1) {
      if (this.beams[i].getOtherNode(this) == node) return true;
    }
    return false;
  };

  Node.prototype.numCreases = function () {
    return this.creases.length;
  };

  Node.prototype.getIndex = function () { // in nodes array
    return this.index;
  };

  Node.prototype.getObject3D = function () {
    return this.object3D;
  };

  // Node.prototype.highlight = function () {
  //     this.object3D.material = nodeMaterialHighlight;
  // };
  //
  // Node.prototype.unhighlight = function () {
  //     if (!this.object3D) return;
  //     if (this.fixed) {
  //         this.object3D.material = nodeMaterialFixed;
  //     }
  //     else {
  //         this.object3D.material = nodeMaterial;
  //     }
  // };

  Node.prototype.setTransparent = function () {
    if (!this.object3D) {
      this.object3D = new THREE$1.Mesh(nodeGeo, nodeMaterial);
      this.object3D.visible = false;
    }
    this.object3D.material = transparentMaterial;
  };

  Node.prototype.setTransparentVR = function () {
    if (!this.object3D) {
      this.object3D = new THREE$1.Mesh(nodeGeo, nodeMaterial);
      this.object3D.visible = false;
    }
    this.object3D.material = transparentVRMaterial;
    this.object3D.scale.set(0.4, 0.4, 0.4);
  };

  // Node.prototype.hide = function () {
  //     this.object3D.visible = false;
  // };

  // Node.prototype.render = function (position) {
  // if (this.fixed) return;
  // position.add(this.getOriginalPosition());
  // console.log(position);
  // this.object3D.position.set(position.x, position.y, position.z);
  // return position;
  // };
  // Node.prototype.renderDelta = function (delta) {
  //     // if (this.fixed) return;
  //     this.object3D.position.add(delta);
  //     return this.object3D.position;
  // };

  // Node.prototype.renderChange = function (change) {
  //     this.object3D.position.add(change);
  // };


  // dynamic solve

  Node.prototype.getOriginalPosition = function () {
    return this._originalPosition.clone();
  };
  Node.prototype.setOriginalPosition = function (x, y, z) {
    this._originalPosition.set(x, y, z);
  };

  Node.prototype.getPosition = function () {
    const positions = this.globals.model.getPositionsArray();
    const i = this.getIndex();
    return new THREE$1.Vector3(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]);
  };

  Node.prototype.moveManually = function (position) {
    const positions = this.globals.model.getPositionsArray();
    const i = this.getIndex();
    positions[3 * i] = position.x;
    positions[3 * i + 1] = position.y;
    positions[3 * i + 2] = position.z;
  };

  Node.prototype.getRelativePosition = function () {
    return this.getPosition().sub(this._originalPosition);
  };

  Node.prototype.getSimMass = function () {
    return 1;
  };


  // deallocate

  Node.prototype.destroy = function () {
    // object3D is removed in outer scope
    this.object3D = null;
    this.beams = null;
    this.creases = null;
    this.invCreases = null;
    this.externalForce = null;
  };

  const isBrowser = function () {
    return typeof window !== "undefined";
  };

  const isNode = function () {
    return typeof window === "undefined" && typeof process !== "undefined";
  };

  // get DOMParser and XMLSerializer from the browser or from Node

  const htmlString = "<!DOCTYPE html><title> </title>";
  const win = {};

  if (isNode()) {
    const { DOMParser, XMLSerializer } = require("xmldom");
    win.DOMParser = DOMParser;
    win.XMLSerializer = XMLSerializer;
    win.document = new DOMParser().parseFromString(htmlString, "text/html");
  } else if (isBrowser()) {
    win.DOMParser = window.DOMParser;
    win.XMLSerializer = window.XMLSerializer;
    win.document = window.document;
  }

  /**
   * Created by amandaghassaei on 5/5/17.
   */

  const THREE$2 = window.THREE || require("three");

  function init3DUI(globals) {
    const raycaster = new THREE$2.Raycaster();
    const mouse = new THREE$2.Vector2();
    const raycasterPlane = new THREE$2.Plane(new THREE$2.Vector3(0, 0, 1));
    let isDragging = false;
    let draggingNode = null;
    let draggingNodeFixed = false;
    let mouseDown = false;
    let highlightedObj;

    const highlighter1 = new Node(globals, new THREE$2.Vector3());
    highlighter1.setTransparent();
    globals.threeView.scene.add(highlighter1.getObject3D());

    function setHighlightedObj(object) {
      if (highlightedObj && (object != highlightedObj)) {
        // highlightedObj.unhighlight();
        highlighter1.getObject3D().visible = false;
      }
      highlightedObj = object;
      if (highlightedObj) {
        // highlightedObj.highlight();
        highlighter1.getObject3D().visible = true;
      }
    }

    win.document.addEventListener("mousedown", (e) => {
      mouseDown = true;

      if (globals.touchMode === "grab") {
        // let bounds = e.target.getBoundingClientRect();
        // i know what we're targeting. target it directly
        const bounds = globals.append.getBoundingClientRect();
        // e.preventDefault();
        // mouse.x = (e.clientX/window.innerWidth)*2-1;
        // mouse.y = - (e.clientY/window.innerHeight)*2+1;
        mouse.x = ((e.clientX - bounds.x) / bounds.width) * 2 - 1;
        mouse.y = -((e.clientY - bounds.y) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(mouse, globals.threeView.camera);

        const obj = checkForIntersections(e, globals.model.getMesh());
        setHighlightedObj(obj);

        if (highlightedObj) {
          draggingNode = highlightedObj;
          draggingNodeFixed = draggingNode.isFixed();
          draggingNode.setFixed(true);
          globals.fixedHasChanged = true;
          globals.threeView.enableCameraRotate(false);
        } else {
          // clicked somewhere outside the origami, temp switch to rotate mode
          globals.threeView.enableCameraRotate(true);
        }
      }
    }, false);

    win.document.addEventListener("mouseup", () => {
      isDragging = false;
      if (draggingNode) {
        draggingNode.setFixed(draggingNodeFixed);
        draggingNode = null;
        globals.fixedHasChanged = true;
        setHighlightedObj(null);
        globals.shouldCenterGeo = true;
      }
      if (globals.touchMode === "grab") {
        // grab mode temporarily becomes rotate when clicking outside object
        globals.threeView.enableCameraRotate(false);
      }
      mouseDown = false;
    }, false);
    win.document.addEventListener("mousemove", mouseMove, false);
    function mouseMove(e) {
      if (mouseDown) {
        isDragging = true;
      }
      // if (!globals.userInteractionEnabled) return;
      if (globals.touchMode === "rotate") { return; }

      if (isDragging) {
        if (highlightedObj) {
          const bounds = globals.append.getBoundingClientRect();
          mouse.x = ((e.clientX - bounds.x) / bounds.width) * 2 - 1;
          mouse.y = -((e.clientY - bounds.y) / bounds.height) * 2 + 1;
          raycaster.setFromCamera(mouse, globals.threeView.camera);
          const intersection = getIntersectionWithObjectPlane(highlightedObj.getPosition().clone());
          highlightedObj.moveManually(intersection);
          globals.nodePositionHasChanged = true;
        }
      } else {
        const bounds = globals.append.getBoundingClientRect();
        mouse.x = ((e.clientX - bounds.x) / bounds.width) * 2 - 1;
        mouse.y = -((e.clientY - bounds.y) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(mouse, globals.threeView.camera);
        const obj = checkForIntersections(e, globals.model.getMesh());
        setHighlightedObj(obj);
      }
      if (highlightedObj) {
        const position = highlightedObj.getPosition();
        highlighter1.getObject3D().position.set(position.x, position.y, position.z);
      }
    }

    function getIntersectionWithObjectPlane(position) {
      const cameraOrientation = globals.threeView.camera.getWorldDirection();
      const dist = position.dot(cameraOrientation);
      raycasterPlane.set(cameraOrientation, -dist);
      const intersection = new THREE$2.Vector3();
      raycaster.ray.intersectPlane(raycasterPlane, intersection);
      return intersection;
    }

    function checkForIntersections(e, objects) {
      let _highlightedObj = null;
      const intersections = raycaster.intersectObjects(objects, false);
      if (intersections.length > 0) {
        const face = intersections[0].face;
        const position = intersections[0].point;
        const positionsArray = globals.model.getPositionsArray();
        const vertices = [];
        vertices.push(new THREE$2.Vector3(
          positionsArray[3 * face.a],
          positionsArray[3 * face.a + 1],
          positionsArray[3 * face.a + 2]
        ));
        vertices.push(new THREE$2.Vector3(
          positionsArray[3 * face.b],
          positionsArray[3 * face.b + 1],
          positionsArray[3 * face.b + 2]
        ));
        vertices.push(new THREE$2.Vector3(
          positionsArray[3 * face.c],
          positionsArray[3 * face.c + 1],
          positionsArray[3 * face.c + 2]
        ));
        let dist = vertices[0].clone().sub(position).lengthSq();
        let nodeIndex = face.a;
        for (let i = 1; i < 3; i += 1) {
          const _dist = (vertices[i].clone().sub(position)).lengthSq();
          if (_dist < dist) {
            dist = _dist;
            if (i === 1) nodeIndex = face.b;
            else nodeIndex = face.c;
          }
        }
        const nodesArray = globals.model.getNodes();
        _highlightedObj = nodesArray[nodeIndex];
      }
      return _highlightedObj;
    }

    function hideHighlighters() {
      highlighter1.getObject3D().visible = false;
    }

    // globals.threeView.sceneAdd(raycasterPlane);

    return {
      hideHighlighters
    };
  }

  // from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

  function GLBoilerPlate() {
    /**
     * Creates and compiles a shader.
     *
     * @param {!WebGLRenderingContext} gl The WebGL Context.
     * @param {string} shaderSource The GLSL source code for the shader.
     * @param {number} shaderType The type of shader, VERTEX_SHADER or
     *     FRAGMENT_SHADER.
     * @return {!WebGLShader} The shader.
     */
    function compileShader(gl, shaderSource, shaderType) {
      // Create the shader object
      const shader = gl.createShader(shaderType);

      // Set the shader source code.
      gl.shaderSource(shader, shaderSource);

      // Compile the shader
      gl.compileShader(shader);

      // Check if it compiled
      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
        // Something went wrong during compilation; get the error
        throw new Error(`could not compile shader: ${gl.getShaderInfoLog(shader)}`);
      }

      return shader;
    }

    /**
     * Creates a program from 2 shaders.
     *
     * @param {!WebGLRenderingContext) gl The WebGL context.
     * @param {!WebGLShader} vertexShader A vertex shader.
     * @param {!WebGLShader} fragmentShader A fragment shader.
     * @return {!WebGLProgram} A program.
     */
    function createProgram(gl, vertexShader, fragmentShader) {
      // create a program.
      const program = gl.createProgram();

      // attach the shaders.
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);

      // link the program.
      gl.linkProgram(program);

      // Check if it linked.
      const success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!success) {
        // something went wrong with the link
        throw new Error(`program filed to link: ${gl.getProgramInfoLog(program)}`);
      }

      return program;
    }

    /**
     * Creates a shader from the content of a script tag.
     *
     * @param {!WebGLRenderingContext} gl The WebGL Context.
     * @param {string} scriptId The id of the script tag.
     * @param {string} opt_shaderType. The type of shader to create.
     *     If not passed in will use the type attribute from the
     *     script tag.
     * @return {!WebGLShader} A shader.
     */
    function createShaderFromSource(gl, shaderSource, shaderType) {
      return compileShader(gl, shaderSource, shaderType);
    }

    /**
     * Creates a program from 2 script tags.
     *
     * @param {!WebGLRenderingContext} gl The WebGL Context.
     * @param {string} vertexShaderId The id of the vertex shader script tag.
     * @param {string} fragmentShaderId The id of the fragment shader script tag.
     * @return {!WebGLProgram} A program
     */
    function createProgramFromSource(gl, vertexShaderSrc, fragmentShaderSrc) {
      const vertexShader = createShaderFromSource(gl, vertexShaderSrc, gl.VERTEX_SHADER);
      const fragmentShader = createShaderFromSource(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);
      return createProgram(gl, vertexShader, fragmentShader);
    }

    function loadVertexData(gl, program) {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

      // look up where the vertex data needs to go.
      const positionLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    }

    function makeTexture(gl, width, height, type, data) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, type, data);

      return texture;
    }

    return {
      createProgramFromSource,
      loadVertexData,
      makeTexture
    };
  }

  /**
   * Created by ghassaei on 2/24/16.
   */

  function initGPUMath() {
    const glBoilerplate = GLBoilerPlate();

    const canvas = win.document.createElement("canvas");
    canvas.setAttribute("style", "display:none;");
    canvas.setAttribute("class", "gpuMathCanvas");
    win.document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", { antialias: false }) || canvas.getContext("experimental-webgl", { antialias: false });
    const floatTextures = gl.getExtension("OES_texture_float");

    function notSupported() {
      console.warn("floating point textures are not supported on your system");
    }

    if (!floatTextures) {
      notSupported();
    }
    gl.disable(gl.DEPTH_TEST);

    const maxTexturesInFragmentShader = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    console.log(`${maxTexturesInFragmentShader} textures max`);


    function GPUMath() {
      this.reset();
    }

    GPUMath.prototype.createProgram = function (programName, vertexShader, fragmentShader) {
      const programs = this.programs;
      let program = programs[programName];
      if (program) {
        gl.useProgram(program.program);
        // console.warn("already a program with the name " + programName);
        return;
      }
      program = glBoilerplate.createProgramFromSource(gl, vertexShader, fragmentShader);
      gl.useProgram(program);
      glBoilerplate.loadVertexData(gl, program);
      programs[programName] = {
        program,
        uniforms: {}
      };
    };

    GPUMath.prototype.initTextureFromData = function (
      name, width, height, typeName, data, shouldReplace
    ) {
      let texture = this.textures[name];

      if (texture) {
        if (!shouldReplace) {
          console.warn(`already a texture with the name ${name}`);
          return;
        }
        gl.deleteTexture(texture);
      }
      texture = glBoilerplate.makeTexture(gl, width, height, gl[typeName], data);
      this.textures[name] = texture;
    };


    GPUMath.prototype.initFrameBufferForTexture = function (textureName, shouldReplace) {
      let framebuffer = this.frameBuffers[textureName];
      if (framebuffer) {
        if (!shouldReplace) {
          console.warn(`framebuffer already exists for texture ${textureName}`);
          return;
        }
        gl.deleteFramebuffer(framebuffer);
      }
      const texture = this.textures[textureName];
      if (!texture) {
        console.warn(`texture ${textureName} does not exist`);
        return;
      }

      framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      const check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (check !== gl.FRAMEBUFFER_COMPLETE) {
        notSupported();
      }

      this.frameBuffers[textureName] = framebuffer;
    };


    GPUMath.prototype.setUniformForProgram = function (programName, name, val, type) {
      if (!this.programs[programName]) {
        console.warn("no program with name " + programName);
        return;
      }
      let uniforms = this.programs[programName].uniforms;
      let location = uniforms[name];
      if (!location) {
        location = gl.getUniformLocation(this.programs[programName].program, name);
        uniforms[name] = location;
      }
      if (type === "1f") gl.uniform1f(location, val);
      else if (type === "2f") gl.uniform2f(location, val[0], val[1]);
      else if (type === "3f") gl.uniform3f(location, val[0], val[1], val[2]);
      else if (type === "1i") gl.uniform1i(location, val);
      else {
        console.warn(`no uniform for type ${type}`);
      }
    };

    GPUMath.prototype.setSize = function (width, height) {
      gl.viewport(0, 0, width, height);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    GPUMath.prototype.setProgram = function (programName) {
      let program = this.programs[programName];
      if (program) gl.useProgram(program.program);
    };

    GPUMath.prototype.step = function (programName, inputTextures, outputTexture, time) {

      gl.useProgram(this.programs[programName].program);
      if (time) this.setUniformForProgram(programName, "u_time", time, "1f");
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[outputTexture]);
      for (let i = 0; i < inputTextures.length; i += 1) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);//draw to framebuffer
    };

    GPUMath.prototype.swapTextures = function (texture1Name, texture2Name) {
      let temp = this.textures[texture1Name];
      this.textures[texture1Name] = this.textures[texture2Name];
      this.textures[texture2Name] = temp;
      temp = this.frameBuffers[texture1Name];
      this.frameBuffers[texture1Name] = this.frameBuffers[texture2Name];
      this.frameBuffers[texture2Name] = temp;
    };

    GPUMath.prototype.swap3Textures = function (texture1Name, texture2Name, texture3Name) {
      let temp = this.textures[texture3Name];
      this.textures[texture3Name] = this.textures[texture2Name];
      this.textures[texture2Name] = this.textures[texture1Name];
      this.textures[texture1Name] = temp;
      temp = this.frameBuffers[texture3Name];
      this.frameBuffers[texture3Name] = this.frameBuffers[texture2Name];
      this.frameBuffers[texture2Name] = this.frameBuffers[texture1Name];
      this.frameBuffers[texture1Name] = temp;
    };

    GPUMath.prototype.readyToRead = function () {
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    };

    GPUMath.prototype.readPixels = function (xMin, yMin, width, height, array) {
      gl.readPixels(xMin, yMin, width, height, gl.RGBA, gl.UNSIGNED_BYTE, array);
    };

    GPUMath.prototype.reset = function () {
      this.programs = {};
      this.frameBuffers = {};
      this.textures = {};
      this.index = 0;
    };

    return new GPUMath();
  }

  var vertexShader = "attribute vec2 a_position;\nvoid main() {\n   gl_Position = vec4(a_position, 0, 1);\n}\n";

  var positionCalcShader = "precision mediump float;\nuniform vec2 u_textureDim;\nuniform float u_dt;\nuniform sampler2D u_lastPosition;\nuniform sampler2D u_velocity;\nuniform sampler2D u_mass;\n\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDim;\n\n  vec3 lastPosition = texture2D(u_lastPosition, scaledFragCoord).xyz;\n\n  float isFixed = texture2D(u_mass, scaledFragCoord).y;\n  if (isFixed == 1.0){\n    gl_FragColor = vec4(lastPosition, 0.0);\n    return;\n  }\n\n  vec4 velocityData = texture2D(u_velocity, scaledFragCoord);\n  vec3 position = velocityData.xyz*u_dt + lastPosition;\n  gl_FragColor = vec4(position, velocityData.a);//velocity.a has error info\n}\n";

  var velocityCalcVerletShader = "precision mediump float;\nuniform vec2 u_textureDim;\nuniform float u_dt;\nuniform sampler2D u_position;\nuniform sampler2D u_lastPosition;\nuniform sampler2D u_mass;\n\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDim;\n\n  float isFixed = texture2D(u_mass, scaledFragCoord).y;\n  if (isFixed == 1.0){\n    gl_FragColor = vec4(0.0);\n    return;\n  }\n\n  vec3 position = texture2D(u_position, scaledFragCoord).xyz;\n  vec3 lastPosition = texture2D(u_lastPosition, scaledFragCoord).xyz;\n  gl_FragColor = vec4((position-lastPosition)/u_dt,0.0);\n}\n";

  var velocityCalcShader = "precision mediump float;\nuniform vec2 u_textureDim;\nuniform vec2 u_textureDimEdges;\nuniform vec2 u_textureDimFaces;\nuniform vec2 u_textureDimCreases;\nuniform vec2 u_textureDimNodeCreases;\nuniform vec2 u_textureDimNodeFaces;\nuniform float u_creasePercent;\nuniform float u_dt;\nuniform float u_axialStiffness;\nuniform float u_faceStiffness;\nuniform sampler2D u_lastPosition;\nuniform sampler2D u_lastVelocity;\nuniform sampler2D u_originalPosition;\nuniform sampler2D u_externalForces;\nuniform sampler2D u_mass;\nuniform sampler2D u_meta;//[beamsIndex, numBeam, nodeCreaseMetaIndex, numCreases]\nuniform sampler2D u_beamMeta;//[k, d, length, otherNodeIndex]\nuniform sampler2D u_creaseMeta;//[k, d, targetTheta]\nuniform sampler2D u_nodeCreaseMeta;//[creaseIndex, nodeIndex, -, -]\nuniform sampler2D u_normals;\nuniform sampler2D u_theta;//[theta, z, normal1Index, normal2Index]\nuniform sampler2D u_creaseGeo;//[h1, h2, coef1, coef2]\nuniform sampler2D u_meta2;//[nodesFaceIndex, numFaces]\nuniform sampler2D u_nodeFaceMeta;//[faceIndex, a, b, c]\nuniform sampler2D u_nominalTriangles;//[angleA, angleB, angleC]\nuniform bool u_calcFaceStrain;\n\nvec4 getFromArray(float index1D, vec2 dimensions, sampler2D tex){\n  vec2 index = vec2(mod(index1D, dimensions.x)+0.5, floor(index1D/dimensions.x)+0.5);\n  vec2 scaledIndex = index/dimensions;\n  return texture2D(tex, scaledIndex);\n}\n\nvec3 getPosition(float index1D){\n  vec2 index = vec2(mod(index1D, u_textureDim.x)+0.5, floor(index1D/u_textureDim.x)+0.5);\n  vec2 scaledIndex = index/u_textureDim;\n  return texture2D(u_lastPosition, scaledIndex).xyz + texture2D(u_originalPosition, scaledIndex).xyz;\n}\n\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDim;\n\n  vec2 mass = texture2D(u_mass, scaledFragCoord).xy;\n  if (mass[1] == 1.0){//fixed\n    gl_FragColor = vec4(0.0);\n    return;\n  }\n  vec3 force = texture2D(u_externalForces, scaledFragCoord).xyz;\n  vec3 lastPosition = texture2D(u_lastPosition, scaledFragCoord).xyz;\n  vec3 lastVelocity = texture2D(u_lastVelocity, scaledFragCoord).xyz;\n  vec3 originalPosition = texture2D(u_originalPosition, scaledFragCoord).xyz;\n\n  vec4 neighborIndices = texture2D(u_meta, scaledFragCoord);\n  vec4 meta = texture2D(u_meta, scaledFragCoord);\n  vec2 meta2 = texture2D(u_meta2, scaledFragCoord).xy;\n\n  float nodeError = 0.0;\n\n  for (int j=0;j<100;j++){//for all beams (up to 100, had to put a const int in here)\n    if (j >= int(meta[1])) break;\n\n    vec4 beamMeta = getFromArray(meta[0]+float(j), u_textureDimEdges, u_beamMeta);\n\n    float neighborIndex1D = beamMeta[3];\n    vec2 neighborIndex = vec2(mod(neighborIndex1D, u_textureDim.x)+0.5, floor(neighborIndex1D/u_textureDim.x)+0.5);\n    vec2 scaledNeighborIndex = neighborIndex/u_textureDim;\n    vec3 neighborLastPosition = texture2D(u_lastPosition, scaledNeighborIndex).xyz;\n    vec3 neighborLastVelocity = texture2D(u_lastVelocity, scaledNeighborIndex).xyz;\n    vec3 neighborOriginalPosition = texture2D(u_originalPosition, scaledNeighborIndex).xyz;\n\n    vec3 nominalDist = neighborOriginalPosition-originalPosition;\n    vec3 deltaP = neighborLastPosition-lastPosition+nominalDist;\n    float deltaPLength = length(deltaP);\n    deltaP -= deltaP*(beamMeta[2]/deltaPLength);\n    if (!u_calcFaceStrain) nodeError += abs(deltaPLength/length(nominalDist) - 1.0);\n    vec3 deltaV = neighborLastVelocity-lastVelocity;\n\n    vec3 _force = deltaP*beamMeta[0] + deltaV*beamMeta[1];\n    force += _force;\n  }\n  if (!u_calcFaceStrain) nodeError /= meta[1];\n\n  for (int j=0;j<100;j++){//for all creases (up to 100, had to put a const int in here)\n    if (j >= int(meta[3])) break;\n\n    vec4 nodeCreaseMeta = getFromArray(meta[2]+float(j), u_textureDimNodeCreases, u_nodeCreaseMeta);\n\n    float creaseIndex1D = nodeCreaseMeta[0];\n    vec2 creaseIndex = vec2(mod(creaseIndex1D, u_textureDimCreases.x)+0.5, floor(creaseIndex1D/u_textureDimCreases.x)+0.5);\n    vec2 scaledCreaseIndex = creaseIndex/u_textureDimCreases;\n\n    vec4 thetas = texture2D(u_theta, scaledCreaseIndex);\n    vec3 creaseMeta = texture2D(u_creaseMeta, scaledCreaseIndex).xyz;//[k, d, targetTheta]\n    vec4 creaseGeo = texture2D(u_creaseGeo, scaledCreaseIndex);//[h1, h2, coef1, coef2]\n    if (creaseGeo[0]< 0.0) continue;//crease disabled bc it has collapsed too much\n\n    float targetTheta = creaseMeta[2] * u_creasePercent;\n    float angForce = creaseMeta[0]*(targetTheta-thetas[0]);// + creaseMeta[1]*thetas[1];\n\n    float nodeNum = nodeCreaseMeta[1];//1, 2, 3, 4\n\n    if (nodeNum > 2.0){//crease reaction, node is on a crease\n\n      //node #1\n      vec3 normal1 = getFromArray(thetas[2], u_textureDimFaces, u_normals).xyz;\n\n      //node #2\n      vec3 normal2 = getFromArray(thetas[3], u_textureDimFaces, u_normals).xyz;\n\n      float coef1 = creaseGeo[2];\n      float coef2 = creaseGeo[3];\n\n      if (nodeNum == 3.0){\n        coef1 = 1.0-coef1;\n        coef2 = 1.0-coef2;\n      }\n\n      vec3 _force = -angForce*(coef1/creaseGeo[0]*normal1 + coef2/creaseGeo[1]*normal2);\n      force += _force;\n\n    } else {\n\n      float normalIndex1D = thetas[2];//node #1\n      float momentArm = creaseGeo[0];//node #1\n      if (nodeNum == 2.0) {\n        normalIndex1D = thetas[3];//node #2\n        momentArm = creaseGeo[1];//node #2\n      }\n\n      vec3 normal = getFromArray(normalIndex1D, u_textureDimFaces, u_normals).xyz;\n\n      vec3 _force = angForce/momentArm*normal;\n      force += _force;\n    }\n  }\n\n  for (int j=0;j<100;j++){//for all faces (up to 100, had to put a const int in here)\n    if (j >= int(meta2[1])) break;\n\n    vec4 faceMeta = getFromArray(meta2[0]+float(j), u_textureDimNodeFaces, u_nodeFaceMeta);//[face index, a, b, c]\n    vec3 nominalAngles = getFromArray(faceMeta[0], u_textureDimFaces, u_nominalTriangles).xyz;//[angA, angB, angC]\n\n    int faceIndex = 0;\n    if (faceMeta[2] < 0.0) faceIndex = 1;\n    if (faceMeta[3] < 0.0) faceIndex = 2;\n\n    //get node positions\n    vec3 a = faceIndex == 0 ? lastPosition+originalPosition : getPosition(faceMeta[1]);\n    vec3 b = faceIndex == 1 ? lastPosition+originalPosition : getPosition(faceMeta[2]);\n    vec3 c = faceIndex == 2 ? lastPosition+originalPosition : getPosition(faceMeta[3]);\n\n    //calc angles\n    vec3 ab = b-a;\n    vec3 ac = c-a;\n    vec3 bc = c-b;\n\n    float lengthAB = length(ab);\n    float lengthAC = length(ac);\n    float lengthBC = length(bc);\n\n    float tol = 0.0000001;\n    if (abs(lengthAB) < tol || abs(lengthBC) < tol || abs(lengthAC) < tol) continue;\n\n    ab /= lengthAB;\n    ac /= lengthAC;\n    bc /= lengthBC;\n\n    vec3 angles = vec3(acos(dot(ab, ac)),\n      acos(-1.0*dot(ab, bc)),\n      acos(dot(ac, bc)));\n    vec3 anglesDiff = nominalAngles-angles;\n\n    vec3 normal = getFromArray(faceMeta[0], u_textureDimFaces, u_normals).xyz;\n\n    //calc forces\n    anglesDiff *= u_faceStiffness;\n    if (faceIndex == 0){//a\n      vec3 normalCrossAC = cross(normal, ac)/lengthAC;\n      vec3 normalCrossAB = cross(normal, ab)/lengthAB;\n      force -= anglesDiff[0]*(normalCrossAC - normalCrossAB);\n      if (u_calcFaceStrain) nodeError += abs((nominalAngles[0]-angles[0])/nominalAngles[0]);\n      force -= anglesDiff[1]*normalCrossAB;\n      force += anglesDiff[2]*normalCrossAC;\n    } else if (faceIndex == 1){\n      vec3 normalCrossAB = cross(normal, ab)/lengthAB;\n      vec3 normalCrossBC = cross(normal, bc)/lengthBC;\n      force -= anglesDiff[0]*normalCrossAB;\n      force += anglesDiff[1]*(normalCrossAB + normalCrossBC);\n      if (u_calcFaceStrain) nodeError += abs((nominalAngles[1]-angles[1])/nominalAngles[1]);\n      force -= anglesDiff[2]*normalCrossBC;\n    } else if (faceIndex == 2){\n      vec3 normalCrossAC = cross(normal, ac)/lengthAC;\n      vec3 normalCrossBC = cross(normal, bc)/lengthBC;\n      force += anglesDiff[0]*normalCrossAC;\n      force -= anglesDiff[1]*normalCrossBC;\n      force += anglesDiff[2]*(normalCrossBC - normalCrossAC);\n      if (u_calcFaceStrain) nodeError += abs((nominalAngles[2]-angles[2])/nominalAngles[2]);\n    }\n\n  }\n  if (u_calcFaceStrain) nodeError /= meta2[1];\n\n  vec3 velocity = force*u_dt/mass[0] + lastVelocity;\n  gl_FragColor = vec4(velocity,nodeError);\n}\n";

  var positionCalcVerletShader = "precision mediump float;\nuniform vec2 u_textureDim;\nuniform vec2 u_textureDimEdges;\nuniform vec2 u_textureDimFaces;\nuniform vec2 u_textureDimCreases;\nuniform vec2 u_textureDimNodeCreases;\nuniform vec2 u_textureDimNodeFaces;\nuniform float u_creasePercent;\nuniform float u_dt;\nuniform float u_axialStiffness;\nuniform float u_faceStiffness;\nuniform sampler2D u_lastPosition;\nuniform sampler2D u_lastLastPosition;\nuniform sampler2D u_lastVelocity;\nuniform sampler2D u_originalPosition;\nuniform sampler2D u_externalForces;\nuniform sampler2D u_mass;\nuniform sampler2D u_meta;//[beamsIndex, numBeam, nodeCreaseMetaIndex, numCreases]\nuniform sampler2D u_beamMeta;//[k, d, length, otherNodeIndex]\nuniform sampler2D u_creaseMeta;//[k, d, targetTheta]\nuniform sampler2D u_nodeCreaseMeta;//[creaseIndex, nodeIndex, -, -]\nuniform sampler2D u_normals;\nuniform sampler2D u_theta;//[theta, z, normal1Index, normal2Index]\nuniform sampler2D u_creaseGeo;//[h1, h2, coef1, coef2]\nuniform sampler2D u_meta2;//[nodesFaceIndex, numFaces]\nuniform sampler2D u_nodeFaceMeta;//[faceIndex, a, b, c]\nuniform sampler2D u_nominalTriangles;//[angleA, angleB, angleC]\n\nvec4 getFromArray(float index1D, vec2 dimensions, sampler2D tex){\n  vec2 index = vec2(mod(index1D, dimensions.x)+0.5, floor(index1D/dimensions.x)+0.5);\n  vec2 scaledIndex = index/dimensions;\n  return texture2D(tex, scaledIndex);\n}\n\nvec3 getPosition(float index1D){\n  vec2 index = vec2(mod(index1D, u_textureDim.x)+0.5, floor(index1D/u_textureDim.x)+0.5);\n  vec2 scaledIndex = index/u_textureDim;\n  return texture2D(u_lastPosition, scaledIndex).xyz + texture2D(u_originalPosition, scaledIndex).xyz;\n}\n\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDim;\n\n  vec3 lastPosition = texture2D(u_lastPosition, scaledFragCoord).xyz;\n\n  vec2 mass = texture2D(u_mass, scaledFragCoord).xy;\n  if (mass[1] == 1.0){//fixed\n    gl_FragColor = vec4(lastPosition, 0.0);\n    return;\n  }\n  vec3 force = texture2D(u_externalForces, scaledFragCoord).xyz;\n  vec3 lastLastPosition = texture2D(u_lastLastPosition, scaledFragCoord).xyz;\n  vec3 lastVelocity = texture2D(u_lastVelocity, scaledFragCoord).xyz;\n  vec3 originalPosition = texture2D(u_originalPosition, scaledFragCoord).xyz;\n\n  vec4 neighborIndices = texture2D(u_meta, scaledFragCoord);\n  vec4 meta = texture2D(u_meta, scaledFragCoord);\n  vec2 meta2 = texture2D(u_meta2, scaledFragCoord).xy;\n\n  float nodeError = 0.0;\n\n  for (int j=0;j<100;j++){//for all beams (up to 100, had to put a const int in here)\n    if (j >= int(meta[1])) break;\n\n    vec4 beamMeta = getFromArray(meta[0]+float(j), u_textureDimEdges, u_beamMeta);\n\n    float neighborIndex1D = beamMeta[3];\n    vec2 neighborIndex = vec2(mod(neighborIndex1D, u_textureDim.x)+0.5, floor(neighborIndex1D/u_textureDim.x)+0.5);\n    vec2 scaledNeighborIndex = neighborIndex/u_textureDim;\n    vec3 neighborLastPosition = texture2D(u_lastPosition, scaledNeighborIndex).xyz;\n    vec3 neighborLastVelocity = texture2D(u_lastVelocity, scaledNeighborIndex).xyz;\n    vec3 neighborOriginalPosition = texture2D(u_originalPosition, scaledNeighborIndex).xyz;\n\n    vec3 deltaP = neighborLastPosition+neighborOriginalPosition-lastPosition-originalPosition;\n    float deltaPLength = length(deltaP);\n    float nominalLength = beamMeta[2];\n    deltaP *= (1.0-nominalLength/deltaPLength);\n    nodeError += abs(deltaPLength/nominalLength - 1.0);\n    vec3 deltaV = neighborLastVelocity-lastVelocity;\n\n    vec3 _force = deltaP*beamMeta[0] + deltaV*beamMeta[1];\n    force += _force;\n  }\n  nodeError /= meta[1];\n\n  for (int j=0;j<100;j++){//for all creases (up to 100, had to put a const int in here)\n    if (j >= int(meta[3])) break;\n\n    vec4 nodeCreaseMeta = getFromArray(meta[2]+float(j), u_textureDimNodeCreases, u_nodeCreaseMeta);\n\n    float creaseIndex1D = nodeCreaseMeta[0];\n    vec2 creaseIndex = vec2(mod(creaseIndex1D, u_textureDimCreases.x)+0.5, floor(creaseIndex1D/u_textureDimCreases.x)+0.5);\n    vec2 scaledCreaseIndex = creaseIndex/u_textureDimCreases;\n\n    vec4 thetas = texture2D(u_theta, scaledCreaseIndex);\n    vec3 creaseMeta = texture2D(u_creaseMeta, scaledCreaseIndex).xyz;//[k, d, targetTheta]\n    vec4 creaseGeo = texture2D(u_creaseGeo, scaledCreaseIndex);//[h1, h2, coef1, coef2]\n    if (creaseGeo[0]< 0.0) continue;//crease disabled bc it has collapsed too much\n\n    float targetTheta = creaseMeta[2] * u_creasePercent;\n    float angForce = creaseMeta[0]*(targetTheta-thetas[0]);// + creaseMeta[1]*thetas[1];\n\n    float nodeNum = nodeCreaseMeta[1];//1, 2, 3, 4\n\n    if (nodeNum > 2.0){//crease reaction, node is on a crease\n\n      //node #1\n      vec3 normal1 = getFromArray(thetas[2], u_textureDimFaces, u_normals).xyz;\n\n      //node #2\n      vec3 normal2 = getFromArray(thetas[3], u_textureDimFaces, u_normals).xyz;\n\n      float coef1 = creaseGeo[2];\n      float coef2 = creaseGeo[3];\n\n      if (nodeNum == 3.0){\n        coef1 = 1.0-coef1;\n        coef2 = 1.0-coef2;\n      }\n\n      vec3 _force = -angForce*(coef1/creaseGeo[0]*normal1 + coef2/creaseGeo[1]*normal2);\n      force += _force;\n\n    } else {\n\n      float normalIndex1D = thetas[2];//node #1\n      float momentArm = creaseGeo[0];//node #1\n      if (nodeNum == 2.0) {\n        normalIndex1D = thetas[3];//node #2\n        momentArm = creaseGeo[1];//node #2\n      }\n\n      vec3 normal = getFromArray(normalIndex1D, u_textureDimFaces, u_normals).xyz;\n\n      vec3 _force = angForce/momentArm*normal;\n      force += _force;\n    }\n  }\n\n  for (int j=0;j<100;j++){//for all faces (up to 100, had to put a const int in here)\n    if (j >= int(meta2[1])) break;\n\n    vec4 faceMeta = getFromArray(meta2[0]+float(j), u_textureDimNodeFaces, u_nodeFaceMeta);//[face index, a, b, c]\n    vec3 nominalAngles = getFromArray(faceMeta[0], u_textureDimFaces, u_nominalTriangles).xyz;//[angA, angB, angC]\n\n    int faceIndex = 0;\n    if (faceMeta[2] < 0.0) faceIndex = 1;\n    if (faceMeta[3] < 0.0) faceIndex = 2;\n\n    //get node positions\n    vec3 a = faceIndex == 0 ? lastPosition+originalPosition : getPosition(faceMeta[1]);\n    vec3 b = faceIndex == 1 ? lastPosition+originalPosition : getPosition(faceMeta[2]);\n    vec3 c = faceIndex == 2 ? lastPosition+originalPosition : getPosition(faceMeta[3]);\n\n    //calc angles\n    vec3 ab = b-a;\n    vec3 ac = c-a;\n    vec3 bc = c-b;\n\n    float lengthAB = length(ab);\n    float lengthAC = length(ac);\n    float lengthBC = length(bc);\n\n    float tol = 0.0000001;\n    if (abs(lengthAB) < tol || abs(lengthBC) < tol || abs(lengthAC) < tol) continue;\n\n    ab /= lengthAB;\n    ac /= lengthAC;\n    bc /= lengthBC;\n\n    vec3 angles = vec3(acos(dot(ab, ac)),\n      acos(-1.0*dot(ab, bc)),\n      acos(dot(ac, bc)));\n    vec3 anglesDiff = nominalAngles-angles;\n\n    vec3 normal = getFromArray(faceMeta[0], u_textureDimFaces, u_normals).xyz;\n\n    //calc forces\n    anglesDiff *= u_faceStiffness;\n    if (faceIndex == 0){//a\n      vec3 normalCrossAC = cross(normal, ac)/lengthAC;\n      vec3 normalCrossAB = cross(normal, ab)/lengthAB;\n      force -= anglesDiff[0]*(normalCrossAC - normalCrossAB);\n      force -= anglesDiff[1]*normalCrossAB;\n      force += anglesDiff[2]*normalCrossAC;\n    } else if (faceIndex == 1){\n      vec3 normalCrossAB = cross(normal, ab)/lengthAB;\n      vec3 normalCrossBC = cross(normal, bc)/lengthBC;\n      force -= anglesDiff[0]*normalCrossAB;\n      force += anglesDiff[1]*(normalCrossAB + normalCrossBC);\n      force -= anglesDiff[2]*normalCrossBC;\n    } else if (faceIndex == 2){\n      vec3 normalCrossAC = cross(normal, ac)/lengthAC;\n      vec3 normalCrossBC = cross(normal, bc)/lengthBC;\n      force += anglesDiff[0]*normalCrossAC;\n      force -= anglesDiff[1]*normalCrossBC;\n      force += anglesDiff[2]*(normalCrossBC - normalCrossAC);\n    }\n\n  }\n\n  vec3 nextPosition = force*u_dt*u_dt/mass[0] + 2.0*lastPosition - lastLastPosition;\n  gl_FragColor = vec4(nextPosition,nodeError);//position.a has error info\n}\n";

  var thetaCalcShader = "#define TWO_PI 6.283185307179586476925286766559\nprecision mediump float;\nuniform vec2 u_textureDim;\nuniform vec2 u_textureDimFaces;\nuniform vec2 u_textureDimCreases;\nuniform sampler2D u_normals;\nuniform sampler2D u_lastTheta;\nuniform sampler2D u_creaseVectors;\nuniform sampler2D u_lastPosition;\nuniform sampler2D u_originalPosition;\nuniform float u_dt;\n\nvec4 getFromArray(float index1D, vec2 dimensions, sampler2D tex){\n  vec2 index = vec2(mod(index1D, dimensions.x)+0.5, floor(index1D/dimensions.x)+0.5);\n  vec2 scaledIndex = index/dimensions;\n  return texture2D(tex, scaledIndex);\n}\n\nvoid main(){\n\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDimCreases;\n\n  vec4 lastTheta = texture2D(u_lastTheta, scaledFragCoord);\n\n  if (lastTheta[2]<0.0){\n    gl_FragColor = vec4(lastTheta[0], 0.0, -1.0, -1.0);\n    return;\n  }\n\n  vec3 normal1 = getFromArray(lastTheta[2], u_textureDimFaces, u_normals).xyz;\n  vec3 normal2 = getFromArray(lastTheta[3], u_textureDimFaces, u_normals).xyz;\n\n  float dotNormals = dot(normal1, normal2);//normals are already normalized, no need to divide by length\n  if (dotNormals < -1.0) dotNormals = -1.0;\n  else if (dotNormals > 1.0) dotNormals = 1.0;\n\n  vec2 creaseVectorIndices = texture2D(u_creaseVectors, scaledFragCoord).xy;\n  vec2 creaseNodeIndex = vec2(mod(creaseVectorIndices[0], u_textureDim.x)+0.5, floor(creaseVectorIndices[0]/u_textureDim.x)+0.5);\n  vec2 scaledNodeIndex = creaseNodeIndex/u_textureDim;\n  vec3 node0 = texture2D(u_lastPosition, scaledNodeIndex).xyz + texture2D(u_originalPosition, scaledNodeIndex).xyz;\n  creaseNodeIndex = vec2(mod(creaseVectorIndices[1], u_textureDim.x)+0.5, floor(creaseVectorIndices[1]/u_textureDim.x)+0.5);\n  scaledNodeIndex = creaseNodeIndex/u_textureDim;\n  vec3 node1 = texture2D(u_lastPosition, scaledNodeIndex).xyz + texture2D(u_originalPosition, scaledNodeIndex).xyz;\n\n  //https://math.stackexchange.com/questions/47059/how-do-i-calculate-a-dihedral-angle-given-cartesian-coordinates\n  vec3 creaseVector = normalize(node1-node0);\n  float x = dotNormals;\n  float y = dot(cross(normal1, creaseVector), normal2);\n\n  float theta = atan(y, x);\n\n  float diff = theta-lastTheta[0];\n  float origDiff = diff;\n  if (diff < -5.0) {\n    diff += TWO_PI;\n  } else if (diff > 5.0) {\n    diff -= TWO_PI;\n  }\n  theta = lastTheta[0] + diff;\n  gl_FragColor = vec4(theta, diff, lastTheta[2], lastTheta[3]);//[theta, w, normal1Index, normal2Index]\n}\n";

  var normalCalc = "precision mediump float;\nuniform vec2 u_textureDim;\nuniform vec2 u_textureDimFaces;\nuniform sampler2D u_faceVertexIndices;\nuniform sampler2D u_lastPosition;\nuniform sampler2D u_originalPosition;\n\nvec3 getPosition(float index1D){\n  vec2 index = vec2(mod(index1D, u_textureDim.x)+0.5, floor(index1D/u_textureDim.x)+0.5);\n  vec2 scaledIndex = index/u_textureDim;\n  return texture2D(u_lastPosition, scaledIndex).xyz + texture2D(u_originalPosition, scaledIndex).xyz;\n}\n\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDimFaces;\n\n  vec3 indices = texture2D(u_faceVertexIndices, scaledFragCoord).xyz;\n\n  vec3 a = getPosition(indices[0]);\n  vec3 b = getPosition(indices[1]);\n  vec3 c = getPosition(indices[2]);\n\n  vec3 normal = normalize(cross(b-a, c-a));\n\n  gl_FragColor = vec4(normal, 0.0);\n}\n";

  var packToBytesShader = "precision mediump float;\nuniform vec2 u_floatTextureDim;\nuniform sampler2D u_floatTexture;\nuniform float u_vectorLength;\nfloat shift_right (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shift_left (float v, float amt) {\n  return floor(v * exp2(amt) + 0.5);\n}\nfloat mask_last (float v, float bits) {\n  return mod(v, shift_left(1.0, bits));\n}\nfloat extract_bits (float num, float from, float to) {\n  from = floor(from + 0.5); to = floor(to + 0.5);\n  return mask_last(shift_right(num, from), to - from);\n}\nvec4 encode_float (float val) {\n  if (val == 0.0) return vec4(0, 0, 0, 0);\n  float sign = val > 0.0 ? 0.0 : 1.0;\n  val = abs(val);\n  float exponent = floor(log2(val));\n  float biased_exponent = exponent + 127.0;\n  float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0;\n  float t = biased_exponent / 2.0;\n  float last_bit_of_biased_exponent = fract(t) * 2.0;\n  float remaining_bits_of_biased_exponent = floor(t);\n  float byte4 = extract_bits(fraction, 0.0, 8.0) / 255.0;\n  float byte3 = extract_bits(fraction, 8.0, 16.0) / 255.0;\n  float byte2 = (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0;\n  float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n  return vec4(byte4, byte3, byte2, byte1);\n}\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  float textureXcoord = floor((fragCoord.x - 0.5)/u_vectorLength+0.0001) + 0.5;\n  vec4 data = texture2D(u_floatTexture, vec2(textureXcoord, fragCoord.y)/u_floatTextureDim);\n  int textureIndex = int(floor(mod(fragCoord.x-0.5+0.0001, u_vectorLength)));\n  if (textureIndex == 0) gl_FragColor = encode_float(data[0]);\n  else if (textureIndex == 1) gl_FragColor = encode_float(data[1]);\n  else if (textureIndex == 2) gl_FragColor = encode_float(data[2]);\n  else if (textureIndex == 3) gl_FragColor = encode_float(data[3]);\n}\n";

  var zeroTexture = "precision mediump float;\nvoid main(){\n  gl_FragColor = vec4(0.0);\n}\n";

  var zeroThetaTexture = "precision mediump float;\nuniform sampler2D u_theta;\nuniform vec2 u_textureDimCreases;\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDimCreases;\n  vec4 theta = texture2D(u_theta, scaledFragCoord);\n  gl_FragColor = vec4(0.0, 0.0, theta[2], theta[3]);\n}\n";

  var centerTexture = "precision mediump float;\nuniform sampler2D u_lastPosition;\nuniform vec2 u_textureDim;\nuniform vec3 u_center;\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDim;\n  vec3 position = texture2D(u_lastPosition, scaledFragCoord).xyz;\n  gl_FragColor = vec4(position-u_center, 0.0);\n}\n";

  var copyTexture = "precision mediump float;\nuniform sampler2D u_orig;\nuniform vec2 u_textureDim;\nvoid main(){\n  gl_FragColor = texture2D(u_orig, gl_FragCoord.xy/u_textureDim);\n}\n";

  var updateCreaseGeo = "precision mediump float;\nuniform vec2 u_textureDim;\nuniform vec2 u_textureDimCreases;\nuniform sampler2D u_lastPosition;\nuniform sampler2D u_originalPosition;\nuniform sampler2D u_creaseMeta2;\n\nvec3 getPosition(float index1D){\n  vec2 index = vec2(mod(index1D, u_textureDim.x)+0.5, floor(index1D/u_textureDim.x)+0.5);\n  vec2 scaledIndex = index/u_textureDim;\n  return texture2D(u_lastPosition, scaledIndex).xyz + texture2D(u_originalPosition, scaledIndex).xyz;\n}\n\nvoid main(){\n  vec2 fragCoord = gl_FragCoord.xy;\n  vec2 scaledFragCoord = fragCoord/u_textureDimCreases;\n\n  vec4 creaseMeta = texture2D(u_creaseMeta2, scaledFragCoord);\n\n  vec3 node1 = getPosition(creaseMeta[0]);\n  vec3 node2 = getPosition(creaseMeta[1]);\n  vec3 node3 = getPosition(creaseMeta[2]);\n  vec3 node4 = getPosition(creaseMeta[3]);\n\n  float tol = 0.000001;\n\n  vec3 creaseVector = node4-node3;\n  float creaseLength = length(creaseVector);\n\n  if (abs(creaseLength)<tol) {\n    gl_FragColor = vec4(-1);//disable crease\n    return;\n  }\n  creaseVector /= creaseLength;\n\n  vec3 vector1 = node1-node3;\n  vec3 vector2 = node2-node3;\n\n  float proj1Length = dot(creaseVector, vector1);\n  float proj2Length = dot(creaseVector, vector2);\n\n  float dist1 = sqrt(abs(vector1.x*vector1.x+vector1.y*vector1.y+vector1.z*vector1.z-proj1Length*proj1Length));\n  float dist2 = sqrt(abs(vector2.x*vector2.x+vector2.y*vector2.y+vector2.z*vector2.z-proj2Length*proj2Length));\n\n  if (dist1<tol || dist2<tol){\n    gl_FragColor = vec4(-1);//disable crease\n    return;\n  }\n\n  gl_FragColor = vec4(dist1, dist2, proj1Length/creaseLength, proj2Length/creaseLength);\n}";

  /**
   * Created by ghassaei on 10/7/16.
   */

  const THREE$3 = window.THREE || require("three");

  // ///////////////////////
  // currently looking into making this work on iOS.
  // problem appears to be the need to support and switch to using HALF_FLOAT
  //
  // https://github.com/mrdoob/three.js/issues/9628
  // http://yomboprime.github.io/GPGPU-threejs-demos/webgl_gpgpu_water.html

  function initDynamicSolver(globals) {
    const float_type = "FLOAT";

    let nodes;
    let edges;
    let faces;
    let creases;
    let positions;
    let colors;

    let originalPosition;
    let position;
    let lastPosition;
    let lastLastPosition; // for verlet integration
    let velocity;
    let lastVelocity;
    let externalForces;
    let mass;
    let meta; // [beamMetaIndex, numBeams, nodeCreaseMetaIndex, numCreases]
    let meta2; // [nodeFaceMetaIndex, numFaces]
    let beamMeta; // [K, D, length, otherNodeIndex]

    let normals;
    let faceVertexIndices; // [a,b,c] textureDimFaces
    let nominalTriangles; // [angleA, angleB, angleC]
    let nodeFaceMeta; // [faceIndex, a, b, c] textureNodeFaces
    let creaseMeta; // [k, d, targetTheta, -] textureDimCreases
    let creaseMeta2; // [node1Index, node2Index, node3index, node4index]
    // nodes 1 and 2 are opposite crease, 3 and 4 are on crease, textureDimCreases
    let nodeCreaseMeta; // [creaseIndex (thetaIndex), nodeIndex (1/2/3/4), -, -] textureDimNodeCreases
    let creaseGeo; // [h1, h2, coef1, coef2]
    let creaseVectors; // indices of crease nodes
    let theta; // [theta, w, normalIndex1, normalIndex2]
    let lastTheta; // [theta, w, normalIndex1, normalIndex2]

    function syncNodesAndEdges() {
      nodes = globals.model.getNodes();
      edges = globals.model.getEdges();
      faces = globals.model.getFaces();
      creases = globals.model.getCreases();

      positions = globals.model.getPositionsArray();
      colors = globals.model.getColorsArray();

      initTypedArrays();
      initTexturesAndPrograms(globals.gpuMath);
      setSolveParams();
    }

    let programsInited = false; // flag for initial setup

    let textureDim = 0;
    let textureDimEdges = 0;
    let textureDimFaces = 0;
    let textureDimCreases = 0;
    let textureDimNodeCreases = 0;
    let textureDimNodeFaces = 0;

    function reset() {
      globals.gpuMath.step("zeroTexture", [], "u_position");
      globals.gpuMath.step("zeroTexture", [], "u_lastPosition");
      globals.gpuMath.step("zeroTexture", [], "u_lastLastPosition");
      globals.gpuMath.step("zeroTexture", [], "u_velocity");
      globals.gpuMath.step("zeroTexture", [], "u_lastVelocity");
      globals.gpuMath.step("zeroThetaTexture", ["u_lastTheta"], "u_theta");
      globals.gpuMath.step("zeroThetaTexture", ["u_theta"], "u_lastTheta");
      render();
    }

    function solve(_numSteps) {
      if (globals.shouldAnimateFoldPercent) {
        globals.creasePercent = globals.videoAnimator.nextFoldAngle(0);
        globals.controls.updateCreasePercent();
        setCreasePercent(globals.creasePercent);
        globals.shouldChangeCreasePercent = true;
      }

      if (globals.forceHasChanged) {
        updateExternalForces();
        globals.forceHasChanged = false;
      }
      if (globals.fixedHasChanged) {
        updateFixed();
        globals.fixedHasChanged = false;
      }
      if (globals.nodePositionHasChanged) {
        updateLastPosition();
        globals.nodePositionHasChanged = false;
      }
      if (globals.creaseMaterialHasChanged) {
        updateCreasesMeta();
        globals.creaseMaterialHasChanged = false;
      }
      if (globals.materialHasChanged) {
        updateMaterials();
        globals.materialHasChanged = false;
      }
      if (globals.shouldChangeCreasePercent) {
        setCreasePercent(globals.creasePercent);
        globals.shouldChangeCreasePercent = false;
      }
      // if (globals.shouldZeroDynamicVelocity) {
      //     globals.gpuMath.step("zeroTexture", [], "u_velocity");
      //     globals.gpuMath.step("zeroTexture", [], "u_lastVelocity");
      //     globals.shouldZeroDynamicVelocity = false;
      // }
      if (globals.shouldCenterGeo) {
        const avgPosition = getAvgPosition();
        globals.gpuMath.setProgram("centerTexture");
        globals.gpuMath.setUniformForProgram("centerTexture", "u_center", [avgPosition.x, avgPosition.y, avgPosition.z], "3f");
        globals.gpuMath.step("centerTexture", ["u_lastPosition"], "u_position");
        if (globals.integrationType === "verlet") globals.gpuMath.step("copyTexture", ["u_position"], "u_lastLastPosition");
        globals.gpuMath.swapTextures("u_position", "u_lastPosition");
        globals.gpuMath.step("zeroTexture", [], "u_lastVelocity");
        globals.gpuMath.step("zeroTexture", [], "u_velocity");
        globals.shouldCenterGeo = false;
      }

      if (_numSteps === undefined) _numSteps = globals.numSteps;
      for (let j = 0; j < _numSteps; j += 1) {
        solveStep();
      }
      render();
    }

    function solveStep() {

      const gpuMath = globals.gpuMath;

      gpuMath.setProgram("normalCalc");
      gpuMath.setSize(textureDimFaces, textureDimFaces);
      gpuMath.step("normalCalc", ["u_faceVertexIndices", "u_lastPosition", "u_originalPosition"], "u_normals");

      gpuMath.setProgram("thetaCalc");
      gpuMath.setSize(textureDimCreases, textureDimCreases);
      gpuMath.step("thetaCalc", ["u_normals", "u_lastTheta", "u_creaseVectors", "u_lastPosition",
        "u_originalPosition"], "u_theta");

      gpuMath.setProgram("updateCreaseGeo");
      // already at textureDimCreasesxtextureDimCreases
      gpuMath.step("updateCreaseGeo", ["u_lastPosition", "u_originalPosition", "u_creaseMeta2"], "u_creaseGeo");

      if (globals.integrationType === "verlet") {
        gpuMath.setProgram("positionCalcVerlet");
        gpuMath.setSize(textureDim, textureDim);
        gpuMath.step("positionCalcVerlet", ["u_lastPosition", "u_lastLastPosition", "u_lastVelocity", "u_originalPosition", "u_externalForces",
          "u_mass", "u_meta", "u_beamMeta", "u_creaseMeta", "u_nodeCreaseMeta", "u_normals", "u_theta", "u_creaseGeo",
          "u_meta2", "u_nodeFaceMeta", "u_nominalTriangles"], "u_position");
        gpuMath.step("velocityCalcVerlet", ["u_position", "u_lastPosition", "u_mass"], "u_velocity");
        gpuMath.swapTextures("u_lastPosition", "u_lastLastPosition");
      } else { // euler
        gpuMath.setProgram("velocityCalc");
        gpuMath.setSize(textureDim, textureDim);
        gpuMath.step("velocityCalc", ["u_lastPosition", "u_lastVelocity", "u_originalPosition", "u_externalForces",
          "u_mass", "u_meta", "u_beamMeta", "u_creaseMeta", "u_nodeCreaseMeta", "u_normals", "u_theta", "u_creaseGeo",
          "u_meta2", "u_nodeFaceMeta", "u_nominalTriangles"], "u_velocity");
        gpuMath.step("positionCalc", ["u_velocity", "u_lastPosition", "u_mass"], "u_position");
      }

      gpuMath.swapTextures("u_theta", "u_lastTheta");
      gpuMath.swapTextures("u_velocity", "u_lastVelocity");
      gpuMath.swapTextures("u_position", "u_lastPosition");
    }

    // let $errorOutput = $("#globalError");

    function getAvgPosition() {
      let xavg = 0;
      let yavg = 0;
      let zavg = 0;
      for (let i = 0; i < positions.length; i += 3) {
        xavg += positions[i];
        yavg += positions[i + 1];
        zavg += positions[i + 2];
      }
      const avgPosition = new THREE$3.Vector3(xavg, yavg, zavg);
      avgPosition.multiplyScalar(3 / positions.length);
      return avgPosition;
    }

    function render() {

      const vectorLength = 4;
      globals.gpuMath.setProgram("packToBytes");
      globals.gpuMath.setUniformForProgram("packToBytes", "u_vectorLength", vectorLength, "1f");
      globals.gpuMath.setUniformForProgram("packToBytes", "u_floatTextureDim", [textureDim, textureDim], "2f");
      globals.gpuMath.setSize(textureDim * vectorLength, textureDim);
      globals.gpuMath.step("packToBytes", ["u_lastPosition"], "outputBytes");

      if (globals.gpuMath.readyToRead()) {
        const numPixels = nodes.length * vectorLength;
        const height = Math.ceil(numPixels / (textureDim * vectorLength));
        const pixels = new Uint8Array(height * textureDim * 4 * vectorLength);
        globals.gpuMath.readPixels(0, 0, textureDim * vectorLength, height, pixels);
        const parsedPixels = new Float32Array(pixels.buffer);
        const shouldUpdateColors = globals.colorMode === "axialStrain";
        for (let i = 0; i < nodes.length; i += 1) {
          const rgbaIndex = i * vectorLength;
          let nodeError = parsedPixels[rgbaIndex + 3] * 100;
          const nodePosition = new THREE$3.Vector3(parsedPixels[rgbaIndex], parsedPixels[rgbaIndex + 1], parsedPixels[rgbaIndex + 2]);
          nodePosition.add(nodes[i]._originalPosition);
          positions[3 * i] = nodePosition.x;
          positions[3 * i + 1] = nodePosition.y;
          positions[3 * i + 2] = nodePosition.z;
          if (shouldUpdateColors) {
            if (nodeError > globals.strainClip) nodeError = globals.strainClip;
            const scaledVal = (1 - nodeError / globals.strainClip) * 0.7;
            const color = new THREE$3.Color();
            color.setHSL(scaledVal, 1, 0.5);
            colors[3 * i] = color.r;
            colors[3 * i + 1] = color.g;
            colors[3 * i + 2] = color.b;
          }
        }
        // $errorOutput.html((globalError / nodes.length).toFixed(7) + " %");
      } else {
        console.log("shouldn't be here");
      }
    }

    function setSolveParams() {
      let dt = calcDt();
      // $("#deltaT").html(dt);
      globals.gpuMath.setProgram("thetaCalc");
      globals.gpuMath.setUniformForProgram("thetaCalc", "u_dt", dt, "1f");
      globals.gpuMath.setProgram("velocityCalc");
      globals.gpuMath.setUniformForProgram("velocityCalc", "u_dt", dt, "1f");
      globals.gpuMath.setProgram("positionCalcVerlet");
      globals.gpuMath.setUniformForProgram("positionCalcVerlet", "u_dt", dt, "1f");
      globals.gpuMath.setProgram("positionCalc");
      globals.gpuMath.setUniformForProgram("positionCalc", "u_dt", dt, "1f");
      globals.gpuMath.setProgram("velocityCalcVerlet");
      globals.gpuMath.setUniformForProgram("velocityCalcVerlet", "u_dt", dt, "1f");
      // globals.controls.setDeltaT(dt);
    }

    function calcDt() {
      let maxFreqNat = 0;
      edges.forEach((beam) => {
        if (beam.getNaturalFrequency() > maxFreqNat) maxFreqNat = beam.getNaturalFrequency();
      });
      return (1 / (2 * Math.PI * maxFreqNat)) * 0.9; // 0.9 of max delta t for good measure
    }

    function initTexturesAndPrograms(gpuMath) {
      gpuMath.initTextureFromData("u_position", textureDim, textureDim, float_type, position, true);
      gpuMath.initTextureFromData("u_lastPosition", textureDim, textureDim, float_type, lastPosition, true);
      gpuMath.initTextureFromData("u_lastLastPosition", textureDim, textureDim, float_type, lastLastPosition, true);
      gpuMath.initTextureFromData("u_velocity", textureDim, textureDim, float_type, velocity, true);
      gpuMath.initTextureFromData("u_lastVelocity", textureDim, textureDim, float_type, lastVelocity, true);
      gpuMath.initTextureFromData("u_theta", textureDimCreases, textureDimCreases, float_type, theta, true);
      gpuMath.initTextureFromData("u_lastTheta", textureDimCreases, textureDimCreases, float_type, lastTheta, true);
      gpuMath.initTextureFromData("u_normals", textureDimFaces, textureDimFaces, float_type, normals, true);

      gpuMath.initFrameBufferForTexture("u_position", true);
      gpuMath.initFrameBufferForTexture("u_lastPosition", true);
      gpuMath.initFrameBufferForTexture("u_lastLastPosition", true);
      gpuMath.initFrameBufferForTexture("u_velocity", true);
      gpuMath.initFrameBufferForTexture("u_lastVelocity", true);
      gpuMath.initFrameBufferForTexture("u_theta", true);
      gpuMath.initFrameBufferForTexture("u_lastTheta", true);
      gpuMath.initFrameBufferForTexture("u_normals", true);

      gpuMath.initTextureFromData("u_meta", textureDim, textureDim, float_type, meta, true);
      gpuMath.initTextureFromData("u_meta2", textureDim, textureDim, float_type, meta2, true);
      gpuMath.initTextureFromData("u_nominalTrinagles", textureDimFaces, textureDimFaces, float_type, nominalTriangles, true);
      gpuMath.initTextureFromData("u_nodeCreaseMeta", textureDimNodeCreases, textureDimNodeCreases, float_type, nodeCreaseMeta, true);
      gpuMath.initTextureFromData("u_creaseMeta2", textureDimCreases, textureDimCreases, float_type, creaseMeta2, true);
      gpuMath.initTextureFromData("u_nodeFaceMeta", textureDimNodeFaces, textureDimNodeFaces, float_type, nodeFaceMeta, true);
      gpuMath.initTextureFromData("u_creaseGeo", textureDimCreases, textureDimCreases, float_type, creaseGeo, true);
      gpuMath.initFrameBufferForTexture("u_creaseGeo", true);
      gpuMath.initTextureFromData("u_faceVertexIndices", textureDimFaces, textureDimFaces, float_type, faceVertexIndices, true);
      gpuMath.initTextureFromData("u_nominalTriangles", textureDimFaces, textureDimFaces, float_type, nominalTriangles, true);

      gpuMath.createProgram("positionCalc", vertexShader, positionCalcShader);
      gpuMath.setUniformForProgram("positionCalc", "u_velocity", 0, "1i");
      gpuMath.setUniformForProgram("positionCalc", "u_lastPosition", 1, "1i");
      gpuMath.setUniformForProgram("positionCalc", "u_mass", 2, "1i");
      gpuMath.setUniformForProgram("positionCalc", "u_textureDim", [textureDim, textureDim], "2f");

      gpuMath.createProgram("velocityCalcVerlet", vertexShader, velocityCalcVerletShader);
      gpuMath.setUniformForProgram("velocityCalcVerlet", "u_position", 0, "1i");
      gpuMath.setUniformForProgram("velocityCalcVerlet", "u_lastPosition", 1, "1i");
      gpuMath.setUniformForProgram("velocityCalcVerlet", "u_mass", 2, "1i");
      gpuMath.setUniformForProgram("velocityCalcVerlet", "u_textureDim", [textureDim, textureDim], "2f");

      gpuMath.createProgram("velocityCalc", vertexShader, velocityCalcShader);
      gpuMath.setUniformForProgram("velocityCalc", "u_lastPosition", 0, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_lastVelocity", 1, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_originalPosition", 2, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_externalForces", 3, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_mass", 4, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_meta", 5, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_beamMeta", 6, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_creaseMeta", 7, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_nodeCreaseMeta", 8, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_normals", 9, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_theta", 10, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_creaseGeo", 11, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_meta2", 12, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_nodeFaceMeta", 13, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_nominalTriangles", 14, "1i");
      gpuMath.setUniformForProgram("velocityCalc", "u_textureDim", [textureDim, textureDim], "2f");
      gpuMath.setUniformForProgram("velocityCalc", "u_textureDimEdges", [textureDimEdges, textureDimEdges], "2f");
      gpuMath.setUniformForProgram("velocityCalc", "u_textureDimFaces", [textureDimFaces, textureDimFaces], "2f");
      gpuMath.setUniformForProgram("velocityCalc", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");
      gpuMath.setUniformForProgram("velocityCalc", "u_textureDimNodeCreases", [textureDimNodeCreases, textureDimNodeCreases], "2f");
      gpuMath.setUniformForProgram("velocityCalc", "u_textureDimNodeFaces", [textureDimNodeFaces, textureDimNodeFaces], "2f");
      gpuMath.setUniformForProgram("velocityCalc", "u_creasePercent", globals.creasePercent, "1f");
      gpuMath.setUniformForProgram("velocityCalc", "u_axialStiffness", globals.axialStiffness, "1f");
      gpuMath.setUniformForProgram("velocityCalc", "u_faceStiffness", globals.faceStiffness, "1f");
      gpuMath.setUniformForProgram("velocityCalc", "u_calcFaceStrain", globals.calcFaceStrain, "1f");

      gpuMath.createProgram("positionCalcVerlet", vertexShader, positionCalcVerletShader);
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_lastPosition", 0, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_lastLastPosition", 1, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_lastVelocity", 2, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_originalPosition", 3, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_externalForces", 4, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_mass", 5, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_meta", 6, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_beamMeta", 7, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_creaseMeta", 8, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_nodeCreaseMeta", 9, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_normals", 10, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_theta", 11, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_creaseGeo", 12, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_meta2", 13, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_nodeFaceMeta", 14, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_nominalTriangles", 15, "1i");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDim", [textureDim, textureDim], "2f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimEdges", [textureDimEdges, textureDimEdges], "2f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimFaces", [textureDimFaces, textureDimFaces], "2f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimNodeCreases", [textureDimNodeCreases, textureDimNodeCreases], "2f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_textureDimNodeFaces", [textureDimNodeFaces, textureDimNodeFaces], "2f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_creasePercent", globals.creasePercent, "1f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_axialStiffness", globals.axialStiffness, "1f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_faceStiffness", globals.faceStiffness, "1f");
      gpuMath.setUniformForProgram("positionCalcVerlet", "u_calcFaceStrain", globals.calcFaceStrain, "1f");

      gpuMath.createProgram("thetaCalc", vertexShader, thetaCalcShader);
      gpuMath.setUniformForProgram("thetaCalc", "u_normals", 0, "1i");
      gpuMath.setUniformForProgram("thetaCalc", "u_lastTheta", 1, "1i");
      gpuMath.setUniformForProgram("thetaCalc", "u_creaseVectors", 2, "1i");
      gpuMath.setUniformForProgram("thetaCalc", "u_lastPosition", 3, "1i");
      gpuMath.setUniformForProgram("thetaCalc", "u_originalPosition", 4, "1i");
      gpuMath.setUniformForProgram("thetaCalc", "u_textureDim", [textureDim, textureDim], "2f");
      gpuMath.setUniformForProgram("thetaCalc", "u_textureDimFaces", [textureDimFaces, textureDimFaces], "2f");
      gpuMath.setUniformForProgram("thetaCalc", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");

      gpuMath.createProgram("normalCalc", vertexShader, normalCalc);
      gpuMath.setUniformForProgram("normalCalc", "u_faceVertexIndices", 0, "1i");
      gpuMath.setUniformForProgram("normalCalc", "u_lastPosition", 1, "1i");
      gpuMath.setUniformForProgram("normalCalc", "u_originalPosition", 2, "1i");
      gpuMath.setUniformForProgram("normalCalc", "u_textureDim", [textureDim, textureDim], "2f");
      gpuMath.setUniformForProgram("normalCalc", "u_textureDimFaces", [textureDimFaces, textureDimFaces], "2f");

      gpuMath.createProgram("packToBytes", vertexShader, packToBytesShader);
      gpuMath.initTextureFromData("outputBytes", textureDim * 4, textureDim, "UNSIGNED_BYTE", null, true);
      gpuMath.initFrameBufferForTexture("outputBytes", true);
      gpuMath.setUniformForProgram("packToBytes", "u_floatTextureDim", [textureDim, textureDim], "2f");
      gpuMath.setUniformForProgram("packToBytes", "u_floatTexture", 0, "1i");

      gpuMath.createProgram("zeroTexture", vertexShader, zeroTexture);
      gpuMath.createProgram("zeroThetaTexture", vertexShader, zeroThetaTexture);
      gpuMath.setUniformForProgram("zeroThetaTexture", "u_theta", 0, "1i");
      gpuMath.setUniformForProgram("zeroThetaTexture", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");

      gpuMath.createProgram("centerTexture", vertexShader, centerTexture);
      gpuMath.setUniformForProgram("centerTexture", "u_lastPosition", 0, "1i");
      gpuMath.setUniformForProgram("centerTexture", "u_textureDim", [textureDim, textureDim], "2f");

      gpuMath.createProgram("copyTexture", vertexShader, copyTexture);
      gpuMath.setUniformForProgram("copyTexture", "u_orig", 0, "1i");
      gpuMath.setUniformForProgram("copyTexture", "u_textureDim", [textureDim, textureDim], "2f");

      gpuMath.createProgram("updateCreaseGeo", vertexShader, updateCreaseGeo);
      gpuMath.setUniformForProgram("updateCreaseGeo", "u_lastPosition", 0, "1i");
      gpuMath.setUniformForProgram("updateCreaseGeo", "u_originalPosition", 1, "1i");
      gpuMath.setUniformForProgram("updateCreaseGeo", "u_creaseMeta2", 2, "1i");
      gpuMath.setUniformForProgram("updateCreaseGeo", "u_textureDim", [textureDim, textureDim], "2f");
      gpuMath.setUniformForProgram("updateCreaseGeo", "u_textureDimCreases", [textureDimCreases, textureDimCreases], "2f");

      gpuMath.setSize(textureDim, textureDim);

      programsInited = true;
    }

    function calcTextureSize(numNodes) {
      if (numNodes === 1) return 2;
      for (let i = 0; i < numNodes; i += 1) {
        if (Math.pow(2, 2 * i) >= numNodes) {
          return Math.pow(2, i);
        }
      }
      console.warn("no texture size found for " + numNodes + " items");
      return 2;
    }

    function updateMaterials(initing) {
      let index = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        if (initing) {
          meta[4 * i] = index;
          meta[4 * i + 1] = nodes[i].numBeams();
        }
        for (let j = 0; j < nodes[i].beams.length; j += 1) {
          const beam = nodes[i].beams[j];
          beamMeta[4 * index] = beam.getK();
          beamMeta[4 * index + 1] = beam.getD();
          if (initing) {
            beamMeta[4 * index + 2] = beam.getLength();
            beamMeta[4 * index + 3] = beam.getOtherNode(nodes[i]).getIndex();
          }
          index += 1;
        }
      }
      globals.gpuMath.initTextureFromData("u_beamMeta", textureDimEdges, textureDimEdges, float_type, beamMeta, true);


      if (programsInited) {
        globals.gpuMath.setProgram("velocityCalc");
        globals.gpuMath.setUniformForProgram("velocityCalc", "u_axialStiffness", globals.axialStiffness, "1f");
        globals.gpuMath.setUniformForProgram("velocityCalc", "u_faceStiffness", globals.faceStiffness, "1f");
        globals.gpuMath.setProgram("positionCalcVerlet");
        globals.gpuMath.setUniformForProgram("positionCalcVerlet", "u_axialStiffness", globals.axialStiffness, "1f");
        globals.gpuMath.setUniformForProgram("positionCalcVerlet", "u_faceStiffness", globals.faceStiffness, "1f");
        setSolveParams(); // recalc dt
      }
    }

    function updateExternalForces() {
      for (let i = 0; i < nodes.length; i += 1) {
        const externalForce = nodes[i].getExternalForce();
        externalForces[4 * i] = externalForce.x;
        externalForces[4 * i + 1] = externalForce.y;
        externalForces[4 * i + 2] = externalForce.z;
      }
      globals.gpuMath.initTextureFromData("u_externalForces", textureDim, textureDim, float_type, externalForces, true);
    }

    function updateFixed() {
      for (let i = 0; i < nodes.length; i += 1) {
        mass[4 * i + 1] = (nodes[i].isFixed() ? 1 : 0);
      }
      globals.gpuMath.initTextureFromData("u_mass", textureDim, textureDim, float_type, mass, true);
    }

    function updateOriginalPosition() {
      for (let i = 0; i < nodes.length; i += 1) {
        const origPosition = nodes[i].getOriginalPosition();
        originalPosition[4 * i] = origPosition.x;
        originalPosition[4 * i + 1] = origPosition.y;
        originalPosition[4 * i + 2] = origPosition.z;
      }
      globals.gpuMath.initTextureFromData("u_originalPosition", textureDim, textureDim, float_type, originalPosition, true);
    }

    function updateCreaseVectors() {
      for (let i = 0; i < creases.length; i += 1) {
        const rgbaIndex = i * 4;
        const nodes = creases[i].edge.nodes;
        // this.vertices[1].clone().sub(this.vertices[0]);
        creaseVectors[rgbaIndex] = nodes[0].getIndex();
        creaseVectors[rgbaIndex + 1] = nodes[1].getIndex();
      }
      globals.gpuMath.initTextureFromData("u_creaseVectors", textureDimCreases, textureDimCreases, float_type, creaseVectors, true);
    }

    function updateCreasesMeta(initing) {
      for (let i = 0; i < creases.length; i += 1) {
        const crease = creases[i];
        creaseMeta[i * 4] = crease.getK();
        // creaseMeta[i*4+1] = crease.getD();
        if (initing) creaseMeta[i * 4 + 2] = crease.getTargetTheta();
      }
      globals.gpuMath.initTextureFromData("u_creaseMeta", textureDimCreases, textureDimCreases, float_type, creaseMeta, true);
    }

    function updateLastPosition() {
      for (let i = 0; i < nodes.length; i += 1) {
        const _position = nodes[i].getRelativePosition();
        lastPosition[4 * i] = _position.x;
        lastPosition[4 * i + 1] = _position.y;
        lastPosition[4 * i + 2] = _position.z;
      }
      globals.gpuMath.initTextureFromData("u_lastPosition", textureDim, textureDim, float_type, lastPosition, true);
      globals.gpuMath.initFrameBufferForTexture("u_lastPosition", true);
    }

    function setCreasePercent(percent) {
      if (!programsInited) return;
      globals.gpuMath.setProgram("velocityCalc");
      globals.gpuMath.setUniformForProgram("velocityCalc", "u_creasePercent", percent, "1f");
      globals.gpuMath.setProgram("positionCalcVerlet");
      globals.gpuMath.setUniformForProgram("positionCalcVerlet", "u_creasePercent", percent, "1f");
    }

    function initTypedArrays() {
      textureDim = calcTextureSize(nodes.length);

      let numNodeFaces = 0;
      const nodeFaces = [];
      for (let i = 0; i < nodes.length; i += 1) {
        nodeFaces.push([]);
        for (let j = 0; j < faces.length; j += 1) {
          if (faces[j].indexOf(i) >= 0) {
            nodeFaces[i].push(j);
            numNodeFaces += 1;
          }
        }
      }
      textureDimNodeFaces = calcTextureSize(numNodeFaces);

      let numEdges = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        numEdges += nodes[i].numBeams();
      }
      textureDimEdges = calcTextureSize(numEdges);

      const numCreases = creases.length;
      textureDimCreases = calcTextureSize(numCreases);

      let numNodeCreases = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        numNodeCreases += nodes[i].numCreases();
      }
      numNodeCreases += numCreases * 2; // reactions
      textureDimNodeCreases = calcTextureSize(numNodeCreases);

      const numFaces = faces.length;
      textureDimFaces = calcTextureSize(numFaces);

      originalPosition = new Float32Array(textureDim * textureDim * 4);
      position = new Float32Array(textureDim * textureDim * 4);
      lastPosition = new Float32Array(textureDim * textureDim * 4);
      lastLastPosition = new Float32Array(textureDim * textureDim * 4);
      velocity = new Float32Array(textureDim * textureDim * 4);
      lastVelocity = new Float32Array(textureDim * textureDim * 4);
      externalForces = new Float32Array(textureDim * textureDim * 4);
      mass = new Float32Array(textureDim * textureDim * 4);
      meta = new Float32Array(textureDim * textureDim * 4);
      meta2 = new Float32Array(textureDim * textureDim * 4);
      beamMeta = new Float32Array(textureDimEdges * textureDimEdges * 4);

      normals = new Float32Array(textureDimFaces * textureDimFaces * 4);
      faceVertexIndices = new Float32Array(textureDimFaces * textureDimFaces * 4);
      creaseMeta = new Float32Array(textureDimCreases * textureDimCreases * 4);
      nodeFaceMeta = new Float32Array(textureDimNodeFaces * textureDimNodeFaces * 4);
      nominalTriangles = new Float32Array(textureDimFaces * textureDimFaces * 4);
      nodeCreaseMeta = new Float32Array(textureDimNodeCreases * textureDimNodeCreases * 4);
      creaseMeta2 = new Float32Array(textureDimCreases * textureDimCreases * 4);
      creaseGeo = new Float32Array(textureDimCreases * textureDimCreases * 4);
      creaseVectors = new Float32Array(textureDimCreases * textureDimCreases * 4);
      theta = new Float32Array(textureDimCreases * textureDimCreases * 4);
      lastTheta = new Float32Array(textureDimCreases * textureDimCreases * 4);

      for (let i = 0; i < faces.length; i += 1) {
        const face = faces[i];
        faceVertexIndices[4 * i] = face[0];
        faceVertexIndices[4 * i + 1] = face[1];
        faceVertexIndices[4 * i + 2] = face[2];

        const a = nodes[face[0]].getOriginalPosition();
        const b = nodes[face[1]].getOriginalPosition();
        const c = nodes[face[2]].getOriginalPosition();
        const ab = (b.clone().sub(a)).normalize();
        const ac = (c.clone().sub(a)).normalize();
        const bc = (c.clone().sub(b)).normalize();
        nominalTriangles[4 * i] = Math.acos(ab.dot(ac));
        nominalTriangles[4 * i + 1] = Math.acos(-1*ab.dot(bc));
        nominalTriangles[4 * i + 2] = Math.acos(ac.dot(bc));

        if (Math.abs(nominalTriangles[4 * i] + nominalTriangles[4 * i + 1] + nominalTriangles[4 * i + 2] - Math.PI) > 0.1) {
          console.warn("bad angles");
        }
      }


      for (let i = 0; i < textureDim * textureDim; i += 1) {
        mass[4 * i + 1] = 1; // set all fixed by default
      }

      for (let i = 0; i < textureDimCreases * textureDimCreases; i += 1) {
        if (i >= numCreases) {
          lastTheta[i * 4 + 2] = -1;
          lastTheta[i * 4 + 3] = -1;
          continue;
        }
        lastTheta[i * 4 + 2] = creases[i].getNormal1Index();
        lastTheta[i * 4 + 3] = creases[i].getNormal2Index();
      }

      let index = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        meta2[4 * i] = index;
        const num = nodeFaces[i].length;
        meta2[4 * i + 1] = num;
        for (let j = 0; j < num; j += 1) {
          const _index = (index + j) * 4;
          const face = faces[nodeFaces[i][j]];
          nodeFaceMeta[_index] = nodeFaces[i][j];
          nodeFaceMeta[_index + 1] = face[0] == i ? -1 : face[0];
          nodeFaceMeta[_index + 2] = face[1] == i ? -1 : face[1];
          nodeFaceMeta[_index + 3] = face[2] == i ? -1 : face[2];
        }
        index += num;
      }

      index = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        mass[4 * i] = nodes[i].getSimMass();
        meta[i * 4 + 2] = index;
        const nodeCreases = nodes[i].creases;
        const nodeInvCreases = nodes[i].invCreases; // nodes attached to crease move in opposite direction
        // console.log(nodeInvCreases);
        meta[i * 4 + 3] = nodeCreases.length + nodeInvCreases.length;
        for (let j = 0; j < nodeCreases.length; j += 1) {
          nodeCreaseMeta[index * 4] = nodeCreases[j].getIndex();
          nodeCreaseMeta[index * 4 + 1] = nodeCreases[j].getNodeIndex(nodes[i]); // type 1, 2, 3, 4
          index += 1;
        }
        for (let j = 0; j < nodeInvCreases.length; j += 1) {
          nodeCreaseMeta[index * 4] = nodeInvCreases[j].getIndex();
          nodeCreaseMeta[index * 4 + 1] = nodeInvCreases[j].getNodeIndex(nodes[i]); // type 1, 2, 3, 4
          index += 1;
        }
      }
      for (let i = 0; i < creases.length; i += 1) {
        const crease = creases[i];
        creaseMeta2[i * 4] = crease.node1.getIndex();
        creaseMeta2[i * 4 + 1] = crease.node2.getIndex();
        creaseMeta2[i * 4 + 2] = crease.edge.nodes[0].getIndex();
        creaseMeta2[i * 4 + 3] = crease.edge.nodes[1].getIndex();
        index += 1;
      }

      updateOriginalPosition();
      updateMaterials(true);
      updateFixed();
      updateExternalForces();
      updateCreasesMeta(true);
      updateCreaseVectors();
      setCreasePercent(globals.creasePercent);
    }

    return {
      syncNodesAndEdges,
      updateFixed,
      solve,
      render,
      reset
    };
  }

  /**
   * Created by ghassaei on 9/16/16.
   */

  // var beamMaterialHighlight = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 1});
  // var beamMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 1});

  function Beam(globals, nodes) {
    this.type = "beam";
    this.globals = globals;

    nodes[0].addBeam(this);
    nodes[1].addBeam(this);
    this.vertices = [nodes[0]._originalPosition, nodes[1]._originalPosition];
    this.nodes = nodes;

    // var lineGeometry = new THREE.Geometry();
    // lineGeometry.dynamic = true;
    // lineGeometry.vertices = this.vertices;

    // this.object3D = new THREE.Line(lineGeometry, beamMaterial);

    this.originalLength = this.getLength();
  }

  // Beam.prototype.highlight = function () {
  //     this.object3D.material = beamMaterialHighlight;
  // };
  //
  // Beam.prototype.unhighlight = function () {
  //     this.object3D.material = beamMaterial;
  // };

  Beam.prototype.getLength = function () {
    return this.getVector().length();
  };
  Beam.prototype.getOriginalLength = function () {
    return this.originalLength;
  };
  Beam.prototype.recalcOriginalLength = function () {
    this.originalLength = this.getVector().length();
  };

  Beam.prototype.isFixed = function () {
    return this.nodes[0].fixed && this.nodes[1].fixed;
  };

  Beam.prototype.getVector = function (fromNode) {
    if (fromNode === this.nodes[1]) {
      return this.vertices[0].clone().sub(this.vertices[1]);
    }
    return this.vertices[1].clone().sub(this.vertices[0]);
  };

  // Beam.prototype.setVisibility = function (state) {
  //     this.object3D.visible = state;
  // };


  // dynamic solve

  Beam.prototype.getK = function () {
    return this.globals.axialStiffness / this.getLength();
  };

  Beam.prototype.getD = function () {
    return this.globals.percentDamping * 2 * Math.sqrt(this.getK() * this.getMinMass());
  };

  Beam.prototype.getNaturalFrequency = function () {
    return Math.sqrt(this.getK() / this.getMinMass());
  };

  Beam.prototype.getMinMass = function () {
    let minMass = this.nodes[0].getSimMass();
    if (this.nodes[1].getSimMass() < minMass) minMass = this.nodes[1].getSimMass();
    return minMass;
  };

  Beam.prototype.getOtherNode = function (node) {
    if (this.nodes[0] === node) return this.nodes[1];
    return this.nodes[0];
  };

  // var valleyColor = new THREE.LineBasicMaterial({color:0x0000ff});
  // var mtnColor = new THREE.LineBasicMaterial({color:0xff0000});

  // Beam.prototype.setMountain = function () {
  //     this.object3D.material = mtnColor;
  // };
  //
  // Beam.prototype.setValley = function () {
  //     this.object3D.material = valleyColor;
  // };


  // render

  // Beam.prototype.getObject3D = function () {
  //     return this.object3D;
  // };

  // Beam.prototype.render = function (shouldComputeLineDistance) {
  //     this.object3D.geometry.verticesNeedUpdate = true;
  //     this.object3D.geometry.computeBoundingSphere();
  //     if (shouldComputeLineDistance) this.object3D.geometry.computeLineDistances();//for dashed lines
  // };


  // deallocate

  Beam.prototype.destroy = function () {
    const self = this;
    // _.each(this.nodes, function (node) {
    //   node.removeBeam(self);
    // });
    this.nodes.forEach(node => node.removeBeam(self));
    this.vertices = null;
    // this.object3D = null;
    this.nodes = null;
  };

  /**
   * Created by amandaghassaei on 2/25/17.
   */

  function Crease(globals, edge, face1Index, face2Index, targetTheta, type, node1, node2, index) {
    // type = 0 panel, 1 crease
    this.globals = globals;
    // face1 corresponds to node1, face2 to node2
    this.edge = edge;
    for (let i = 0; i < edge.nodes.length; i += 1) {
      edge.nodes[i].addInvCrease(this);
    }
    this.face1Index = face1Index; // todo this is useless
    this.face2Index = face2Index;
    this.targetTheta = targetTheta;
    this.type = type;
    this.node1 = node1; // node at vertex of face 1
    this.node2 = node2; // node at vertex of face 2
    this.index = index;
    node1.addCrease(this);
    node2.addCrease(this);
  }

  Crease.prototype.getLength = function () {
    return this.edge.getLength();
  };

  Crease.prototype.getVector = function (fromNode) {
    return this.edge.getVector(fromNode);
  };

  Crease.prototype.getNormal1Index = function () {
    return this.face1Index;
  };

  Crease.prototype.getNormal2Index = function () {
    return this.face2Index;
  };

  Crease.prototype.getTargetTheta = function () {
    return this.targetTheta;
  };

  Crease.prototype.getK = function () {
    const length = this.getLength();
    if (this.type === 0) return this.globals.panelStiffness * length;
    return this.globals.creaseStiffness * length;
  };

  Crease.prototype.getD = function () {
    return this.globals.percentDamping * 2 * Math.sqrt(this.getK());
  };

  Crease.prototype.getIndex = function () {
    return this.index;
  };

  Crease.prototype.getLengthToNode1 = function () {
    return this.getLengthTo(this.node1);
  };

  Crease.prototype.getLengthToNode2 = function () {
    return this.getLengthTo(this.node2);
  };

  Crease.prototype.getCoef1 = function (edgeNode) {
    return this.getCoef(this.node1, edgeNode);
  };
  Crease.prototype.getCoef2 = function (edgeNode) {
    return this.getCoef(this.node2, edgeNode);
  };

  Crease.prototype.getCoef = function (node, edgeNode) {
    const vector1 = this.getVector(edgeNode);
    const creaseLength = vector1.length();
    vector1.normalize();
    const nodePosition = node.getOriginalPosition();
    const vector2 = nodePosition.sub(edgeNode.getOriginalPosition());
    const projLength = vector1.dot(vector2);
    let length = Math.sqrt(vector2.lengthSq() - projLength * projLength);
    if (length <= 0.0) {
      console.warn("bad moment arm");
      length = 0.001;
    }
    return (1 - projLength / creaseLength);
  };

  Crease.prototype.getLengthTo = function (node) {
    const vector1 = this.getVector().normalize();
    const nodePosition = node.getOriginalPosition();
    const vector2 = nodePosition.sub(this.edge.nodes[1].getOriginalPosition());
    const projLength = vector1.dot(vector2);
    let length = Math.sqrt(vector2.lengthSq() - projLength * projLength);
    if (length <= 0.0) {
      console.warn("bad moment arm");
      length = 0.001;
    }
    return length;
  };

  Crease.prototype.getNodeIndex = function (node) {
    if (node === this.node1) return 1;
    if (node === this.node2) return 2;
    if (node === this.edge.nodes[0]) return 3;
    if (node === this.edge.nodes[1]) return 4;
    console.log("unknown node type");
    return 0;
  };

  Crease.prototype.setVisibility = function () {
    let vis = false;
    if (this.type === 0) vis = this.globals.panelsVisible;
    else {
      vis = (this.targetTheta > 0 && this.globals.mtnsVisible) || (this.targetTheta < 0 && this.globals.valleysVisible);
    }
    this.edge.setVisibility(vis);
  };

  Crease.prototype.destroy = function () {
    this.node1.removeCrease(this);
    this.node2.removeCrease(this);
    if (this.edge && this.edge.nodes) {
      for (let i = 0; i < this.edge.nodes.length; i += 1) {
        this.edge.nodes[i].removeInvCrease(this);
      }
    }
    this.edge = null;
    this.face1Index = null;
    this.face2Index = null;
    this.targetTheta = null;
    this.type = null;
    this.node1 = null;
    this.node2 = null;
    this.index = null;
  };

  /**
   * Created by amandaghassaei on 2/24/17.
   */

  const THREE$4 = window.THREE || require("three");

  function initModel(globals) {
    let material;
    let material2;
    let geometry;
    const frontside = new THREE$4.Mesh(); // front face of mesh
    const backside = new THREE$4.Mesh(); // back face of mesh (different color)
    backside.visible = false;

    // #145685 blue
    // #edb31c yellow
    // #e64e1e red

    const lineMaterial = new THREE$4.LineBasicMaterial({
      color: 0x000000,
      linewidth: 1,
      transparent: true,
      opacity: 0.3
    });
    const hingeLines = new THREE$4.LineSegments(null, lineMaterial);
    const mountainLines = new THREE$4.LineSegments(null, lineMaterial);
    const valleyLines = new THREE$4.LineSegments(null, lineMaterial);
    const cutLines = new THREE$4.LineSegments(null, lineMaterial);
    const facetLines = new THREE$4.LineSegments(null, lineMaterial);
    const borderLines = new THREE$4.LineSegments(null, lineMaterial);

    const lines = {
      U: hingeLines,
      M: mountainLines,
      V: valleyLines,
      C: cutLines,
      F: facetLines,
      B: borderLines
    };

    clearGeometries();
    setMeshMaterial();

    function clearGeometries() {
      if (geometry) {
        frontside.geometry = null;
        backside.geometry = null;
        geometry.dispose();
      }

      geometry = new THREE$4.BufferGeometry();
      frontside.geometry = geometry;
      backside.geometry = geometry;
      // geometry.verticesNeedUpdate = true;
      geometry.dynamic = true;

      Object.values(lines).forEach((line) => {
        let lineGeometry = line.geometry;
        if (lineGeometry) {
          line.geometry = null;
          lineGeometry.dispose();
        }

        lineGeometry = new THREE$4.BufferGeometry();
        line.geometry = lineGeometry;
        // lineGeometry.verticesNeedUpdate = true;
        lineGeometry.dynamic = true;
      });
    }


    globals.threeView.sceneAddModel(frontside);
    globals.threeView.sceneAddModel(backside);
    Object.values(lines).forEach((line) => {
      globals.threeView.sceneAddModel(line);
    });

    let positions; // place to store buffer geo vertex data
    let colors; // place to store buffer geo vertex colors
    let indices;
    let nodes = [];
    let faces = [];
    let edges = [];
    let creases = [];
    let vertices = []; // indexed vertices array
    let fold;
    let creaseParams;

    let nextCreaseParams;
    let nextFold; // todo only nextFold, nextCreases?

    let inited = false;

    function setMeshMaterial() {
      const polygonOffset = 0.5;
      if (globals.colorMode === "axialStrain") {
        material = new THREE$4.MeshBasicMaterial({
          vertexColors: THREE$4.VertexColors,
          side: THREE$4.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: polygonOffset, // positive value pushes polygon further away
          polygonOffsetUnits: 1
        });
        backside.visible = false;
        if (!globals.threeView.simulationRunning) {
          getSolver().render();
          setGeoUpdates();
        }
      } else {
        material = new THREE$4.MeshPhongMaterial({
          flatShading: true,
          side: THREE$4.FrontSide,
          polygonOffset: true,
          polygonOffsetFactor: polygonOffset, // positive value pushes polygon further away
          polygonOffsetUnits: 1,
          // transparent: true,
          // opacity: 0.3,
          // dithering:true,
          shininess: 1,
          specular: 0xffffff,
          reflectivity: 0
        });
        material2 = new THREE$4.MeshPhongMaterial({
          flatShading: true,
          side: THREE$4.BackSide,
          polygonOffset: true,
          polygonOffsetFactor: polygonOffset, // positive value pushes polygon further away
          polygonOffsetUnits: 1,
          // transparent: true,
          // opacity: 0.3,
          // dithering:true,
          shininess: 1,
          specular: 0xffffff,
          reflectivity: 0
        });

        // material = new THREE.MeshPhysicalMaterial( {
        //     map: null,
        //     color: 0x0000ff,
        //     metalness: 0.2,
        //     roughness: 0.6,
        //     side: THREE.FrontSide,
        //     transparent: false,
        //     envMapIntensity: 5,
        //     premultipliedAlpha: true
        //     // TODO: Add custom blend mode that modulates background color by this materials color.
        // } );

        // material2 = new THREE.MeshPhysicalMaterial( {
        //     map: null,
        //     color: 0xffffff,
        //     metalness: 0.2,
        //     roughness: 0.6,
        //     side: THREE.BackSide,
        //     transparent: false,
        //     envMapIntensity: 5,
        //     premultipliedAlpha: true
        //     // TODO: Add custom blend mode that modulates background color by this materials color.
        // } );

        material.color.setStyle(`#${globals.color1}`);
        material2.color.setStyle(`#${globals.color2}`);
        backside.visible = true;
      }
      frontside.material = material;
      backside.material = material2;
      frontside.material.needsUpdate = true;
      backside.material.needsUpdate = true;
      // frontside.material.depthWrite = false;
      // backside.material.depthWrite = false;

      frontside.castShadow = true;
      frontside.receiveShadow = true;
      // backside.castShadow = true;
      // backside.receiveShadow = true;
    }

    function updateEdgeVisibility() {
      mountainLines.visible = globals.edgesVisible && globals.mtnsVisible;
      valleyLines.visible = globals.edgesVisible && globals.valleysVisible;
      facetLines.visible = globals.edgesVisible && globals.panelsVisible;
      hingeLines.visible = globals.edgesVisible && globals.passiveEdgesVisible;
      borderLines.visible = globals.edgesVisible && globals.boundaryEdgesVisible;
      cutLines.visible = false;
    }

    function updateMeshVisibility() {
      frontside.visible = globals.meshVisible;
      backside.visible = globals.colorMode === "color" && globals.meshVisible;
    }

    function getGeometry() {
      return geometry;
    }

    function getMesh() {
      return [frontside, backside];
    }

    function getPositionsArray() {
      return positions;
    }

    function getColorsArray() {
      return colors;
    }

    function pause() {
      globals.threeView.pauseSimulation();
    }

    function resume() {
      globals.threeView.startSimulation();
    }

    function reset() {
      getSolver().reset();
      setGeoUpdates();
    }

    function step(numSteps) {
      getSolver().solve(numSteps);
      setGeoUpdates();
    }

    function setGeoUpdates() {
      geometry.attributes.position.needsUpdate = true;
      if (globals.colorMode === "axialStrain") geometry.attributes.color.needsUpdate = true;
      if (globals.userInteractionEnabled || globals.vrEnabled) geometry.computeBoundingBox();
    }

    function startSolver() {
      globals.threeView.startAnimation();
    }

    function getSolver() {
      if (globals.simType === "dynamic") return globals.dynamicSolver;
      if (globals.simType === "static") return globals.staticSolver;
      return globals.rigidSolver;
    }

    function buildModel(buildFold, buildCreaseParams) {
      if (buildFold.vertices_coords.length === 0) {
        globals.warn("No geometry found.");
        return;
      }
      if (buildFold.faces_vertices.length === 0) {
        globals.warn("No faces found, try adjusting import vertex merge tolerance.");
        return;
      }
      if (buildFold.edges_vertices.length === 0) {
        globals.warn("No edges found.");
        return;
      }

      nextFold = buildFold;
      nextCreaseParams = buildCreaseParams;

      globals.needsSync = true;
      globals.simNeedsSync = true;

      if (!inited) {
        startSolver(); // start animation loop
        inited = true;
      }
    }

    function sync() {
      for (let i = 0; i < nodes.length; i += 1) {
        nodes[i].destroy();
      }
      for (let i = 0; i < edges.length; i += 1) {
        edges[i].destroy();
      }
      for (let i = 0; i < creases.length; i += 1) {
        creases[i].destroy();
      }

      fold = nextFold;
      nodes = [];
      edges = [];
      faces = fold.faces_vertices;
      creases = [];
      creaseParams = nextCreaseParams;
      const _edges = fold.edges_vertices;

      const _vertices = [];
      for (let i = 0; i < fold.vertices_coords.length; i += 1) {
        const vertex = fold.vertices_coords[i];
        _vertices.push(new THREE$4.Vector3(vertex[0], vertex[1], vertex[2]));
      }

      for (let i = 0; i < _vertices.length; i += 1) {
        nodes.push(new Node(globals, _vertices[i].clone(), nodes.length));
      }
      // _nodes[_faces[0][0]].setFixed(true);
      // _nodes[_faces[0][1]].setFixed(true);
      // _nodes[_faces[0][2]].setFixed(true);

      for (let i = 0; i < _edges.length; i += 1) {
        edges.push(new Beam(globals, [nodes[_edges[i][0]], nodes[_edges[i][1]]]));
      }

      for (let i = 0; i < creaseParams.length; i += 1) { // allCreaseParams.length
        const _creaseParams = creaseParams[i]; // face1Ind, vert1Ind, face2Ind, ver2Ind, edgeInd, angle
        const type = _creaseParams[5] !== 0 ? 1 : 0;
        // edge, face1Index, face2Index, targetTheta, type, node1, node2, index
        creases.push(new Crease(globals, edges[_creaseParams[4]], _creaseParams[0], _creaseParams[2], _creaseParams[5], type, nodes[_creaseParams[1]], nodes[_creaseParams[3]], creases.length));
      }

      vertices = [];
      for (let i = 0; i < nodes.length; i += 1) {
        vertices.push(nodes[i].getOriginalPosition());
      }

      if (globals.noCreasePatternAvailable() && globals.navMode === "pattern") {
        // switch to simulation mode
        // $("#svgViewer").hide();
        globals.navMode = "simulation";
      }

      positions = new Float32Array(vertices.length * 3);
      colors = new Float32Array(vertices.length * 3);
      indices = new Uint16Array(faces.length * 3);

      for (let i = 0; i < vertices.length; i += 1) {
        positions[3 * i] = vertices[i].x;
        positions[3 * i + 1] = vertices[i].y;
        positions[3 * i + 2] = vertices[i].z;
      }
      for (let i = 0; i < faces.length; i += 1) {
        const face = faces[i];
        indices[3 * i] = face[0];
        indices[3 * i + 1] = face[1];
        indices[3 * i + 2] = face[2];
      }

      clearGeometries();

      const positionsAttribute = new THREE$4.BufferAttribute(positions, 3);

      const lineIndices = {
        U: [],
        V: [],
        M: [],
        B: [],
        F: [],
        C: []
      };
      for (let i = 0; i < fold.edges_assignment.length; i += 1) {
        const edge = fold.edges_vertices[i];
        const assignment = fold.edges_assignment[i];
        lineIndices[assignment].push(edge[0]);
        lineIndices[assignment].push(edge[1]);
      }
      Object.keys(lines).forEach((key) => {
        const indicesArray = lineIndices[key];
        const uIndices = new Uint16Array(indicesArray.length);
        for (let i = 0; i < indicesArray.length; i += 1) {
          uIndices[i] = indicesArray[i];
        }
        lines[key].geometry.addAttribute("position", positionsAttribute);
        lines[key].geometry.setIndex(new THREE$4.BufferAttribute(uIndices, 1));
        // lines[key].geometry.attributes.position.needsUpdate = true;
        // lines[key].geometry.index.needsUpdate = true;
        lines[key].geometry.computeBoundingBox();
        lines[key].geometry.computeBoundingSphere();
        lines[key].geometry.center();
      });

      geometry.addAttribute("position", positionsAttribute);
      geometry.addAttribute("color", new THREE$4.BufferAttribute(colors, 3));
      geometry.setIndex(new THREE$4.BufferAttribute(indices, 1));
      // geometry.attributes.position.needsUpdate = true;
      // geometry.index.needsUpdate = true;
      // geometry.verticesNeedUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      geometry.center();

      const scale = 1 / geometry.boundingSphere.radius;
      globals.scale = scale;

      // scale geometry
      for (let i = 0; i < positions.length; i += 1) {
        positions[i] *= scale;
      }
      for (let i = 0; i < vertices.length; i += 1) {
        vertices[i].multiplyScalar(scale);
      }

      // update vertices and edges
      for (let i = 0; i < vertices.length; i += 1) {
        nodes[i].setOriginalPosition(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]);
      }
      for (let i = 0; i < edges.length; i += 1) {
        edges[i].recalcOriginalLength();
      }

      updateEdgeVisibility();
      updateMeshVisibility();

      syncSolver();

      globals.needsSync = false;
      if (!globals.simulationRunning) reset();
    }

    function syncSolver() {
      getSolver().syncNodesAndEdges();
      globals.simNeedsSync = false;
    }

    function getNodes() {
      return nodes;
    }

    function getEdges() {
      return edges;
    }

    function getFaces() {
      return faces;
    }

    function getCreases() {
      return creases;
    }

    function getDimensions() {
      geometry.computeBoundingBox();
      return geometry.boundingBox.max.clone().sub(geometry.boundingBox.min);
    }

    return {
      pause,
      resume,
      reset,
      step,

      getNodes,
      getEdges,
      getFaces,
      getCreases,
      getGeometry, // for save stl
      getPositionsArray,
      getColorsArray,
      getMesh,

      buildModel, // load new model
      sync, // update geometry to new model
      syncSolver, // update solver params

      // rendering
      setMeshMaterial,
      updateEdgeVisibility,
      updateMeshVisibility,

      getDimensions // for save stl
    };
  }

  /**
   * Created by amandaghassaei on 2/25/17.
   */

  const THREE$5 = window.THREE || require("three");
  const Segmentize = window.Segmentize || require("svg-segmentize");
  const earcut = window.earcut || require("earcut");
  const FOLD = window.FOLD || require("fold");

  function initPattern(globals) {
    let foldData = {};
    let rawFold = {};

    function clearFold() {
      foldData.vertices_coords = [];
      foldData.edges_vertices = [];
      // B = boundary, M = mountain, V = valley, C = cut, F = facet, U = hinge
      foldData.edges_assignment = [];
      foldData.edges_foldAngle = []; // target angles
      delete foldData.vertices_vertices;
      delete foldData.faces_vertices;
      delete foldData.vertices_edges;
      rawFold = {};
    }

    let verticesRaw = [];
    // refs to vertex indices
    let mountainsRaw = [];
    let valleysRaw = [];
    let bordersRaw = [];
    let cutsRaw = [];
    let triangulationsRaw = [];
    let hingesRaw = [];

    let badColors = [];// store any bad colors in svg file to show user

    let mountains = [];
    let valleys = [];
    let borders = [];
    let hinges = [];
    let triangulations = [];

    function clearAll() {
      clearFold();
      verticesRaw = [];

      mountainsRaw = [];
      valleysRaw = [];
      bordersRaw = [];
      cutsRaw = [];
      triangulationsRaw = [];
      hingesRaw = [];

      mountains = [];
      valleys = [];
      borders = [];
      hinges = [];
      triangulations = [];

      badColors = [];
    }

    clearAll();

    // const SVGloader = new THREE.SVGLoader();

    function getOpacity(obj) {
      let opacity = obj.getAttribute("opacity");
      if (opacity === undefined) {
        if (obj.style && obj.style.opacity) {
          opacity = obj.style.opacity;
        }
        if (opacity === undefined) {
          opacity = obj.getAttribute("stroke-opacity");
          if (opacity === undefined) {
            if (obj.style && obj.style["stroke-opacity"]) {
              opacity = obj.style["stroke-opacity"];
            }
          }
        }
      }
      opacity = parseFloat(opacity);
      if (isNaN(opacity)) { return 1; }
      return opacity;
    }

    function getStroke(obj) {
      let stroke = obj.getAttribute("stroke");
      // let stroke = obj.attr("stroke");
      if (stroke == null) {
        if (obj.style && obj.style.stroke) {
          stroke = obj.style.stroke.toLowerCase();
          stroke = stroke.replace(/\s/g, ""); // remove all whitespace
          return stroke;
        }
        return null;
      }
      stroke = stroke.replace(/\s/g, ""); // remove all whitespace
      return stroke.toLowerCase();
    }

    function typeForStroke(stroke) {
      if (stroke === "#000000" || stroke === "#000" || stroke === "black" || stroke === "rgb(0,0,0)") return "border";
      if (stroke === "#ff0000" || stroke === "#f00" || stroke === "red" || stroke === "rgb(255,0,0)") return "mountain";
      if (stroke === "#0000ff" || stroke === "#00f" || stroke === "blue" || stroke === "rgb(0,0,255)") return "valley";
      if (stroke === "#00ff00" || stroke === "#0f0" || stroke === "green" || stroke === "rgb(0,255,0)") return "cut";
      if (stroke === "#ffff00" || stroke === "#ff0" || stroke === "yellow" || stroke === "rgb(255,255,0)") return "triangulation";
      if (stroke === "#ff00ff" || stroke === "#f0f" || stroke === "magenta" || stroke === "rgb(255,0,255)") return "hinge";
      badColors.push(stroke);
      return null;
    }

    function colorForAssignment(assignment) {
      if (assignment === "B") return "#000"; // border
      if (assignment === "M") return "#f00"; // mountain
      if (assignment === "V") return "#00f"; // valley
      if (assignment === "C") return "#0f0"; // cut
      if (assignment === "F") return "#ff0"; // facet
      if (assignment === "U") return "#f0f"; // hinge
      return "#0ff";
    }
    function opacityForAngle(angle, assignment) {
      if (angle === null || assignment === "F") return 1;
      return Math.abs(angle) / Math.PI;
    }

    const multiply_vector2_matrix2 = function (vector, matrix) {
      return [
        vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
        vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5],
      ];
    };

    function applyTransformation(vertex, transformations) {
      if (transformations === undefined) { return; }
      transformations = transformations.baseVal;
      for (let i = 0; i < transformations.length; i += 1) {
        const t = transformations[i];
        // const M = [[t.matrix.a, t.matrix.c, t.matrix.e],
        //   [t.matrix.b, t.matrix.d, t.matrix.f], [0, 0, 1]];
        // const out = numeric.dot(M, [vertex.x, vertex.z, 1]);
        // vertex.x = out[0];
        // vertex.z = out[1];
        const m = t.matrix;
        const out = multiply_vector2_matrix2(
          [vertex.x, vertex.z],
          [m.a, m.b, m.c, m.d, m.e, m.f]
        );
        [vertex.x, vertex.z] = out;
      }
    }

    function loadSegmentedSVG(svg) {
      // all lines are at the top level we don't need to recurse down the tree
      const lines = Array.from(svg.childNodes)
        .filter(node => node.tagName === "line");

      // const _$svg = $(svg);

      clearAll();

      // format all appropriate svg elements
      // const $paths = _$svg.find("path");
      // const $lines = _$svg.find("line");
      // const $rects = _$svg.find("rect");
      // const $polygons = _$svg.find("polygon");
      // const $polylines = _$svg.find("polyline");
      // $paths.css({ fill: "none", "stroke-dasharray": "none" });
      // $lines.css({ fill: "none", "stroke-dasharray": "none" });
      // $rects.css({ fill: "none", "stroke-dasharray": "none" });
      // $polygons.css({ fill: "none", "stroke-dasharray": "none" });
      // $polylines.css({ fill: "none", "stroke-dasharray": "none" });

      const add_to_array = function (element, segment_array, target_angle) {
        verticesRaw.push(new THREE$5.Vector3(
          element.x1.baseVal.value, 0, element.y1.baseVal.value
        ));
        verticesRaw.push(new THREE$5.Vector3(
          element.x2.baseVal.value, 0, element.y2.baseVal.value
        ));
        const segment = (target_angle === undefined
          ? [verticesRaw.length - 2, verticesRaw.length - 1]
          : [verticesRaw.length - 2, verticesRaw.length - 1, target_angle]);
        segment_array.push(segment);
        applyTransformation(verticesRaw[verticesRaw.length - 2], element.transform);
        applyTransformation(verticesRaw[verticesRaw.length - 1], element.transform);
      };

      const svg_mountains = lines
        .filter(l => typeForStroke(getStroke(l)) === "mountain");
      const svg_valleys = lines
        .filter(l => typeForStroke(getStroke(l)) === "valley");
      const svg_borders = lines
        .filter(l => typeForStroke(getStroke(l)) === "border");
      const svg_cuts = lines
        .filter(l => typeForStroke(getStroke(l)) === "cut");
      const svg_triangulations = lines
        .filter(l => typeForStroke(getStroke(l)) === "triangulation");
      const svg_hinges = lines
        .filter(l => typeForStroke(getStroke(l)) === "hinge");

      svg_mountains.forEach((m) => {
        const opacity = getOpacity(m);
        add_to_array(m, mountainsRaw, -opacity * Math.PI);
      });
      svg_valleys.forEach((m) => {
        const opacity = getOpacity(m);
        add_to_array(m, valleysRaw, opacity * Math.PI);
      });
      svg_borders.forEach(m => add_to_array(m, bordersRaw));
      svg_cuts.forEach(m => add_to_array(m, cutsRaw));
      svg_triangulations.forEach(m => add_to_array(m, triangulationsRaw));
      svg_hinges.forEach(m => add_to_array(m, hingesRaw));

      if (badColors.length > 0) {
        // badColors = _.uniq(badColors);
        badColors = [...(new Set(badColors))];
        let string = "Some objects found with the following stroke colors:<br/><br/>";
        badColors.forEach((color) => {
          string += `<span style='background:${color}' class='colorSwatch'></span>${color}<br/>`;
        });
        string +=  "<br/>These objects were ignored.<br/>  Please check that your file is set up correctly, <br/>" +
          "see <b>File > File Import Tips</b> for more information.";
        globals.warn(string);
      }

      // todo revert back to old pattern if bad import
      const success = parseSVG(verticesRaw, bordersRaw, mountainsRaw,
        valleysRaw, cutsRaw, triangulationsRaw, hingesRaw);
      if (!success) return;

      // find max and min vertices
      const max = new THREE$5.Vector3(-Infinity, -Infinity, -Infinity);
      const min = new THREE$5.Vector3(Infinity, Infinity, Infinity);
      for (let i = 0; i < rawFold.vertices_coords.length; i += 1) {
        const vertex = new THREE$5.Vector3(rawFold.vertices_coords[i][0],
          rawFold.vertices_coords[i][1], rawFold.vertices_coords[i][2]);
        max.max(vertex);
        min.min(vertex);
      }
      if (min.x === Infinity) {
        if (badColors.length === 0) globals.warn("no geometry found in file");
        return;
      }
      max.sub(min);
      const border = new THREE$5.Vector3(0.1, 0, 0.1);
      let scale = max.x;
      if (max.z < scale) scale = max.z;
      if (scale === 0) return;

      const strokeWidth = scale / 300;
      border.multiplyScalar(scale);
      min.sub(border);
      max.add(border.multiplyScalar(2));
      const viewBoxTxt = [min.x, min.z, max.x, max.z].join(" ");

      const ns = "http://www.w3.org/2000/svg";
      const newSVG = win.document.createElementNS(ns, "svg");
      newSVG.setAttribute("viewBox", viewBoxTxt);
      for (let i = 0; i < rawFold.edges_vertices.length; i += 1) {
        const line = win.document.createElementNS(ns, "line");
        const edge = rawFold.edges_vertices[i];
        let vertex = rawFold.vertices_coords[edge[0]];
        line.setAttribute("stroke", colorForAssignment(rawFold.edges_assignment[i]));
        line.setAttribute("opacity", opacityForAngle(rawFold.edges_foldAngle[i], rawFold.edges_assignment[i]));
        line.setAttribute("x1", vertex[0]);
        line.setAttribute("y1", vertex[2]);
        vertex = rawFold.vertices_coords[edge[1]];
        line.setAttribute("x2", vertex[0]);
        line.setAttribute("y2", vertex[2]);
        line.setAttribute("stroke-width", strokeWidth);
        newSVG.appendChild(line);
      }
      // $("#svgViewer").html(newSVG);
      // window.document.querySelector("#svgViewer").innerHTML = newSVG;
    }

    function loadSVG(svg) {
      const segmentized = Segmentize(svg, { svg: true, string: false });
      // const segmentized = new DOMParser().parseFromString(segmentizedString, "text/xml").childNodes[0];
      console.log("segmentized", segmentized);
      loadSegmentedSVG(segmentized);
    }

    function processFold(fold, returnCreaseParams) {

      rawFold = JSON.parse(JSON.stringify(fold)); // save pre-triangulated for for save later
      // make 3d
      for (let i = 0; i < rawFold.vertices_coords.length; i += 1) {
        const vertex = rawFold.vertices_coords[i];
        if (vertex.length === 2) { // make vertices_coords 3d
          rawFold.vertices_coords[i] = [vertex[0], 0, vertex[1]];
        }
      }
      // const cuts = FOLD.filter.cutEdges(fold);
      const cuts = [];
      if (cuts.length > 0) {
        fold = splitCuts(fold);
        fold = FOLD.convert.edges_vertices_to_vertices_vertices_unsorted(fold);
        fold = removeRedundantVertices(fold, 0.01); // remove vertices that split edge
      }
      delete fold.vertices_vertices;
      delete fold.vertices_edges;

      foldData = triangulatePolys(fold, true);

      for (let i = 0; i < foldData.vertices_coords.length; i += 1) {
        const vertex = foldData.vertices_coords[i];
        if (vertex.length === 2) { // make vertices_coords 3d
          foldData.vertices_coords[i] = [vertex[0], 0, vertex[1]];
        }
      }

      mountains = FOLD.filter.mountainEdges(foldData);
      valleys = FOLD.filter.valleyEdges(foldData);
      borders = FOLD.filter.boundaryEdges(foldData);
      hinges = FOLD.filter.unassignedEdges(foldData);
      triangulations = FOLD.filter.flatEdges(foldData);

      // $("#numMtns").html("(" + mountains.length + ")");
      // $("#numValleys").html("(" + valleys.length + ")");
      // $("#numFacets").html("(" + triangulations.length + ")");
      // $("#numBoundary").html("(" + borders.length + ")");
      // $("#numPassive").html("(" + hinges.length + ")");

      const allCreaseParams = getFacesAndVerticesForEdges(foldData); // todo precompute vertices_faces
      if (returnCreaseParams) return allCreaseParams;

      globals.model.buildModel(foldData, allCreaseParams);
      return foldData;
    }


    function parseSVG(_verticesRaw, _bordersRaw, _mountainsRaw, _valleysRaw, _cutsRaw, _triangulationsRaw, _hingesRaw) {

      _verticesRaw.forEach((vertex) => {
        foldData.vertices_coords.push([vertex.x, vertex.z]);
      });
      _bordersRaw.forEach((edge) => {
        foldData.edges_vertices.push([edge[0], edge[1]]);
        foldData.edges_assignment.push("B");
        foldData.edges_foldAngle.push(null);
      });
      _mountainsRaw.forEach((edge) => {
        foldData.edges_vertices.push([edge[0], edge[1]]);
        foldData.edges_assignment.push("M");
        foldData.edges_foldAngle.push(edge[2]);
      });
      _valleysRaw.forEach((edge) => {
        foldData.edges_vertices.push([edge[0], edge[1]]);
        foldData.edges_assignment.push("V");
        foldData.edges_foldAngle.push(edge[2]);
      });
      _triangulationsRaw.forEach((edge) => {
        foldData.edges_vertices.push([edge[0], edge[1]]);
        foldData.edges_assignment.push("F");
        foldData.edges_foldAngle.push(0);
      });
      _hingesRaw.forEach((edge) => {
        foldData.edges_vertices.push([edge[0], edge[1]]);
        foldData.edges_assignment.push("U");
        foldData.edges_foldAngle.push(null);
      });
      _cutsRaw.forEach((edge) => {
        foldData.edges_vertices.push([edge[0], edge[1]]);
        foldData.edges_assignment.push("C");
        foldData.edges_foldAngle.push(null);
      });

      if (foldData.vertices_coords.length === 0 || foldData.edges_vertices.length === 0) {
        globals.warn("No valid geometry found in SVG, be sure to ungroup all and remove all clipping masks.");
        return false;
      }

      foldData = FOLD.filter.collapseNearbyVertices(foldData, globals.vertTol);
      // foldData = FOLD.filter.removeLoopEdges(foldData); // remove edges that points to same vertex
      FOLD.filter.removeLoopEdges(foldData); // remove edges that points to same vertex
      // foldData = FOLD.filter.removeDuplicateEdges_vertices(foldData); // remove duplicate edges
      // foldData = FOLD.filter.subdivideCrossingEdges_vertices(foldData, globals.vertTol);
      // find intersections and add vertices/edges
      FOLD.filter.subdivideCrossingEdges_vertices(foldData, globals.vertTol);
      foldData = findIntersections(foldData, globals.vertTol);
       // cleanup after intersection operation
      foldData = FOLD.filter.collapseNearbyVertices(foldData, globals.vertTol);
      // foldData = FOLD.filter.removeLoopEdges(foldData); // remove edges that points to same vertex
      FOLD.filter.removeLoopEdges(foldData); // remove edges that points to same vertex
      // foldData = FOLD.filter.removeDuplicateEdges_vertices(foldData); // remove duplicate edges
      FOLD.filter.removeDuplicateEdges_vertices(foldData); // remove duplicate edges
      foldData = FOLD.convert.edges_vertices_to_vertices_vertices_unsorted(foldData);
      foldData = removeStrayVertices(foldData); // delete stray anchors
      foldData = removeRedundantVertices(foldData, 0.01); // remove vertices that split edge
      FOLD.convert.sort_vertices_vertices(foldData);
      foldData = FOLD.convert.vertices_vertices_to_faces_vertices(foldData);
      foldData = edgesVerticesToVerticesEdges(foldData);
      foldData = removeBorderFaces(foldData); // expose holes surrounded by all border edges
      foldData = reverseFaceOrder(foldData); // set faces to counter clockwise
      return processFold(foldData);
    }

    function makeVector(v) {
      if (v.length === 2) return makeVector2(v);
      return makeVector3(v);
    }
    function makeVector2(v) {
      return new THREE$5.Vector2(v[0], v[1]);
    }
    function makeVector3(v) {
      return new THREE$5.Vector3(v[0], v[1], v[2]);
    }

    function getDistFromEnd(t, length, tol) {
      const dist = t * length;
      if (dist < -tol) return null;
      if (dist > length + tol) return null;
      return dist;
    }

    // http://paulbourke.net/geometry/pointlineplane/
    function line_intersect(v1, v2, v3, v4) {
      const x1 = v1.x;
      const y1 = v1.y;
      const x2 = v2.x;
      const y2 = v2.y;
      const x3 = v3.x;
      const y3 = v3.y;
      const x4 = v4.x;
      const y4 = v4.y;
      const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
      if (denom === 0) {
        return null;
      }
      const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
      const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
      return {
        intersection: new THREE$5.Vector2(x1 + ua * (x2 - x1), y1 + ua * (y2 - y1)),
        t1: ua,
        t2: ub
      };
    }

    function getFoldData(raw) {
      if (raw) return rawFold;
      return foldData;
    }

    function setFoldData(fold, returnCreaseParams) {
      clearAll();
      return processFold(fold, returnCreaseParams);
    }

    function getTriangulatedFaces() {
      return foldData.faces_vertices;
    }

    function reverseFaceOrder(fold) {
      for (let i = 0; i < fold.faces_vertices.length; i += 1) {
        fold.faces_vertices[i].reverse();
      }
      return fold;
    }

    function edgesVerticesToVerticesEdges(fold) {
      const verticesEdges = [];
      for (let i = 0; i < fold.vertices_coords.length; i += 1) {
        verticesEdges.push([]);
      }
      for (let i = 0; i < fold.edges_vertices.length; i += 1) {
        const edge = fold.edges_vertices[i];
        verticesEdges[edge[0]].push(i);
        verticesEdges[edge[1]].push(i);
      }
      fold.vertices_edges = verticesEdges;
      return fold;
    }

    function facesVerticesToVerticesFaces(fold) {
      const verticesFaces = [];
      for (let i = 0; i < fold.vertices_coords.length; i += 1) {
        verticesFaces.push([]);
      }
      for (let i = 0; i < fold.faces_vertices.length; i += 1) {
        const face = fold.faces_vertices[i];
        for (let j = 0; j < face.length; j += 1) {
          verticesFaces[face[j]].push(i);
        }
      }
      fold.vertices_faces = verticesFaces;
      return fold;
    }

    function sortVerticesEdges(fold) {
      for (let i = 0; i < fold.vertices_vertices.length; i += 1) {
        const verticesVertices = fold.vertices_vertices[i];
        const verticesEdges = fold.vertices_edges[i];
        const sortedVerticesEdges = [];
        for (let j = 0; j < verticesVertices.length; j += 1) {
          let index = -1;
          for (let k = 0; k < verticesEdges.length; k += 1) {
            const edgeIndex = verticesEdges[k];
            const edge = fold.edges_vertices[edgeIndex];
            if (edge.indexOf(verticesVertices[j]) >= 0) {
              index = edgeIndex;
              break;
            }
          }
          if (index < 0) console.warn("no matching edge found, fix this");
          sortedVerticesEdges.push(index);
        }
        fold.vertices_edges[i] = sortedVerticesEdges;
      }
      return fold;
    }

    function splitCuts(fold) {
      fold = sortVerticesEdges(fold);
      fold = facesVerticesToVerticesFaces(fold);
      // go around each vertex and split cut in clockwise order
      for (let i = 0; i < fold.vertices_edges.length; i += 1) {
        const groups = [[]];
        let groupIndex = 0;
        const verticesEdges = fold.vertices_edges[i];
        const verticesFaces = fold.vertices_faces[i];
        for (let j = 0; j < verticesEdges.length; j += 1) {
          const edgeIndex = verticesEdges[j];
          const assignment = fold.edges_assignment[edgeIndex];
          groups[groupIndex].push(edgeIndex);
          if (assignment === "C") {
            // split cut edge into two boundary edges
            groups.push([fold.edges_vertices.length]);
            groupIndex += 1;
            const newEdgeIndex = fold.edges_vertices.length;
            const edge = fold.edges_vertices[edgeIndex];
            fold.edges_vertices.push([edge[0], edge[1]]);
            fold.edges_assignment[edgeIndex] = "B";
            fold.edges_foldAngle.push(null);
            fold.edges_assignment.push("B");
            // add new boundary edge to other vertex
            let otherVertex = edge[0];
            if (otherVertex === i) otherVertex = edge[1];
            const otherVertexEdges = fold.vertices_edges[otherVertex];
            const otherVertexEdgeIndex = otherVertexEdges.indexOf(edgeIndex);
            otherVertexEdges.splice(otherVertexEdgeIndex, 0, newEdgeIndex);
          } else if (assignment === "B") {
            if (j === 0 && verticesEdges.length > 1) {
              // check if next edge is also boundary
              const nextEdgeIndex = verticesEdges[1];
              if (fold.edges_assignment[nextEdgeIndex] === "B") {
                // check if this edge shares a face with the next
                const edge = fold.edges_vertices[edgeIndex];
                let otherVertex = edge[0];
                if (otherVertex === i) { otherVertex = edge[1]; }
                const nextEdge = fold.edges_vertices[nextEdgeIndex];
                let nextVertex = nextEdge[0];
                if (nextVertex === i) { nextVertex = nextEdge[1]; }
                if (connectedByFace(fold, fold.vertices_faces[i], otherVertex, nextVertex)) ; else {
                  groups.push([]);
                  groupIndex += 1;
                }
              }
            } else if (groups[groupIndex].length > 1) {
              groups.push([]);
              groupIndex += 1;
            }
          }
        }
        if (groups.length <= 1) continue;
        for (let k = groups[groupIndex].length - 1; k >= 0; k -= 1) {
          // put remainder of last group in first group
          groups[0].unshift(groups[groupIndex][k]);
        }
        groups.pop();
        for (let j = 1; j < groups.length; j += 1) { // for each extra group, assign new vertex
          const currentVertex = fold.vertices_coords[i];
          const vertIndex = fold.vertices_coords.length;
          fold.vertices_coords.push(currentVertex.slice()); // make a copy
          const connectingIndices = [];
          for (let k = 0; k < groups[j].length; k += 1) { // update edges_vertices
            const edgeIndex = groups[j][k];
            const edge = fold.edges_vertices[edgeIndex];
            let otherIndex = edge[0];
            if (edge[0] === i) {
              edge[0] = vertIndex;
              otherIndex = edge[1];
            } else edge[1] = vertIndex;
            connectingIndices.push(otherIndex);
          }
          if (connectingIndices.length < 2) {
            console.warn("problem here");
          } else {
            for (let k = 1; k < connectingIndices.length; k += 1) { // update faces_vertices
              // i, k-1, k
              const thisConnectingVertIndex = connectingIndices[k];
              const previousConnectingVertIndex = connectingIndices[k - 1];
              let found = false;
              for (let a = 0; a < verticesFaces.length; a += 1) {
                const face = fold.faces_vertices[verticesFaces[a]];
                const index1 = face.indexOf(thisConnectingVertIndex);
                const index2 = face.indexOf(previousConnectingVertIndex);
                const index3 = face.indexOf(i);
                if (index1 >= 0 && index2 >= 0 && index3 >= 0
                  && (Math.abs(index1 - index3) === 1
                    || Math.abs(index1 - index3) === face.length - 1)
                  && (Math.abs(index2 - index3) === 1
                    || Math.abs(index2 - index3) === face.length - 1)) {
                  found = true;
                  face[index3] = vertIndex;
                  break;
                }
              }
              if (!found) console.warn("problem here");
            }
          }
        }
      }
      // these are all incorrect now
      delete fold.vertices_faces;
      delete fold.vertices_edges;
      delete fold.vertices_vertices;
      return fold;
    }

    function connectedByFace(fold, verticesFaces, vert1, vert2) {
      if (vert1 === vert2) return false;
      for (let a = 0; a < verticesFaces.length; a += 1) {
        const face = fold.faces_vertices[verticesFaces[a]];
        if (face.indexOf(vert1) >= 0 && face.indexOf(vert2) >= 0) {
          return true;
        }
      }
      return false;
    }

    function removeBorderFaces(fold) {
      for (let i = fold.faces_vertices.length - 1; i >= 0; i -= 1) {
        const face = fold.faces_vertices[i];
        let allBorder = true;

        for (let j = 0; j < face.length; j += 1) {
          const vertexIndex = face[j];
          let nextIndex = j + 1;
          if (nextIndex >= face.length) nextIndex = 0;
          const nextVertexIndex = face[nextIndex];
          let connectingEdgeFound = false;
          for (let k = 0; k < fold.vertices_edges[vertexIndex].length; k += 1) {
            const edgeIndex = fold.vertices_edges[vertexIndex][k];
            const edge = fold.edges_vertices[edgeIndex];
            if ((edge[0] === vertexIndex && edge[1] === nextVertexIndex)
              || (edge[1] === vertexIndex && edge[0] === nextVertexIndex)) {
              connectingEdgeFound = true;
              const assignment = fold.edges_assignment[edgeIndex];
              if (assignment !== "B") {
                allBorder = false;
                break;
              }
            }
          }
          if (!connectingEdgeFound) console.warn("no connecting edge found on face");
          if (!allBorder) break;
        }
        if (allBorder) fold.faces_vertices.splice(i, 1);
      }
      return fold;
    }

    function getFacesAndVerticesForEdges(fold) {
      const allCreaseParams = []; // face1Ind, vertInd, face2Ind, ver2Ind, edgeInd, angle
      const faces = fold.faces_vertices;
      for (let i = 0; i < fold.edges_vertices.length; i += 1) {
        const assignment = fold.edges_assignment[i];
        if (assignment !== "M" && assignment !== "V" && assignment !== "F") {
          continue;
        }
        const edge = fold.edges_vertices[i];
        const v1 = edge[0];
        const v2 = edge[1];
        let creaseParams = [];
        for (let j = 0; j < faces.length; j += 1) {
          const face = faces[j];
          const faceVerts = [face[0], face[1], face[2]];
          const v1Index = faceVerts.indexOf(v1);
          if (v1Index >= 0) {
            const v2Index = faceVerts.indexOf(v2);
            if (v2Index >= 0) {
              creaseParams.push(j);
              if (v2Index > v1Index) {
                faceVerts.splice(v2Index, 1);
                faceVerts.splice(v1Index, 1);
              } else {
                faceVerts.splice(v1Index, 1);
                faceVerts.splice(v2Index, 1);
              }
              creaseParams.push(faceVerts[0]);
              if (creaseParams.length === 4) {
                if (v2Index - v1Index === 1 || v2Index - v1Index === -2) {
                  creaseParams = [creaseParams[2], creaseParams[3], creaseParams[0], creaseParams[1]];
                }
                creaseParams.push(i);
                const angle = fold.edges_foldAngle[i];
                creaseParams.push(angle);
                allCreaseParams.push(creaseParams);
                break;
              }
            }
          }
        }
      }
      return allCreaseParams;
    }

    function removeRedundantVertices(fold, epsilon) {
      const old2new = [];
      let numRedundant = 0;
      let newIndex = 0;
      for (let i = 0; i < fold.vertices_vertices.length; i += 1) {
        const vertex_vertices = fold.vertices_vertices[i];
        if (vertex_vertices.length !== 2) {
          old2new.push(newIndex++);
          continue;
        }
        const vertex_coord = fold.vertices_coords[i];
        const neighbor0 = fold.vertices_coords[vertex_vertices[0]];
        const neighbor1 = fold.vertices_coords[vertex_vertices[1]];
        const threeD = vertex_coord.length === 3;
        const vec0 = [neighbor0[0] - vertex_coord[0], neighbor0[1] - vertex_coord[1]];
        const vec1 = [neighbor1[0] - vertex_coord[0], neighbor1[1] - vertex_coord[1]];
        let magSqVec0 = vec0[0] * vec0[0] + vec0[1] * vec0[1];
        let magSqVec1 = vec1[0] * vec1[0] + vec1[1] * vec1[1];
        let dot = vec0[0] * vec1[0] + vec0[1] * vec1[1];
        if (threeD) {
          vec0.push(neighbor0[2] - vertex_coord[2]);
          vec1.push(neighbor1[2] - vertex_coord[2]);
          magSqVec0 += vec0[2] * vec0[2];
          magSqVec1 += vec1[2] * vec1[2];
          dot += vec0[2] * vec1[2];
        }
        dot /= Math.sqrt(magSqVec0 * magSqVec1);
        if (Math.abs(dot + 1.0) < epsilon) {
          let merged = mergeEdge(fold, vertex_vertices[0], i, vertex_vertices[1]);
          if (merged) {
            numRedundant += 1;
            old2new.push(null);
          } else {
            old2new.push(newIndex++);
            continue;
          }
        } else old2new.push(newIndex++);
      }
      if (numRedundant === 0) { return fold; }
      console.warn(`${numRedundant} redundant vertices found`);
      fold = FOLD.filter.remapField(fold, "vertices", old2new);
      if (fold.faces_vertices) {
        for (let i = 0; i < fold.faces_vertices.length; i += 1) {
          const face = fold.faces_vertices[i];
          for (let j = face.length - 1; j >= 0; j -= 1) {
            if (face[j] === null) face.splice(j, 1);
          }
        }
      }
      return fold;
    }

    function mergeEdge(fold, v1, v2, v3) { // v2 is center vertex
      let angleAvg = 0;
      let avgSum = 0;
      const angles = [];
      let edgeAssignment = null;
      const edgeIndices = [];
      for (let i = fold.edges_vertices.length - 1; i >= 0; i -= 1) {
        const edge = fold.edges_vertices[i];
        if (edge.indexOf(v2) >= 0 && (edge.indexOf(v1) >= 0 || edge.indexOf(v3) >= 0)) {
          if (edgeAssignment === null) edgeAssignment = fold.edges_assignment[i];
          else if (edgeAssignment !== fold.edges_assignment[i]) {
            console.log(edgeAssignment, fold.edges_assignment[i]);
            console.warn("different edge assignments");
            return false;
          }
          var angle = fold.edges_foldAngle[i];
          if (isNaN(angle)) console.log(i);
          angles.push(angle);
          if (angle) {
            angleAvg += angle;
            avgSum += 1;
          }
          edgeIndices.push(i);//larger index in front
        }
      }
      if (angles[0] !== angles[1]) {
        console.warn("incompatible angles: " + JSON.stringify(angles));
      }
      for (let i = 0; i < edgeIndices.length; i += 1) {
        const index = edgeIndices[i];
        fold.edges_vertices.splice(index, 1);
        fold.edges_assignment.splice(index, 1);
        fold.edges_foldAngle.splice(index, 1);
      }
      fold.edges_vertices.push([v1, v3]);
      fold.edges_assignment.push(edgeAssignment);
      if (avgSum > 0) fold.edges_foldAngle.push(angleAvg / avgSum);
      else fold.edges_foldAngle.push(null);
      let index = fold.vertices_vertices[v1].indexOf(v2);
      fold.vertices_vertices[v1].splice(index, 1);
      fold.vertices_vertices[v1].push(v3);
      index = fold.vertices_vertices[v3].indexOf(v2);
      fold.vertices_vertices[v3].splice(index, 1);
      fold.vertices_vertices[v3].push(v1);
      return true;
    }

    function removeStrayVertices(fold) {
      if (!fold.vertices_vertices) {
        console.warn("compute vertices_vertices first");
        fold = FOLD.convert.edges_vertices_to_vertices_vertices_unsorted(fold);
      }
      let numStrays = 0;
      const old2new = [];
      let newIndex = 0;
      for (let i = 0; i < fold.vertices_vertices.length; i += 1) {
        if (fold.vertices_vertices[i] === undefined || fold.vertices_vertices[i].length === 0) {
          numStrays++;
          old2new.push(null);
        } else old2new.push(newIndex++);
      }
      if (numStrays === 0) return fold;
      console.warn(`${numStrays} stray vertices found`);
      return FOLD.filter.remapField(fold, "vertices", old2new);
    }

    function triangulatePolys(fold, is2d) {
      const vertices = fold.vertices_coords;
      const faces = fold.faces_vertices;
      const edges = fold.edges_vertices;
      const foldAngles = fold.edges_foldAngle;
      const assignments = fold.edges_assignment;
      const triangulatedFaces = [];
      for (let i = 0; i < faces.length; i += 1) {

        const face = faces[i];

        if (face.length === 3) {
          triangulatedFaces.push(face);
          continue;
        }

        // check for quad and solve manually
        if (face.length === 4) {
          const faceV1 = makeVector(vertices[face[0]]);
          const faceV2 = makeVector(vertices[face[1]]);
          const faceV3 = makeVector(vertices[face[2]]);
          const faceV4 = makeVector(vertices[face[3]]);
          const dist1 = (faceV1.clone().sub(faceV3)).lengthSq();
          const dist2 = (faceV2.clone().sub(faceV4)).lengthSq();
          if (dist2 < dist1) {
            edges.push([face[1], face[3]]);
            foldAngles.push(0);
            assignments.push("F");
            triangulatedFaces.push([face[0], face[1], face[3]]);
            triangulatedFaces.push([face[1], face[2], face[3]]);
          } else {
            edges.push([face[0], face[2]]);
            foldAngles.push(0);
            assignments.push("F");
            triangulatedFaces.push([face[0], face[1], face[2]]);
            triangulatedFaces.push([face[0], face[2], face[3]]);
          }
          continue;
        }

        const faceEdges = [];
        for (let j = 0; j < edges.length; j += 1) {
          const edge = edges[j];
          if (face.indexOf(edge[0]) >= 0 && face.indexOf(edge[1]) >= 0) {
            faceEdges.push(j);
          }
        }

        const faceVert = [];
        for (let j = 0; j < face.length; j += 1) {
          const vertex = vertices[face[j]];
          faceVert.push(vertex[0]);
          faceVert.push(vertex[1]);
          if (!is2d) faceVert.push(vertex[2]);
        }

        const triangles = earcut(faceVert, null, is2d ? 2 : 3);

        for (let j = 0; j < triangles.length; j += 3) {
          const tri = [face[triangles[j + 2]], face[triangles[j + 1]], face[triangles[j]]];
          const foundEdges = [false, false, false]; // ab, bc, ca

          for (let k = 0; k < faceEdges.length; k += 1) {
            const edge = edges[faceEdges[k]];

            const aIndex = edge.indexOf(tri[0]);
            const bIndex = edge.indexOf(tri[1]);
            const cIndex = edge.indexOf(tri[2]);

            if (aIndex >= 0) {
              if (bIndex >= 0) {
                foundEdges[0] = true;
                continue;
              }
              if (cIndex >= 0) {
                foundEdges[2] = true;
                continue;
              }
            }
            if (bIndex >= 0) {
              if (cIndex >= 0) {
                foundEdges[1] = true;
                continue;
              }
            }
          }

          for (let k = 0; k < 3; k += 1) {
            if (foundEdges[k]) continue;
            if (k === 0) {
              faceEdges.push(edges.length);
              edges.push([tri[0], tri[1]]);
              foldAngles.push(0);
              assignments.push("F");
            } else if (k === 1) {
              faceEdges.push(edges.length);
              edges.push([tri[2], tri[1]]);
              foldAngles.push(0);
              assignments.push("F");
            } else if (k === 2) {
              faceEdges.push(edges.length);
              edges.push([tri[2], tri[0]]);
              foldAngles.push(0);
              assignments.push("F");
            }
          }

          triangulatedFaces.push(tri);
        }
      }
      fold.faces_vertices = triangulatedFaces;
      return fold;
    }

    function saveSVG() {
      if (globals.extension === "fold") {
        // todo solve for crease pattern
        globals.warn("No crease pattern available for files imported from FOLD format.");
        return;
      }
      const serializer = new win.XMLSerializer();
      console.log("pattern.js saveSVG needs testing, check out these 2 lines");
      const getSVG = win.document.querySelector("#svgViewer>svg");
      const source = serializer.serializeToString(getSVG);
      // const source = serializer.serializeToString(getSVG[0]);
      
      // const source = serializer.serializeToString($("#svgViewer>svg").get(0));
      const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = win.document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `${globals.filename}.svg`;
      win.document.body.appendChild(downloadLink);
      downloadLink.click();
      win.document.body.removeChild(downloadLink);
    }

    function findIntersections(fold, tol) {
      const vertices = fold.vertices_coords;
      const edges = fold.edges_vertices;
      const foldAngles = fold.edges_foldAngle;
      const assignments = fold.edges_assignment;
      for (let i = edges.length - 1; i >= 0; i -= 1) {
        for (let j = i - 1; j >= 0; j -= 1) {
          const v1 = makeVector2(vertices[edges[i][0]]);
          const v2 = makeVector2(vertices[edges[i][1]]);
          const v3 = makeVector2(vertices[edges[j][0]]);
          const v4 = makeVector2(vertices[edges[j][1]]);
          const data = line_intersect(v1, v2, v3, v4);
          if (data) {
            const length1 = (v2.clone().sub(v1)).length();
            const length2 = (v4.clone().sub(v3)).length();
            const d1 = getDistFromEnd(data.t1, length1, tol);
            const d2 = getDistFromEnd(data.t2, length2, tol);
            if (d1 === null || d2 === null) continue; // no crossing

            const seg1Int = d1 > tol && d1 < length1 - tol;
            const seg2Int = d2 > tol && d2 < length2 - tol;
            if (!seg1Int && !seg2Int) continue; // intersects at endpoints only

            let vertIndex;
            if (seg1Int && seg2Int) {
              vertIndex = vertices.length;
              vertices.push([data.intersection.x, data.intersection.y]);
            } else if (seg1Int) {
              if (d2 <= tol) vertIndex = edges[j][0];
              else vertIndex = edges[j][1];
            } else {
              if (d1 <= tol) vertIndex = edges[i][0];
              else vertIndex = edges[i][1];
            }

            if (seg1Int) {
              let foldAngle = foldAngles[i];
              let assignment = assignments[i];
              edges.splice(i, 1, [vertIndex, edges[i][0]], [vertIndex, edges[i][1]]);
              foldAngles.splice(i, 1, foldAngle, foldAngle);
              assignments.splice(i, 1, assignment, assignment);
              i += 1;
            }
            if (seg2Int) {
              let foldAngle = foldAngles[j];
              let assignment = assignments[j];
              edges.splice(j, 1, [vertIndex, edges[j][0]], [vertIndex, edges[j][1]]);
              foldAngles.splice(j, 1, foldAngle, foldAngle);
              assignments.splice(j, 1, assignment, assignment);
              j += 1;
              i += 1;
            }
          }
        }
      }
      return fold;
    }

    return {
      loadSVG,
      saveSVG,
      getFoldData,
      getTriangulatedFaces,
      setFoldData
    };
  }

  /**
   * Created by ghassaei on 2/22/17.
   */
  // import Controls from "./controls"; // this file is all kinds of front-end hardcoded
  // import Importer from "./importer"; // also needs refactoring
  // import Vive from "./VRInterface";  // haven't touched yet
  // import VideoAnimator from "./videoAnimator"; // haven't touched yet


  /**
   * return a copy of the user's options object that contains only keys
   * matching valid options parameters, taken from "globals.js"
   */
  const validateUserOptions = function (options) {
    if (options == null) { return {}; }
    const validKeys = Object.keys(globalDefaults);
    const validatedOptions = {};
    Object.keys(options)
      .filter(key => validKeys.includes(key))
      .forEach((key) => { validatedOptions[key] = options[key]; });
    return validatedOptions;
  };


  const OrigamiSimulator = function (options) {
    const app = Object.assign(
      JSON.parse(JSON.stringify(globalDefaults)),
      validateUserOptions(options)
    );
    if (app.append == null) { app.append = win.document.body; }


    /** initialize the app */
    app.threeView = initThreeView(app);
    // app.controls = Controls(app);
    app.UI3D = init3DUI(app);
    // app.importer = Importer(app);
    app.model = initModel(app);
    app.gpuMath = initGPUMath();
    app.dynamicSolver = initDynamicSolver(app);
    app.pattern = initPattern(app);
    // app.vive = Vive(app);
    // app.videoAnimator = VideoAnimator(app);


    // object methods
    const loadSVG = function (svgAsDomNode) {
      app.threeView.resetModel();
      app.pattern.loadSVG(svgAsDomNode);
    };
    const loadSVGString = function (svgAsString) {
      app.threeView.resetModel();
      const svg = new DOMParser().parseFromString(svgAsString, "text/xml").childNodes[0];
      app.pattern.loadSVG(svg);
    };
    const warn = msg => console.warn(msg);
    const noCreasePatternAvailable = () => app.extension === "fold";
    const setTouchModeRotate = function () {
      app.touchMode = "rotate";
      app.threeView.enableCameraRotate(true);
      app.UI3D.hideHighlighters();
    };
    const setTouchModeGrab = function () {
      app.touchMode = "grab";
      app.threeView.enableCameraRotate(false);
      app.threeView.resetModel();
    };

    Object.defineProperty(app, "loadSVG", { value: loadSVG });
    Object.defineProperty(app, "loadSVGString", { value: loadSVGString });
    Object.defineProperty(app, "warn", { value: warn });
    Object.defineProperty(app, "noCreasePatternAvailable", { value: noCreasePatternAvailable });
    Object.defineProperty(app, "grab", {
      set: value => (value ? setTouchModeGrab() : setTouchModeRotate()),
      get: () => app.touchMode === "grab"
    });
    Object.defineProperty(app, "foldPercent", {
      set: (value) => {
        app.creasePercent = value;
        app.shouldChangeCreasePercent = true;
      },
      get: () => app.creasePercent
    });
    Object.defineProperty(app, "strain", {
      set: (value) => {
        app.colorMode = (value ? "axialStrain" : "color");
        app.model.setMeshMaterial();
      },
      get: () => app.colorMode === "axialStrain"
    });

    return app;
  };

  return OrigamiSimulator;

})));
