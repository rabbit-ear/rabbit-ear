<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>

<h1>INTERSECTIONS</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-intersections" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="span-merge-result"></span>graph.<f>chop</f>()</code></pre>
	</div>


	<div class="centered">
		<pre><code>graph.<f>getEdgeIntersections</f>()</code></pre>
	</div>
</section>

<section id="parallel">
	<h2>Parallel Lines</h2>
	<div class="explain">
		<p>At some point, two lines will be considered parallel due to floating point precision, and could vary from machine to machine, so this library needs to be in control of the epsilon calculation.</p>
	</div>

	<div class="centered p5sketch" id="intersections-div"></div>

	<div class="quote">
		<p>Collinear lines (the last pair) should not intersect.</p>
	</div>
	
</section>

<div class="tests">
	<ul>
		<li><a href="../tests/html/chop_one_line.html">chop overlapping lines</a></li>
		<li><a href="../tests/html/chop_collinear_vert.html">chop vertical collinear</a></li>
		<li><a href="../tests/html/chop_collinear_horiz.html">chop horizontal collinear</a></li>
		<li><a href="../tests/html/chop_angle_ray.html">chop angled rays</a></li>
		<li><a href="../tests/html/chop_mountain_valley.html">chop and preserve mountain/valley</a></li>
	</ul>
</div>


<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/js/intersections.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/05_parallels_scale.js"></script>
<script>
	var p505 = new p5(_05_parallels, 'intersections-div');
</script>

<script>
	edge_intersections_callback = function(event){
		if(event != undefined){
			document.getElementById("span-merge-result").innerHTML = "<v>Array</v>(<n>" + event.length + "</n>) ← ";
		}
	}
</script>
<?php include 'footer.php';?>