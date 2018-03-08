<?php include 'header.php';?>

<h1>VORONOI</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-voronoi-many" resize class="panorama"></canvas>
	</div>

	<p>The Voronoi algorithm continues to appear in origami algorithms and research. The algorithm itself is an implementation of <a href="axioms.php">origami axiom #2</a>.</p>

	<p>Gussets are inserted between neighboring cells and run parallel to the cell edges. This algorithm explores a global crease pattern where every gusset's thickness is relative to the space between the neighbor cell sites.</p>

	<div class="centered">
		<canvas id="canvas-voronoi-interpolate" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><v>cp</v>.<f>creaseVoronoi</f>(<n id="interp-value"></n>)</code></pre>
	</div>

	<p>It's easy to crease a gusset by hand that sits halfway between cells. With a computer we can parameterize this value to be anywhere between 0.0 and 1.0.</p>
	

	<div class="centered">
		<canvas id="canvas-voronoi-animate-1" resize></canvas>
	</div>

	<p>A gusset joint is the area around where 3 points come together. The joint is treated differently if the triangle formed by the 3 voronoi sites is acute or obtuse.</p>


	<div class="centered">
		<canvas id="canvas-voronoi-edit" resize></canvas>
	</div>


</section>

<script src="../lib/d3.min.js"></script>
<script src="../tests/voronoi_many.js"></script>
<script src="../tests/voronoi_anim1.js"></script>
<script src="../tests/voronoi_interp.js"></script>
<script src="../tests/voronoi_edit.js"></script>

<script type="text/javascript">

voronoiInterpCallback = function(e){
	if(e !== undefined){
		document.getElementById("interp-value").innerHTML = e.toFixed(2);
	}
}

</script>

<?php include 'footer.php';?>