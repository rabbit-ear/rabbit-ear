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
&lt;<key>script</key> <v>src</v>=<str>"rabbit-ear.js"</str>&gt;&lt;/<key>script</key>&gt;
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
		<button class="btn btn-primary" id="download-button"><i class="fa fa-download"></i> rabbit-ear-0.2.zip</button>
	</div>

	<p>Create a new project inside the "sketches" folder by copying and renaming "empty".</p>
	<div style="margin: auto; text-align: center; width:50vw; min-width: 300px;">
		<img style="width:100%" src="https://rabbitear.org/images/new-project.gif">
	</div>

	<p>There are three files:</p>
	<ul>
		<li><strong>index.html</strong> open this file to run your sketch.</li>
		<li><strong>style.css</strong> set the color of the paper and style the lines.</li>
		<li><strong>sketch.js</strong> let's look closer at this:</li>
	</ul>

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

	<p>This loads an svg image, interprets it like a crease pattern, and folds it.</p>

	<div id="div-folded-crane" class="diptych"></div>

	<pre><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();<br>origami.<f>load</f>(<str>"crane.svg"</str>);<br>origami.<f>fold</f>();</code></pre>

	<p>This sketch generates pleats based on a sine curve.</p>

	<div id="canvas-sine-pleats" class="diptych"></div>
	<div class="center" style="width: 300px; max-width: 50vw; margin:auto; margin-top: 2rem; text-align:center;">
		<input type="range" id="sine-pleats-input" min=0 max=500 value=0>
	</div>

	<pre><code><f>let</f> origami <key>=</key> <f>RabbitEar</f>.<f>Origami</f>();</code></pre>

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

	<p>Each origami object contains a <b>Crease Pattern</b>, an extended <a href="https://github.com/edemaine/fold">FOLD</a> object. This is where all the crease information is stored.</p>

	<div class="centered">
		<pre><code>origami.cp <c>// an origami's crease pattern is here</c></code></pre>
	</div>

	<p>For more computational use cases, create one directly and visualize it on your own:</p>

	<div class="centered">
		<pre><code><f>let</f> cp <key>=</key> <f>RabbitEar</f>.<f>CreasePattern</f>();</code></pre>
	</div>

	<div class="diptych">
		<img src="../rabbitear-site/images/one-fold-folded.svg">
	</div>

</section>

<section id="footer" style="font-size: 80%; margin: 2rem 0">
	<hr>
	<p>This project is <a href="http://github.com/robbykraft/Origami/">open source</a>, released under the MIT license.</p>

</section>

<script type="text/javascript" src="../tests/origami_fold.js"></script>
<script type="text/javascript" src="../tests/origami_two_coloring.js"></script>
<!-- <script type="text/javascript" src="../tests/origami_swim.js"></script> -->


<script>
// let view3D = RabbitEar.Origami3D("intersection-wobble");
// view3D.load("../files/fold/square-twist.fold");
</script>

<script>
// folded crane
let craneCP = RabbitEar.svg.image("div-folded-crane")
craneCP.load("../files/svg/crane.svg", function(image){
	let pad = image.w*0.02;
	image.setViewBox(-pad, -pad, image.w + pad*2, image.h + pad*2);
});

let craneFold = RabbitEar.Origami("div-folded-crane")
craneFold.load("../files/fold/crane.fold", function(cp){
	craneFold.foldWithoutLayering(2);
});

</script>

<script type="text/javascript">
document.getElementById("download-example-button").onclick = function(event){
	RabbitEar.svg.save(sinePleatsFolded);
}
document.getElementById("download-button").onclick = function(e){
	let zip_file_path = "https://github.com/robbykraft/Origami/releases/download/untagged-1fdecd22aca74a9d72a0/rabbit-ear-0.1.zip";
	download(zip_file_path, "rabbit-ear.zip");
}
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
let sinePleatsFolded = RabbitEar.Origami("canvas-sine-pleats");

sinePleats.init = function(t = 0.0) {
	if (t >= 1) { t = 0.99; }
	let unitCosine = -Math.cos(t*Math.PI*2)*0.5 + 0.5
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
			: sinePleats.cp.creaseLine(p[0], p[1]).valley() );
	sinePleatsFolded.cp = RabbitEar.CreasePattern(JSON.parse(JSON.stringify(sinePleats.cp)));
	let face = sinePleats.nearest(pts[5][0][0]-0.02, pts[5][0][1]).face;
	sinePleatsFolded.fold(face.index);
}
sinePleats.init();
document.querySelector("#sine-pleats-input").oninput = function(event) {
	let v = event.target.value / 500;
	sinePleats.init(v*2);
}

</script>

<?php include 'footer.php';?>
