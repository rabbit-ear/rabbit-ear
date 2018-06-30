<?php include 'header.php';?>

<h1>VORONOI</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-voronoi" resize class="panorama"></canvas>
	</div>

	<p>The Voronoi algorithm repeatedly appears in origami algorithms and research. The algorithm itself is an implementation of <a href="axioms.php">origami axiom #2</a>.</p>

	<p>This is a great example of the reason this library was written in Javascript: for collaboration. This is the Voronoi algorithm from <a href="http://d3js.org/">D3</a>.</p>

	<div class="centered">
		<canvas id="canvas-voronoi-scale" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><v>cp</v>.<f>creaseVoronoi</f>(<n id="interp-value"></n>)</code></pre>
	</div>

	<p>This was a personal exploration uncovering this particular Voronoi crease pattern, it folds into 3D channels with molecules resolving at their intersections.</p>
	
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
voronoiSketch.reset(20);
</script>

<script type="text/javascript">
voronoiScaleCallback = function(e){
	if(e !== undefined){
		document.getElementById("interp-value").innerHTML = e.toFixed(2);
	}
}
</script>

<?php include 'footer.php';?>