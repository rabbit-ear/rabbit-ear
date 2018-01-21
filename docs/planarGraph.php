<?php include 'header.php';?>

<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>
<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.d3js.js"></script>

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
		<p>Because a planar graph's nodes are in 2D space, it's now possible for faces to be made at edge intersections.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-face-single" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="span-generate-face-result"></span>planarGraph.<a href="library/generateFaces.php"><f>generateFaces</f></a>()</code></pre>
	</div>
</section>


<h2>Planar Nodes</h2>
<section id="nodes">

	<div class="quote">
		<p>Adjacent nodes create a fan shape from the parent node and can be sorted clockwise.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-radial-rainbow" resize></canvas>
	</div>
	
	<div class="centered">
		<pre><code><span id="edge-angle-div"></span>cp.<v>nodes</v>[<n>0</n>].<a href="library/planarAdjacent.php"><f>planarAdjacent</f>()</a></code></pre>
	</div>

	<div class="quote">
		<p>Notice the angle value. Computers render +Y axis downwards. Angles increase clockwise.</p>
	</div>

	<div class="quote">
		<p>Does this library use degrees or radians? I haven't made up my mind.</p>
	</div>


</section>


<h2>Planar Edges</h2>
<section id="edges">

	<div class="quote">
		<p></p>
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

<script type="text/javascript" src="../tests/js/radial_rainbow.js"></script>
<script>
radial_rainbow_callback = function(event){
	var edgeNum = event.edge.index;
	var nodeNum = event.node.index;
	var angleDegrees = event.angle * 180 / Math.PI;
	// if(angleDegrees < 0) angleDegrees += 360;
	document.getElementById("edge-angle-div").innerHTML = 
		"{<n>" + angleDegrees.toFixed(1) + "</n>°, " + 
		"<v>edge" + edgeNum + "</v>, " + 
		"<v>node" + nodeNum + "</v>} ← ";
}
</script>


<?php include 'footer.php';?>