<?php include 'header.php';?>

<h1>Neighbors</h1>
<section id="interaction">
<h2>Select</h2>
	<div class="third p5sketch" id="div-p5-nearest-node"></div>
	<div class="third p5sketch" id="div-p5-nearest-edge"></div>
	<div class="third p5sketch" id="div-p5-nearest-face"></div>
	<div class="centered">
		<pre class="centered language-javascript"><code class="language-javascript">graph.<span class="token function">getNearestNode</span>( <span class="token argument" id="spanNearest1MouseX">x</span>, <span class="token argument" id="spanNearest1MouseY">y</span> )<br>graph.<span class="token function">getNearestEdge</span>( <span class="token argument" id="spanNearest2MouseX">x</span>, <span class="token argument" id="spanNearest2MouseY">y</span> )<br>graph.<span class="token function">getNearestFace</span>( <span class="token argument" id="spanNearest3MouseX">x</span>, <span class="token argument" id="spanNearest3MouseY">y</span> )</code></pre>
	</div>
	<div class="accordion">
		<p></p>
	</div>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/planarGraph/nearest_node.js"></script>
<script language="javascript" type="text/javascript" src="../tests/planarGraph/nearest_edge.js"></script>
<script language="javascript" type="text/javascript" src="../tests/planarGraph/nearest_face.js"></script>
<script>
	var p5a = new p5(p5_nearest_node, 'div-p5-nearest-node');
	var p5b = new p5(p5_nearest_edge, 'div-p5-nearest-edge');
	var p5c = new p5(p5_nearest_face, 'div-p5-nearest-face');
</script>

<?php include 'footer.php';?>