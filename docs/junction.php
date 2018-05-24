<?php include 'header.php';?>

<h1>JUNCTIONS</h1>

<section id="junction">

	<div class="centered">
		<canvas id="canvas-fragment" class="half" resize></canvas>
		<canvas id="canvas-origami-base" class="half" resize></canvas>
	</div>

	<p>In contrast to a random assortment of lines, origami crease patterns tend to gather their edge intersections at the fewest number of locations.</p>

	<p>This makes each intersection point more interesting. A lot of time will be spent studying the space around one intersection.</p>

	<p class="quote"><strong>Junction</strong>: the area including one node, its adjacent edges, and the interior angles they form.</p>

	<p>Junctions themselves are made up of <b>sectors</b>, the number of sectors is equal to the number of edges, or interior angles.</p>

<h2>SECTORS</h2>

	<p class="quote"><strong>Sector</strong>: two adjacent ordered edges and the space that creates an angle between them.</p>

	<p>The angle between two vectors can be the smaller or the larger which is why it's important to order the vectors, and consider the clockwise space between them.</p>
	
	<div class="centered">
		<canvas id="canvas-one-sector" resize></canvas>
	</div>

	<p class="quote">If all that isn't confusing enough, computers render +Y down and clockwise appears counter-clockwise. FML</p>

</section>

<script type="text/javascript" src="../tests/fragment.js"></script>
<script type="text/javascript" src="../tests/one_sector.js"></script>

<script>
fragmentSketch.reset(20);
fragmentSketch.setPadding(0.025);
fragmentSketch.selectEdges = false;
</script>

<script>
var origamiBase = new OrigamiPaper("canvas-origami-base").blackAndWhite().mediumLines().setPadding(0.025);
origamiBase.style.valley.dashArray = null;
origamiBase.style.node.fillColor = origamiBase.styles.byrne.blue;
origamiBase.style.node.radius = 0.01;
origamiBase.show.nodes = true;
origamiBase.baseNumber = 1;
origamiBase.onMouseDown = function(){
	this.cp.clear();
	this.baseNumber = (this.baseNumber+1)%4;
	switch( this.baseNumber ){
		case 0: this.cp.kiteBase(); break;
		case 1: this.cp.fishBase(); break;
		case 2: this.cp.birdBase(); break;
		case 3: this.cp.frogBase(); break;
	}
	this.draw();
}
origamiBase.onMouseDown();
</script>


<?php include 'footer.php';?>
