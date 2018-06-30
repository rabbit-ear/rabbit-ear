<?php include 'header.php';?>
<script type="text/javascript" src="../lib/perlin.js"></script>

<h1>CREASE PATTERNS</h1>

<section id="intro">
	
	<div class="centered">
		<canvas id="canvas-fish-base-wobble" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><f>let</f> cp <op>=</op> <key>new</key> CreasePattern().<f>fishBase</f>()</code></pre>
	</div>
	
	<p class="quote">This is a javascript library for creating origami crease patterns.</p>

<h2>Download</h2>

<section id="intro">

	<p>Everything you need, including a guide to making your first sketch is on the <a href="introduction.php">introduction</a>.</p>

</section>

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

<h2>About</h2>

	<p>This is <a href="http://github.com/robbykraft/Origami/">open source</a></p>
	<p>These docs make heavy use of <a href="http://paperjs.org/">paper.js</a>, <a href="http://d3js.org/">d3.js</a>, and <a href="http://p5js.org/">p5.js</a>. Thank you to their developers.</p>
	<p>This libary is available under the MIT open source license.</p>

</section>

<script type="text/javascript" src="js/cp_fish_wobble.js"></script>
<script type="text/javascript" src="../tests/intersect_wobble.js"></script>
<script>
wobble_intersections_callback = function(e){
	document.getElementById("span-intersection-results").innerHTML = "{<str>'fragment'</str>: <v>Array</v>(<n>" + e.length + "</n>)} ← ";
}</script>

<?php include 'footer.php';?>