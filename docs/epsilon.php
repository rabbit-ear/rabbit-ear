<?php include 'header.php';?>

<!-- <script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>
 -->

<!-- <h3 class="centered" style="padding-top:2em;">CHAPTER V.</h3> -->
<h1>EPSILON</h1>

<section id="intro">

	<div class="quote">
		<p>Epsilon (ε) is the tiny space deep in the floating point number past the decimal point. </p>
	</div>

	<div class="centered">
		<canvas id="canvas" resize class="panorama"></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> planarGraph<key> = new</key> PlanarGraph()</code></pre>
	</div>

	<div class="quote">
		<p>Nearly every function has an optional epsilon argument at the end. You are in complete control over how wide to define the space of similar nodes.</p>
	</div>
	

	<div class="quote">
		<p>For most generative applications an epsilon of 0.00000001 is sufficient for Javascript's 64 bit floats. 0.001 is more reasonable when dealing with imported files created in vector graphics applications with sometimes imprecise input.</p>
	</div>
	
</section>


<?php include 'footer.php';?>