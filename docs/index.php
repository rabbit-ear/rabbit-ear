<?php include 'header.php';?>

<p class="explain">Rabbit Ear is gearing up for a version 2 release. Documentation and updates will continue through May and June of 2019</p>

<script type="text/javascript" src="include/threejs/three.min.js"></script>
<script type="text/javascript" src="include/threejs/THREE.MeshLine.js"></script>
<script type="text/javascript" src="include/threejs/THREE.OrbitControls.js"></script>

<h1>Origami</h1>

<section id="simplest-app">

	<div id="canvas-origami-fold"></div>

	<p class="quote">grab</p>

	<div class="code"><pre class="language">.HTML</pre>
	<pre><code>&lt;!<key>DOCTYPE</key> html&gt;
&lt;<key>title</key>&gt;Rabbit Ear&lt;/<key>title</key>&gt;
&lt;<key>script</key> <v>src</v>=<str>"rabbit-ear.js"</str>&gt;&lt;/<key>script</key>&gt;
&lt;<key>script</key>&gt;
<f>RE</f>.<f>Origami</f>( {<str>"folding"</str>:<n>true</n>} );
&lt;/<key>script</key>&gt;
</code></pre>
</div>

	<p>This simple app creates the sketch above - a square sheet of paper that you can fold.</p>

</section>

<section id="first-app">

	<h2>Getting Started</h2>

<!-- 	<p>Download Rabbit Ear here.</p>

	<div class="center">
		<a href="https://github.com/robbykraft/Origami/releases/download/untagged-1fdecd22aca74a9d72a0/rabbit-ear-0.19.zip"><button class="btn btn-primary" id="download-button"><i class="fa fa-download"></i> rabbit-ear-0.19.zip</button></a>
	</div>
 -->
	<p>Create a new project inside the "sketches" folder by copying and renaming "empty".</p>
	<div style="margin: auto; text-align: center; width:50vw; min-width: 300px;">
		<img style="width:100%" src="https://rabbitear.org/images/new-project.gif">
	</div>

	<p>There are three files in your sketch:</p>
	<ul>
		<li><strong>index.html</strong> open this file to run your sketch.</li>
		<li><strong>style.css</strong> set the color of the paper and style the lines.</li>
		<li><strong>sketch.js</strong> let's take a closer look:</li>
	</ul>

	<div class="centered code"><pre class="language">.js</pre>
	<pre><code><f>let</f> origami <key>=</key> <f>RE</f>.<f>Origami</f>();
<br><c>// respond to a touch event</c>
<f>origami</f>.<v>onMouseMove</v> = <f>function</f>(<arg>event</arg>){

}
</code></pre>
	</div>

</section>


<h2>Examples</h2>

<section id="examples">

	<p>This loads an svg image, interprets it like a crease pattern, and folds it.</p>

	<div id="div-folded-crane" class="diptych"></div>

	<div class="diptych code">
		<pre><code><f>let</f> origami <key>=</key> <f>RE</f>.<f>Origami</f>();<br>origami.<f>load</f>(<str>"crane.svg"</str>);</code></pre>
		<pre><code><f>let</f> origami <key>=</key> <f>RE</f>.<f>Origami</f>();<br>origami.<f>load</f>(<str>"crane.svg"</str>);<br>origami.<f>fold</f>();</code></pre>
	</div>

	<p class="quote">In some cases Rabbit Ear is capable of determining layer ordering for a folding. When it is unsure it draws translucent faces.</p>

	<p class="explain">loading a file requires running a localhost server.</p>

	<p>This sketch loads a frog base and colors the faces.</p>

	<div id="canvas-face-coloring"></div>

<div class="code"><pre class="language">.js</pre>
<pre><code><f>let</f> origami <key>=</key> <f>RE</f>.<f>Origami</f>();
origami.<f>load</f>(<f>RE</f>.bases.frog);

<f>RE</f>.core.faces_coloring(origami.cp, <n>0</n>)
  .<f>map</f>(<arg>color</arg> <f>=></f> color <key>?</key> <str>"#224c72"</str> <key>:</key> <str>"#f1c14f"</str>)
  .<f>forEach</f>((<arg>color</arg>, <arg>i</arg>) <f>=></f>
    origami.faces[i].<f>setAttribute</f>(<str>"style"</str>, <str>"fill:"</str> <key>+</key> color)
  );</code></pre>
