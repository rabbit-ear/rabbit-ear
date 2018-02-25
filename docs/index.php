<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>

<h1>ORIGAMI</h1>

<section id="intro">
	<div class="centered">
		<canvas id="canvas-fish-base-wobble" resize></canvas>
	</div>
	<div class="centered">
		<pre><code><key>let</key> cp <op>=</op> <key>new</key> CreasePattern().<f>fishBase</f>()</code></pre>
	</div>
	
	<p>This is a planar graph javascript library for creating origami crease patterns.</p>

<h2>Graphs</h2>
	
	<p>Origami crease patterns are modeled on planar graphs, which themselves are graphs, abstract models of nodes and edges.</p>

	<div id="sketch_intersections" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code><span id="span-intersection-results"></span>planarGraph.<a href=""><f>getEdgeIntersections</f></a>();</code></pre>
	</div>
	<p>These docs serve as a diary of the making of this code and contain visual interactive animated examples of functions. The early sections explain the abstract fundamentals and geometry, and the later pages relate more toward origami.</p>

<h2>About</h2>
	<p>This is <a href="http://github.com/robbykraft/Origami/">open source</a></p>
	<p>These docs make heavy use of <a href="http://paperjs.org/">paper.js</a>, <a href="http://d3js.org/">d3.js</a>, and <a href="http://p5js.org/">p5.js</a>. Thank you to their developers.</p>
	<p>This libary is available under the MIT open source license.</p>

	<p class="explain">This library is still under construction</p>

</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="js/cp_fish_wobble.js"></script>
<script language="javascript" type="text/javascript" src="../tests/04_intersections.js"></script>
<script>
var p5intersections = new p5(_04_intersections, 'sketch_intersections');
p5intersections.callback = function(e){
	document.getElementById("span-intersection-results").innerHTML = "<v>Array</v>(<n>" + e.length + "</n>) ← ";
}
</script>

<?php include 'footer.php';?>