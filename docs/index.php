<?php include 'header.php';?>

<!-- <script type="text/javascript" src="../include/three.min.js"></script>
<script type="text/javascript" src="../include/THREE.MeshLine.js"></script>
<script type="text/javascript" src="../include/THREE.OrbitControls.js"></script>
 -->
<h1>Origami</h1>

<section id="simplest-app">

	<div id="canvas-origami-fold"></div>

<div class="language"><pre>.HTML</pre></div>
<pre><code>&lt;!<key>DOCTYPE</key> html&gt;
&lt;<key>title</key>&gt;Rabbit Ear&lt;/<key>title</key>&gt;
&lt;<key>script</key> <v>src=</v><str>"rabbit-ear.js"</str>&gt;&lt;/<key>script</key>&gt;
&lt;<key>script</key>&gt;
<f>RabbitEar</f>.<f>Origami</f>();
&lt;/<key>script</key>&gt;
</code></pre>

	<p>This simple app creates the sketch above - a square sheet of paper that you can fold.</p>

</section>

<section id="first-app">

<h2>Getting Started</h2>

	<p>Download Rabbit Ear here.</p>

	<div class="center">
		<button class="btn btn-primary" id="download-button"><i class="fa fa-download"></i> rabbit-ear-0.1.zip</button>
	</div>

	<p>Create a new project inside the "sketches" folder by copying and renaming "empty".</p>
	<div style="margin: auto; text-align: center; width:50vw; min-width: 300px;">
		<img style="width:100%" src="https://rabbitear.org/images/new-project.gif">
	</div>

	<p>The <strong>style.css</strong> sets the colors and style of all the SVG content. There's nothing special in <strong>index.html</strong>. Take a look at <strong>sketch.js</strong>.</p>

<div class="centered">
<pre><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();
<br><c>// respond to a touch event</c>
<f>origami</f>.<v>onMouseMove</v> = <f>function</f>(<arg>event</arg>){

}
</code></pre>
</div>

</section>


<h2>Examples</h2>

<section id="examples">

	<p>This sketch loads a frog base and colors the faces.</p>

	<div id="canvas-face-coloring"></div>

<pre><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();
origami.<f>load</f>(<f>RabbitEar</f>.bases.frog);

<f>RabbitEar</f>.core.faces_coloring(origami.cp, <n>0</n>)
  .<f>map</f>(<arg>color</arg> <key>=></key> color <key>?</key> <str>"#224c72"</str> <key>:</key> <str>"#f1c14f"</str>)
  .<f>forEach</f>((<arg>color</arg>, <arg>i</arg>) =>
    origami.faces[i].<f>setAttribute</f>(<str>"fill"</str>, color)
  );</code></pre>

	<p class="quote">A flat-foldable crease pattern is always two-colorable.</p>

	<p>This loads an svg image, interprets it like a crease pattern and folds it.</p>

	<div id="canvas-svg-load"></div>
	<div id="div-folded-crane"></div>

<pre><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();
origami.<f>load</f>(<str>"elephant.svg"</str>);
origami.<f>fold</f>();
</code></pre>

	<p>This sketch modifies the folding method to only allow axiom 1 folds.</p>
	<p>Because Rabbit Ear draws using SVG, a vector image file is always ready for export.</p>

	<div class="center">
		<button type="button" class="btn btn-dark" id="download-example-button">download image</button>
	</div>


</section>


<h2>CREASE PATTERN</h2>

	<div class="diptych">
		<img src="../rabbitear-site/images/one-fold-cp.svg">
	</div>

<section>

	<p>Each origami comes with a <b>Crease Pattern</b>, an extended <a href="https://github.com/edemaine/fold">FOLD</a> object. This is where all the crease information is stored.</p>

	<div class="centered">
		<pre><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();<br>origami.cp <c>// an origami's crease pattern is here</c></code></pre>
	</div>

	<p>For more computational-type sketches you'll want to access this directly. Or alternatively, create one directly:</p>

	<div class="centered">
		<pre><code><f>let</f> cp <key>=</key> <f>RabbitEar</f>.<f>CreasePattern</f>();</code></pre>
	</div>

	<p>An <b>extended</b> FOLD object means it comes with additional methods like fold, axiom4, kawasakiCollapse, but it's always possible to get the FOLD object.</p>

	<div class="centered">
		<pre><code><f>let</f> foldObject <key>=</key> cp.<f>getFOLD</f>();</code></pre>
	</div>

	<div class="diptych">
		<img src="../rabbitear-site/images/one-fold-folded.svg">
	</div>

