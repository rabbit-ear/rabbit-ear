/** Simple .FOLD file view
 * converts .fold file into SVG, binds it to the DOM
 *   constructor arguments:
 *   - fold file
 *   - DOM object, or "string" DOM id
 */

"use strict";

import SVG from "./SimpleSVG.js";

const CREASE_DIR = {
    "B": "boundary",
    "M": "mountain",
    "V": "valley",
    "F": "mark",
    "U": "mark"
};

export default class FoldView{

    constructor() {
        //  from arguments, get a fold file, if it exists
        let args = Array.from(arguments);
        this.cp = args.filter(arg =>
            typeof arg == "object" && arg.vertices_coords != undefined
        ).shift();
        if(this.cp == undefined){ this.cp = Origami.emptyFoldFile; }

        // create a new SVG
        this.svg = SVG.SVG();

        //  from arguments, get a parent DOM node for the new SVG as
        //  an HTML element or as a id-string
        //  but wait until after the <body> has rendered
        let that = this;
        document.addEventListener("DOMContentLoaded", function(){
            let parent = args.filter((arg) =>
                arg instanceof HTMLElement
            ).shift();
            if(parent == undefined){
                let idString = args.filter((a) =>
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

        // view properties
        this.isFolded = false;
        this.zoom = 1.0;
        this.padding = 0.01;  // padding inside the canvas
        this.style = {
            node:{ radius: 0.01 },  // radius of nodes
            sector:{ scale: 0.5 },  // radius of sector wedges
            face:{ scale:1.0 },     // shrink scale of each face
        };

        this.draw();
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
        let d = (this.bounds.size.width / this.zoom) - this.bounds.size.width;
        let oX = this.bounds.origin.x - d;
        let oY = this.bounds.origin.y - d;
        let width = this.bounds.size.width + d*2;
        let height = this.bounds.size.height + d*2;
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
        let creaseline = this.line(edge[0][0],
                                   edge[0][1],
                                   edge[1][0],
                                   edge[1][1],
                                   orientation, "edge");
        this.creases.appendChild(creaseline);
    }
    addFace(points){
        let className = (this.isFolded ? "face folded" : "face");
        let poly = this.polygon(points, className, "face");
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

    load(input, callback){ // epsilon
        // are they giving us a filename, or the data of an already loaded file?
        var that = this;
        if (typeof input === 'string' || input instanceof String){
            var extension = input.substr((input.lastIndexOf('.') + 1));
            // filename. we need to upload
            switch(extension){
                case 'fold':
                fetch(input)
                    .then((response) => response.json())
                    .then((data) => {
                        that.cp = data;
                        that.draw();
                        if(callback != undefined){ callback(that.cp); }
                    });
                return that;
            }
        }
        try{
            // try .fold file format first
            var foldFileImport = JSON.parse(input);
            that.cp = foldFileImport;
            return that;
        } catch(err){
            console.log("not a valid .fold file format")
            return that;
        }
    }
}
