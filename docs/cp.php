<?php include 'header.php';?>

<h3 style="text-align:center;margin-top:3em;">CHAPTER III.</h3>

<h1>CREASE PATTERNS</h1>


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


<h2>Axioms</h2>

RE.axiom(1,[0.2,0.333],[1,1])

RE.axiom(1,{x:0.2, y:0.333},{x:1,y:1})

<section id="axioms">

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

<script type="text/javascript" src="../tests/origami_single_vertex.js"></script>
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

<?php include 'footer.php';?>