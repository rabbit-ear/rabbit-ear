<?php include 'header.php';?>

<h1>Crease Patterns</h1>

<section id="intro">
	<div class="centered" id="fish-noise"></div>
	<div class="centered">
		<pre><code><f>let</f> cp <op>=</op> <key>new</key> CreasePattern().<f>fishBase</f>()</code></pre>
	</div>
	<p class="quote">This is a javascript library for creating origami crease patterns.</p>
</section>

<section id="intro">
	<h2>Download</h2>
	<p>Everything you need, including a guide to making your first sketch is on the <a href="introduction.php">introduction</a>.</p>
</section>

<section>
	<h2>Graphs</h2>
	<p>Origami crease patterns leverage mathematical graphs. Crease lines are the graph's edges defined by their end nodes.</p>
	<p>This type of graph is a planar graph, the crease lines exist on the Euclidean plane in the typical X, Y coordinate system.</p>
	<div class="centered">
		<canvas id="canvas-intersection-wobble" class="panorama" resize></canvas>
	</div>
	<div class="centered">
		<pre><code><span id="span-intersection-results"></span>planarGraph.<a href=""><f>fragment</f></a>();</code></pre>
	</div>
	<p>The aim of this library is for origami designs to be able to be created entirely in code, making every component accessible, flexible, and parametric.</p>
</section>

<section>
	<h2>About</h2>
	<p><a href="http://github.com/robbykraft/Origami/">All code is available</a>, released under the MIT open source license.</p>
</section>

<script type="text/javascript" src="../tests/fish_noise.js"></script>
<script type="text/javascript" src="../tests/intersect_wobble.js"></script>

<?php include 'footer.php';?>
