<?php include 'header.php';?>

<h1>FLAT FOLDABLE</h1>

<section id="intro">

<h2>Kawasaki's Theorem</h2>

	<div class="centered">
		<canvas id="canvas-flat-foldable-nodes-wiggle" class="large" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="ff-result"></span>cp.<v>nodes</v>[<n id="node-index">index</n>].<f>flatFoldable</f>();</code></pre>
	</div>
	
</section>

<script type="text/javascript" src="../tests/js/flat_foldable_nodes_wiggle.js"></script>

<script>
flat_foldable_nodes_wiggle_callback = function(e){
	document.getElementById("node-index").innerHTML = e.node;
	if(e.valid) document.getElementById("ff-result").innerHTML = "<n>true</n> ← ";
	else             document.getElementById("ff-result").innerHTML = "<n>false</n> ← ";
}
</script>

<?php include 'footer.php';?>