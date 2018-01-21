<?php include 'header.php';?>
<!-- <script src="../lib/p5.min.js"></script>
<script src="../src/cp.p5js.js"></script>
 -->
<h1>FLAT FOLDABLE</h1>

<div class="centered">
	<canvas id="canvas-unfolded-crane" resize></canvas>
	<canvas id="canvas-folded-crane" resize></canvas>
</div>

	<div class="quote">
		<p></p>
	</div>


<section id="flat-foldable">
<h2>Locally Flat Foldable</h2>

	<div class="quote">
		<p></p>
	</div>


	<div class="centered">
		<canvas id="canvas-one-crease" resize></canvas>
		<canvas id="canvas-one-crease-folded" resize></canvas>
	</div>

	<div class="centered">
		<canvas id="canvas-off-squares" class="panorama" resize></canvas>
	</div>

	<div class="centered">
		<canvas id="canvas-off-squares-folded" resize></canvas>
	</div>

	<div class="quote">
		<p></p>
	</div>

	<div class="centered">
		<canvas id="canvas-face-matrix" resize></canvas>
	</div>

</section>

<section id="kawasaki">

<h2>Kawasaki's Theorem</h2>

	<div class="quote">
		<p>Global flat-foldability is an np-hard problem. Local flat-foldability is easy.</p>
	</div>


	<div class="centered">
		<img src="kawasaki-colors.gif" height="420">
	</div>
	<!-- <div id="divP5_kawasaki" class="centered p5sketch"></div> -->


	<div class="centered">
		<canvas id="canvas-flat-foldable-nodes-wiggle" class="large" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="ff-result"></span>cp.<v>nodes</v>[<n id="node-index">index</n>].<f>flatFoldable</f>();</code></pre>
	</div>

	<div class="quote">
		<p>What is the missing crease needed to satisfy flat-foldability?</p>
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
<script type="text/javascript" src="../tests/js/face_matrix.js"></script>

<script>
var unfoldedCrane = new OrigamiPaper("canvas-unfolded-crane");
unfoldedCrane.load("../tests/svg/crane.svg", function(){
	unfoldedCrane.style.valley = unfoldedCrane.style.mountain;
	unfoldedCrane.draw();
});

var foldedCrane = new OrigamiFold("canvas-folded-crane");
foldedCrane.load("../tests/svg/crane.svg", function(){
	foldedCrane.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };
	foldedCrane.update();
});
</script>


<script>

var oneCrease = new OrigamiPaper("canvas-one-crease");
oneCrease.onMouseDown = function(){ redoOneCrease(); }

function redoOneCrease(){
	oneCrease.cp.clear();
	var angle = Math.random()*Math.PI*2;
	var offCenter = new XY(0.5 + 0.1 * Math.cos(angle), 0.5 + 0.1 * Math.sin(angle));
	oneCrease.cp.creaseThroughPoints(new XY(0.5, 0.5), offCenter).valley();
	oneCrease.cp.clean();
	oneCrease.cp.generateFaces();
	oneCrease.faceLayer.visible = false;
	oneCrease.draw();

	var oneCreaseFolded = new OrigamiFold("canvas-one-crease-folded", oneCrease.cp.duplicate());
	oneCreaseFolded.onMouseDown = oneCrease.onMouseDown
	// oneCreaseFolded.cp = ;
	oneCreaseFolded.style = { face:{ fillColor:{ gray:0.0, alpha:0.4 } } };
	oneCreaseFolded.update();

}
redoOneCrease();


// var oneCreaseFolded = new OrigamiFold("canvas-one-crease-folded", oneCrease.cp.duplicate());
// oneCreaseFolded.cp.creaseThroughPoints(new XY(0.5, 0.5), offCenter).valley();
// oneCreaseFolded.cp.clean();
// oneCreaseFolded.draw();
// console.log(oneCreaseFolded.cp);

// console.log("one crease");
// oneCreaseFolded.load("../tests/svg/one-crease.svg", function(){
// 	console.log("one crease end");
// 	oneCreaseFolded.style = { face:{ fillColor:{ gray:0.0, alpha:0.5 } } };
// 	oneCreaseFolded.update();
// });

// oneCreaseFolded.cp = ;
// oneCreaseFolded.draw();
// oneCreaseFolded.style = { face:{ fillColor:{ gray:0.0, alpha:0.4 } } };
// oneCreaseFolded.update();
// oneCreaseFolded.customZoom = 2;
// oneCreaseFolded.setPadding();


