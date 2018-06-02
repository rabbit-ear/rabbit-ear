<?php include 'header.php';?>

<h1>FLAT FOLDABLE</h1>

	<div class="centered">
		<canvas id="canvas-unfolded-crane" resize></canvas>
		<canvas id="canvas-folded-crane" resize></canvas>
	</div>

	<p class="quote">This crane crease pattern has been virtually folded.</p>

<section id="flat-foldable">
<h2>Local Flat-Foldability</h2>

<h3>Kawasaki's Theorem</h3>

	<p>The sum of alternating angles around a node must equal 180 degrees. This is one determining factor for local flat-foldability.</p>

	<div class="centered">
		<canvas id="canvas-kawasaki" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="kawasaki-result"></span></code></pre>
	</div>

	<p>Notice the error indicators below. Move nodes around to see how other nodes are affected.</p>

	<div class="centered">
		<canvas id="canvas-flat-foldable-adjust" class="large" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="ff-result"></span>cp.<v>nodes</v>[<n id="node-index">index</n>].<f>flatFoldable</f>();</code></pre>
	</div>

	<p>Kawasaki's Theorem can also be used to discover a 4th additional crease necessary to make a 3-fold unit flat foldable.</p>

	<p class="quote">What is the missing crease needed to satisfy flat-foldability?</p>

	<div class="centered">
		<canvas id="canvas-flat-foldable-single" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.sectors[<span id="ff-single-sector"></span>].<f>kawasakiFourth</f>();</code></pre>
	</div>

<h3>Maekawa's Theorem</h3>

	<p>When considering the adjacent edges around a node the number of mountain and valley creases must differ by ±2.</p>

<h3>2 Colorability</h3>

	<p>For a crease pattern to be flat-foldable the graph must be 2-colorable, or a bipartite graph.</p>

	<div class="centered">
		<canvas id="canvas-two-colorable" resize></canvas>
	</div>

	<p>This implies that each vertex must have an even number of edges connecting it unless it is a boundary vertex. It also says there will be an even number of boundary vertices.</p>

</section>

<section id="folding">
<h2>Folding Algorithm</h2>
	
	<p>To simulate the folded state, faces are reflected across neighboring crease lines using a <a href="planarMath.php#reflection">reflection matrix</a>.

	<div class="centered">
		<canvas id="canvas-one-crease" resize></canvas>
		<canvas id="canvas-one-crease-folded" resize></canvas>
	</div>

	<p>To calculate more complex crease patterns, one face is selected to be fixed, then the following data structure is calculated- a tree map of the neighbor relationships to each face.</p>

	<div class="centered">
		<canvas id="canvas-face-tree" resize></canvas>
	</div>

</section>

<script type="text/javascript" src="../tests/kawasaki.js"></script>
<script type="text/javascript" src="../tests/flat_foldable_adjust.js"></script>
<script type="text/javascript" src="../tests/flat_foldable_single.js"></script>
<script type="text/javascript" src="../tests/face_tree.js"></script>
<script type="text/javascript" src="../tests/two_colorable.js"></script>

<script>
var unfoldedCrane = new OrigamiPaper("canvas-unfolded-crane").blackAndWhite();
unfoldedCrane.show.faces = false;
unfoldedCrane.load("../files/svg/crane.svg", function(){
	var foldedCrane = new OrigamiFold("canvas-folded-crane", unfoldedCrane.cp.copy());
	foldedCrane.style.face.fillColor = { gray:0.0, alpha:0.1 };
	// foldedCrane.rotation = 135;
	// foldedCrane.zoom = 0.666;
	foldedCrane.draw();
});
</script>

