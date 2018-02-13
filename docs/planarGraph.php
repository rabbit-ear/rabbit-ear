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

	<p>A graph becomes a planar graph when nodes and edges are given a location in 2D space, ushering in a new emerging set of rules and ways of orienting the graph.</p>

	<p>Positions are mapped to the Euclidean plane and are described in terms of X and Y. Two adjacent edges create an interior angle between them. Nodes and edges can be <strong>near in proximity</strong> to each other. Edges can enclose a space to create a <strong>face</strong>.</p>

	<p>Edges can now cross each other, something mathematicians have decided is not allowed. 2 crossing edges should be resolved into 4 edges with a new node sitting at their intersection.</p>

</section>

<div class="nav">
	<div class="nav-back">
		<a href="/docs/graph.php">⇦ Back: Graphs</a>
	</div>
	<div class="nav-next">
		<a href="planarClean.php">Next: Clean ⇒</a>
	</div>
</div>

<canvas id="p5-empty-canvas" style="display:none;"></canvas>

<script language="javascript" type="text/javascript" src="../tests/intersect_wobble.js"></script>
<script type="text/javascript" src="../tests/face_single.js"></script>
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

<script type="text/javascript" src="../tests/radial_rainbow.js"></script>
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