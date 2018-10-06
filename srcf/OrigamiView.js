/** 
 * this extends FoldView to add interaction behavior
 */

"use strict";

import SVG from "./SimpleSVG";
import FoldView from "./FoldView";

export default class OrigamiView extends FoldView{

    // implement these, they will get called when the event fires
    onResize(event){ }
    animate(event){ }
    onMouseDown(event){ }
    onMouseUp(event){ }
    onMouseMove(event){ }
    onMouseDidBeginDrag(event){ }

    constructor() {
        super(...arguments);

        // expose these functions to the user
        this.line = SVG.line;
        this.circle = SVG.circle;
        this.polygon = SVG.polygon;
        this.bezier = SVG.bezier;
        this.group = SVG.group;
        this.addClass = SVG.addClass;
        this.removeClass = SVG.removeClass;
        this.setId = SVG.setId;
        this.removeChildren = SVG.removeChildren;
        this.convertToViewbox = SVG.convertToViewbox;

        // interaction behavior
        this.mouse = {
            position: {"x":0,"y":0},// the current position of the mouse
            pressed: {"x":0,"y":0}, // the last location the mouse was pressed
            isPressed: false,       // is the mouse button pressed (y/n)
            isDragging: false       // is the mouse moving while pressed (y/n)
        };
        this.style.sector = {scale: 0.5};  // radius of sector wedges
        this.style.face = {scale:1.0};     // shrink scale of each face
        this.style.selected = {
            node:{ radius: 0.02 },
            edge:{ strokeColor:{ hue:0, saturation:0.8, brightness:1 } },
            face:{ fillColor:{ hue:0, saturation:0.8, brightness:1 } }
        };

        let that = this;
        this.svg.onmousedown = function(event){
            that.mouse.isPressed = true;
            that.mouse.isDragging = false;
            that.mouse.pressed = that.convertToViewbox(that.svg,
                                                       event.clientX,
                                                       event.clientY);
            // that.attemptSelection();
            that.onMouseDown( {point:Object.assign({}, that.mouse.pressed)} );
        };
        this.svg.onmouseup = function(event){
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
        this.svg.onmousemove = function(event){
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
        this.svg.onResize = function(event){
            that.onResize(event);
        };
        // javascript get Date()
        var frameNum = 0;
        this.animateTimer = setInterval(function(){
            that.animate({"time":that.svg.getCurrentTime(),"frame":frameNum});
            frameNum += 1;
        }, 1000/60);
    }

}
