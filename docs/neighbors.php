<?php include 'header.php';?>

<h1>NEIGHBORS</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-nearest" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>nearest</f>(<n id="sketch-nearest-x">x</n>, <n id="sketch-nearest-y">y</n>)</a></code></pre>
	</div>


	<div class="centered">
		<canvas id="canvas-nearest-sector" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>let</key> sector <key>=</key> cp.<f>nearest</f>(<n id="sketch-nia-x">x</n>, <n id="sketch-nia-y">y</n>).sector</a></code></pre>
	</div>

	<div class="quote">
		<p>These functions are useful for relocating parts after an operation, and user-input.</p>
	</div>

	<div class="half p5sketch" id="div-p5-nearest-node"></div>
	<div class="half p5sketch" id="div-p5-nearest-edge"></div>
	<div class="centered">
		<pre class="centered language-javascript"><code class="language-javascript"><span id="spanNearestNodeIndex"></span>cp.<f>getNearestNode</f>( <n id="spanNearest1MouseX">x</n>, <n id="spanNearest1MouseY">y</n> )<br><span id="spanNearestEdgeIndex"></span>cp.<f>getNearestEdge</f>( <n class="token argument" id="spanNearest2MouseX">x</n>, <n class="token argument" id="spanNearest2MouseY">y</n> )</code></pre>
	</div>

	<div class="quote">
		<p>The nearest edge provides information like the nearest point on the edge.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-nearest-nodes" resize class="fill"></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>getNearestNodes</f>(<n id="sketch-ms-count">how many nodes</n>, <n id="sketch-ms-x1">x</n>, <n id="sketch-ms-y1">y</n>)</code></pre>
	</div>

	<div class="quote">
		<p>It's possible to get more than just one in an array sorted by distance.</p>
	</div>

</section>

<!-- include .js sketches -->
<!-- <script type="text/javascript" src="../lib/p5.min.js"></script>
<script type="text/javascript" src="../dist/cp.p5js.js"></script>
<script type="text/javascript" src="../tests/15_nearest_node.js"></script>
<script type="text/javascript" src="../tests/15_nearest_edge.js"></script>
 -->
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


// 	var p5a = new p5(p5_nearest_node, 'div-p5-nearest-node');
// 	var p5b = new p5(p5_nearest_edge, 'div-p5-nearest-edge');

// 	p5a.callback = function(e){
// 		if(e.x != undefined && e.y != undefined && e.node != undefined){
// 			document.getElementById("spanNearest1MouseX").innerHTML = (e.x).toFixed(2);
// 			document.getElementById("spanNearest1MouseY").innerHTML = (e.y).toFixed(2);
// 			document.getElementById("spanNearestNodeIndex").innerHTML = '<v>node' + e.node.index + '</v>  ← ';
// 		} else{
// 			document.getElementById("spanNearest1MouseX").innerHTML = ' x';
// 			document.getElementById("spanNearest1MouseY").innerHTML = ' y ';
// 			document.getElementById("spanNearestNodeIndex").innerHTML = '';
// 		}
// 		// console.log(e);
// 	}
// 	p5b.callback = function(e){
// 		if(e.x != undefined && e.y != undefined){
// 			document.getElementById("spanNearest2MouseX").innerHTML = (e.x).toFixed(2);
// 			document.getElementById("spanNearest2MouseY").innerHTML = (e.y).toFixed(2);
// // distance
// // edge
// // location
// 			document.getElementById("spanNearestEdgeIndex").innerHTML = '<v>edge' + e.nearest.edge.index + '</v>, (<n>' + e.nearest.point.x.toFixed(2) + '</n>,<n>' + e.nearest.point.y.toFixed(2) + '</n>)  ← ';
// 		} else{
// 			document.getElementById("spanNearest2MouseX").innerHTML = ' x';
// 			document.getElementById("spanNearest2MouseY").innerHTML = ' y ';
// 			document.getElementById("spanNearestEdgeIndex").innerHTML = '';
// 		}
// 		// console.log(e);
// 	}

</script>

<?php include 'footer.php';?>