</script>

<script>
var offSquaresFolded = new OrigamiFold("canvas-off-squares-folded");
offSquaresFolded.load("../tests/svg/off-squares.svg", function(){
	offSquaresFolded.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };
	offSquaresFolded.update();
	offSquaresFolded.customZoom = 2;
	offSquaresFolded.setPadding();
});

var offSquares = new OrigamiPaper("canvas-off-squares");
offSquares.load("../tests/svg/off-squares.svg", function(){
	offSquares.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };
	offSquares.update();
});

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


<script>
/*
var _04_kawasaki = function( p ) {
	p.callback = undefined;  // returns the inner angles upon refresh

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var cp = new CreasePattern();
	var cpFlat = new CreasePattern();

	var numEdges = 4;

	var innerAngles = [];
	var innerAnglesFlat = [];

	p.reset = function(){
		cp.clear();
		for(var i = 0; i < numEdges; i++){
			var angle = Math.random()*Math.PI * 2;
			cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle),Math.sin(angle)));
		}
		cp.clean();

		cpFlat = cp.duplicate();

		cpFlat.clean();
		innerAngles = cpFlat.kawasaki(0);
		console.log(innerAngles);
		if(p.callback != undefined){
			p.callback(innerAngles);
		}

		var change = new Array(cpFlat.nodes.length);
		for(var i = 0; i < innerAngles.length; i++){
			var angles = innerAngles[i].angles;
			var arc = innerAngles[i].arc;
			var innerNodes = innerAngles[i].nodes;
			if( change[ innerNodes[0] ] == undefined ) { change[ innerNodes[0] ] = 0.0; }
			if( change[ innerNodes[1] ] == undefined ) { change[ innerNodes[1] ] = 0.0; }
			change[ innerNodes[0] ] = angles[0] - innerAngles[i].kawasaki;
			change[ innerNodes[1] ] = angles[1] + innerAngles[i].kawasaki;
		}
		for(var i = 0; i < change.length; i++){
			if(change[i] != undefined){
				cpFlat.nodes[ i ] = p.endPointForAngle( change[i] );
			}
		}
		// update inner angles for drawing
		cpFlat.clean();
		innerAnglesFlat = cpFlat.kawasaki(0);
		// var diff = parseInt((angles[i].arc + angles[i].kawasaki)*180/Math.PI);
		// console.log(i + ": " + parseInt(angles[i].arc*180/Math.PI) + "  " + parseInt(angles[i].kawasaki*180/Math.PI)  + "   =   " + diff);
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
	}
	p.draw = function() {

		//draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);
		p.background(255);

		// draw graph
		p.fill(0);
		p.stroke(192);
		p.strokeWeight(.02);
		// drawGraphPoints(p, cp);
		drawGraphLines(p, cp);
		drawCoordinateFrame(p);

		p.stroke(255, 0, 0);
		p.noFill();
		// for(var i = 0; i < innerAngles.length; i++){
		// 	if(i % 2 == 0){ p.stroke(210); }
		// 	// else { p.stroke(0, 210, 0); }
		// 	else { p.stroke(210); }
		// 	var radius = 0.5;
		// 	if(i%2 == 0) radius = 0.6;
		// 	p.arc(0.5, 0.5, radius, radius, innerAngles[i].angles[0], innerAngles[i].angles[1]);
		// }



		// draw graph
		p.fill(0);
		p.stroke(0);
		p.strokeWeight(.02);
		drawGraphLines(p, cpFlat);
		drawCoordinateFrame(p);

		p.noFill();
		p.stroke(255, 0, 0);
		for(var i = 0; i < innerAnglesFlat.length; i++){
			
			var radius = 0.55;
			if(i%2 == 0) radius = 0.65;
			if(innerAngles[i].angles[0] > innerAnglesFlat[i].angles[0]){
				p.arc(0.5, 0.5, radius, radius, innerAnglesFlat[i].angles[0], innerAngles[i].angles[0]);
			}
			else {
				p.arc(0.5, 0.5, radius, radius, innerAngles[i].angles[0], innerAnglesFlat[i].angles[0]);
			}
		}


	}
	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was pressed inside of canvas
		}
	}
	p.mouseReleased = function(event){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was released inside of canvas
			p.reset();
		}
	}
};

var p5a = new p5(_04_kawasaki, 'divP5_kawasaki');

*/
</script>

<?php include 'footer.php';?>