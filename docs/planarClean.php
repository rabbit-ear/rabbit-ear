<?php include 'header.php';?>
<script type="text/javascript" src="../lib/p5.min.js"></script>
<script type="text/javascript" src="../dist/cp.p5js.js"></script>

<h1>CLEAN</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-intersections" resize class="panorama"></canvas>
	</div>

	<p>Cleaning a planar graph will ensure there are no duplicate or circular edges, just like a regular graph, but also perform additional 2D-related operations, like resolve 2 crossed edges.</p>

	<div class="centered">
		<pre><code>graph.<f>clean</f>()</code></pre>
	</div>

</section>

<h2>Duplicate Nodes in Space</h2>
<section id="duplicate-nodes">

	<p>When two nodes occupy the same space they will be merged into one.</p>

	<div id="divP5_merge" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code><span id="div-node-count"></span> nodes, <span id="div-edge-count"></span> edges</code></pre>
	</div>

	<p>The process by which 2 nodes are said to occupy the same space is heavily dependent on the epsilon (ε) value which declares two numbers to be the same. A larger epsilon will merge points across a greater distance.</p>

	<div class="centered">
		<canvas id="canvas1" resize></canvas>
		<canvas id="canvas2" resize></canvas>
		<!-- <canvas id="canvas3" resize></canvas> -->
	</div>

	<p class="quote">Both graphs have been cleaned, the one on the right was given a larger epsilon.</p>

	<div class="centered">
		<pre><code>graph.<f>cleanDuplicateNodes</f>(<n>epsilon</n>)</code></pre>
	</div>

	<p class="explain"><a href="planarMath.php#epsilon">Epsilon (ε)</a> is the tiny space deep in the floating point number past the decimal point.</p>	

</section>

<h2>Fragment</h2>

<section id="intersections">

	<p>Fragmenting edges will chop them at their edge crossings.</p>

	<div class="centered">
		<canvas id="canvas-crane-1" resize></canvas><canvas id="canvas-crane-2" resize></canvas>
	</div>

	<p class="quote">The graph on the right has been <a href="library/fragment">fragmented</a>. The longer lines have been split at their crossings.</p>

	<div class="centered">
		<pre><code>graph.<f>fragment</f>()</code></pre>
	</div>

</section>

<h2>Collinear Planar Graph Edges</h2>
<section id="collinear-nodes">

	<p class="quote">Collinear nodes can be removed, the two edges on either side merged into one, disappearing the point which once divided the edge.</p>

	<div class="centered">
		<canvas id="canvas-mouse-delete-edge" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>graph.<f>removeEdge</f>(<arg>edge</arg>)</code></pre>
	</div>

	<p class="quote">Removing edges will remove their nodes, and so will nodes left behind between 2 collinear lines be removed as well.</p>

</section>

<h2>Intersection of Two Edges</h2>
<section id="parallel">

	<p>Mathematically speaking, parallel lines have zero points of intersection and collinear lines have infinite. However in this library collinear lines will register to have zero points of intersection.</p>

	<div class="centered p5sketch" id="intersections-div"></div>

	<p class="quote">The epsilon has been increased to magnify the moment that the lines become parallel.</p>

</section>

<div class="tests">
	<ul>
		<li><a href="../tests/html/chop_cross_many.html">chop overlapping lines</a></li>
		<li><a href="../tests/html/chop_collinear_vert.html">chop vertical collinear</a></li>
		<li><a href="../tests/html/chop_collinear_horiz.html">chop horizontal collinear</a></li>
		<li><a href="../tests/html/chop_angle_ray.html">chop angled rays</a></li>
		<li><a href="../tests/html/chop_mountain_valley.html">chop and preserve mountain/valley</a></li>
		<li><a href="../tests/html/merge_node_check.html">merge node transparency check</a></li>
	</ul>
</div>

<!-- include .js sketches -->
<script type="text/javascript" src="../tests/mouse_delete_edge.js"></script>
<script type="text/javascript" src="../tests/intersections.js"></script>
<script type="text/javascript" src="../tests/05_parallels_scale.js"></script>
<script type="text/javascript" src="../tests/11_merge_duplicates.js"></script>

<script>
	
var crane1CP = new OrigamiPaper("canvas-crane-1").blackAndWhite().setPadding(0.05);
crane1CP.loadRaw("/files/svg/crane-errors.svg");
crane1CP.onMouseMove = function(event){
	var point = {x:event.point.x, y:event.point.y};
	var edgeArray = this.cp.edges
		.map(function(edge){
			return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
		})
		.sort(function(a,b){
			return a.distance - b.distance;
		})[0];
	var edge = (edgeArray != undefined) ? edgeArray.edge : undefined;

	if(edge != undefined){
		this.updateStyles();
		this.edges[ edge.index ].strokeColor = this.styles.byrne.red;
		this.edges[ edge.index ].strokeWidth = this.style.mountain.strokeWidth*2;
	}

}

var crane2CP = new OrigamiPaper("canvas-crane-2").blackAndWhite().setPadding(0.05);
crane2CP.load("/files/svg/crane-errors.svg");
crane2CP.show.faces = false;
crane2CP.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.edge){ 
		this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.red;
		this.edges[ nearest.edge.index ].strokeWidth = this.style.mountain.strokeWidth*2;
	}
}

</script>

<script>
	var p505 = new p5(_05_parallels, 'intersections-div');
</script>

<script>
	var p5b = new p5(_11_merge_duplicates, 'divP5_merge');
	p5b.callback = function(nodecount, edgecount, mergeInfo){
		document.getElementById("div-node-count").innerHTML = nodecount;
		document.getElementById("div-edge-count").innerHTML = edgecount;
	}
</script>

<script>
	var cp = [];
	for(var i = 0; i < 3; i++){
		cp[i] = new CreasePattern();
		cp[i].nodes = [];
		cp[i].edges = [];
		var freq = Math.PI*2;
		var inc = Math.PI/(12*freq * 2);
		for(var j = 0; j < 1-inc; j+=inc){
			cp[i].crease(j, 0.5 + 0.45*Math.sin(j*freq), (j+inc), 0.5 + 0.45*Math.sin((j+inc)*freq));
			cp[i].crease(j, 0.5 + 0.45*Math.sin(j*freq-Math.PI*0.5), (j+inc), 0.5 + 0.45*Math.sin((j+inc)*freq-Math.PI*0.5));
		}
	}

	cp[0].cleanDuplicateNodes(0.01);
	// cp[1].cleanDuplicateNodes(0.025);
	cp[1].cleanDuplicateNodes(0.05);
	// cp[2].cleanDuplicateNodes(0.066);
	var paper1 = new OrigamiPaper("canvas1", cp[0]);
	var paper2 = new OrigamiPaper("canvas2", cp[1]);
	// var paper3 = new OrigamiPaper("canvas3", cp[2]);
	// paper1.style.node.visible = true;
	// paper2.style.node.visible = true;
	paper1.show.nodes = true;
	paper2.show.nodes = true;
	paper1.style.node.fillColor = { gray:0 };
	paper2.style.node.fillColor = { gray:0 };
	// paper3.style.node.visible = true;
	paper1.draw();
	paper2.draw();
	// paper3.update();
</script>


<script>
	// edge_intersections_callback = function(event){
	// 	if(event !== undefined){
	// 		document.getElementById("span-merge-result").innerHTML = "<v>Array</v>(<n>" + event.length + "</n>) ← ";
	// 	}
	// }
	// intersectionSketch.reset();
</script>

<?php include 'footer.php';?>