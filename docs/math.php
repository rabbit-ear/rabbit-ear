<?php include 'header.php';?>

<h1>MATH</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-radial-rainbow" resize></canvas>
	</div>
	
	<div class="centered">
		<pre><code><span id="edge-angle-div"></span>cp.<v>nodes</v>[<n>0</n>].<a href="library/planarAdjacent.php"><f>planarAdjacent</f>()</a></code></pre>
	</div>

	<div class="quote">
		<p>Computers render +Y axis downwards. Angles increase clockwise, and arc tangent gives results between -180 and +180.</p>
	</div>

	<div class="quote">
		<p>Does this library use degrees or radians? I haven't made up my mind.</p>
	</div>

</section>

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