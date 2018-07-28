var origami = new OrigamiPaper("paperCanvas");
var folded = new OrigamiFold("foldCanvas");
var steps = [];
var operation = "b";
var orientation = CreaseDirection.mark;
var axiom = "lt2p";
var numAnchors = 2;
var snap = "p";
var anchors = [];

origami.style.mountain.dashArray = [0.03, 0.02, 0.005, 0.02];
origami.style.mountain.strokeColor = origami.style.valley.strokeColor;
origami.style.valley.strokeColor = origami.styles.byrne.red;

folded.style.face.fillColor = { gray:0.0, alpha:0.2 };
//folded.show.edges = true;
folded.mouseZoom = false;
folded.rotation = 180;

function onChangeOperation()
{
	var combo = document.menu.operationCombo;
	operation = combo.options[combo.selectedIndex].value;

	revert();
}

function onChangeDirection()
{
	var combo = document.menu.directionCombo;
	var direction = combo.options[combo.selectedIndex].value;

	switch (direction)
	{
		case "c":
			orientation = CreaseDirection.mark; break;
		case "v":
			orientation = CreaseDirection.valley; break;
		case "m":
			orientation = CreaseDirection.mountain; break;
	}
}

function onChangeAxiom()
{
	var combo = document.menu.axiomCombo;
	axiom = combo.options[combo.selectedIndex].value;

	switch (axiom)
	{
		case "lt2p":
		case "pop":
		case "lol":
		case "pltp":
		{
			numAnchors = 2;
			break;
		}
		case "poltp":
		case "polpl":
		case "loptp":
		case "loppl":
		{
			numAnchors = 3;
			break;
		}
	}

	revert();
}

function onChangeSnap()
{
	var combo = document.menu.snapCombo;
	snap = combo.options[combo.selectedIndex].value;
}

function revert()
{
	anchors = [undefined];
	if (origami.cp.faces.length == 1)
		anchors.push(origami.cp.boundary);

	origami.cp = steps[0];
	origami.draw();
	updateFoldedView();
}

function undo()
{
}

function redo()
{
}

function updateFoldedView()
{
	folded.cp = origami.cp.copy();
	folded.cp.clean();

	folded.draw( folded.cp.faces[0], true );
}

function getPoint(anchor)
{
	if (anchor.snap == undefined || anchor.snap == "p")
		return anchor.node;

	if (anchor.snap == "m")
		return new XY((anchor.edge.nodes[0].x + anchor.edge.nodes[1].x)/2, (anchor.edge.nodes[0].y + anchor.edge.nodes[1].y)/2);

	if (anchor.snap == "e")
		return new Line(anchor.point, anchor.edge.vector().rotate90()).intersection(anchor.edge.infiniteLine());

	if (anchor.snap == "n")
		return anchor.point;

	return undefined;
}

function getLine(anchor)
{
	return anchor.edge.infiniteLine();
}

function propogate(ray)
{
	var creases = new Polyline()
		.rayReflectRepeat(ray, origami.cp.edges.filter(function (e) { return e.orientation != CreaseDirection.mark; }, this))
		.edges();

	var o = orientation;

	return creases.map
		(
			function (edge)
			{
				var crease = origami.cp.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
				if (o != CreaseDirection.mark && crease != undefined)
				{
					crease.orientation = o;
					o = o == CreaseDirection.valley ? CreaseDirection.mountain : CreaseDirection.valley;
				}
				return crease;
			},
			this
		)
		.filter(function (el) { return el != undefined; });
}

function coPlanarFaces(face, edgesWalked)
{
	var faces = [face];
	if (edgesWalked == undefined)
		edgesWalked = [];

	face.edges.forEach
	(
		function(e)
		{
			if (edgesWalked.indexOf(e) == -1)
			{
				edgesWalked.push(e);
				if (e.orientation == CreaseDirection.mark)
				{
					e.adjacentFaces().forEach
					(
						function(f)
						{
							if (f !== face)
								faces = faces.concat(coPlanarFaces(f, edgesWalked));
						},
						this
					);
				}
			}
		},
		this
	);

	return faces;
}

function coPlanarPolygon(face)
{
	var nodes = [];
	coPlanarFaces(face).forEach
	(
		function(f)
		{
			f.nodes.forEach
			(
				function(n)
				{
					if (nodes.indexOf(n) == -1)
						nodes.push(n);
				},
				this
			);
		},
		this
	);

	return new ConvexPolygon().convexHull(nodes);
}

function highlightNode(p)
{
	if (p != undefined)
	{
		origami.nodeLayer.activate();

		node = new origami.scope.Shape.Circle({ center: [p.x, p.y] });
		Object.assign(node, origami.style.node);
	}

	return node;
}

function highlightEdge(e)
{
	if (e != undefined)
	{
		origami.edgeLayer.activate();

		edge = new origami.scope.Path({segments: e.nodes.map(function(el){ return [el.x, el.y]; }), closed: false });
		Object.assign(edge, origami.styleForCrease(e.orientation));
		edge.strokeColor = origami.styles.byrne.yellow;
	}

	return edge;
}

