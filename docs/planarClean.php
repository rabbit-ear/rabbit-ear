<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>

<h1>CLEAN</h1>

<section id="intro">

	<div class="centered">
		<pre><code>graph.<f>clean</f>()</code></pre>
	</div>

	<div class="quote">
		<p>a planar graph is cleaned with operations that utilize x y location</p>
	</div>

</section>

<h2>Duplicate Nodes in Space</h2>
<section id="duplicate-nodes">

	<div class="quote">
		<p>When two nodes occupy the same space they will be merged into one</p>
	</div>

	<div id="divP5_merge" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code><span id="div-node-count"></span> nodes, <span id="div-edge-count"></span> edges</code></pre>
	</div>


	<div class="centered">
		<canvas id="canvas1" resize></canvas>
		<canvas id="canvas2" resize></canvas>
		<!-- <canvas id="canvas3" resize></canvas> -->
	</div>

	<div class="centered">
		<pre><code>graph.<f>cleanDuplicateNodes</f>(<n>epsilon</n>)</code></pre>
	</div>

	<div class="explain">
		<p><b>Epsilon</b> is the radius around a point where merging occurs. It's a fraction of the size of the canvas. A larger number will merge across a further distance.</p>
	</div>

</section>

<h2>Fragment</h2>

<section id="intersections">

	<div class="quote">
		<p>Fragmenting edges will chop them at their edge crossings</p>
	</div>

	<div class="centered">
		<pre><code><span id="span-merge-result"></span>graph.<f>fragment</f>()</code></pre>
	</div>

	<div class="centered">
		<canvas id="canvas-intersections" resize class="panorama"></canvas>
	</div>

	<div class="centered">
		<pre><code>graph.<f>getEdgeIntersections</f>()</code></pre>
	</div>

	<div class="quote">
		<p>This will give you the crossing locations without fragmenting. It returns an <a href="library/EdgeIntersection">EdgeIntersection</a> object.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-crane-1" resize></canvas><canvas id="canvas-crane-2" resize></canvas>
	</div>

	<div class="quote">
		<p>The SVG on the right has been <a href="library/fragment">fragmented</a></p>
	</div>

</section>

<h2>Collinear Nodes</h2>
<section id="collinear-nodes">

	<div class="centered">
		<canvas id="canvas-mouse-delete-edge" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>graph.<f>removeEdge</f>(<arg>edge</arg>)</code></pre>
	</div>

	<div class="quote">
		<p>Removing edges will remove their nodes, and so will nodes left behind between 2 collinear lines be removed as well.</p>
	</div>

</section>

<h2>Intersection of Two Edges</h2>
<section id="parallel">

	<div class="centered p5sketch" id="intersections-div"></div>
	
	<div class="quote">
		<p>Collinear lines at certain angles is a good place to test the robustness of the intersection algorithm</p>
	</div>

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
<script language="javascript" type="text/javascript" src="../tests/js/mouse_delete_edge.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/intersections.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/05_parallels_scale.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/11_merge_duplicates.js"></script>

<script>
var crane1CP = new OrigamiPaper("canvas-crane-1", cp);
loadSVGUnclean("/tests/svg/crane-errors.svg", function(cp){ 
	// crane1CP = new OrigamiPaper("canvas-folded", cp);
	crane1CP.cp = cp;
	paper = crane1CP.scope; 
	crane1CP.zoomToFit(0.05);
	crane1CP.initialize();
	crane1CP.selectNearestEdge = true;
});

var crane2CP = new OrigamiPaper("canvas-crane-2", cp);
loadSVG("/tests/svg/crane-errors.svg", function(cp){ 
	// crane2CP = new OrigamiPaper("canvas-folded", cp);
	crane2CP.cp = cp;
	paper = crane2CP.scope; 
	crane2CP.zoomToFit(0.05);
	crane2CP.initialize();
	crane2CP.selectNearestEdge = true;
});
</script>

<script>
	var p505 = new p5(_05_parallels, 'intersections-div');
</script>

<script>
	var p5b = new p5(_11_merge_duplicates, 'divP5_merge');
	p5b.callback = function(nodecount, edgecount, mergeInfo){
		$("#div-node-count").html(nodecount);
		$("#div-edge-count").html(edgecount);
		// if(mergeInfo != undefined){
		// 	var xString = (mergeInfo.x).toFixed(2);
		// 	var yString = (mergeInfo.y).toFixed(2);
		// 	var string = "{x:" + xString + ", y:" + yString + ", nodes:[" + mergeInfo.nodes[0] +"," + mergeInfo.nodes[1] + "]}";
		// 	$("#span-merge-result").html(string);
		// }
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
	paper1.style.nodes.visible = true;
	paper2.style.nodes.visible = true;
	// paper3.style.nodes.visible = true;
	paper1.update();
	paper2.update();
	// paper3.update();
</script>


<script>
	edge_intersections_callback = function(event){
		if(event !== undefined){
			document.getElementById("span-merge-result").innerHTML = "<v>Array</v>(<n>" + event.length + "</n>) ← ";
		}
	}
	intersectionSketch.reset();
</script>

<?php include 'footer.php';?>