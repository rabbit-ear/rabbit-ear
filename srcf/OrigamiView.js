/** 
 * this extends FoldView to add interaction
 */

"use strict";

import SVG from "./SimpleSVG";
import FoldView from "./FoldView";

export default function OrigamiView(args){

	let {cp, svg, boundaryGroup, facesGroup, creasesGroup, 
	     verticesGroup, frame, zoom, padding, style, setPadding,
	     draw, setViewBox} = FoldView(args);

	// implement these, they will get called when the event fires
	this.event = {
		animate: function(){},
		onResize: function(){},
		onMouseMove: function(){},
		onMouseDown: function(){},
		onMouseUp: function(){},
		onMouseDidBeginDrag: function(){},
	}

	// expose these functions to the user
	let line = SVG.line;
	let circle = SVG.circle;
	let polygon = SVG.polygon;
	let bezier = SVG.bezier;
	let group = SVG.group;
	let addClass = SVG.addClass;
	let removeClass = SVG.removeClass;
	let setId = SVG.setId;
	let removeChildren = SVG.removeChildren;
	let convertToViewbox = SVG.convertToViewbox;

	// interaction behavior
	let mouse = {
		// position: {"x":0,"y":0},// the current position of the mouse
		position: [],
		pressed: {"x":0,"y":0}, // the last location the mouse was pressed
		isPressed: false,       // is the mouse button pressed (y/n)
		isDragging: false       // is the mouse moving while pressed (y/n)
	};
	var frameNum = 0;

	// update FoldView member variables to
	style.sector = {scale: 0.5};  // radius of sector wedges
	style.face = {scale:1.0};     // shrink scale of each face
	style.selected = {
		node:{ radius: 0.02 },
		edge:{ strokeColor:{ hue:0, saturation:0.8, brightness:1 } },
		face:{ fillColor:{ hue:0, saturation:0.8, brightness:1 } }
	};

	var thaaar = this;
	svg.onmousedown = function(event){
		mouse.isPressed = true;
		mouse.isDragging = false;
		mouse.pressed = convertToViewbox(svg, event.clientX, event.clientY);
		// attemptSelection();
		thaaar.event.onMouseDown(mouse);
	};
	svg.onmouseup = function(event){
		mouse.isPressed = false;
		mouse.isDragging = false;
		selectedTouchPoint = undefined;
		thaaar.event.onMouseUp(mouse);
	};
	svg.onmousemove = function(event){
		mouse.position = convertToViewbox(svg, event.clientX, event.clientY);
		if(mouse.isPressed){
			if(mouse.isDragging === false){
				mouse.isDragging = true;
				thaaar.event.onMouseDidBeginDrag(mouse);
			}
		}
		// updateSelection();
		thaaar.event.onMouseMove(mouse);
	};
	svg.onResize = function(event){
		thaaar.event.onResize(event);
	};

	// javascript get Date()
	// todo: watch for the variable getting set
	animateTimer = setInterval(function(){
		if(typeof thaaar.event.animate === "function"){
			thaaar.event.animate({"time":svg.getCurrentTime(), "frame":frameNum});
		}
		frameNum += 1;
	}, 1000/60);

	return Object.freeze({
		cp,
		svg,
		boundaryGroup,
		facesGroup,
		creasesGroup,
		verticesGroup,
		frame,
		zoom,
		padding,
		style,
		setPadding,
		draw,
		setViewBox,

		mouse,
		event:this.event,

		line,
		circle,
		polygon,
		bezier,
		group,
		addClass,
		removeClass,
		setId,
		removeChildren,
		convertToViewbox,
	});

}