<script>
kawasakiCallback = function(event){
	if(event !== undefined){
		var string = "";
		var sums = [0,0];
		event[0].angles.forEach(function(el, i){ 
			var deg = el*180 / Math.PI;
			sums[0] += deg;
			string += "<n>" + parseInt(deg) + "</n>&deg;";
			if(i < event[0].angles.length-1){ string += " + "; }
		});
		string += " = " + sums[0].toFixed(1) + "&deg; <c>// red</c><br>";
		event[1].angles.forEach(function(el, i){
			var deg = el*180 / Math.PI;
			sums[1] += deg;
			string += "<n>" + parseInt(deg) + "</n>&deg;";
			if(i < event[0].angles.length-1){ string += " + "; }
		});
		string += " = " + sums[1].toFixed(1) + "&deg; <c>// blue</c>";
	}
	document.getElementById("kawasaki-result").innerHTML = string;
}
projectKawasaki.update();
projectKawasaki.drawSectors();


</script>

<script>

var oneCrease = new OrigamiPaper("canvas-one-crease");
var oneCreaseFolded = new OrigamiFold("canvas-one-crease-folded");
oneCreaseFolded.style = { face:{ fillColor:{ gray:0.0, alpha:0.4 } } };
oneCrease.cp.setBoundary([ [0,0], [0,1.618], [1,1.618], [1,0] ]);

oneCrease.reset = function(){
	// paper = this.scope;
	// do{
		this.cp.clear();
		var a1 = Math.random()*Math.PI*2;
		var ray1 = new XY(0.1 * Math.cos(a1), 0.1 * Math.sin(a1));
		var pt1 = new XY(0.5, 1.618/3);
		var pt2 = new XY(0.5, 1.618*2/3);
		this.cp.creaseThroughPoints(pt1, pt1.add(ray1)).valley();
		this.cp.creaseThroughPoints(pt2, pt2.add(ray1)).mountain();
		this.cp.clean();
		this.cp.flatten();
	// } while(this.cp.edges.filter(function(edge){return edge.orientation == CreaseDirection.valley},this).length != 2);
	this.draw();

	oneCreaseFolded.cp = this.cp.copy()
	oneCreaseFolded.draw();
	// oneCreaseFolded.update();
}
oneCrease.reset();

oneCrease.onMouseDown = function(){ this.reset(); }
oneCreaseFolded.onMouseDown = function(){ oneCrease.reset() };


</script>

<script>
flat_foldable_single_callback = function(e){
	if(e != undefined){
		if(e.sector != undefined){
			document.getElementById("ff-single-sector").innerHTML = "<n>" + e.sector.index + "</n>";
		} else{
			document.getElementById("ff-single-sector").innerHTML = "<n></n>";			
		}
		// if(e.solution != undefined){
		// 	var deg = e.solution * 180 / Math.PI;
		// 	var angleString = "<n>" + deg.toFixed(2) + "°</n> ← ";
		// 	document.getElementById("ff-single-angle").innerHTML = angleString;
		// } else{
		// 	document.getElementById("ff-single-angle").innerHTML = "";
		// }
		// if(e.flatFoldable != undefined){
		// 	document.getElementById("ff-single-result").innerHTML = "<n>" + e.flatFoldable + "</n> ← ";
		// 	document.getElementById("ff-single-result").innerHTML = "<n>" + e.flatFoldable + "</n> ← ";
		// }
		// var edgeFunctionString = "";
		// if(e.angle != undefined && e.angle.edges != undefined && e.angle.edges.length > 1){
		// 	edgeFunctionString = " <key>new</key> <f>InteriorAngle</f>(<arg>edge"+ e.angle.edges[0].index + "</arg>, <arg>edge" + e.angle.edges[1].index + "</arg>) ";
		// }
		// document.getElementById("edge-function").innerHTML = edgeFunctionString;
	}
}

flat_foldable_nodes_wiggle_callback = function(e){
	document.getElementById("node-index").innerHTML = e.node;
	if(e.valid) document.getElementById("ff-result").innerHTML = "<n>true</n> ← ";
	else             document.getElementById("ff-result").innerHTML = "<n>false</n> ← ";
}
</script>


<?php include 'footer.php';?>