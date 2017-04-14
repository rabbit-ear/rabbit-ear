<?php include 'header.php';?>

<h1>Adjacency</h1>
<section id="adjacent-section">
	
	<h2>node.adjacent</h2>
	<div id="divP5_adjacent1" class="centered p5sketch"></div>

	<h2>node.adjacent.angle</h2>
	<div id="divP5_adjacent2" class="centered p5sketch"></div>

</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/planarGraph/12_adjacent.js"></script>
<script language="javascript" type="text/javascript" src="../tests/planarGraph/13_adjacent.js"></script>

<script>
	var p5a = new p5(_12_adjacent, 'divP5_adjacent1');
	var p5b = new p5(_13_adjacent, 'divP5_adjacent2');
	// p5b.callback = function(nodecount, edgecount, mergeInfo){}
</script>

<?php include 'footer.php';?>