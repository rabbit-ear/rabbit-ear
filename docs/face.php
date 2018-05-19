<?php include 'header.php';?>

<h1>FACE</h1>

<section id="face">
	<div class="centered">
		<canvas id="canvas-node-adjacent-faces" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<v>nodes</v>[<n id="adjacent-face-node">0</n>].<f>adjacentFaces</f>()</code></pre>
	</div>
<!--
	<p class="quote">This algorithm above, <b>adjacentFaces()</b>, is running in real time</p
 -->
	<div class="centered">
		<canvas id="canvas-faces-convex" resize></canvas>
		<canvas id="canvas-faces-non-convex" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>flatten</f>()</code></pre>
	</div>

	<p class="quote">This algorithm, <b>flatten()</b>, calculates and stores all the faces, and ran once at the beginning</p>
	
	<p class="explain">A face won't be created if there is a stray edge poking into the polygon.</p>
</section>


<h2>Face Finding Algorithm</h2>
<section>

	<p class="quote">Faces are found by walking down edges, and whenever reaching a node, always making the sharpest right turn, a face is found when you end up where you began.</li>

	<div class="centered">
		<canvas id="canvas-1" resize></canvas>
		<canvas id="canvas-2" resize></canvas>
		<!-- <canvas id="canvas-3" resize></canvas> -->
	</div>

	<p>To find the sharpest right turn, we need to sort adjacent edges by their angles.</p>

	<div class="centered">
		<canvas id="canvas-radial-rainbow" resize></canvas>
	</div>
	
	<div class="centered">
		<pre><code><span id="edge-angle-div"></span>cp.<v>nodes</v>[<n>0</n>].<f>adjacentEdges</f>()</code></pre>
	</div>

	<p class="quote">In the planar graph, a node's adjacent edges will come <b>sorted radially around the node</b>.</p>

	<p class="quote">After sorting the lines by angle, it's easy to find the next most right turn.</p>

	<p class="quote">Along the way it's important to sum up the angles visited along the walk. Interior angles are right turns.</p>

	<p class="quote">Since we know we are making right turns, if there are 4 angles of 270 degrees, we just walked around the outside of a perimeter of a square.</p>

	<!-- <div class="centered">
		<canvas id="canvas-faces-radial" resize></canvas>
	</div> -->

</section>
<!-- 
<div class="tests">
	<ul>
		<li></li>
	</ul>
</div>
 -->
<script type="text/javascript" src="../tests/node_adjacent_faces.js"></script>
<!-- <script type="text/javascript" src="../tests/faces_radial.js"></script> -->
<script type="text/javascript" src="../tests/faces_convex.js"></script>
<script type="text/javascript" src="../tests/faces_non_convex.js"></script>
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
<script>
var cp1 = new CreasePattern();
cp1.fishBase();
cp1.flatten();
var cp2 = new CreasePattern();
cp2.birdBase();
cp2.flatten();
// var cp3 = new CreasePattern();
// cp3.frogBase();
// cp3.flatten();

new OrigamiPaper("canvas-1", cp1);
new OrigamiPaper("canvas-2", cp2);

</script>

<script>
// console.log(_node_adjacent_faces);
node_adjacent_faces_callback = function(event){
	document.getElementById("adjacent-face-node").innerHTML = event.node.index;
}
</script>

<?php include 'footer.php';?>