<?php include 'header.php';?>

<h1>APPENDIX</h1>

<h2>Library Structure</h2>

<section>
	<div class="centered">
		<pre class="compact"><code><f>RabbitEar</f>
┃
┃ <c>// origami objects</c>
┣━ <v>CreasePattern</v>
┣━ <v>Origami</v>
┃
┃ <c>// math objects</c>
┣━ <v>Vector</v>
┣━ <v>Matrix2</v>
┣━ <v>Line</v>
┣━ <v>Edge</v>
┣━ <v>Ray</v>
┣━ <v>Polygon</v>
┣━ <v>ConvexPolygon</v>
┣━ <v>Rectangle</v>
┣━ <v>Circle</v>
┣━ <v>Junction</v>
┣━ <v>Sector</v>
┣━ <v>Graph</v>
┃
┃ <c>// containers</c>
┣━ bases
┣━ math
┣━ convert
┣━ svg
┗━ core</code></pre>
</div>

	<p>Capitalized entries are objects you can create, lowercase are containers (like folders) containing things inside them.</p>

</section>

<section>

	<h2>Containers</h2>
	<ul>
		<li><b>bases</b>: contains useful origami bases in FOLD format</li>
		<li><b>convert</b>: convenient methods for converting between file types</li>
		<li><b>math</b>: a decent-sized linear algebra and geometry library</li>
		<li><b>svg</b>: a mini creative coding library for drawing SVG</li>
		<li><b>core</b>: the brains of the library, the algorithms behind the origami operations operating primarily on FOLD objects</li>
	</ul>

	<h3>Bases</h3>

	<div class="centered">
		<pre class="compact"><code><f>RabbitEar</f>.bases
┃
┣━ square
┣━ kite
┣━ fish
┣━ bird
┣━ frog
┗━ blintz</code></pre>		
	</div>

	<p>Popular origami bases like kite, frog, bird are available here in the FOLD format. These are <a>frozen</a> objects, Javascript passes objects by reference, make sure to clone them before use.

	<div class="centered">
		<pre class="compact"><code><f>let</f> birdBase <key>=</key> <f>JSON</f>.<f>parse</f>(<f>JSON</f>.<f>stringify</f>(<f>RabbitEar</f>.bases.bird));</code></pre>		
	</div>

	<h3>Math</h3>
	<div class="centered" style="height:15rem; overflow: scroll;">
		<pre class="compact"><code><f>RabbitEar</f>.math
┃
┣━ <v>average</v>
┣━ <v>axiom</v>
┣━ <v>bisect_lines2</v>
┣━ <v>bisect_vectors</v>
┣━ <v>centroid</v>
┣━ <v>clean_number</v>
┣━ <v>clockwise_angle2</v>
┣━ <v>clockwise_angle2_radians</v>
┣━ <v>convex_hull</v>
┣━ <v>counter_clockwise_angle2</v>
┣━ <v>counter_clockwise_angle2_radians</v>
┣━ <v>cross2</v>
┣━ <v>cross3</v>
┣━ <v>degenerate</v>
┣━ <v>distance2</v>
┣━ <v>distance3</v>
┣━ <v>dot</v>
┣━ <v>enclosing_rectangle</v>
┣━ <v>equivalent</v>
┣━ <v>interior_angles2</v>
┣━ <v>intersection</v>
┣━ <v>magnitude</v>
┣━ <v>make_matrix2_inverse</v>
┣━ <v>make_matrix2_reflection</v>
┣━ <v>make_matrix2_rotation</v>
┣━ <v>make_regular_polygon</v>
┣━ <v>midpoint</v>
┣━ <v>multiply_line_matrix2</v>
┣━ <v>multiply_matrices2</v>
┣━ <v>multiply_vector2_matrix2</v>
┣━ <v>normalize</v>
┣━ <v>parallel</v>
┣━ <v>signed_area</v>
┣━ <v>split_convex_polygon</v>
┗━ <v>split_polygon</v>
</code></pre>		
	</div>	
	<p>This is the core of the math library. <b>It's recommended you use the objects like Vector, Polygon, and use their property methods.</b> There's no type checking in the core; it was built for speed. However if you follow the correct parameter types this is where the fast math operations are housed.</p>

	<h3>Convert</h3>
	<div class="centered">
		<pre class="compact"><code><f>RabbitEar</f>.convert
