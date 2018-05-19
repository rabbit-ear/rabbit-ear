<?php include 'header.php';?>

<h1>NEIGHBORS</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-nearest" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>nearest</f>(<n id="sketch-nearest-x">x</n>, <n id="sketch-nearest-y">y</n>)</a></code></pre>
	</div>

	<p>Supply a coordinate location to the nearest function and it will find the nearest one of each of the parts of a crease pattern.</p>

	<div class="centered">
		<pre><code>{<br>&nbsp;&nbsp;node:<f>PlanarNode</f>,<br>&nbsp;&nbsp;edge:<f>PlanarEdge</f>,<br>&nbsp;&nbsp;face:<f>PlanarFace</f>,<br>&nbsp;&nbsp;junction:<f>PlanarJunction</f>,<br>&nbsp;&nbsp;sector:<f>PlanarSector</f><br>}</code></pre>
	</div>


	<p>Each member object can be found in the return object and is a pointer to that member object in the crease pattern.</p>

	<div class="centered">
		<canvas id="canvas-nearest-sector" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>let</key> sector <key>=</key> cp.<f>nearest</f>(<n id="sketch-nia-x">x</n>, <n id="sketch-nia-y">y</n>).sector</a></code></pre>
	</div>


	<p>If you call the component functions directly, it's possible to pass in more arguments like locating more than one nearest node.</p>

	<div class="centered">
		<canvas id="canvas-nearest-nodes" resize class="fill"></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>getNearestNodes</f>(<n id="sketch-ms-count">how many nodes</n>, <n id="sketch-ms-x1">x</n>, <n id="sketch-ms-y1">y</n>)</code></pre>
	</div>


</section>


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

nearSectorCallback = function(point){
	if(point === undefined){
		document.getElementById("sketch-nia-x").innerHTML = 'x';
		document.getElementById("sketch-nia-y").innerHTML = 'y';
	}
	else{
		document.getElementById("sketch-nia-x").innerHTML = (point.x).toFixed(2);
		document.getElementById("sketch-nia-y").innerHTML = (point.y).toFixed(2);
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

</script>

<?php include 'footer.php';?>