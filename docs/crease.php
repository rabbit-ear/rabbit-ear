<?php include 'header.php';?>

<h1>CREASE</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-crease-edge" class="third" resize></canvas>
		<canvas id="canvas-crease-line" class="third" resize></canvas>
		<canvas id="canvas-crease-ray" class="third" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>crease</f>(<span id="edge-points"></span>)<br>cp.<f>creaseThroughPoints</f>(<span id="line-points"></span>)<br>cp.<f>creaseRay</f>(<span id="ray-points"></span>)</code></pre>
	</div>

	<p class="quote">Ray is unique among these, the second point should be a direction vector</p>

	<div class="centered">
		<canvas id="canvas-crease-ray-repeat" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>creaseRayRepeat</f>(<span id="ray-repeat-points"></span>)</code></pre>
	</div>


	<div class="centered">
		<canvas id="canvas-crease-ray-stop" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>creaseRayUntilIntersection</f>(<span id="ray-stop-points"></span>)</code></pre>
	</div>


	<div class="centered">
		<canvas id="canvas-crease-edge-to-edge" resize></canvas>
	</div>

<h3>Pleats</h3>

	<div class="centered">
		<canvas id="canvas-pleat-edge" resize></canvas>
	</div>
</section>

<script type="text/javascript" src="../tests/crease_edge.js"></script>
<script type="text/javascript" src="../tests/crease_line.js"></script>
<script type="text/javascript" src="../tests/crease_ray.js"></script>
<script type="text/javascript" src="../tests/crease_ray_repeat.js"></script>
<script type="text/javascript" src="../tests/crease_ray_stop.js"></script>
<script type="text/javascript" src="../tests/crease_edge_to_edge.js"></script>
<script type="text/javascript" src="../tests/pleat_edge.js"></script>

<script>
creaseEdgeCallback = function(event){
	if(event.points !== undefined){
		document.getElementById("edge-points").innerHTML = "<n>" + event.points[0].x.toFixed(2) + "</n>, <n>" + event.points[0].y.toFixed(2) + "</n>, <n>" + event.points[1].x.toFixed(2) + "</n>, <n>" + event.points[1].y.toFixed(2) + "</n>";
	}
}
creaseLineCallback = function(event){
	if(event.points !== undefined){
		document.getElementById("line-points").innerHTML = "<n>" + event.points[0].x.toFixed(2) + "</n>, <n>" + event.points[0].y.toFixed(2) + "</n>, <n>" + event.points[1].x.toFixed(2) + "</n>, <n>" + event.points[1].y.toFixed(2) + "</n>";
	}
}
creaseRayCallback = function(event){
	if(event.points !== undefined){
		document.getElementById("ray-points").innerHTML = "<n>" + event.points[0].x.toFixed(2) + "</n>, <n>" + event.points[0].y.toFixed(2) + "</n>, <n>" + event.points[1].x.toFixed(2) + "</n>, <n>" + event.points[1].y.toFixed(2) + "</n>";
	}
}
creaseEdge.updateCreases();
creaseLine.updateCreases();
creaseRay.updateCreases();

</script>

<?php include 'footer.php';?>