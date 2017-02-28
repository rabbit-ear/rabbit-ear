<?php include 'header.php';?>

<section id="cleanup">
	<h2><a href="#cleanup">Clean</a></h2>

	<div class="centered">
		<pre><code>graph.<f>clean</f>()</code></pre>
	</div>

	<div class="accordion">
		<div>
			<p>Calling graph.clean() will do everything below:</p>
			<p>- it removes redundant edges (2 edges joining the same nodes)</p>
			<p>- it removes redundant nodes (2 or more nodes exist at the same location in space.</p>
		</div>
	</div>

	<h3>mergeDuplicateVertices</h3>
	<div id="divP5_clean" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code>graph.<f>mergeDuplicateVertices</f>()    <c>//calling clean() will automatically call this</c></code></pre>
	</div>

	<div class="accordion">
		<div>
			<p>Due to floating point precision, points are determined to be redundant when the are close enough to a certain floating point precision.</p>
		</div>
	</div>

	<h3>mergeDuplicateVertices</h3>
	<div id="divP5_merge" class="centered p5sketch"></div>

	<div class="centered">
		<p style="font-family:monospace; font-size:2.5em; margin-top:0"><span id="div-node-count"></span> nodes<br><span id="div-edge-count"></span> edges</p>
	</div>

</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/planarGraph/10_clean.js"></script>
<script language="javascript" type="text/javascript" src="../tests/planarGraph/11_merge_duplicates.js"></script>

<script>
	var p5a = new p5(_10_clean, 'divP5_clean');
	var p5b = new p5(_11_merge_duplicates, 'divP5_merge');
	p5b.callback = function(nodecount, edgecount){
		$("#div-node-count").html(nodecount);
		$("#div-edge-count").html(edgecount);
	}
</script>

<?php include 'footer.php';?>