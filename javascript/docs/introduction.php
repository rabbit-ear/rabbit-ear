<?php include 'header.php';?>

<section id="intro">
<h2>Introduction</h2>
	<div class="accordion">
		<p>This is a library to assist in the building and manipulating of origami crease patterns. Crease patterns are represented by <a href="https://en.wikipedia.org/wiki/Planar_graph">Planar Graphs</a>. To begin, create a new planar graph object.</p>
	</div>
	<pre><code><key>var</key> graph <op>=</op> <key>new</key> PlanarGraph()<br>graph.<f>fishBase</f>()</code></pre>
	<div id="sketch_intro" class="centered p5sketch"></div>
	<pre><code><c>//wiggle</c><br>graph.<f>nodes</f>[<n>3</n>] <op>=</op> { <str>x</str>:<f>noise</f>(<arg>t1</arg>), <str>y</str>:<f>noise</f>(<arg>t2</arg>) };<br>graph.<f>nodes</f>[<n>6</n>] <op>=</op> { <str>x</str>:<f>noise</f>(<arg>t3</arg>), <str>y</str>:<f>noise</f>(<arg>t4</arg>) };</code></pre>
	<div class="accordion">
		<p>A certain priority is placed on accessibility and real-time updating. Everything is available for you to change, and where possible, code is optimized to be able to be run inside of a game loop.</p>
	</div>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="sketch_intro.js"></script>
<script>
	new p5(sketch_intro, 'sketch_intro');
</script>

<?php include 'footer.php';?>