┃
┣━ <v>intoFOLD</v>
┣━ <v>intoORIPA</v>
┗━ <v>intoSVG</v>
</code></pre>		
	</div>	
	<p>Convenient methods to convert between file formats. the SVG into FOLD conversion will interpret as best as possible with regards to mountain/valley assignment, epsilon range for not-exactly-perfect line endpoints.</p>

	<h3>SVG</h3>
	<div class="centered">
		<pre class="compact"><code><f>RabbitEar</f>.svg
┃
┃	<c>// drawing</c>
┣━ <v>svg</v>
┣━ <v>group</v>
┣━ <v>arc</v>
┣━ <v>bezier</v>
┣━ <v>circle</v>
┣━ <v>ellipse</v>
┣━ <v>line</v>
┣━ <v>polygon</v>
┣━ <v>polyline</v>
┣━ <v>rect</v>
┣━ <v>regularPolygon</v>
┣━ <v>text</v>
┣━ <v>wedge</v>
┃
┃	<c>// viewbox</c>
┣━ <v>convertToViewBox</v>
┣━ <v>getViewBox</v>
┣━ <v>scaleViewBox</v>
┣━ <v>setViewBox</v>
┣━ <v>translateViewBox</v>
┃
┃	<c>// additional</c>
┣━ <v>save</v>
┣━ <v>load</v>
┣━ <v>setArc</v>
┣━ <v>setPoints</v>
┣━ <v>removeChildren</v>
┃
┃	<c>// events</c>
┣━ <v>image</v>
┗━ <v>controls</v></code></pre>
	</div>
	<p>Rabbt Ear uses SVG as its primary method of rendering origami. This container is its own fully-functioning creative coding library. Much care was taken to incorporate events and touch handling.</p>

</section>

<section>
	<h2>Origami Objects</h2>
	<h3>CreasePattern</h3>
	<p>a digital representation of an origami design; an extended FOLD file format</p>
	<h3>Origami</h3>
	<p>a union of a CreasePattern object, SVG visualization, and interactive touch handling</p>
	<p>The dependency tree for shapes in the SVG</p>
	<div class="centered">
		<pre class="compact"><code>&lt;<key>svg</key>&gt;
┃
┣━ &lt;<key>group</key>&gt; (boundary)
┃    ┗━ &lt;<key>polygon</key>&gt;
┃
┣━ &lt;<key>group</key>&gt; (faces)
┃    ┣━ &lt;<key>polygon</key>&gt;
┃    ┣━ &lt;<key>polygon</key>&gt;
┃    ┗━ ...
┃
┣━ &lt;<key>group</key>&gt; (creases)
┃    ┣━ &lt;<key>line</key>&gt;
┃    ┣━ &lt;<key>line</key>&gt;
┃    ┗━ ...
┃
┣━ &lt;<key>group</key>&gt; (vertices)
┃    ┣━ &lt;<key>circle</key>&gt;
┃    ┣━ &lt;<key>circle</key>&gt;
┃    ┗━ ...</code></pre>
	</div>	
</section>
<!-- 
<section>
	<h2>Math Objects</h2>
	<h3>Vector</h3>
	<h3>Matrix2</h3>
	<h3>Line</h3>
	<h3>Edge</h3>
	<h3>Ray</h3>
	<h3>Polygon</h3>
	<h3>ConvexPolygon</h3>
	<h3>Rectangle</h3>
	<h3>Circle</h3>
	<h3>Junction</h3>
	<h3>Sector</h3>
	<h3>Graph</h3>
</section>
 -->
<?php include 'footer.php';?>
