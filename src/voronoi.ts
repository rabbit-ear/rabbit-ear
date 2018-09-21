
import * as M from './geometry'
import CreasePattern from './CreasePattern'

//////////////////////////////////////////////////////////////////////////
// D3.js VORONOI DEPENDENCY
interface d3VoronoiObject{
	'edges':{
		0:[number,number],
		1:[number,number],
		'left'?:{0:number,1:number,'data':[number,number],'index':number,'length':number},
		'right'?:{0:number,1:number,'data':[number,number],'index':number,'length':number},
		'length':number
	}[],
	'cells':{
		'halfedges':number[],  // integer type, variable length
		'site':{
			0:number,
			1:number,
			'data':[number,number],
			'length':number   // integer type
		}
	}[]
}

/////////////////////////////////////////////////////////////////////////////////
//                            VORONOI
/////////////////////////////////////////////////////////////////////////////////

class VoronoiMolecule extends M.Triangle{
	overlaped:VoronoiMolecule[];
	hull:M.ConvexPolygon;
	units:VoronoiMoleculeTriangle[];
	isEdge:boolean;
	edgeNormal:M.XY; // if isEdge is true, normal to edge, pointing (in/out) from hull?
	isCorner:boolean;
	constructor(points:[M.XY,M.XY,M.XY], circumcenter:M.XY, edgeNormal?:M.XY){
		super(points, circumcenter);
		this.isEdge = false;  this.isCorner = false;
		this.overlaped = [];
		this.hull = new M.ConvexPolygon().convexHull([points[0], points[1], points[2], circumcenter].filter(function(el){return el !== undefined;}));
		this.units = this.points.map(function(el,i){
			var nextEl = this.points[ (i+1)%this.points.length ];
			return new VoronoiMoleculeTriangle(circumcenter, [el, nextEl]);
		},this);//.filter(function(el){return el !== undefined; });
		// handle edge and corner cases
		var pointsLength = (<M.XY[]>this.points).length;
		switch(pointsLength){
			case 1: this.isCorner = true; this.addCornerMolecules(); break;
			case 2:
				this.isEdge = true;
				// this.units.pop();
				// there are two reflected triangles built around the same base line. remove the counter-clockwise wound one
				this.units = this.units.filter(function(el){
					// update molecule crimp angle
					var cross = (el.vertex.y-el.base[0].y)*(el.base[1].x-el.base[0].x) -
					            (el.vertex.x-el.base[0].x)*(el.base[1].y-el.base[0].y);
					if(cross < 0){ return false;}
					return true;
				},this);
				this.addEdgeMolecules(edgeNormal);
			break;
		}
		// obtuse case: look for the eclipsed molecule, adjust the remaining crimp angles accordingly
		var eclipsed:VoronoiMoleculeTriangle = undefined;
		this.units = this.units.filter(function(el){
			// update molecule crimp angle
			var cross = (el.vertex.y - el.base[0].y) * (el.base[1].x - el.base[0].x) -
			            (el.vertex.x - el.base[0].x) * (el.base[1].y - el.base[0].y);
			if(cross < 0){ eclipsed = el; return false;}
			return true;
		},this);
		if(eclipsed !== undefined){
			var angle = M.clockwiseInteriorAngle(eclipsed.vertex.subtract(eclipsed.base[1]), eclipsed.base[0].subtract(eclipsed.base[1]));
			this.units.forEach(function(el){ el.crimpAngle -= angle; });
		}
	}
	addEdgeMolecules(normal:M.XY){
		this.edgeNormal = normal.normalize().abs();
		if(this.units.length < 1){ return; }
		var base = this.units[0].base;
		var reflected = base.map(function(b){
			var diff = this.circumcenter.subtract(b);
			var change = diff.multiply(this.edgeNormal).scale(2);
			return b.add(change);
		},this);
		this.units = this.units.concat(
			[new VoronoiMoleculeTriangle(this.circumcenter, [base[1], reflected[1]]),
			 new VoronoiMoleculeTriangle(this.circumcenter, [reflected[0], base[0]])]
		);
	}
	addCornerMolecules(){ }

