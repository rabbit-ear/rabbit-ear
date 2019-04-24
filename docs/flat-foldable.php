<?php include 'header.php';?>

<h1>FLAT FOLDABILITY</h1>

<section id="intro">

<h2>Kawasaki's Theorem</h2>

	<p class="explain">The sum of alternating interior angles between the edges around one vertex should each add up to 180&deg;.</p>
	<div id="canvas-kawasaki"></div>

	<div class="centered">
		<pre><code>cp.<f>kawasaki</f>()</code></pre>
	</div>

	<p>This data is available to us in a few ways:
		<ul>
			<li>create a <b>Junction</b> at the node</li>
			<li>get the function from the core of the library</li>
		</ul>
	</p>

	<h3>Kawasaki Collapse</h3>

	<p>when the unique case that there are three edges around a node, and each interior angle is less than 180&deg;, there is one and only one solution per sector.</p>

	<div id="canvas-kawasaki-collapse"></div>

	<div class="centered">
		<pre><code>junction.<f>kawasakiCollapse</f>()</code></pre>
	</div>

</section>

<script type="text/javascript" src="../tests/origami_kawasaki.js"></script>
<script type="text/javascript" src="../tests/origami_kawasaki_collapse.js"></script>

<?php include 'footer.php';?>