</div>

	<p class="quote">A flat-foldable crease pattern is always two-colorable.</p>

	<p>These generative pleats are based on sine curves.</p>

	<div id="canvas-sine-pleats" class="diptych"></div>
	<div class="center" style="width: 300px; max-width: 50vw; margin:auto; margin-top: 2rem; text-align:center;">
		<input type="range" id="sine-pleats-input" min=0 max=500 value=225>
	</div>

<div class="code"><pre class="language">.js</pre>
	<pre><code><f>let</f> origami <key>=</key> <f>RE</f>.<f>Origami</f>();
<f>let</f> creaseLines <op>=</op> <f>Array</f>.<f>from</f>(<f>Array</f>((<n>12</n>)))
  .<f>map</f>((<arg>_</arg>,<arg>i</arg>) <f>=></f> [ [p[i][<n>0</n>], p[i][<n>1</n>]], [p[i][<n>2</n>], p[i][<n>3</n>]] ]
);

creaseLines.<f>forEach</f>((<arg>a</arg>,<arg>i</arg>) <f>=></f> i<op>%</op>2 <op>===</op> <n>0</n>
  <op>?</op> sinePleats.cp.<f>creaseLine</f>(a[<n>0</n>], a[<n>1</n>]).<f>mountain</f>()
  <op>:</op> sinePleats.cp.<f>creaseLine</f>(a[<n>0</n>], a[<n>1</n>]).<f>valley</f>()
);</code></pre>
</div>

	<p>Because Rabbit Ear draws using SVG, a vector image is always ready to download.</p>

	<div class="center">
		<button type="button" class="btn btn-dark" id="download-example-button">save image</button>
	</div>

	<p>There's a <a href="https://threejs.org/">three.js</a> extension in the works.</p>

	<div class="three" id="twist-3d"></div>

	<div class="center" style="width: 300px; max-width: 50vw; margin:auto; margin-top: 2rem; text-align:center;">
		<input type="range" id="twist-3d-input" min=0 max=500 value=125>
	</div>

	<div class="centered code"><pre class="language">.js</pre>
		<pre><code><f>let</f> origami <key>=</key> <f>RE</f>.<f>Origami3D</f>();<br>origami.<f>load</f>(<str>"square-twist.fold"</str>);</code></pre>
	</div>

</section>

<section>

<h2>CREASE PATTERN</h2>

	<div class="diptych">
		<img src="/images/one-fold-cp.svg">
	</div>

	<p>Each origami object contains a <b>Crease Pattern</b>, an extended <a href="https://github.com/edemaine/fold">FOLD</a> object. This is where all the crease information is stored including the folded form.</p>

	<div class="centered code"><pre class="language">.js</pre>
		<pre><code>origami.cp <c>// crease data is stored here</c></code></pre>
	</div>

	<p>For especially algorithmic cases, you can create a crease pattern data object directly, unattached to any SVG.</p>

	<div class="centered code"><pre class="language">.js</pre>
		<pre><code><f>let</f> cp <key>=</key> <f>RE</f>.<f>CreasePattern</f>();</code></pre>
	</div>

	<p>There is a growing list of ways to put in a crease.</p>

	<div class="centered code"><pre class="language">.js</pre>
		<pre><code><f>axiom1</f>(<arg>point</arg>, <arg>point</arg>)
...
<f>axiom7</f>(<arg>point</arg>, <arg>line</arg>, <arg>line</arg>)
<f>addVertexOnEdge</f>(<arg>x</arg>, <arg>y</arg>, <arg>oldEdgeIndex</arg>)
<f>creaseRay</f>(<arg>ray</arg>)
<f>creaseLine</f>(<arg>line</arg>)</code></pre>
	</div>

	<div class="diptych">
		<img src="/images/one-fold-folded.svg">
	</div>

	<p>Read more about the <b>Crease Pattern object</b>, .svg to .fold <b>converters</b>, the <b>math library</b>, and more in the following sections.

</section>


<section id="footer" style="font-size: 80%; margin: 2rem 0">
	<hr>
	<p>This project is <a href="http://github.com/robbykraft/Origami/">open source</a>.</p>

