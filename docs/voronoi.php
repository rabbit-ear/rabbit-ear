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
		<pre><code><key>var</key> cp<key> = new</key> CreasePattern()</code></pre>
	</div>


</section>

<script src="../lib/d3.min.js"></script>
<script src="../tests/js/voronoi_interp.js"></script>

<?php include 'footer.php';?>