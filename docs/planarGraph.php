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
		<pre><code><key>var</key> planarGraph<key> = new</key> PlanarGraph()<br><span id="span-intersection-results"></span>planarGraph.<a href="library/getEdgeIntersections.php"><f>getEdgeIntersections</f></a>()<c> // <a href="library/edgeIntersection.php">EdgeIntersection</a></c></code></pre>
	</div>

	<div class="quote">
		<p>A planar graph places a graph's nodes in 2D space (X,Y). It's now possible for edges to cross and make faces, locate parts based on distances, and more..</p>
	</div>

	<div class="centered">
		<canvas id="canvas-face-single" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="span-generate-face-result"></span>planarGraph.<a href="library/getEdgeIntersections.php"><f>generateFaces</f></a>()</code></pre>
	</div>

	<div class="centered">
		<canvas id="canvas-face-anim" class="panorama" resize></canvas>
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

<canvas id="p5-empty-canvas" style="display:none;"></canvas>


<script language="javascript" type="text/javascript" src="../tests/js/intersect_wobble.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/nearest_nodes.js"></script>
<script type="text/javascript" src="../tests/js/face_anim.js"></script>
<script type="text/javascript" src="../tests/js/face_single.js"></script>
<script>
var p5js = new p5(function(p, canvasName) { 
	noise = function(d){ return p.noise(d); }
	millis = function(){ return p.millis(); }
}, 'p5-empty-canvas');

wobble_intersections_callback = function(e){
	document.getElementById("span-intersection-results").innerHTML = "<v>Array</v>(<n>" + e.length + "</n>) ← ";
}

singleFaceCallback = function(e){
	document.getElementById("span-generate-face-result").innerHTML = "<v>Array</v>(<n>" + e.length + "</n>) ← ";
}
singleFace.reset();
</script>

<?php include 'footer.php';?>