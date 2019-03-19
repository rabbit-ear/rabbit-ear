<?php include 'header.php';?>

<script type="text/javascript" src="../lib/three.min.js"></script>
<script type="text/javascript" src="../lib/THREE.MeshLine.js"></script>
<script type="text/javascript" src="../lib/THREE.OrbitControls.js"></script>

<h1>Crease Patterns</h1>

<section id="intro">
	<div id="fish-noise"></div>
	<pre><code><f>let</f> origami <op>=</op> <f>RabbitEar</f>.bases.fish</code></pre>
	<p class="quote">A crease pattern can easily be represented in code making computation design an accessible reality.</p>	
	<p>It's possible to design origami by modifying an existing design. But truly novel designs begin when you understand crease patterns..</p>
</section>

<section id="graphs">
	<h2>Graphs</h2>
	<p>A graph is an abstract collection of <strong>nodes</strong> and connections between them called <strong>edges</strong>. A crease pattern's crease lines are the edges and their endpoints as nodes. When it lies flat like this it's called a <strong>planar graph</strong>.</p>
	<p>However, when the model begins to fold, the lines leave the plane and enter 3D.</p>
	<div class="three-js" id="intersection-wobble"></div>
	<pre><code><span id="span-intersection-results"></span>origami.<a href=""><f>fold</f></a>();</code></pre>
	<p class="quote">Even if a model is folded in 3D, it still has a 2D crease pattern.</p>
	<p>The aim of this library is for origami designs to be able to be created entirely in code, making every component accessible, flexible, and parametric.</p>
</section>

<section id="download">
	<h2>Download</h2>
	<p>Everything you need, including a guide to making your first sketch is on the <a href="introduction.php">introduction</a>.</p>
</section>

<section id="about">
	<h2>About</h2>
	<p><a href="http://github.com/robbykraft/Origami/">All code is available</a>, released under the MIT open source license.</p>
</section>

<script type="text/javascript" src="../tests/origami_swim.js"></script>
<script>
let view3D = RabbitEar.Origami3D("intersection-wobble");
view3D.load("../files/fold/square-twist.fold");
</script>
<?php include 'footer.php';?>
