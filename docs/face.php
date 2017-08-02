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
		<p>Even if edges properly enclose a space, a face won't be created if there is a stray edge poking into the polygon.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-faces-random" resize></canvas>
		<canvas id="canvas-faces-random-partial" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>generateFaces</f>()</code></pre>
	</div>
	
	<div class="tests">
		<ul>
			<li>adjacentNodeClockwiseFrom()</li>
			<li>planarAdjacent()</li>
		</ul>
	</div>

</section>
<section>

<h2>Face Finding Algorithm</h2>

	<div class="centered">
		<canvas id="canvas-radial-rainbow" resize></canvas>
	</div>
	
	<div class="centered">
		<pre><code><span id="edge-angle-div"></span>cp.<v>nodes</v>[<n>0</n>].<a href="methods/planarAdjacent.php"><f>planarAdjacent</f>()</a></code></pre>
	</div>

	<div class="centered">
		<canvas id="canvas-faces-radial" resize></canvas>
	</div>

	<div class="explain">
		<p>Edge Walking Face Detection:</p>
		<ol>
			<li>Begin with a node, walk down one adjacent edge</li>
			<li>Upon reaching the next node, make the most immediate right turn available, walk down edge</li>
			<li>Repeat, always turning right, stop when you reach the node from which you began</li>
		</ol>
	</div>

	<div class="centered">
		<canvas id="canvas-1" resize></canvas>
		<canvas id="canvas-2" resize></canvas>
		<canvas id="canvas-3" resize></canvas>
	</div>


</section>

<script type="text/javascript" src="../tests/js/node-adjacent-faces.js"></script>
<script type="text/javascript" src="../tests/js/blank.js"></script>
<script type="text/javascript" src="../tests/js/radial_rainbow.js"></script>
<script type="text/javascript" src="../tests/js/faces_radial.js"></script>
<script type="text/javascript" src="../tests/js/faces_random.js"></script>
<script type="text/javascript" src="../tests/js/faces_random_partial.js"></script>
<script>
radial_rainbow_callback = function(event){
	var edgeNum = event.edge.index;
	var nodeNum = event.node.index;
	var angleDegrees = event.angle * 180 / Math.PI;
	if(angleDegrees < 0) angleDegrees += 360;
	document.getElementById("edge-angle-div").innerHTML = 
		"{angle:<n>" + angleDegrees.toFixed(1) + "</n>°, " + 
		"edge#:<n>" + edgeNum + "</n>, " + 
		"node#:<n>" + nodeNum + "</n>} ← ";
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
	document.getElementById("adjacent-face-node").innerHTML = event.node.index;
}
</script>

<?php include 'footer.php';?>