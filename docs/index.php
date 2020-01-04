<?php include 'header.php';?>

<p class="explain">Rabbit Ear is gearing up for a version 1 release. check back in early 2020.</p>

<script type="text/javascript" src="include/threejs/three.min.js"></script>
<script type="text/javascript" src="include/threejs/THREE.MeshLine.js"></script>
<script type="text/javascript" src="include/threejs/THREE.OrbitControls.js"></script>

<h1>Origami</h1>

<div id="canvas-origami-fold"></div>

<p class="quote">
	grab
</p>

<pre class="code"><code>&lt;!<key>DOCTYPE</key> html&gt;
&lt;<key>title</key>&gt;Rabbit Ear&lt;/<key>title</key>&gt;
&lt;<key>script</key> <v>src</v>=<str>"rabbit-ear.js"</str>&gt;&lt;/<key>script</key>&gt;
&lt;<key>script</key>&gt;
<f>RabbitEar</f>.<f>Origami</f>( {<str>"folding"</str>:<n>true</n>} );
&lt;/<key>script</key>&gt;
</code></pre>

<p>
	This simple app creates the sketch above - a square sheet of paper that you can fold.
</p>

<h2>Example Apps</h2>

<ul>
	<li><a href="//finder.origami.tools/">Reference Finder</a></li>
	<li><a href="//svg.rabbitear.org/">SVG code</a></li>
	<li><a href="https://convert.rabbitear.org/">File Converter</a></li>
	<li><a href="https://beta.rabbitear.org/diagram/">Fold and Diagram</a></li>
</ul>

<h2>Getting Started</h2>

<!-- 	<p>Download Rabbit Ear here.</p>

	<div class="center">
		<a href="https://github.com/robbykraft/Origami/releases/download/untagged-1fdecd22aca74a9d72a0/rabbit-ear-0.19.zip"><button class="btn btn-primary" id="download-button"><i class="fa fa-download"></i> rabbit-ear-0.19.zip</button></a>
	</div>
 -->
<p>
	Create a new project inside the "sketches" folder by copying and renaming "empty".
</p>

<div style="margin: auto; text-align: center; width:50vw; min-width: 300px;">
	<img style="width:100%" src="https://rabbitear.org/images/new-project.gif">
</div>

<p>
	There are three files in your sketch:
</p>

<ul>
	<li><strong>index.html</strong> open this file to run your sketch.</li>
	<li><strong>style.css</strong> set the color of the paper and style the lines.</li>
	<li><strong>sketch.js</strong> let's take a closer look:</li>
</ul>

<pre class="code"><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();
<br><c>// respond to a touch event</c>
<f>origami</f>.<v>onMouseMove</v> = <f>function</f>(<arg>event</arg>){

}
</code></pre>

<h2>Examples</h2>

<p>
	This loads an svg image, interprets it like a crease pattern, and folds it.
</p>

<div id="div-folded-crane" class="grid-2"></div>

<pre class="code"><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();<br>origami.<f>load</f>(<str>"crane.svg"</str>);</code></pre>

<pre class="code"><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();<br>origami.<f>load</f>(<str>"crane.svg"</str>);<br>origami.<f>fold</f>();</code></pre>

<p class="quote">
	In some cases Rabbit Ear is capable of determining layer ordering for a folding. When it is unsure it draws translucent faces.
</p>

<p class="explain">
	loading a file requires running a localhost server.
</p>

<p>
	This sketch loads a frog base and colors the faces.
</p>

<div id="canvas-face-coloring"></div>

<pre class="code"><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();
origami.<f>load</f>(<f>RabbitEar</f>.bases.frog);

<f>RabbitEar</f>.core.make_faces_coloring(origami)
  .<f>map</f>(<arg>color</arg> <f>=></f> color <key>?</key> <str>"#224c72"</str> <key>:</key> <str>"#f1c14f"</str>)
  .<f>forEach</f>((<arg>color</arg>, <arg>i</arg>) <f>=></f>
    origami.faces[i].<f>setAttribute</f>(<str>"style"</str>, <str>"fill:"</str> <key>+</key> color)
  );</code></pre>

<p class="quote">
	A flat-foldable crease pattern is always two-colorable.
</p>

<p>
	Read more about the <b>Origami object</b>, .svg to .fold <b>converters</b>, the <b>math and svg libraries</b>, and more in the following sections.
</p>

<section id="footer" style="font-size: 80%; margin: 2rem 0">
	<hr>
	<p>This project is <a href="http://github.com/robbykraft/Origami/">open source</a>.</p>

<script>
let twoColor = RabbitEar.Origami("canvas-face-coloring", {
	style: ".foldedForm polygon.back { fill: #fb3; }"
});
twoColor.load(RabbitEar.bases.frog);
twoColor.edges.visible = false;
let faces = twoColor.faces;
RabbitEar.core.make_faces_coloring(twoColor, 0)
	.map(color => color ? "#224c72" : "#ecb233")
	.forEach((color, i) =>
		faces[i].svg.setAttribute("style", "fill:"+color)
	);
</script>

<script>
let origamiFold;
let sketchW = (window.innerWidth < window.innerHeight)
	? 1
	: window.innerWidth / window.innerHeight;
