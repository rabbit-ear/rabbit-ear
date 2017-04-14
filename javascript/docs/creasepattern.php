<?php include 'header.php';?>

<h1>Crease Pattern</h1>
<section id="cleanup">
	
	<h2>one</h2>
	<div id="divP5_cp1" class="centered p5sketch"></div>

	<h3>two</h3>
	<div id="divP5_cp2" class="centered p5sketch"></div>

</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/creasePattern/01_test.js"></script>
<!-- <script language="javascript" type="text/javascript" src="../tests/creasePattern/02_test.js"></script> -->

<script>
	var p5a = new p5(_01_test, 'divP5_cp1');
	// var p5b = new p5(_02_test, 'divP5_cp2');
	// p5b.callback = function(nodecount, edgecount, mergeInfo){}
</script>

<?php include 'footer.php';?>