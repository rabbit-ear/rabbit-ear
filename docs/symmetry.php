<?php include 'header.php';?>

<!-- <script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>
 -->

<!-- <h3 class="centered" style="padding-top:2em;">CHAPTER V.</h3> -->
<h1>SYMMETRY</h1>

<section id="intro">

	<div class="quote">
		<p>Classical origami designs so frequently employ bilaterial symmetry.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-mirror" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> planarGraph<key> = new</key> PlanarGraph()</code></pre>
	</div>

	<div class="centered">
		<canvas id="canvas-mirror-book" resize></canvas>
	</div>

	<div class="quote">
		<p><b>Book</b> or <b>horizontal</b> (line through edge) and <b>diagonal</b> (line through corners) symmetry.</p>
	</div>

	<div class="quote">
		<p>I would like to generalize the symmetry application function as much as possible.</p>
	</div>

</section>

<script src="../tests/js/mirror.js"></script>
<script src="../tests/js/mirror-book.js"></script>


<?php include 'footer.php';?>