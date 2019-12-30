<?php include 'header.php';?>

<h1>APPENDIX</h1>

<section id="types">
	<h3>Contents</h3>
	<!-- <p>This library contains a growing list of about ten primitives.</p> -->
	<div class="centered code">
		<pre class="compact"><code><f>RabbitEar</f>
┃
┣━ <v>Vector</v>
┣━ <v>Matrix</v>
┣━ <v>Line</v>
┣━ <v>Ray</v>
┣━ <v>Edge</v>
┣━ <v>Junction</v>
┣━ <v>Sector</v>
┣━ <v>Rectangle</v>
┣━ <v>Circle</v>
┣━ <v>Polygon</v>
┣━ <v>ConvexPolygon</v>
┗━ math</code></pre>
	</div>

	<p>The top level contains math objects. These are intended to be convient to the coder. The core contains a lot of the actual algorithms built for speed, it's not mean to be convient.</p>

	<div class="centered code">
		<pre class="compact"><code><f>RabbitEar</f>.math
┃
┣━ <v>average</v>
┣━ <v>bisect_lines2</v>
┣━ <v>bisect_vectors</v>
┣━ <v>centroid</v>
┣━ <v>clockwise_angle2</v>
┣━ <v>convex_hull</v>
┣━ <v>convex_polygon_is_enclosed</v>
┣━ <v>convex_polygons_enclose</v>
┣━ <v>convex_polygons_overlap</v>
┣━ <v>counter_clockwise_angle2</v>
┣━ <v>cross</v>
┣━ <v>degenerate</v>
┣━ <v>distance</v>
┣━ <v>dot</v>
┣━ <v>enclosing_rectangle</v>
┣━ <v>equivalent</v>
┣━ <v>interior_angles</v>
┣━ <v>intersection</v>
┣━ <v>is_counter_clockwise_between</v>
┣━ <v>magnitude</v>
┣━ <v>make_regular_polygon</v>
┣━ <v>midpoint2</v>
┣━ <v>nearest_point</v>
┣━ <v>normalize</v>
┣━ <v>parallel</v>
┣━ <v>point_in_poly</v>
┣━ <v>point_in_convex_poly</v>
┣━ <v>point_in_convex_poly_exclusive</v>
┣━ <v>point_on_line</v>
┣━ <v>point_on_segment</v>
┣━ <v>segment_segment_overlap</v>
┣━ <v>signed_area</v>
┣━ <v>split_convex_polygon</v>
┣━ <v>split_polygon</v>
┣━ <v>subsect</v>
┣━ <v>transpose_matrix4</v>
┗━ ...</code></pre>
</div>


</section>


<h2 id="svg">SVG</h2>

insert cool svg interactive thing

<p>attributes are the lowest precident level.</p>

<pre><code>
1. attributes
2. css stylesheet <b>&lt;style&gt;</b>
2. inline style <b>style="stroke:black;"</b>
</code></pre>


<h2 id="library">Library Structure</h2>

<section>
	<div class="centered code">
		<pre class="compact"><code><f>RabbitEar</f>
┃
┃ <c>// containers</c>
┣━ bases
┣━ math
┣━ convert
┣━ svg
┣━ core
┃
┃ <c>// origami</c>
┣━ <v>CreasePattern</v>
┣━ <v>Origami</v>
┃
┃ <c>// math</c>
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
┗━ <v>Graph</v></code></pre>
</div>

	<p>Capitalized entries are objects you can create, lowercase are subfolders with either objects or more levels inside them.</p>

	<div class="diptych code">
		<pre><code><f>RabbitEar</f></code></pre>
		<pre><code><f>RE</f></code></pre>
	</div>

	<p>This namespace is under both <b>RabbitEar</b> and <b>RE</b> for short. They're interchangeable</p>
</section>

<section>

	<h2>Containers</h2>
	<ul>
		<li><b>bases</b>: traditional origami bases in FOLD format</li>
		<li><b>convert</b>: methods for converting between file types</li>
		<li><b>math</b>: a decent-sized linear algebra and geometry library</li>
		<li><b>svg</b>: a mini creative coding library for drawing SVG</li>
		<li><b>core</b>: the brains of the library, the algorithms behind the origami operations operating primarily on FOLD objects</li>
	</ul>

graft() // combines two fold files
stripGraft()
stretch

	<h3 id="bases">Bases</h3>

	<div class="centered code">
		<pre class="compact"><code><f>RabbitEar</f>.bases
┃
┣━ square
┣━ kite
┣━ fish
┣━ bird
┣━ frog
┣━ blintz
┃
┗━ make
    ┃
    ┣━ <f>polygon</f>(<arg>sides</arg>)
    ┣━ <f>triangleGrid</f>(<arg>count</arg>)
    ┣━ <f>squareGrid</f>(<arg>count</arg>)
    ┣━ <f>rectangleGrid</f>(<arg>countX</arg>, <arg>countY</arg>)
    ┗━ <f>hexGrid</f>(<arg>sides</arg>)
</code></pre>
	</div>

	<p>Traditional origami bases are available in FOLD format.</p>

	<div class="centered code">
		<pre class="compact"><code>cp <key>=</key> <f>RabbitEar</f>.bases.bird</code></pre>
	</div>

	<p>The "make" category contains functions which <b>generate</b> FOLD objects, they are not FOLD objects themselves.</p>

	<div class="centered code">
		<pre class="compact"><code>cp <key>=</key> <f>RabbitEar</f>.bases.make.<f>polygon</f>(<n>5</n>)</code></pre>
	</div>

	<h3 id="convert">Convert</h3>
	<div class="centered code">
		<pre class="compact"><code><f>RabbitEar</f>.convert
┃
┣━ <f>toFOLD</f>(<arg>input</arg>, <arg>callback</arg>)
┣━ <f>toORIPA</f>(<arg>input</arg>, <arg>callback</arg>)
┗━ <f>toSVG</f>(<arg>input</arg>, <arg>callback</arg>)
</code></pre>
	</div>	
	<p>Convenient methods to convert between file formats. the SVG into FOLD conversion will interpret as best as possible with regards to mountain/valley assignment, epsilon range for not-exactly-perfect line endpoints.</p>

	<h3 id="math">Math</h3>
	<div class="centered code">
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
┣━ <v>invert_matrix2</v>
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

	<h3 id="svg">SVG</h3>
	<div class="centered code">
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
	<h3 id="crease-pattern">CreasePattern</h3>
	<p>a digital representation of an origami design; an extended FOLD file format</p>
	<h3 id="origami">Origami</h3>
	<p>a union of a CreasePattern object, SVG visualization, and interactive touch handling</p>
	<p>The dependency tree for shapes in the SVG</p>
	<div class="centered code">
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
