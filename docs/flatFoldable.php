<?php include 'header.php';?>

<h1>FLAT FOLDABLE</h1>

	<div class="centered">
		<canvas id="canvas-unfolded-crane" resize></canvas>
		<canvas id="canvas-folded-crane" resize></canvas>
	</div>

	<p>The crease pattern on the left's folded form has been simulated by this library.</p>

<section id="flat-foldable">
<h2>Locally Flat Foldable</h2>

	<p class="quote">Global flat-foldability is an np-hard problem.</p>

	<p>Local flat foldability concerns the area around 1 intersection of edges, and can be determined using a number of operations including Kawasaki's theorem and Maekawa's theorem.</p>

	<p>The following crease pattern has minor errors throughout:</p>

	<div class="centered">
		<canvas id="canvas-flat-foldable-nodes-wiggle" class="large" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="ff-result"></span>cp.<v>nodes</v>[<n id="node-index">index</n>].<f>flatFoldable</f>();</code></pre>
	</div>

</section>

<section id="kawasaki">
<h2>Kawasaki's Theorem</h2>

	<p>The sum of alternating angles around a node must equal 180 degrees.</p>

	<div class="centered">
		<canvas id="canvas-kawasaki" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="kawasaki-result"></span></code></pre>
	</div>

	<p>Kawasaki's Theorem can also be used to discover a 4th additional crease necessary to make a 3-fold unit flat foldable.</p>

	<p class="quote">What is the missing crease needed to satisfy flat-foldability?</p>

	<div class="centered">
		<canvas id="canvas-flat-foldable-single" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="ff-single-angle"></span>cp.<f>findFlatFoldable</f>(<span id="edge-function"></span>);<br><c>// crease an edge from the center with that angle</c><br><span id="ff-single-result"><n>false</n> ← </span>cp.<v>nodes</v>[<n id="node-index">0</n>].<f>flatFoldable</f>();</code></pre>
	</div>

</section>

<section id="maekawa">
<h2>Maekawa's Theorem</h2>

	<p>When considering the adjacent edges around a node the number of mountain and valley creases must differ by ±2.</p>

</section>

<section id="twocolorable">
<h2>2 Colorability</h2>

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
		<canvas id="canvas-face-matrix" resize></canvas>
	</div>

</section>

<script type="text/javascript" src="../tests/kawasaki.js"></script>
<script type="text/javascript" src="../tests/flat_foldable_nodes_wiggle.js"></script>
<script type="text/javascript" src="../tests/flat_foldable_single.js"></script>
<script type="text/javascript" src="../tests/face_matrix.js"></script>
<script type="text/javascript" src="../tests/two_colorable.js"></script>

<script>
var unfoldedCrane = new OrigamiPaper("canvas-unfolded-crane").blackAndWhite();
unfoldedCrane.load("../files/svg/crane.svg", function(){
	unfoldedCrane.draw();
});

var foldedCrane = new OrigamiFold("canvas-folded-crane");
foldedCrane.load("../files/svg/crane.svg", function(){
	foldedCrane.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };
	foldedCrane.update();
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

</script>

<script>

var oneCrease = new OrigamiPaper("canvas-one-crease");
oneCrease.onMouseDown = function(){ redoOneCrease(); }

var redoOneCrease = function(){
	oneCrease.cp.clear();
	var angle = Math.random()*Math.PI*2;
	var offCenter = new XY(0.5 + 0.1 * Math.cos(angle), 0.5 + 0.1 * Math.sin(angle));
	oneCrease.cp.creaseThroughPoints(new XY(0.5, 0.5), offCenter).valley();
	oneCrease.cp.clean();
	oneCrease.cp.flatten();
	oneCrease.faceLayer.visible = false;
	oneCrease.draw();

	var oneCreaseFolded = new OrigamiFold("canvas-one-crease-folded", oneCrease.cp.copy());
	oneCreaseFolded.onMouseDown = redoOneCrease
	oneCreaseFolded.style = { face:{ fillColor:{ gray:0.0, alpha:0.4 } } };
	oneCreaseFolded.update();
}
redoOneCrease();

</script>

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