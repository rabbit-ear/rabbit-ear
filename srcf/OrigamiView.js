/** 
 * this extends FoldView to add interaction
 */

"use strict";

import SVG from "./SimpleSVG";
import FoldView from "./FoldView";

export default function OrigamiView(args){

	let that = FoldView(args);

	// implement these, they will get called when the event fires
	that.onResize = function(event){ }
	that.animate = function(event){ }
	that.onMouseDown = function(event){ }
	that.onMouseUp = function(event){ }
	that.onMouseMove = function(event){ }
	that.onMouseDidBeginDrag = function(event){ }

	// expose these functions to the user
	that.line = SVG.line;
	that.circle = SVG.circle;
	that.polygon = SVG.polygon;
	that.bezier = SVG.bezier;
	that.group = SVG.group;
	that.addClass = SVG.addClass;
	that.removeClass = SVG.removeClass;
	that.setId = SVG.setId;
	that.removeChildren = SVG.removeChildren;
	that.convertToViewbox = SVG.convertToViewbox;

	// interaction behavior
	that.mouse = {
		position: {"x":0,"y":0},// the current position of the mouse
		pressed: {"x":0,"y":0}, // the last location the mouse was pressed
		isPressed: false,       // is the mouse button pressed (y/n)
		isDragging: false       // is the mouse moving while pressed (y/n)
	};
	that.style.sector = {scale: 0.5};  // radius of sector wedges
	that.style.face = {scale:1.0};     // shrink scale of each face
	that.style.selected = {
		node:{ radius: 0.02 },
		edge:{ strokeColor:{ hue:0, saturation:0.8, brightness:1 } },
		face:{ fillColor:{ hue:0, saturation:0.8, brightness:1 } }
	};

	that.svg.onmousedown = function(event){
		that.mouse.isPressed = true;
		that.mouse.isDragging = false;
		that.mouse.pressed = that.convertToViewbox(that.svg,
												   event.clientX,
												   event.clientY);
		// that.attemptSelection();
		that.onMouseDown( {point:Object.assign({}, that.mouse.pressed)} );
	};
	that.svg.onmouseup = function(event){
		that.mouse.isPressed = false;
		that.mouse.isDragging = false;
		that.selectedTouchPoint = undefined;
		let mouseUpEvent = {
			point: that.convertToViewbox(that.svg,
										 event.clientX,
										 event.clientY)
		};
		that.onMouseUp(mouseUpEvent);
	};
	that.svg.onmousemove = function(event){
		that.mouse.position = that.convertToViewbox(that.svg,
													event.clientX,
													event.clientY);
		if(that.mouse.isPressed){
			if(that.mouse.isDragging === false){
				that.mouse.isDragging = true;
				let didBeginDragEvent = {
					point: Object.assign({}, that.mouse.position)
				};
				that.onMouseDidBeginDrag(didBeginDragEvent);
			}
		}
		// that.updateSelected();
		let moveEvent = {point:Object.assign({}, that.mouse.position)};
		that.onMouseMove(moveEvent);
	};
	that.svg.onResize = function(event){
		that.onResize(event);
	};
	// javascript get Date()
	var frameNum = 0;
	that.animateTimer = setInterval(function(){
		that.animate({"time":that.svg.getCurrentTime(),"frame":frameNum});
		frameNum += 1;
	}, 1000/60);

	return that;

}