	generateCreases():M.Edge[]{
		var edges:M.Edge[] = [];
		var outerEdges = this.units.map(function(el,i){
			var nextEl = this.units[ (i+1)%this.units.length ];
			if(el.base[1].equivalent(nextEl.base[0])){ 
				edges.push(new M.Edge(el.base[1], el.vertex))
			}
		},this);

		var creases = this.units.map(function(el){return el.generateCrimpCreaseLines();});
		creases.forEach(function(el){ edges = edges.concat(el); },this);

		if(this.isObtuse()){
			// obtuse angles, outer edges only creased if shared between 2 units
			this.units.forEach(function(el,i){
				var nextEl = this.units[ (i+1)%this.units.length ];
				if(el.base[0].equivalent(el.base[1])){ edges.push( new M.Edge(el.base[0], el.vertex)); }
			},this);
		}
		return edges;
	}
}
/** Isosceles Triangle units that comprise a VoronoiMolecule */
class VoronoiMoleculeTriangle{
	base:[M.XY,M.XY];
	vertex:M.XY;
	// the crimp angle is measured against the base side.
	crimpAngle:number;
	overlapped:VoronoiMolecule[];
	constructor(vertex:M.XY, base:[M.XY,M.XY], crimpAngle?:number){
		this.vertex = vertex;
		this.base = base;
		this.crimpAngle = crimpAngle;
		this.overlapped = [];
		if(this.crimpAngle === undefined){
			var vec1 = base[1].subtract(base[0]);
			var vec2 = vertex.subtract(base[0]);
			var a1 = M.clockwiseInteriorAngle(vec1, vec2);
			var a2 = M.clockwiseInteriorAngle(vec2, vec1);
			this.crimpAngle = (a1<a2) ? a1 : a2;
		}
	}
	crimpLocations():[M.XY,M.XY]{
		// first is the top of the outer triangle, the second the angle bisection
		var baseAngle = Math.atan2(this.base[1].y-this.base[0].y,this.base[1].x-this.base[0].x);
		var crimpVector = new M.XY(Math.cos(baseAngle+this.crimpAngle),Math.sin(baseAngle+this.crimpAngle));
		var bisectVector = new M.XY(Math.cos(baseAngle+this.crimpAngle*0.5),Math.sin(baseAngle+this.crimpAngle*0.5));
		var symmetryLine = new M.Edge(this.vertex, this.base[0].midpoint(this.base[1]));
		var crimpPos = M.intersectionRayEdge(new M.Ray(this.base[0], crimpVector), symmetryLine);
		var bisectPos = M.intersectionRayEdge(new M.Ray(this.base[0], bisectVector), symmetryLine);
		return [crimpPos, bisectPos];
	}
	generateCrimpCreaseLines():M.Edge[]{
		var crimps:[M.XY,M.XY] = this.crimpLocations();

		var symmetryLine = new M.Edge(this.vertex, this.base[0].midpoint(this.base[1]));
		if(this.overlapped.length > 0){
			symmetryLine.nodes[1] = this.overlapped[0].circumcenter;
		}
		var overlappingEdges = [symmetryLine]
			.concat( this.overlapped
				.map(function(el:VoronoiMolecule){return el.generateCreases();})
				.reduce(function(prev, curr){ return prev.concat(curr); },[])
			)
		var edges = [symmetryLine]
			.concat(new M.Polyline().rayReflectRepeat(new M.Ray(this.base[0], this.base[1].subtract(this.base[0])), overlappingEdges, this.base[1]).edges());
		crimps.filter(function(el){
				return el!==undefined && !el.equivalent(this.vertex);},this)
			.forEach(function(crimp:M.XY){
				edges = edges.concat( new M.Polyline().rayReflectRepeat(new M.Ray(this.base[0], crimp.subtract(this.base[0])), overlappingEdges, this.base[1]).edges() );
			},this);
		return edges;
	}
	pointInside(p:M.XY):boolean{
		var points = [this.vertex, this.base[0], this.base[1]];
		for(var i = 0; i < points.length; i++){
			var p0 = points[i];
			var p1 = points[(i+1)%points.length];
			var cross = (p.y - p0.y) * (p1.x - p0.x) - 
			            (p.x - p0.x) * (p1.y - p0.y);
			if (cross < 0) return false;
		}
		return true;
	}
}
class VoronoiEdge{
	endPoints:[M.XY, M.XY];
	junctions:[VoronoiJunction, VoronoiJunction];
	cells:[VoronoiCell,VoronoiCell];
	isBoundary:boolean;
	cache:object = {};
}
class VoronoiCell{
	site:M.XY;
	points:M.XY[];
	edges:VoronoiEdge[];
	constructor(){ this.points = []; this.edges = []; }
}
class VoronoiJunction{
	position:M.XY;
	edges:VoronoiEdge[];
	cells:VoronoiCell[];
	isEdge:boolean;
	isCorner:boolean;
	edgeNormal:M.XY;// normal to the edge, if there is an edge
	constructor(){ this.edges = []; this.cells = []; this.isEdge = false; this.isCorner = false; }
}
export class VoronoiGraph{
	edges:VoronoiEdge[];
	junctions:VoronoiJunction[];
	cells:VoronoiCell[];

