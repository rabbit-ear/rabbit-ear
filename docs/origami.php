<?php include 'header.php';?>

<h3>CHAPTER IV.</h3>

<h1>ORIGAMI</h1>

<pre class="code"><code><f>var</f> origami <key>=</key> <f>RabbitEar</f>.<f>origami</f>()</code></pre>

<h2>Axioms</h2>

<p>
	Every precise origami fold is one of seven geometric constructions.
</p>

<div class="toolbar">
	<a class="button nopress">Axiom</button>
	<a class="button" id="button-axiom-1">1</a>
	<a class="button red" id="button-axiom-2">2</a>
	<a class="button" id="button-axiom-3">3</a>
	<a class="button" id="button-axiom-4">4</a>
	<a class="button" id="button-axiom-5">5</a>
	<a class="button" id="button-axiom-6">6</a>
	<a class="button" id="button-axiom-7">7</a>
</div>

<p class="quote" id="axiom-description"></p>

<div id="canvas-axioms-graph" class="full"></div>

<pre class="code"><code><f>RabbitEar</f>.<f>axiom</f>(<span id="span-axioms-info"></span>)</code></pre>

<div id="canvas-axioms" class="grid-2"></div>

	<div id="canvas-face-dual"></div>

<section id="intro">

<h2>Flat-foldability</h2>

	<p>At the heart of origami computation is the test for flat-foldability: whether or not an origami crease pattern will fold flat.</p>

	<div id="single-vertex" class="diptych"></div>
	
	<p class="quote">This is ensuring flat-foldability by using the Kawasaki Collapse.</p>

	<p>Flat-foldability is difficult to calculate, but there are tools for approximating a calculation:</p>

	<h3>Kawasaki's Theorem</h3>
	
	<p>The sum of alternating interior angles between the edges around one vertex should each add up to 180&deg;.</p>

	<div id="canvas-kawasaki"></div>

	<div class="centered">
		<pre><code>junction.<f>kawasaki</f>()</code></pre>
	</div>

	<h3>Kawasaki Collapse</h3>

	<p>This unique case occurs often in computational origami:
		<ul>
			<li>three edges around a shared vertex</li>
			<li>every crease is the same orientation</li>
			<li>each interior angle is less than 180&deg;</li>
		</ul>
	</p>
	<p>there are three solutions to satisfy flat-foldability, one per sector.</p>

	<div id="canvas-kawasaki-collapse"></div>

	<div class="centered">
		<pre><code>junction.<f>kawasakiCollapse</f>()</code></pre>
	</div>

</section>

<section id="molecules">

<h2>Uniaxial Bases</h2>

	<p>Robert Lang's Treemaker</p>

	<div id="canvas-treemaker"></div>

	<h3>The Universal Molecule</h3>

	<div id="canvas-origami-molecule"></div>

	<p>Uniaxial base design allowed huge advancements in origami art. In a uniaxial base, origami molecules are formed out of convex polygons tiling the plane.</p>

</section>

<section id="twists">

<h2>Twists</h2>

	<div id="canvas-face-coloring"></div>

	<p>Especially with face tilings, it's helpful for.........</p>

	<div id="canvas-convex-twist"></div>

</section>

<script type="text/javascript" src="../ui-tests/origami_axioms_graph.js"></script>
<!-- <script type="text/javascript" src="../tests/origami_single_vertex.js"></script>
<script type="text/javascript" src="../tests/origami_kawasaki.js"></script>
<script type="text/javascript" src="../tests/origami_kawasaki_collapse.js"></script>
<script type="text/javascript" src="../tests/origami_molecule.js"></script>
<script type="text/javascript" src="../tests/graph_face_dual.js"></script>
<script type="text/javascript" src="../tests/origami_twist.js"></script>
<script type="text/javascript" src="../tests/origami_treemaker.js"></script>
<script type="text/javascript" src="../tests/origami_two_coloring.js"></script>
<script type="text/javascript" src="../tests/origami_axiom1.js"></script>
<script type="text/javascript" src="../tests/origami_axiom2.js"></script>
<script type="text/javascript" src="../tests/origami_axiom3.js"></script>
 -->

<script>
axiomSketchCallback = function (event) {
	var numPoints = event.parameters.points != null ? event.parameters.points.length : 0;
	var numLines = event.parameters.lines != null ? event.parameters.lines.length : 0;
	var points = numPoints === 0 ? "" : "[" + event.parameters.points.map(p => {
		return "[<n>" + p[0].toFixed(2) + "</n>, <n>" + p[1].toFixed(2) + "</n>]";
	}).join(", ") + "]";
	var lines = numLines === 0 ? "" : "[" + event.parameters.lines.map(l => {
		return "{<br>    origin: [<n>" + l.origin[0].toFixed(2) + "</n>, <n>" + l.origin[1].toFixed(2) + "</n>],<br>    vector: [<n>" + l.vector[0].toFixed(2) + "</n>, <n>" + l.vector[1].toFixed(2) + "</n>]<br>  }";
	}).join(", ") + "]";
	var strings = [
		(numPoints ? "<br>  points: " + points : undefined),
		(numLines ? "<br>  lines: " + lines : undefined)
	].filter(function(a){return a !== undefined;});
	var objectString = "{" + strings.join(", ") + "<br>}"
	document.querySelector("#span-axioms-info").innerHTML = "<n>"+event.axiom+"</n>, " + objectString;
	document.querySelector("#axiom-description").innerHTML = RabbitEar.text.axioms.en[event.axiom];
}
</script>
<?php include 'footer.php';?>