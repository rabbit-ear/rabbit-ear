<?php include 'header.php';?>

<section id="intro">
<h2>Introduction</h2>
	<div class="accordion">
		<p>Origami crease patterns are <a href="https://en.wikipedia.org/wiki/Planar_graph">Planar Graphs</a>, a type of mathematical graph; a collection of creases defined by endpoints.</p>
	</div>
	<div id="sketch_intro" class="centered p5sketch"></div>
	<pre><code><span class="token keyword">var</span> graph = <span class="token keyword">new</span> PlanarGraph()<br>graph.<span class="token function">fishBase</span>()</code></pre>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="sketch_intro.js"></script>
<script>
	new p5(sketch_intro, 'sketch_intro');
</script>

<?php include 'footer.php';?>