let sketchH = (window.innerWidth < window.innerHeight)
	? window.innerHeight / window.innerWidth
	: 1;
origamiFold = RabbitEar.Origami("canvas-origami-fold", {
	touchFold:true,
	autofit: false,
	style: ".foldedForm polygon.back { fill: #fb3; }"
}, sketchW * window.innerWidth, sketchH * window.innerWidth, function() {
	// did load
	let pad = 0.1;
	origamiFold.svg.setViewBox(-pad - (sketchW-1)*0.5, -pad, sketchW+pad*2, sketchH+pad*2);
	let points = [
		RabbitEar.vector(1, 0),
		RabbitEar.vector(0.7 - Math.random()*0.3, 0.2 + Math.random()*0.45)
	];
	let midpoint = points[0].midpoint(points[1]);
	let vector = points[1].subtract(points[0]);
	origamiFold.crease(midpoint, vector.rotateZ90());

	origamiFold.collapse();
});

</script>

<script>
// let view3D = RabbitEar.Origami3D("twist-3d");
// view3D.load("../files/fold/square-twist.fold", function(){
// 	view3D.frame = 5;
// });
// document.querySelector("#twist-3d-input").oninput = function(event) {
// 	let fraction = parseFloat(event.target.value / 500);
// 	let frame = parseInt(fraction * (view3D.frames.length-1));
// 	view3D.frame = frame;
// }
</script>

<script>
var craneSVGPath = "../files/svg/crane.svg";

let craneFold = RabbitEar.Origami("div-folded-crane", {
	style: ".foldedForm polygon.back { fill: #fb3; } .creasePattern polygon { fill: none; }"
})

fetch(craneSVGPath)
  .then(response => response.text())
  // .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
  .then(svgString => {
		craneFold.load(svgString);
		craneFold.collapse();
  // .then(data => {
  	// let loadedSVG = data.childNodes[0];
		RabbitEar.svg.load(svgString, function(image){
			RabbitEar.svg.setViewBox(image, -12, -12, 600 + 12*2, 600 + 12*2);
			// document.querySelector("#div-folded-crane").insertBefore(image, craneFold);
			document.querySelector("#div-folded-crane").appendChild(image);
		});
  });
</script>

<script type="text/javascript">
document.getElementById("download-example-button").onclick = function(event){
	sinePleatsFolded.export("pleats.svg", true);
}
// document.getElementById("download-button").onclick = function(e){
// 	let zip_file_path = "https://github.com/robbykraft/Origami/releases/download/untagged-1fdecd22aca74a9d72a0/rabbit-ear-0.1.zip";
// 	download(zip_file_path, "rabbit-ear.zip");
// }
function download(url, filename){
	let a = document.createElement("a");
	a.style = "display: none";
	document.body.appendChild(a);
	a.href = url;
	a.download = filename;
	a.click();
	document.body.removeChild(a);
}
</script>

<script>
// let sinePleats = RabbitEar.Origami("canvas-sine-pleats");
// sinePleats.faces.visible = false;
// let sinePleatsFolded = RabbitEar.Origami("canvas-sine-pleats");

// sinePleats.init = function(t = 0.0) {
// 	if (t >= 1) { t = 0.99; }
// 	let unitCosine = -Math.cos(t*Math.PI*2)*0.5 + 0.5;
// 	// sinePleats.cp = RabbitEar.CreasePattern();//.rectangle(2,1);
// 	let PLEATS = 12;
// 	let a = Array.from(Array((PLEATS-1))).map((_,i) => i+1);
// 	let f = a.map(i => i/PLEATS);
// 	let pts = f.map((f,i) =>
// 		Math.PI/2 + (i%2)*(0.05+0.075*Math.sin(t*Math.PI*3)) + 0.3*(-Math.cos(t*5))
// 	).map((a,i) => [
// 		[0.5 + (f[i]-0.5)*(1.0+0.5-0.5*unitCosine), t],
// 		[Math.cos(a), Math.sin(a)]
// 	]);
// 	pts.map((p,i) => i%2===0
// 		? sinePleats.crease(p[0], p[1]).mountain()
// 		: sinePleats.crease(p[0], p[1]).valley()
// 	);
// 	let cp = sinePleats.cp.copy();
// 	let vertices_coords = RabbitEar.core.fold_vertices_coords(cp, 0);
// 	let faces_layer = Array.from(Array(sinePleats.faces.length)).map((_,i) => i);
// 	let file_frame = {
// 		vertices_coords,
// 		"faces_re:layer": faces_layer,
// 		frame_classes: ["foldedForm"],
// 		frame_inherit: true,
// 		frame_parent: 0
// 	};
// 	cp.file_frames = [file_frame];
// 	sinePleatsFolded.cp = cp;
// 	sinePleatsFolded.frame = 1;
// }
// sinePleats.init(-0.32 + (225 / 500)*1.15);
// document.querySelector("#sine-pleats-input").oninput = function(event) {
// 	let v = event.target.value / 500;
// 	sinePleats.init(-0.32 + v*1.15 );
// }
</script>

<?php include 'footer.php';?>