</section>

<section id="about">
	<h2>About</h2>
	<p>This project is <a href="http://github.com/robbykraft/Origami/">open source</a>, released under the MIT license.</p>

</section>

<script type="text/javascript" src="../tests/origami_fold.js"></script>
<script type="text/javascript" src="../tests/origami_two_coloring.js"></script>
<!-- <script type="text/javascript" src="../tests/origami_swim.js"></script> -->
<script>
let view3D = RabbitEar.Origami3D("intersection-wobble");
view3D.load("../files/fold/square-twist.fold");
</script>

<script>
let craneFold = RabbitEar.Origami("div-folded-crane")
craneFold.load("../files/fold/crane.fold", function(cp){
	console.log(cp);
});
// craneFold.svg.setAttributeNS(null, 'id', 'folded-crane');
// craneFold.colorLayer = craneFold.group(undefined, "color-layer");
// craneFold.svg.appendChild(craneFold.colorLayer);
// craneFold.svg.appendChild(craneFold.facesLayer);

</script>

<!-- <script type="text/javascript" src="js/rabbit-ear.min.js"></script>
 -->
<script>
// flat fold example: kawasaki collapse, crease pattern and folded form
// let kawasakiPaper = RabbitEar.Origami("kawasaki-collapse-example");
// kawasakiPaper.onMouseMove = function(event){
// 	this.cp.clear();
// 	this.cp.crease(0, 0, event.point.x, event.point.y).mountain();
// 	this.cp.crease(1, 1, event.point.x, event.point.y).mountain();
// 	let cornerCrease = this.cp.crease(1, 0, event.point.x, event.point.y);
// 	let kawasakiCrease = this.cp.kawasakiCollapse(event.point);
// 	let a = {x:0,y:0};
// 	let b = {x:1,y:1};
// 	let cross = (b.x - a.x)*(event.point.y - a.y) > (b.y - a.y)*(event.point.x - a.x);
// 	// console.log(cross)
// 	if((b.x - a.x)*(event.point.y - a.y) > (b.y - a.y)*(event.point.x - a.x)){ 
// 		cornerCrease.valley(); kawasakiCrease.mountain();
// 	} else{
// 		kawasakiCrease.valley(); cornerCrease.mountain();
// 	}
// 	this.draw();
// 	kawasakiFolded.cp = this.cp.copy();
// 	kawasakiFolded.draw();
// }
// let kawasakiFolded = RabbitEar.Origami("kawasaki-collapse-example");
// kawasakiFolded.holdPoint = {x:0.5, y:0.0001};
// kawasakiFolded.rotation = 180;
// kawasakiPaper.onMouseMove( {point:{x:0.5,y:0.55}} );

</script>

<script>
// download flat fold example folded form
function download(text, filename){
	let blob = new Blob([text], {type: "image/svg+xml"});
	let url = window.URL.createObjectURL(blob);
	let a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
// document.getElementById("download-example-button").onclick = function(event){
// 	let svg = kawasakiFolded.cp.foldSVG();
// 	download(svg, "rabbit-ear.js example.svg");
// }


</script>

<script>
// folded crane
// let craneFold = new OrigamiFold("div-folded-crane").load("../files/svg/crane.svg", function(){
// 	craneFold.foldedCP.faces_vertices
// 		.map(function(face){
// 			return face.map(function(nodeIndex){
// 				return craneFold.foldedCP.vertices_coords[nodeIndex];
// 			},this);
// 		},this)
// 		.forEach(function(vertices, index){
// 			let polygon = craneFold.polygon(vertices, 'folded-paper-color', 'face-' + index);
// 			craneFold.colorLayer.appendChild(polygon);
// 		},this);
// });
// craneFold.svg.setAttributeNS(null, 'id', 'folded-crane');
// craneFold.colorLayer = craneFold.group(undefined, "color-layer");
// craneFold.svg.appendChild(craneFold.colorLayer);
// craneFold.svg.appendChild(craneFold.facesLayer);
</script>

<script type="text/javascript">
document.getElementById("download-button").onclick = function(e){
	let zip_file_path = "https://github.com/robbykraft/Origami/releases/download/untagged-1fdecd22aca74a9d72a0/rabbit-ear-0.1.zip";
	let zip_file_name = "rabbit-ear.zip";
	let a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	a.href = zip_file_path;
	a.download = zip_file_name;
	a.click();
	document.body.removeChild(a);
}
</script>

<?php include 'footer.php';?>
