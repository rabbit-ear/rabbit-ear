<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Rabbit Ear, origami and creative code</title>
<meta name="description" content="an origami creative coding library. design crease patterns in code">
<meta http-equiv="content-type" content="text/html;charset=UTF-8">
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-121244028-1"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','UA-121244028-1');</script>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
<link href="https://fonts.googleapis.com/css?family=Montserrat:600" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="../docs/css/code.css">
<link rel="stylesheet" type="text/css" href="css/byrne.css?version=0.2">
<link rel="stylesheet" type="text/css" href="css/page.css?version=0.2">

<h2>1. paper &nbsp;2. crease &nbsp;3. fold</h2>

<div class="flex-grid demo">
	<div class="column">
		<canvas id="canvas-one" class="third" resize></canvas>
		<pre><code><f>var</f> cp <key>=</key> <key>new</key> CreasePattern();</code></pre>
	</div>
	<div class="column">
		<canvas id="canvas-two" class="third" resize></canvas>
		<pre><code>cp.<f>pleat</f>(<n>3</n>, topEdge, rightEdge);<br><f>var</f> ray <key>=</key> <key>new</key> Ray(<n>1</n>,<n>1</n>,<span id="ray-numbers"><n>-.7</n>,<n>-.7</n></span>);<br>cp.<f>creaseAndReflect</f>(ray);</code></pre>
	</div>
	<div class="column">
		<canvas id="canvas-three" class="third" resize></canvas>
		<pre><code>cp.<f>fold</f>()</code></pre>
	</div>
</div>

<h2>showcase</h2>

<div class="card-columns">
	<div class="card">
		<a href="examples/miura/">
		<img class="card-img-top" src="images/miura.svg">
		<div class="card-body">
			<h5 class="card-title">code: Miura-Ori</h5>
		</div>
		</a>
	</div>
	<div class="card">
		<a href="//editor.origami.tools">
	<div class="canvas-container card-img-top">
		<canvas id="canvas-nearest" resize></canvas>
	</div>
		<div class="card-body">
			<h5 class="card-title">editor</h5>
			<p class="card-text">for origami crease patterns</p>
			<p class="card-text"><small class="text-muted">an ambitious undertaking, in-development</small></p>
		</div>
	</a>
	</div>
	<div class="card text-center">
		<div class="card-body">
		<a href="examples/voronoi/">
			<h5 class="card-title">Voronoi</h5>
			<p class="card-text">algorithm into origami crease pattern</p>
		</a>
			<p class="card-text"><small class="text-muted">demonstrate interoperability with an external library: D3 Voronoi algorithm</small></p>
		</div>
	</div>
	<div class="card text-center">
		<div class="card-body">
		<a href="examples/folder/">
			<h5 class="card-title">folding simulator</h5>
			<p class="card-text">fold an .svg file.</p>
		</a>
			<p class="card-text"><small class="text-muted"><a href="docs/introduction.php">try crease patterns inside the .zip</a></small></p>
		</div>
	</div>
	<div class="card">
		<a href="examples/schamp/">
		<img class="card-img-top" src="images/schamp.svg">
		<div class="card-body">
			<h5 class="card-title">code: angled pleats</h5>
			<p class="card-text"><small class="text-muted">after Ray Schamp</small></p>
		</div>
	</a>
	</div>

	<div class="card text-center">
		<div class="card-body">
		<a href="examples/code/">
			<h5 class="card-title">empty code canvas</h5>
		</a>
			<p class="card-text"><small class="text-muted">check out the <a href="docs/">documentation</a> for operations</small></p>
		</div>
	</div>

	<div class="card">
		<a href="examples/validator/">
	<div class="canvas-container card-img-top">
		<canvas id="canvas-flat-foldable" resize></canvas>
	</div>
		<div class="card-body">
			<h5 class="card-title">validator</h5>
			<p class="card-text">validate (potential) flat-foldability</p>
			<p class="card-text"><small class="text-muted"><a href="docs/introduction.php">try crease patterns inside the .zip</a></small></p>
		</div>
	</a>
	</div>
	<div class="card text-center">
		<div class="card-body">
		<a href="docs/">
			<h5 class="card-title">don't miss the docs</h5>
			<p class="card-text"></p>
		</a>
			<p class="card-text"><small class="text-muted">they're full of interactive explorable explanations.</small></p>
		</div>
	</div>

</div>

<script type="text/javascript" src="../cp.js"></script>
<script type="text/javascript" src="../include/paper-full.min.js"></script>
<script type="text/javascript" src="../cp.paperjs.js"></script>
<script type="text/javascript" src="js/demo-triptych.js"></script>
<script type="text/javascript" src="../tests/nearest.js"></script>
<script type="text/javascript" src="../tests/flat_foldable.js"></script>

</body>
</html>