	edgeExists(points:[M.XY,M.XY], epsilon?:number):VoronoiEdge{
		if(epsilon === undefined){ epsilon = M.EPSILON_HIGH; }
		this.edges.forEach(function(el){
			if(el.endPoints[0].equivalent(points[0], epsilon) &&
			   el.endPoints[1].equivalent(points[1], epsilon)){ return el; }
			if(el.endPoints[1].equivalent(points[0], epsilon) &&
			   el.endPoints[0].equivalent(points[1], epsilon)){ return el; }
		});
		return undefined;
	}
	/** Build a VoronoiGraph object from the object generated by D3.js Voronoi */
	constructor(v:d3VoronoiObject, epsilon?:number){
		var containsXY = function(a:M.XY[],object:M.XY):boolean{
			return (a.filter(function(e:M.XY){
				return e.equivalent(object,epsilon);
			}).length > 0);
		}

		if(epsilon === undefined){ epsilon = M.EPSILON_HIGH; }
		var allPoints = v.edges
			.map(function(e){return [new M.XY(e[0][0],e[0][1]),new M.XY(e[1][0],e[1][1])]})
			.reduce(function(prev, curr){ return prev.concat(curr); },[])
		var hull = new M.ConvexPolygon().convexHull(allPoints);
		this.edges = [];
		this.junctions = [];
		this.cells = [];
		this.edges = v.edges.map(function(el){
			var edge = new VoronoiEdge()
			edge.endPoints = [new M.XY(el[0][0],el[0][1]), new M.XY(el[1][0],el[1][1])];
			edge.cache = {'left': el.left, 'right': el.right}
			return edge;
		});
		this.cells = v.cells.map(function(c){
			var cell = new VoronoiCell();
			cell.site = new M.XY(c.site[0], c.site[1]);
			// use halfedge indices to make an array of VoronoiEdge
			cell.edges = c.halfedges.map(function(hf){ return this.edges[hf]; },this);
			// turn the edges into a circuit of points
			cell.points = cell.edges.map(function(el,i){
				var a = el.endPoints[0];
				var b = el.endPoints[1];
				var nextA = cell.edges[(i+1)%cell.edges.length].endPoints[0];
				var nextB = cell.edges[(i+1)%cell.edges.length].endPoints[1];
				if(a.equivalent(nextA,epsilon) || a.equivalent(nextB,epsilon)){
					return b;
				}
				return a;
			},this);
			return cell;
		},this);
		// locate each of the neighbor cells for every edge
		this.edges.forEach(function(el){
			var thisCells:[VoronoiCell, VoronoiCell] = [undefined, undefined];
			if(el.cache['left'] !== undefined){
				var leftSite = new M.XY(el.cache['left'][0], el.cache['left'][1]);
				for(var i = 0; i < this.cells.length; i++){
					if(leftSite.equivalent(this.cells[i].site,epsilon)){
						thisCells[0] = this.cells[i];
						break;
					}
				}
			}
			if(el.cache['right'] !== undefined){
				var rightSite = new M.XY(el.cache['right'][0], el.cache['right'][1]);
				for(var i = 0; i < this.cells.length; i++){
					if(rightSite.equivalent(this.cells[i].site,epsilon)){
						thisCells[1] = this.cells[i];
						break;
					}
				}
			}
			el.cells = thisCells;
			el.isBoundary = false;
			if(el.cells[0] === undefined || el.cells[1] === undefined){el.isBoundary = true;}
			el.cache = {};
		},this);
		var nodes:M.XY[] = [];
		this.edges.forEach(function(el){
			if(!containsXY(nodes, el.endPoints[0])){nodes.push(el.endPoints[0]);}
			if(!containsXY(nodes, el.endPoints[1])){nodes.push(el.endPoints[1]);}
		},this);
		this.junctions = nodes.map(function(el){
			var junction = new VoronoiJunction();
			junction.position = el;
			junction.cells = this.cells.filter(function(cell){ 
				return containsXY(cell.points, el)
			},this).sort(function(a:VoronoiCell,b:VoronoiCell){
				var vecA = a.site.subtract(el);
				var vecB = b.site.subtract(el);
				return Math.atan2(vecA.y,vecA.x) - Math.atan2(vecB.y,vecB.x);
			});
			switch(junction.cells.length){
				case 1: junction.isCorner = true; break;
				case 2: 
					junction.isEdge = true;
					hull.edges.forEach(function(edge:M.Edge){
						if(edge.collinear(junction.position)){
							junction.edgeNormal = edge.nodes[1].subtract(edge.nodes[0]).rotate90();
						}
					});
				break;
			}
			junction.edges = this.edges.filter(function(edge){
				return containsXY(edge.endPoints, el);
			},this).sort(function(a:VoronoiEdge,b:VoronoiEdge){
				var otherA = a.endPoints[0];
				if(otherA.equivalent(el)){ otherA = a.endPoints[1];}
				var otherB = b.endPoints[0];
				if(otherB.equivalent(el)){ otherB = b.endPoints[1];}
				var vecA = otherA.subtract(el);
				var vecB = otherB.subtract(el);
				return Math.atan2(vecA.y,vecA.x) - Math.atan2(vecB.y,vecB.x);
			});
			return junction;
		},this);
		return this;
	}

