<?php include 'header.php';?>

<h1>2D SPACE</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-nearest" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>nearest</f>(<n id="sketch-nearest-x">x</n>, <n id="sketch-nearest-y">y</n>)</a></code></pre>
	</div>

	<p class="quote">Remember, <b>adjacency</b> is still defined in relation to graph space, but we now have 2D space to perform distance operations.</p>

	<p>Specify a coordinate and this function will find the nearest of each parts of a crease pattern: nodes, edges, faces, sectors, junctions.</p>

	<div class="centered">
		<canvas id="canvas-node-adjacent-faces" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<v>nodes</v>[<n id="adjacent-face-node">0</n>].<f>adjacentFaces</f>()</code></pre>
	</div>

	<p>Edge-adjacent-faces are faces which share an edge with another face. A node's adjacent faces is in the example above.</p>

	<div class="centered">
		<canvas id="canvas-nearest-sector" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>let</key> sector <key>=</key> cp.<f>nearest</f>(<n id="sketch-nia-x">x</n>, <n id="sketch-nia-y">y</n>).sector</a></code></pre>
	</div>

	<div class="centered">
		<canvas id="canvas-nearest-nodes" resize class="fill"></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>getNearestNodes</f>(<n id="sketch-ms-count">how many nodes</n>, <n id="sketch-ms-x1">x</n>, <n id="sketch-ms-y1">y</n>)</code></pre>
	</div>

</section>

<script type="text/javascript" src="../tests/node_adjacent_faces.js"></script>
<script type="text/javascript" src="../tests/nearest.js"></script>
<script type="text/javascript" src="../tests/nearest_sector.js"></script>
<script type="text/javascript" src="../tests/nearest_nodes.js"></script>

<script>
nearestCallback = function(point){
	if(point === undefined){
		document.getElementById("sketch-nearest-x").innerHTML = 'x';
		document.getElementById("sketch-nearest-y").innerHTML = 'y';
	}
	else{
		document.getElementById("sketch-nearest-x").innerHTML = (point.x).toFixed(2);
		document.getElementById("sketch-nearest-y").innerHTML = (point.y).toFixed(2);
	}
}
nearSectorCallback = function(event){
	if(event.point === undefined){
		document.getElementById("sketch-nia-x").innerHTML = 'x';
		document.getElementById("sketch-nia-y").innerHTML = 'y';
	}
	else{
		document.getElementById("sketch-nia-x").innerHTML = (event.point.x).toFixed(2);
		document.getElementById("sketch-nia-y").innerHTML = (event.point.y).toFixed(2);
	}
}
nearestNodesCallback = function(event){
	if(event == undefined){
		document.getElementById("sketch-ms-x1").innerHTML = 'x';
		document.getElementById("sketch-ms-y1").innerHTML = 'y';
		document.getElementById("sketch-ms-count").innerHTML = 'how many nodes';
	}
	else{
		document.getElementById("sketch-ms-x1").innerHTML = (event.point.x).toFixed(2);
		document.getElementById("sketch-ms-y1").innerHTML = (event.point.y).toFixed(2);
		document.getElementById("sketch-ms-count").innerHTML = event.count;
	}
}
node_adjacent_faces_callback = function(event){
	document.getElementById("adjacent-face-node").innerHTML = event.node.index;
}
</script>

<?php include 'footer.php';?>