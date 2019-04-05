<?php include 'header.php';?>

<h1>ORIGAMI</h1>

<section id="intro">

<h2>Flat-foldability</h2>

	<h3>Kawasaki's Theorem</h3>

	<p class="explain">The sum of alternating interior angles between the edges around one vertex should each add up to 180&deg;.</p>
	<div id="canvas-kawasaki"></div>

	<div class="centered">
		<pre><code>cp.<f>kawasaki</f>()</code></pre>
	</div>

	<p>This data is available to us in a few ways:
		<ul>
			<li>create a <b>Junction</b> at the node</li>
			<li>get the function from the core of the library</li>
		</ul>
	</p>

	<h3>Kawasaki Collapse</h3>

	<p>when the unique case that there are three edges around a node, and each interior angle is less than 180&deg;, there is one and only one solution per sector.</p>

	<div id="canvas-kawasaki-collapse"></div>

	<div class="centered">
		<pre><code>junction.<f>kawasakiCollapse</f>()</code></pre>
	</div>

</section>


<h2>Axioms</h2>

<section id="intro">

<h3>Axiom 1</h3>
	<p class="explain">Given two points, we can fold a line connecting them</p>
	<div id="canvas-axiom-1"></div>
	<div class="centered">
		<pre><code>cp.<f>creaseConnectingPoints</f>(point1, point2)</code></pre>
	</div>

<h3>Axiom 2</h3>
	<p class="explain">Given two points, we can fold point 1 onto point 2</p>
	<div id="canvas-axiom-2"></div>
	<div class="centered">
		<pre><code>cp.<f>creasePointToPoint</f>(point1, point2)</code></pre>
	</div>

<h3>Axiom 3</h3>
	<p class="explain">Given two lines, we can fold line 1 onto line 2</p>
	<div id="canvas-axiom-3"></div>
	<div class="centered">
		<pre><code>cp.<f>creaseEdgeToEdge</f>(edge1, edge2)</code></pre>
	</div>

<h3>Axiom 4</h3>
	<p class="explain">Given a point and a line, we can make a fold perpendicular to the line passing through the point</p>
	<div id="canvas-axiom-4"></div>
	<div class="centered">
		<pre><code>cp.<f>creasePerpendicularThroughPoint</f>(edge, point)</code></pre>
	</div>

<h3>Axiom 5</h3>
	<p class="explain">Given two points and a line, we can make a fold that places the first point on to the line and passes through the second point</p>
	<div id="canvas-axiom-5"></div>
	<div class="centered">
		<pre><code>cp.<f>creasePointToLine</f>(point1, point2, edge)</code></pre>
	</div>

<h3>Axiom 6</h3>
	<p class="explain">Given two points and two lines we can make a fold that places the first point onto the first line and the second point onto the second line</p>
	<div class="centered"><p style="padding-top:6em;padding-bottom:6em;">oof. this one is hard</p></div>
	<div id="canvas-axiom-6"></div>
	<div class="centered">
		<pre><code>cp.<f>creaseConnectingPoints</f>(point1, point2)</code></pre>
	</div>

<h3>Axiom 7</h3>
	<p class="explain">Given a point and two lines we can make a fold perpendicular to the second line that places the point onto the first line</p>
	<div id="canvas-axiom-7"></div>
	<div class="centered">
		<pre><code>cp.<f>creasePerpendicularPointOntoLine</f>(point, edge1, edge2)</code></pre>
	</div>

</section>

<script type="text/javascript" src="../tests/origami_kawasaki.js"></script>
<script type="text/javascript" src="../tests/origami_kawasaki_collapse.js"></script>
<script type="text/javascript" src="../tests/origami_axiom1.js"></script>
<script type="text/javascript" src="../tests/origami_axiom2.js"></script>
<script type="text/javascript" src="../tests/origami_axiom3.js"></script>

<?php include 'footer.php';?>