function highlightFace(f)
{
	if (f != undefined)
	{
		origami.faceLayer.activate();

		var nodes = f instanceof ConvexPolygon ? f.nodes() : f.nodes;

		face = new origami.scope.Path({segments: nodes.map(function(el){ return [el.x, el.y]; }), closed:true});
		//face.scale(origami.style.face.scale, f.centroid());
		Object.assign(face, origami.style.face);
		face.fillColor = { gray:0.0, alpha:0.2 };
	}
}

function highlightAnchors()
{
	for (var i = anchors.length - 1; i >= 0; --i)
	{
		var anchor = anchors[i];
		if (anchor == undefined)
			return;

		if (anchor instanceof ConvexPolygon)
			highlightFace(anchor);
		else if (anchor instanceof GraphEdge)
			highlightEdge(anchor);
		else
			highlightNode(anchor);
	}
}

function cleanHighlights()
{
	origami.nodeLayer.removeChildren();
	//origami.edgeLayer.removeChildren(origami.cp.edges.length);
	origami.faceLayer.removeChildren();
}


origami.onMouseMove = function(event)
{
	if (anchors.length == numAnchors + 1 && anchors[0] != undefined)
	{
		origami.cp = steps[0].copy();
		origami.draw();
	}
	else
		cleanHighlights();

	anchors.shift();

	// get the nearest parts of the crease pattern to the mouse point
	var nearest = origami.cp.nearest(event.point);
	nearest.point = event.point;
	nearest.snap = snap;

	if (anchors.length == 0)
	{
		if (nearest.face != undefined)
			anchors.unshift(coPlanarPolygon(nearest.face));
		else
			anchors.unshift(undefined);
	}
	else
	{
		var folds = undefined;

		switch (axiom)
		{
			case "lt2p":
			case "pop":
			{
				anchors.unshift(getPoint(nearest));

				if (anchors.length == 3)
				{
					if (axiom ==  "lt2p")
						folds = [origami.cp.axiom1(anchors[1], anchors[0])];
					else if (axiom == "pop")
						folds = [origami.cp.axiom2(anchors[1], anchors[0])];
				}
				break;
			}
			case "lol":
			{
				anchors.unshift(getLine(nearest));

				if (anchors.length == 3)
				{
					folds = origami.cp.axiom3(anchors[1], anchors[0]);
				}
				break;
			}
			case "pltp":
			{
				if (anchors.length == 1)
				{
					anchors.unshift(getPoint(nearest))
				}
				else if (anchors.length == 2)
				{
					anchors.unshift(getLine(nearest));

					folds = [origami.cp.axiom4(anchors[1], anchors[0])];
				}
				break;
			}
			case "poltp":
			case "polpl":
			case "2po2l":
			{
				if (anchors.length == 1)
				{
					anchors.unshift(getPoint(nearest));
				}
				else if (anchors.length == 2)
				{
					anchors.unshift(getLine(nearest));
				}
				else if (anchors.length == 3)
				{
					if (axiom == "polpl")
					{
						anchors.unshift(getLine(nearest));

						folds = [origami.cp.axiom7(anchors[2], anchors[1], anchors[0])];
					}
					else
					{
						anchors.unshift(getPoint(nearest));

						if (axiom ==  "poltp")
							folds = origami.cp.axiom5(anchors[2], anchors[1], anchors[0]);
					}
				}
				else if (anchors.length == 4)
				{
					folds = origami.cp.axiom6(anchors[3], anchors[2], anchors[1], anchors[0]);
				}
				break;
			}
			case "loptp":
			case "loppl":
			case "2lo2p":
			{
				if (anchors.length == 1)
				{
					anchors.unshift(getLine(nearest));
				}
				else if (anchors.length == 2)
				{
					anchors.unshift(getPoint(nearest));
				}
				else if (anchors.length == 3)
				{
					if (axiom ==  "loptp")
					{
						anchors.unshift(getPoint(nearest));

						folds = origami.cp.axiom5(anchors[1], anchors[2], anchors[0]);
					}
					else
					{
						anchors.unshift(getLine(nearest));

						if (axiom == "loppl")
							folds = [origami.cp.axiom7(anchors[1], anchors[2], anchors[0])];
					}
				}
				else if (anchors.length == 4)
				{
					folds = origami.cp.axiom6(anchors[2], anchors[3], anchors[0], anchors[1]);
				}
				break;
			}
		}

		if (folds && folds.length > 0 && folds[0] != undefined)
		{
			var p = anchors[numAnchors];

			var clippedEdge = p.clipLine(folds[0]);
			if(clippedEdge == undefined && folds.length > 1 && folds[1] != undefined)
				clippedEdge = p.clipLine(folds[1])
			if (clippedEdge)
			{
				var midPoint = clippedEdge.midpoint();

				propogate(new Ray(midPoint, clippedEdge.vector()));
				propogate(new Ray(midPoint, clippedEdge.vector().rotate180()));
			}

			origami.cp.clean();
			origami.draw();
			updateFoldedView();
		}
	}

	highlightAnchors();
}

origami.onMouseUp = function(event)
{
	if (anchors[0] == undefined)
		return;

	if (anchors.length == numAnchors + 1)
	{
		steps.unshift(origami.cp.copy());
		anchors = [];
	}
	anchors.unshift(undefined);
}

origami.reset = function()
{
	origami.cp = new CreasePattern();
	anchors = [undefined, origami.cp.boundary];
	steps = [origami.cp.copy()];

	origami.draw();
	updateFoldedView();

	highlightAnchors();
}

origami.reset();
