<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.d3js.js"></script>

<h1>MATH</h1>

<section id="intro">
	<div class="quote">
		<p>The more 2D linear algebra I have thrown at this library the better.</p>
	</div>

	<div class="centered">
		<svg id="svgTest00" width="400" height="400"></svg>
	</div>

	<div class="quote">
		<p>The svg</p>
	</div>


	<div class="centered">
		<canvas id="canvas-radial-rainbow" resize></canvas>
	</div>
	
	<div class="centered">
		<pre><code><span id="edge-angle-div"></span>cp.<v>nodes</v>[<n>0</n>].<a href="library/planarAdjacent.php"><f>planarAdjacent</f>()</a></code></pre>
	</div>

	<div class="quote">
		<p>Notice the angle value. Computers render +Y axis downwards. Angles increase clockwise.</p>
	</div>

	<div class="quote">
		<p>Does this library use degrees or radians? I haven't made up my mind.</p>
	</div>

</section>
<script language="javascript" type="text/javascript" src="../tests/js/graph_simple.js"></script>
<script type="text/javascript" src="../tests/js/radial_rainbow.js"></script>
<script>
radial_rainbow_callback = function(event){
	var edgeNum = event.edge.index;
	var nodeNum = event.node.index;
	var angleDegrees = event.angle * 180 / Math.PI;
	// if(angleDegrees < 0) angleDegrees += 360;
	document.getElementById("edge-angle-div").innerHTML = 
		"{<n>" + angleDegrees.toFixed(1) + "</n>°, " + 
		"<v>edge" + edgeNum + "</v>, " + 
		"<v>node" + nodeNum + "</v>} ← ";
}
</script>


<?php include 'footer.php';?>