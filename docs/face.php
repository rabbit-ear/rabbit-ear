<?php include 'header.php';?>

<h1>Face</h1>
<section id="faces">
	<h2>generateFaces</h2>
	<div class="centered p5sketch" id="div-p5-faces"></div>
	<div class="centered">
		<pre class="centered language-javascript"><code class="language-javascript">graph.<span class="token function">generateFaces</span>()  <span class="token comment">// from early code, finds duplicates<span></code></pre>
	</div>
	<h2>Clockwise</h2>
	<div class="centered p5sketch" id="div-p5-clockwise"></div>
	<div class="centered">
		<pre class="centered language-javascript"><code class="language-javascript">graph.<span class="token function">getClockwiseNeighbor</span>( <span class="token argument">nodeIndex</span>, <span class="token argument">nodePrime</span> )</code></pre>
	</div>
	<div class="centered">
		<pre class="centered language-javascript"><code class="language-javascript">graph.<span class="token function">getClockwiseConnectedNodesSorted</span>( <span class="token argument">nodeIndex</span> )</code></pre>
	</div>
</section>
</div>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/p5js/planarGraph/08_find_faces.js"></script>
<script language="javascript" type="text/javascript" src="../tests/p5js/planarGraph/09_clockwise_nodes.js"></script>
<script>
	var p5a = new p5(test08, 'div-p5-faces');
	var p5b = new p5(test09, 'div-p5-clockwise');
</script>

<?php include 'footer.php';?>