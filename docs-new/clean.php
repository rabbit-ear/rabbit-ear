<?php include 'header.php';?>

<h1>CLEAN</h1>

<section id="intro">

<h2>mergeDuplicateVertices</h2>

	<div id="divP5_merge" class="centered p5sketch"></div>

	<div class="centered">
		<p style="font-family:monospace; font-size:2.5em; margin-top:0"><span id="div-node-count"></span> nodes<br><span id="div-edge-count"></span> edges</p>
	</div>

	<div class="centered">
		<pre><code><span id="span-merge-result"></span>← graph.<f>mergeDuplicateVertices</f>()</code></pre>
	</div>

	<div class="explain">
		<div>
			<p>The shift from graph to planar graph introduces the concept of adjacency in 2D space. Nodes that occupy the same space can be merged into one, and their adjacent edges join too.</p>
		</div>
	</div>

	<div class="tests">
		<ul>
			<li>clean()</li>
			<li>mergeDuplicateVertices()</li>
		</ul>
	</div>

</section>


<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/11_merge_duplicates.js"></script>

<script>
	var p5b = new p5(_11_merge_duplicates, 'divP5_merge');
	p5b.callback = function(nodecount, edgecount, mergeInfo){
		$("#div-node-count").html(nodecount);
		$("#div-edge-count").html(edgecount);
		// if(mergeInfo != undefined){
		// 	var xString = (mergeInfo.x).toFixed(2);
		// 	var yString = (mergeInfo.y).toFixed(2);
		// 	var string = "{x:" + xString + ", y:" + yString + ", nodes:[" + mergeInfo.nodes[0] +"," + mergeInfo.nodes[1] + "]}";
		// 	$("#span-merge-result").html(string);
		// }
	}
</script>
<?php include 'footer.php';?>