</section>

<script>
let twoColor = RabbitEar.Origami("canvas-face-coloring");
twoColor.load(RabbitEar.bases.frog);
twoColor.edges.visible = false;
let faces = twoColor.faces;
RabbitEar.core.faces_coloring(twoColor.cp, 0)
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
origamiFold = RabbitEar.Origami("canvas-origami-fold", {folding:true}, sketchW * window.innerWidth, sketchH * window.innerWidth, function(){
	// did load
	let pad = 0.1;
	origamiFold.setViewBox(-pad - (sketchW-1)*0.5, -pad, sketchW+pad*2, sketchH+pad*2);
});
origamiFold.init = function() {
	let pad = 0.1;

	origamiFold.setViewBox(-pad, -pad, sketchW+pad*2, sketchH+pad*2);
	origamiFold.preferences.autofit = false;
	let points = [
		RabbitEar.Vector(1, 0),
		RabbitEar.Vector(0.7 - Math.random()*0.3, 0.2 + Math.random()*0.45)
	];
	let midpoint = points[0].midpoint(points[1]);
	let vector = points[1].subtract(points[0]);
	origamiFold.cp.valleyFold(midpoint, vector.rotateZ90(), 0);
	origamiFold.fold();
}
origamiFold.init();
</script>

<script>
let view3D = RabbitEar.Origami3D("twist-3d");
view3D.load("../files/fold/square-twist.fold", function(){
	view3D.frame = 5;
});
document.querySelector("#twist-3d-input").oninput = function(event) {
	let fraction = parseFloat(event.target.value / 500);
	let frame = parseInt(fraction * (view3D.frames.length-1));
	view3D.frame = frame;
}
</script>

<script>
// folded crane
RabbitEar.svg.load("../files/svg/crane.svg", function(image){
	RabbitEar.svg.setViewBox(image, -12, -12, 600 + 12*2, 600 + 12*2);
	document.querySelector("#div-folded-crane").insertBefore(image, craneFold);
});
let craneFold = RabbitEar.Origami("div-folded-crane")
craneFold.load("../files/fold/crane.fold", function(cp){
	craneFold.foldWithoutLayering(2);
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
let sinePleats = RabbitEar.Origami("canvas-sine-pleats");
sinePleats.faces.visible = false;
let sinePleatsFolded = RabbitEar.Origami("canvas-sine-pleats");

sinePleats.init = function(t = 0.0) {
	if (t >= 1) { t = 0.99; }
	let unitCosine = -Math.cos(t*Math.PI*2)*0.5 + 0.5;
	sinePleats.cp = RabbitEar.CreasePattern();//.rectangle(2,1);
	let PLEATS = 12;
	let a = Array.from(Array((PLEATS-1))).map((_,i) => i+1);
	let f = a.map(i => i/PLEATS);
	let pts = f.map((f,i) =>
		Math.PI/2 + (i%2)*(0.05+0.075*Math.sin(t*Math.PI*3)) + 0.3*(-Math.cos(t*5))
	).map((a,i) => [
		[0.5 + (f[i]-0.5)*(1.0+0.5-0.5*unitCosine), t],
		[Math.cos(a), Math.sin(a)]
	]);
	pts.map((p,i) => i%2===0
		? sinePleats.cp.creaseLine(p[0], p[1]).mountain()
		: sinePleats.cp.creaseLine(p[0], p[1]).valley()
	);
	let cp = RabbitEar.CreasePattern(sinePleats.cp.json);
	let vertices_coords = RabbitEar.core.fold_vertices_coords(cp, 0);
	let faces_layer = Array.from(Array(sinePleats.faces.length)).map((_,i) => i);
	let file_frame = {
		vertices_coords,
		"re:faces_layer": faces_layer,
		frame_classes: ["foldedForm"],
		frame_inherit: true,
		frame_parent: 0
	};
	cp.file_frames = [file_frame];
	sinePleatsFolded.cp = cp;
	sinePleatsFolded.frame = 1;
}
sinePleats.init(-0.32 + (225 / 500)*1.15);
document.querySelector("#sine-pleats-input").oninput = function(event) {
	let v = event.target.value / 500;
	sinePleats.init(-0.32 + v*1.15 );
}
</script>

<?php include 'footer.php';?>
