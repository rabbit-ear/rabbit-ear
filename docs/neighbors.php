<?php include 'header.php';?>

<h1>NEIGHBORS</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-mouse-select" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>getNearestNode</f>(<n id="sketch-ms-x1">x</n>, <n id="sketch-ms-y1">y</n>)<br>cp.<f>getNearestEdge</f>(<n id="sketch-ms-x2">x</n>, <n id="sketch-ms-y2">y</n>)</code></pre>
	</div>

	<div class="quote">
		<p>getNearestEdge provides further information, like the nearest point on an edge.</p>
	</div>

	<div class="half p5sketch" id="div-p5-nearest-node"></div>
	<div class="half p5sketch" id="div-p5-nearest-edge"></div>
	<div class="centered">
		<pre class="centered language-javascript"><code class="language-javascript"><span id="spanNearestNodeIndex"></span>cp.<f>getNearestNode</f>( <n id="spanNearest1MouseX">x</n>, <n id="spanNearest1MouseY">y</n> )<br><span id="spanNearestEdgeIndex"></span>cp.<f>getNearestEdge</f>( <n class="token argument" id="spanNearest2MouseX">x</n>, <n class="token argument" id="spanNearest2MouseY">y</n> )</code></pre>
	</div>

	<div class="centered">
		<canvas id="canvas-nearest-nodes" resize class="fill"></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>getNearestNodes</f>(<n id="sketch-ms-x1">x</n>, <n id="sketch-ms-y1">y</n>)</code></pre>
	</div>

	<div class="quote">
		<p>getNearestNodes (plural) lets you query for more than one, and returns an array of nodes sorted by distance.</p>
	</div>
</section>

<script type="text/javascript" src="../tests/js/mouse-select.js"></script>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/15_nearest_node.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/15_nearest_edge.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/nearest_nodes.js"></script>
<script>

mouse_select_callback = function(e){
	document.getElementById("sketch-ms-x1").innerHTML = (e.x).toFixed(2);
	document.getElementById("sketch-ms-y1").innerHTML = (e.y).toFixed(2);
	document.getElementById("sketch-ms-x2").innerHTML = (e.x).toFixed(2);
	document.getElementById("sketch-ms-y2").innerHTML = (e.y).toFixed(2);
}

	var p5a = new p5(p5_nearest_node, 'div-p5-nearest-node');
	var p5b = new p5(p5_nearest_edge, 'div-p5-nearest-edge');

	p5a.callback = function(e){
		if(e.x != undefined && e.y != undefined && e.node != undefined){
			$("#spanNearest1MouseX").html((e.x).toFixed(2));
			$("#spanNearest1MouseY").html((e.y).toFixed(2));
			$("#spanNearestNodeIndex").html('<v>node' + e.node.index + '</v>  ← ');
		} else{
			$("#spanNearest1MouseX").html(' x');
			$("#spanNearest1MouseY").html(' y ');
			$("#spanNearestNodeIndex").html('');
		}
		// console.log(e);
	}
	p5b.callback = function(e){
		if(e.x != undefined && e.y != undefined){
			$("#spanNearest2MouseX").html((e.x).toFixed(2));
			$("#spanNearest2MouseY").html((e.y).toFixed(2));
// distance
// edge
// location
			$("#spanNearestEdgeIndex").html('<v>edge' + e.nearest.edge.index + '</v>, (<n>' + e.nearest.x.toFixed(2) + '</n>,<n>' + e.nearest.y.toFixed(2) + '</n>)  ← ');
		} else{
			$("#spanNearest2MouseX").html(' x');
			$("#spanNearest2MouseY").html(' y ');
			$("#spanNearestEdgeIndex").html('');
		}
		// console.log(e);
	}
</script>

<?php include 'footer.php';?>