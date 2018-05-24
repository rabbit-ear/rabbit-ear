<?php include 'header.php';?>

<h1>VORONOI</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-voronoi" resize class="panorama"></canvas>
	</div>

	<p>The Voronoi algorithm repeatedly appears in origami algorithms and research. The algorithm itself is an implementation of <a href="axioms.php">origami axiom #2</a>.</p>

<h2>Gussets</h2>

	<p>Gussets are channels inserted between cells that run parallel to the cell edges. This specific implementation explores a global crease pattern where every gusset's thickness is relative to the distance between the Voronoi sites.</p>

	<div class="centered">
		<canvas id="canvas-voronoi-scale" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><v>cp</v>.<f>creaseVoronoi</f>(<n id="interp-value"></n>)</code></pre>
	</div>

	<p>It's easy to crease a gusset by hand that sits halfway between cells. With a computer we can parameterize this value to be anywhere between 0.0 and 1.0.</p>
	
<h2>Molecules</h2>

	<div class="centered">
		<canvas id="canvas-voronoi-obtuse-cover" resize></canvas>
		<canvas id="canvas-voronoi-obtuse" resize></canvas>
	</div>

	<p>A molecule is the area around where 3 points come together. If the 3 Voronoi sites form an acute or right triangle the boundary of the molecule is a triangle; if the 3 sites form an obtuse triangle the boundary is a quadrilateral.</p>


<!-- 	<div class="centered">
		<canvas id="canvas-voronoi-edit" resize></canvas>
	</div> -->


</section>

<script src="../lib/d3.min.js"></script>
<script src="../tests/voronoi.js"></script>
<script src="../tests/voronoi_obtuse_cover.js"></script>
<script src="../tests/voronoi_obtuse.js"></script>
<script src="../tests/voronoi_scale.js"></script>

<script>
voronoiSketch.reset(30);
</script>

<script type="text/javascript">
voronoiScaleCallback = function(e){
	if(e !== undefined){
		document.getElementById("interp-value").innerHTML = e.toFixed(2);
	}
}
</script>

<?php include 'footer.php';?>