<?php include 'header.php';?>

<section id="cleanup">
	<h2><a href="#cleanup">Clean</a></h2>
	<div class="accordion">
		<div>
			<p>Clean does a few things:</p>
			<p>First, it removes any redundant edges (when 2 or more edges join between the same nodes).</p>
			<p>Secondly, because this is a planar graph, it is able to remove redundant nodes when 2 or more nodes exist at the same location in space.</p>
			<p>Due to floating point precision, points are determined to be redundant when the are close enough to a certain floating point precision.</p>
		</div>
	</div>

	<pre><code>graph.<span class="token function">clean</span>()</code></pre>
	<pre><code>graph.<span class="token function">mergeDuplicateVertices</span>()    <span class="token comment">//calling clean() will automatically call this</span></code></pre>
</section>

<!-- include .js sketches -->
<?php include 'footer.php';?>