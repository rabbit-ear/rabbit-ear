<?php include 'header.php';?>

<section id="intro">
<h2>PlanarGraph()</h2>
	<div class="centered">
		<pre><code><key>var</key> graph <op>=</op> <key>new</key> PlanarGraph()</code></pre>
	</div>
	<div id="sketch_intersections" class="centered p5sketch"></div>
	<div class="centered">
		<pre><code><c>//Planar Graph</c><br>
			cp.<f>nodes</f>[<n>3</n>].x <op>=</op> <f>noise</f>(<arg>t1</arg>);<br>cp.<f>nodes</f>[<n>3</n>].y <op>=</op> <f>noise</f>(<arg>t2</arg>);<br>cp.<f>nodes</f>[<n>6</n>].x <op>=</op> <f>noise</f>(<arg>t3</arg>);<br>cp.<f>nodes</f>[<n>6</n>].y <op>=</op> <f>noise</f>(<arg>t4</arg>);</code></pre>
	</div>
	<div class="accordion">
		<p>A certain priority is placed on accessibility and real-time updating. Everything is available for you to change, and where possible, code is optimized to be able to be run inside of a game loop.</p>
	</div>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/p5js/planarGraph/04_intersections.js"></script>
<script>
	new p5(_04_intersections, 'sketch_intersections');
</script>

<?php include 'footer.php';?>