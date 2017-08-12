<?php include 'header.php';?>

<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>

<h3 class="centered" style="padding-top:2em;">CHAPTER II.</h3>
<h1>PLANAR GRAPHS</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-intersection-wobble" resize class="panorama"></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> planarGraph<key> = new</key> PlanarGraph();<br><span id="span-intersection-results"></span>planarGraph.<a href="library/getEdgeIntersections.php"><f>getEdgeIntersections</f></a>();</code></pre>
	</div>

	<div class="quote">
		<p>A planar graph gives 2D space (X,Y) to the nodes.</p>
	</div>

	<div class="quote">
		<p>It's now possible to calculate edge crossings, faces, and interact with the screen.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-mouse-delete-edge" resize></canvas>
	</div>

	<div class="quote">
		<p>More sophisticated operations can occur like removing nodes left behind that are coplanar to an edge.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-nearest-nodes" resize class="fill"></canvas>
	</div>

</section>

<div class="nav">
	<div class="nav-back">
		<p><a href="/docs/graph.php">⇦ Back: Graphs</a></p>
	</div>
	<div class="nav-next">
		<p><a href="planarClean.php">Next: Clean ⇒</a></p>
	</div>
</div>


<script language="javascript" type="text/javascript" src="../tests/js/mouse_delete_edge.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/intersect_wobble.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/nearest_nodes.js"></script>
<script>
var p5js = new p5(function(p, canvasName) { 
	noise = function(d){ return p.noise(d); }
	millis = function(){ return p.millis(); }
}, '');

wobble_intersections_callback = function(e){
	document.getElementById("span-intersection-results").innerHTML = "Array(<n>" + e.length + "</n>) ← ";
}
</script>

<?php include 'footer.php';?>