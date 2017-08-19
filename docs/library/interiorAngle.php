<?php include 'header.php';?>

<div class="centered">
	<pre><code class="centered"><h3><v>InteriorAngle</v></h3></code></pre>
</div>

<div class="quote">
	<p>This is a class that represents the space between two adjacent planar edges.</p>
</div>

<h2>Class Properties</h2>
<div class="centered">
<pre><code>edges:[<v>PlanarEdge</v>,<v>PlanarEdge</v>]<br>node:<v>PlanarNode</v><br>angle:<f>number</f></code></pre>
</div>

<h2>Class Methods</h2>
<div class="centered">
<pre><code><f>constructor</f>(<arg>edge1</arg>:<v>PlanarEdge</v>, <arg>edge2</arg>:<v>PlanarEdge</v>)</code></pre>
</div>

<div class="quote">
	<p>Calling the constructor will:</p>
	<p>• find the node in common<br>• calculate the interior angle</p>
	<p>the interior angle is in the clockwise direction from the first edge to the second edge in the order supplied in the constructor.</p>
</div>

<?php include 'footer.php';?>