<?php include 'header.php';?>

<h3 class="centered" style="padding-top:2em;">CHAPTER II.</h3>
<h1>PLANAR GRAPHS</h1>

<section id="intro">

	<div class="centered">
		<pre><code><key>var</key> planarGraph<key> = new</key> PlanarGraph()</code></pre>
	</div>
	<div class="explain">
		<p>The planar graph inherits from a graph and uses <i>PlanarNode</i> and <i>PlanarEdge</i> in place of <i>GraphNode</i> and <i>GraphEdge</i>.</p>
		<p>Edges work the same way: connecting 2 nodes, but nodes now have an X and Y property, they exist in 2D space.</p>
	</div>

</section>

<?php include 'footer.php';?>