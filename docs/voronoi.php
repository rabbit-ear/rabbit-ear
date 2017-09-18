<?php include 'header.php';?>

<!-- <script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>
 -->

<!-- <h3 class="centered" style="padding-top:2em;">CHAPTER V.</h3> -->
<h1>VORONOI</h1>

<section id="intro">

	<div class="quote">
		<p>The Voronoi algorithm has a special place in origami, it's an implementation of origami axiom #2.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-voronoi-interpolate" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><v>cp</v>.<f>creaseVoronoi</f>(<n id="interp-value"></n>)</code></pre>
	</div>

	<div class="quote">
		<p>By hand, it's easy to crease the line at the midpoint (0.5), with a computer we can parameterize this value.</p>
	</div>


</section>

<script src="../lib/d3.min.js"></script>
<script src="../tests/js/voronoi_interp.js"></script>

<script type="text/javascript">

voronoiInterpCallback = function(e){
	if(e !== undefined){
		document.getElementById("interp-value").innerHTML = e.toFixed(2);
	}
}

</script>

<?php include 'footer.php';?>