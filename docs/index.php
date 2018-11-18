<?php include 'header.php';?>

<h1>Crease Patterns</h1>

<section id="intro">
	<div id="fish-noise"></div>
	<pre><code><f>let</f> cp <op>=</op> CreasePattern().<f>fishBase</f>()</code></pre>
	<p class="quote">The crease pattern is the map for an origami design, and in recent years has expanded in understanding and scope.</p>
</section>

<section id="graphs">
	<h2>Graphs</h2>
	<p>A mathematical graph is an abstract map of connections between nodes. Origami crease patterns leverage these, their creases are the graph's edges, ending at nodes shared by neighboring crease lines.</p>
	<p>Furthermore this kind of graph is embedded in the Euclidean plane; these are called <b>planar graphs</b>.</p>
	<canvas id="canvas-intersection-wobble" class="panorama" resize></canvas>
	<pre><code><span id="span-intersection-results"></span>planarGraph.<a href=""><f>fragment</f></a>();</code></pre>
	<p class="quote">Edges in a planar graphs are not allowed to cross. An overlapped edge must be split into two with a node added at the intersection.</p>
	<p>The aim of this library is for origami designs to be able to be created entirely in code, making every component accessible, flexible, and parametric.</p>
</section>

<section id="download">
	<h2>Download</h2>
	<p>Everything you need, including a guide to making your first sketch is on the <a href="introduction.php">introduction</a>.</p>
</section>

<section id="about">
	<h2>About</h2>
	<p><a href="http://github.com/robbykraft/Origami/">All code is available</a>, released under the MIT open source license.</p>
</section>

<script type="text/javascript" src="../tests/fish_noise.js"></script>
<!-- <script type="text/javascript" src="../tests/intersect_wobble.js"></script> -->

<?php include 'footer.php';?>
