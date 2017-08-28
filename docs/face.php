<?php include 'header.php';?>

<h1>FACE</h1>

<section id="face">
	<div class="centered">
		<canvas id="canvas-node-adjacent-faces" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<v>nodes</v>[<n id="adjacent-face-node">0</n>].<f>adjacentFaces</f>()</code></pre>
	</div>

<!-- 	<div class="quote">
		<p>This algorithm above, <b>adjacentFaces()</b>, is running in real time</p>
	</div>
 -->
	<div class="centered">
		<canvas id="canvas-faces-random" resize></canvas>
		<canvas id="canvas-faces-random-partial" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>generateFaces</f>()</code></pre>
	</div>

	<div class="quote">
		<p>This algorithm, <b>generateFaces()</b>, calculates and stores all the faces, and ran once at the beginning</p>
	</div>

	<div class="explain">
		<p>A face won't be created if there is a stray edge poking into the polygon.</p>
	</div>
</section>


<h2>Face Finding Algorithm</h2>
<section>

	<div class="quote">
		<p>Faces are found by walking down edges, and whenever reaching a node, always making the sharpest right turn, a face is found when you end up where you began.</li>
	</div>

	<div class="centered">
		<canvas id="canvas-1" resize></canvas>
		<canvas id="canvas-2" resize></canvas>
		<!-- <canvas id="canvas-3" resize></canvas> -->
	</div>

	<div class="quote">
		<p>To find the sharpest right turn, we need to sort adjacent edges by their angles.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-faces-radial" resize></canvas>
	</div>


</section>

<div class="tests">
	<ul>
		<li></li>
	</ul>
</div>

<script type="text/javascript" src="../tests/js/node-adjacent-faces.js"></script>
<script type="text/javascript" src="../tests/js/faces_radial.js"></script>
<script type="text/javascript" src="../tests/js/faces_random.js"></script>
<script type="text/javascript" src="../tests/js/faces_random_partial.js"></script>
<script>
var cp1 = new CreasePattern();
cp1.fishBase();
cp1.generateFaces();
var cp2 = new CreasePattern();
cp2.birdBase();
cp2.generateFaces();
// var cp3 = new CreasePattern();
// cp3.frogBase();
// cp3.generateFaces();

new PaperCreasePattern("canvas-1", cp1);
new PaperCreasePattern("canvas-2", cp2);

</script>

<script>
// console.log(_node_adjacent_faces);
node_adjacent_faces_callback = function(event){
	document.getElementById("adjacent-face-node").innerHTML = event.node.index;
}
</script>

<?php include 'footer.php';?>