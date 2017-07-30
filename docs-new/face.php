<?php include 'header.php';?>

<h1>FACE</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-node-adjacent-faces" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<v>nodes</v>[<n id="adjacent-face-node">0</n>].<f>adjacentFaces</f>()</code></pre>
	</div>

	<div class="explain">
		<p>Now that edges exist in 2D space, we can generate a face whenever 3 or more edges close off a space.</p>
	</div>
	<canvas id="canvas-1" resize></canvas>
	<canvas id="canvas-2" resize></canvas>
	<canvas id="canvas-3" resize></canvas>

	<div class="centered">
		<pre><code>cp.<f>generateFaces</f>()</code></pre>
	</div>
	
	<div class="explain">
		<p>This performs "edge walking" face detection</p>
		<ol>
			<li>Start at 1 node, walk away down 1 edge</li>
			<li>Upon reaching the next node, make the most immediate right turn available</li>
			<li>Walk down this new edge, repeat, always making immediate right turns until returning home</li>
		</ol>
	</div>
	<div class="tests">
		<ul>
			<li>adjacentNodeClockwiseFrom()</li>
			<li>planarAdjacent()</li>
		</ul>
	</div>
	<div class="centered">
		<canvas id="canvas-radial-rainbow" resize></canvas>
	</div>
	
	<div class="centered">
		<pre><code><span id="edge-angle-div"></span></code></pre>
	</div>


</section>

<script type="text/javascript" src="../tests/js/node-adjacent-faces.js"></script>
<script type="text/javascript" src="../tests/js/blank.js"></script>
<script type="text/javascript" src="../tests/js/radial_rainbow.js"></script>
<script>
radial_rainbow_callback = function(event){
	var angleDegrees = event * 180 / Math.PI;
	if(angleDegrees < 0) angleDegrees += 360;
	document.getElementById("edge-angle-div").innerHTML = angleDegrees.toFixed(1) + "°";
}
</script>

<script>
var cp1 = new CreasePattern();
cp1.kiteBase();
cp1.generateFaces();
var cp2 = new CreasePattern();
cp2.fishBase();
cp2.generateFaces();
var cp3 = new CreasePattern();
cp3.birdBase();
cp3.generateFaces();

fillCanvasWithCP("canvas-1", cp1);
fillCanvasWithCP("canvas-2", cp2);
fillCanvasWithCP("canvas-3", cp3);
</script>

<script>
// console.log(_node_adjacent_faces);
node_adjacent_faces_callback = function(event){
	document.getElementById("adjacent-face-node").innerHTML = event.node;
	console.log(event);
}
</script>

<?php include 'footer.php';?>