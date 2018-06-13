<?php include 'header.php';?>
<script type="text/javascript" src="../lib/p5.min.js"></script>
<script type="text/javascript" src="../dist/cp.p5js.js"></script>


<h1>EPSILON</h1>

<section id="epsilon">

	<div id="divP5_merge" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code><span id="div-node-count"></span> nodes, <span id="div-edge-count"></span> edges</code></pre>
	</div>

	<p class="quote">Epsilon (ε) is a tiny floating point number, many zeros past the decimal point.</p>
	
</section>

<h2>Duplicate Nodes in Space</h2>
<section id="duplicate-nodes">

	<p>When two nodes occupy the same space they will be merged into one.</p>

	<p>What constitutes the <span style="font-style:italic">same space</span> depends on the epsilon (ε). A larger epsilon will merge points across a greater distance.</p>

	<div class="centered">
		<canvas id="canvas1" resize></canvas>
		<canvas id="canvas2" resize></canvas>
		<!-- <canvas id="canvas3" resize></canvas> -->
	</div>

	<p class="quote">Both graphs have been cleaned, the one on the right was given a larger epsilon.</p>

	<div class="centered">
		<pre><code>graph.<f>cleanDuplicateNodes</f>(<n>epsilon</n>)</code></pre>
	</div>

	<p>Nearly every math function in this library offers an optional argument allowing you to specify a level of precision.</p>

	<p class="explain">For most applications an epsilon of 0.00000001 is sufficient for Javascript's 64 bit floats. 0.001 is more reasonable when importing SVG files made by hand, as points don't always lie on top.<br><br>These calculations relate to a unit-square-sized canvas.</p>

</section>

<h2>Collinear Planar Graph Edges</h2>
<section id="collinear-nodes">
	
	<p>Here's an interesting problem. When edges are removed and leave behind a node that separates two collinear edges, it's possible to consider the node no longer useful if you can claim its two incident edges are in fact parallel.

	<div class="centered">
		<canvas id="canvas-remove-edge" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="delete-edge-response"></span>graph.<f>removeEdge</f>(<arg>edge</arg>)<span id="delete-edge-comment"></span></code></pre>
	</div>

	<p class="quote">Nodes can be cleaned up if they are connecting two collinear edges, the two edges on either side can be merged into one.</p>

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
<script type="text/javascript" src="../tests/remove_edge.js"></script>
<script type="text/javascript" src="../tests/p5js_parallels_scale.js"></script>
<script type="text/javascript" src="../tests/p5js_merge_duplicates.js"></script>

<script>
remove_edge_callback = function(report){
	if(report != undefined){
		var nodecount = report.nodes.total;
		var edgecount = report.edges.total;
		// var str = "{edges:<n>" + edgecount + "</n>, nodes:<n>" + nodecount + "</n>} ⬅︎ ";
		// document.getElementById("delete-edge-response").innerHTML = str;
		var str = "<br><c>// just removed " + edgecount + " edge and " + nodecount + " node" + (nodecount==1 ? "" : "s") + "</c>";
		document.getElementById("delete-edge-comment").innerHTML = str;
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
	cp[1].cleanDuplicateNodes(0.05);
	var paper1 = new OrigamiPaper("canvas1", cp[0]);
	var paper2 = new OrigamiPaper("canvas2", cp[1]);
	paper1.show.nodes = true;
	paper2.show.nodes = true;
	paper1.style.node.fillColor = { gray:0 };
	paper2.style.node.fillColor = { gray:0 };
	paper1.draw();
	paper2.draw();
</script>


<?php include 'footer.php';?>