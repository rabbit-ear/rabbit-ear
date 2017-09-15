<?php include 'header.php';?>

<h1>FLAT FOLDABLE</h1>


<section id="flat-foldable">

<h2>Locally Flat Foldable</h2>

	<div class="quote">
		<p>Global flat-foldability is an np-hard problem, but local flat-foldability can be determined with a few tests.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-flat-foldable-nodes-wiggle" class="large" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="ff-result"></span>cp.<v>nodes</v>[<n id="node-index">index</n>].<f>flatFoldable</f>();</code></pre>
	</div>

	<div class="quote">
		<p>This is testing for Kawasaki's theorem, ...</p>
	</div>

</section>

<section id="kawasaki">

<h2>Kawasaki's Theorem</h2>

	<div class="quote">
		<p>These 3 mountain folds need one additional valley fold to make the joint flat foldable.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-flat-foldable-single" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="ff-single-angle"></span>cp.<f>findFlatFoldable</f>(<span id="edge-function"></span>);<br><c>// crease an edge from the center with that angle</c><br><span id="ff-single-result"><n>false</n> ← </span>cp.<v>nodes</v>[<n id="node-index">0</n>].<f>flatFoldable</f>();</code></pre>
	</div>

</section>

<script type="text/javascript" src="../tests/js/flat_foldable_nodes_wiggle.js"></script>
<script type="text/javascript" src="../tests/js/flat_foldable_single.js"></script>

<script>
flat_foldable_single_callback = function(e){
	if(e != undefined){
		if(e.solution != undefined){
			var deg = e.solution * 180 / Math.PI;
			var angleString = "<n>" + deg.toFixed(2) + "°</n> ← ";
			document.getElementById("ff-single-angle").innerHTML = angleString;
		} else{
			document.getElementById("ff-single-angle").innerHTML = "";
		}
		if(e.flatFoldable != undefined){
			document.getElementById("ff-single-result").innerHTML = "<n>" + e.flatFoldable + "</n> ← ";
			document.getElementById("ff-single-result").innerHTML = "<n>" + e.flatFoldable + "</n> ← ";
		}
		var edgeFunctionString = "";
		if(e.angle != undefined && e.angle.edges != undefined && e.angle.edges.length > 1){
			edgeFunctionString = " <key>new</key> <f>InteriorAngle</f>(<arg>edge"+ e.angle.edges[0].index + "</arg>, <arg>edge" + e.angle.edges[1].index + "</arg>) ";
		}
		document.getElementById("edge-function").innerHTML = edgeFunctionString;
	}
}

flat_foldable_nodes_wiggle_callback = function(e){
	document.getElementById("node-index").innerHTML = e.node;
	if(e.valid) document.getElementById("ff-result").innerHTML = "<n>true</n> ← ";
	else             document.getElementById("ff-result").innerHTML = "<n>false</n> ← ";
}
</script>

<?php include 'footer.php';?>