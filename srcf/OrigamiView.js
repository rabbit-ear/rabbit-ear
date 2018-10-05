/*jshint esversion: 6 */
/*jshint strict:false */

"use strict";

import SVG from "./SimpleSVG.js";

const CREASE_DIR = {
    "B": "boundary",
    "M": "mountain",
    "V": "valley",
    "F": "mark",
    "U": "mark"
};

export default class OrigamiView{

    // implement these, they will get called when the event fires
    onResize(event){ }
    animate(event){ }
    onMouseDown(event){ }
    onMouseUp(event){ }
    onMouseMove(event){ }
    onMouseDidBeginDrag(event){ }

    constructor() {
        //  from arguments, get a fold file, if it exists
        let args = Array.from(arguments);
        this.cp = args.filter(arg =>
            typeof arg == "object" && arg.vertices_coords != undefined
        ).shift();
        if(this.cp == undefined){ this.cp = Origami.emptyFoldFile; }

        this.svg = SVG.SVG();

        //  from arguments, get a parent DOM node for the new SVG as
        //  an HTML element or as a id-string
        //  but wait until after the <body> has rendered
        var that = this;
        document.addEventListener("DOMContentLoaded", function(){
            var parent = args.filter((arg) =>
                arg instanceof HTMLElement
            ).shift();
            if(parent == undefined){
                var idString = args.filter((a) =>
                    typeof a === "string" || a instanceof String
                ).shift();
                if(idString != undefined){
                    parent = document.getElementById(idString);
                }
            }
            if(parent == undefined){ parent = document.body; }
            parent.appendChild(that.svg);
        });

        // create the OrigamiPaper object
        this.line = SVG.line;
        this.circle = SVG.circle;
        this.polygon = SVG.polygon;
        this.bezier = SVG.bezier;
        this.group = SVG.group;
        this.addClass = SVG.addClass;
        this.removeClass = SVG.removeClass;
        this.convertToViewbox = SVG.convertToViewbox;

        // prepare SVG
        this.faces = this.group(null, "faces");
        this.sectors = this.group(null, "sectors");
        this.creases = this.group(null, "creases");
        this.boundary = this.group(null, "boundary");
        this.nodes = this.group(null, "nodes");
        this.svg.appendChild(this.boundary);
        this.svg.appendChild(this.faces);
        this.svg.appendChild(this.sectors);
        this.svg.appendChild(this.creases);
        this.svg.appendChild(this.nodes);

        this.isFolded = false;
        this.zoom = 1.0;
        this.padding = 0.01;  // padding inside the canvas

        this.mouse = {
            position: {"x":0,"y":0},// the current position of the mouse
            pressed: {"x":0,"y":0}, // the last location the mouse was pressed
            isPressed: false,       // is the mouse button pressed (y/n)
            isDragging: false       // is the mouse moving while pressed (y/n)
        };

        this.style = {
            node:{ radius: 0.01 },
            sector:{ scale: 0.5 },
            face:{ scale:1.0 },
            selected:{
                node:{ radius: 0.02 },
                edge:{ strokeColor:{ hue:0, saturation:0.8, brightness:1 } },
                face:{ fillColor:{ hue:0, saturation:0.8, brightness:1 } }
            }
        };

        this.draw();

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
    setPadding(padding){
        if(padding != undefined){
            this.padding = padding;
            this.setViewBox();
        }
        return this;
    }
    setViewBox(){
        // todo: need protections if cp is returning no bounds
        this.bounds = { origin:{x:0,y:0}, size:{width:1, height:1} };
        // todo: this is maybe not the best zoom operation
        var d = (this.bounds.size.width / this.zoom) - this.bounds.size.width;
        var oX = this.bounds.origin.x - d;
        var oY = this.bounds.origin.y - d;
        var width = this.bounds.size.width + d*2;
        var height = this.bounds.size.height + d*2;
        let viewBoxString = [
            (-this.padding+oX),
            (-this.padding+oY),
            (this.padding*2+width),
            (this.padding*2+height)
        ].join(" ");
        this.svg.setAttribute("viewBox", viewBoxString);
    }

    draw(){
        if(this.cp.vertices_coords == undefined){ return; }

        let verts = this.cp.vertices_coords;
        let edges = this.cp.edges_vertices.map(ev =>
            [verts[ev[0]], verts[ev[1]]]
        );
        let orientations = this.cp.edges_assignment.map(a => CREASE_DIR[a]);
        let faces = this.cp.faces_vertices.map(fv => fv.map(v => verts[v]));

        this.setViewBox();

        [this.boundary,
         this.faces,
         this.sectors,
         this.creases,
         this.nodes
        ].forEach(function(layer){
            while(layer.lastChild) {
                layer.removeChild(layer.lastChild);
            }
        },this);

        edges.forEach((e,i) => this.addEdge(e, orientations[i]));
        faces.forEach(f => this.addFace(f));
    }
    addEdge(edge, orientation){
        if(orientation == undefined){ orientation = "mark"; }
        var creaseline = this.line(edge[0][0],
                                   edge[0][1],
                                   edge[1][0],
                                   edge[1][1],
                                   orientation, "edge");
        this.creases.appendChild(creaseline);
    }
    addFace(points){
        var poly = this.polygon(points, (this.isFolded
            ? "face folded"
            : "face"
        ), "face");
        this.faces.appendChild(poly);
    }

    showNodes(){ origami.nodes.setAttribute("display", "");}
    hideNodes(){ origami.nodes.setAttribute("display", "none");}
    showEdges(){ origami.creases.setAttribute("display", "");}
    hideEdges(){ origami.creases.setAttribute("display", "none");}
    showFaces(){ origami.faces.setAttribute("display", "");}
    hideFaces(){ origami.faces.setAttribute("display", "none");}
    showSectors(){ origami.sectors.setAttribute("display", "");}
    hideSectors(){ origami.sectors.setAttribute("display", "none");}
}
