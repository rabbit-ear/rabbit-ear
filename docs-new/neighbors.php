<?php include 'header.php';?>

<h1>NEIGHBORS</h1>

<section id="intro">

<h2>get nearest</h2>
	<div class="centered">
		<canvas id="canvas-mouse-select" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>getNearestNode</f>(point)<br>cp.<f>getNearestEdge</f>(point)</code></pre>
	</div>

<h2>nearest nodes</h2>
	<div class="half p5sketch" id="div-p5-nearest-node"></div>
	<div class="half p5sketch" id="div-p5-nearest-edge"></div>
	<div class="centered">
		<pre class="centered language-javascript"><code class="language-javascript"><span id="spanNearest1NodeIndex"></span>cp.<span class="token function">getNearestNode</span>( <n id="spanNearest1MouseX">x</n>, <n id="spanNearest1MouseY">y</n> )<br>cp.<span class="token function">getNearestEdge</span>( <span class="token argument" id="spanNearest2MouseX">x</span>, <span class="token argument" id="spanNearest2MouseY">y</span> )</code></pre>
	</div>
	<div class="explain">
		<p>Nodes can return multiple nodes, and nearest edges provide the location on the edge that is the nearest point.</p>
	</div>
</section>
</section>

<script type="text/javascript" src="../examples/paperjs/mouse-select.js"></script>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../examples/p5js.cp.js"></script>
<script language="javascript" type="text/javascript" src="../examples/p5js/nearest_node.js"></script>
<script language="javascript" type="text/javascript" src="../examples/p5js/nearest_edge.js"></script>
<script>
	var p5a = new p5(p5_nearest_node, 'div-p5-nearest-node');
	var p5b = new p5(p5_nearest_edge, 'div-p5-nearest-edge');

	p5a.callback = function(e){
		if(e.x != undefined && e.y != undefined){
			$("#spanNearest1MouseX").html((e.x).toFixed(2));
			$("#spanNearest1MouseY").html((e.y).toFixed(2));
			$("#spanNearest1NodeIndex").html('<n>' + e.nearest + '</n>  ← ');
		} else{
			$("#spanNearest1MouseX").html(' x');
			$("#spanNearest1MouseY").html(' y ');
			$("#spanNearest1NodeIndex").html('');
		}
		// console.log(e);
	}
</script>

<?php include 'footer.php';?>