	generateMolecules(interp:number):VoronoiMolecule[]{
		return this.junctions.map(function(j:VoronoiJunction){
			var endPoints:M.XY[] = j.cells.map(function(cell:VoronoiCell){
				return cell.site.lerp(j.position,interp);
			},this);
			var molecule = new VoronoiMolecule(<[M.XY,M.XY,M.XY]>endPoints, j.position, j.isEdge?j.edgeNormal:undefined);
			return molecule;
		},this);		
	}

	/** sorts molecules based on overlap  */
	generateSortedMolecules(interp:number):VoronoiMolecule[][]{
		var molecules = this.generateMolecules(interp);
		for(var i = 0; i < molecules.length; i++){
			for(var j = 0; j < molecules.length; j++){
				if(i !== j){
					molecules[j].units.forEach(function(unit){
						if(unit.pointInside(molecules[i].circumcenter)){
							unit.overlapped.push(molecules[i]);
							molecules[j].overlaped.push(molecules[i]);
						}
					});
				}
			}
		}
		for(var i = 0; i < molecules.length; i++){
			molecules[i].units.forEach(function(unit:VoronoiMoleculeTriangle){
				unit.overlapped.sort(function(a:VoronoiMolecule,b:VoronoiMolecule){
					return a.circumcenter.distanceTo(unit.vertex)-b.circumcenter.distanceTo(unit.vertex);
				});
			});
			molecules[i].overlaped.sort(function(a:VoronoiMolecule,b:VoronoiMolecule){
				return a.circumcenter.distanceTo(molecules[i].circumcenter)-b.circumcenter.distanceTo(molecules[i].circumcenter);
			});
		}
		// not correct. could be better? maybe?
		var array = [];
		var mutableMolecules = molecules.slice();
		var rowIndex = 0;
		while(mutableMolecules.length > 0){
			array.push([]);
			for(var i = mutableMolecules.length-1; i >= 0; i--){
				if(mutableMolecules[i].overlaped.length <= rowIndex){
					array[rowIndex].push(mutableMolecules[i]);
					mutableMolecules.splice(i, 1);
				}
			}
			rowIndex++;
		}
		return array;
	}
}

export function creaseVoronoi(cp:CreasePattern, v:VoronoiGraph, interp?:number):any[]{

	// returns an array of VoronoiMolecule[]
	// creaseVoronoi(v:VoronoiGraph, interp?:number):any[]{
		if(interp === undefined){ interp = 0.5; }

		// original voronoi graph edges
		var edges = v.edges.filter(function(el){return !el.isBoundary; });
		// shrunk voronoi cell outlines
		var cells:[M.XY,M.XY][][] = <[M.XY,M.XY][][]>v.cells.map(function(cell){
			return cell.edges.map(function(edge){
				return edge.endPoints.map(function(el:M.XY){
					return cell.site.lerp(el,interp);
				});
			},this);
		},this);
		// junction molecules
		// var molecules:VoronoiMolecule[] = v.generateMolecules(interp);
		// find overlapped molecules
		var sortedMolecules = v.generateSortedMolecules(interp);
		sortedMolecules.forEach(function(arr){
			arr.forEach(function(m){
				var edges = m.generateCreases();
				edges.forEach(function(el){
					cp.crease(el.nodes[0], el.nodes[1]);
				},this);
			}, this);
		}, this);

		edges.forEach(function(edge){
			var c = cp.crease(edge.endPoints[0], edge.endPoints[1]);
			if(c !== undefined){ c.valley(); }
		},this);
		cells.forEach(function(cell:[M.XY,M.XY][]){ cell.forEach(function(edge){
			cp.crease(edge[0], edge[1]).mountain();
		},this)},this);

		return sortedMolecules.reduce(function(prev, current){ return prev.concat(current); });

}