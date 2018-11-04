
export default function OrigamiView(){

    return {
        padding: 0,
        zoom: 1,
        bounds: { origin:{x:0,y:0}, size:{width:1, height:1} },
        onResize: function(event){ },
        animate: function(event){ },
        onMouseDown: function(event){ },
        onMouseUp: function(event){ },
        onMouseMove: function(event){ },
        onMouseDidBeginDrag: function(event){ },
        setPadding: function(pad){
            this.padding = (pad != undefined) ? pad : 0
            this.setViewBox();
        },
        setViewBox: function(){
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
            console.log(viewBoxString);
            // this.svg.setAttribute("viewBox", viewBoxString);
        }
        // showNodes: function(){ origami.nodesLayer.setAttribute("display", ""); }
        // showEdges: function(){ origami.creasesLayer.setAttribute("display", ""); }
        // showFaces: function(){ origami.facesLayer.setAttribute("display", ""); }
        // showSectors: function(){ origami.sectorsLayer.setAttribute("display", ""); }
        // hideNodes: function(){ origami.nodesLayer.setAttribute("display", "none"); }
        // hideEdges: function(){ origami.nodesLayer.setAttribute("display", "none"); }
        // hideFaces: function(){ origami.nodesLayer.setAttribute("display", "none"); }
        // hideSectors: function(){ origami.nodesLayer.setAttribute("display", "none"); }

    };

}
