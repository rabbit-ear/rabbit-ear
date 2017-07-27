<?php include 'header.php';?>

<h1>FACE</h1>

<section id="intro">

<h2>adjacentFaces()</h2>
	<div class="centered">
		<canvas id="canvas-node-adjacent-faces" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>creaseConnectingPoints</f>(point1, point2)</code></pre>
	</div>

	<div class="explain">
		<p>This performs "edge walking" face detection</p>
		<ol>
			<li>Start at 1 node, walk away down 1 edge</li>
			<li>Upon reaching the next node, make the most immediate right turn available</li>
			<li>Walk down this new edge, repeat, always making immediate right turns until returning home</li>
		</ol>
	</div>

</section>

<script type="text/javascript" src="../examples/paperjs/node-adjacent-faces.js"></script>

<?php include 'footer.php';?>