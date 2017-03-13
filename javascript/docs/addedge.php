<?php include 'header.php';?>

<h1>Crease</h1>
<section id="planar-graph">
<h2>addEdgeWithVertices</h2>
	<div id="divP5_drag" class="centered p5sketch"></div>
	<div class="centered">click and drag</div>

	<div class="centered">
		<pre><code>graph.<v>addEdgeWithVertices</v>( <span id="var1">x1</span>, <span id="var2">y1</span>, <span id="var3">x2</span>, <span id="var4">y2</span> );</code></pre>
	</div>
	<div class="accordion">
		<p>A good way to think about creases is that they are lines connected by 2 points.</p>
	</div>

<h2>addEdgeFromVertex</h2>
	<h3>to the most recently added point</h3>
	<div id="divP5_snake" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code>graph.<v>addEdgeFromVertex</v>( graph.nodes.<f>length</f>-<n>1</n>, <span id="var5">x</span>, <span id="var6">y</span> );</code></pre>
	</div>

	<h3>to the first point</h3>
	<div id="divP5_radial" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code>graph.<v>addEdgeFromVertex</v>( <n>0</n>, <span id="var7">x</span>, <span id="var8">y</span> );</code></pre>
	</div>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/planarGraph/03_add_nodes_drag.js"></script>
<script language="javascript" type="text/javascript" src="../tests/planarGraph/03_add_nodes_snake.js"></script>
<script language="javascript" type="text/javascript" src="../tests/planarGraph/03_add_nodes_radial.js"></script>
<script>
	var p5a = new p5(_03_add_nodes_drag, 'divP5_drag');
	var p5b = new p5(_03_add_nodes_snake, 'divP5_snake');
	var p5c = new p5(_03_add_nodes_radial, 'divP5_radial');

	p5a.callback = function(e){
		if(e == undefined){
			$('#var1').html('x1');
			$('#var2').html('y1');
			$('#var3').html('x2');
			$('#var4').html('y2');
			$("#var1").removeClass("n");
			$("#var2").removeClass("n");
			$("#var3").removeClass("n");
			$("#var4").removeClass("n");
		}
		else{
			if(e.start.x == undefined || e.start.y == undefined){
				$('#var1').html('x1');
				$('#var2').html('y1');
				$("#var1").removeClass("n");
				$("#var2").removeClass("n");
			} else{
				$('#var1').html( (e.start.x).toFixed(2) );
				$('#var2').html( (e.start.y).toFixed(2) );
				$("#var1").addClass("n");
				$("#var2").addClass("n");
			}

			if(e.end.x == undefined || e.end.y == undefined){
				$('#var3').html('x2');
				$('#var4').html('y2');
				$("#var3").removeClass("n");
				$("#var4").removeClass("n");
			} else{
				$('#var3').html( (e.end.x).toFixed(2) );
				$('#var4').html( (e.end.y).toFixed(2) );
				$("#var3").addClass("n");
				$("#var4").addClass("n");
			}
		}
	};

	p5b.callback = function(e){
		if(e == undefined){
			$('#var5').html('x');
			$('#var6').html('y');
			$("#var5").removeClass("n");
			$("#var6").removeClass("n");
		}
		else{
			if(e.end.x == undefined || e.end.y == undefined){
				$('#var5').html('x');
				$('#var6').html('y');
				$("#var5").removeClass("n");
				$("#var6").removeClass("n");
			} else{
				$('#var5').html( (e.end.x).toFixed(2) );
				$('#var6').html( (e.end.y).toFixed(2) );
				$("#var5").addClass("n");
				$("#var6").addClass("n");
			}
		}
	};

	p5c.callback = function(e){
		if(e == undefined){
			$('#var7').html('x');
			$('#var8').html('y');
			$("#var7").removeClass("n");
			$("#var8").removeClass("n");
		}
		else{
			if(e.end.x == undefined || e.end.y == undefined){
				$('#var7').html('x');
				$('#var8').html('y');
				$("#var7").removeClass("n");
				$("#var8").removeClass("n");
			} else{
				$('#var7').html( (e.end.x).toFixed(2) );
				$('#var8').html( (e.end.y).toFixed(2) );
				$("#var7").addClass("n");
				$("#var8").addClass("n");
			}
		}
	};

</script>

<?php include 'footer.php';?>