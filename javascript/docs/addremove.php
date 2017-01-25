<?php include 'header.php';?>

<section id="planar-graph">
<h2>Generate Creases</h2>
	<div class="accordion">
		<p>Add creases by adding their endpoints or add a crease using an existing crease for positioning.</p>
	</div>

	<div id="divTest03_drag" class="centered p5sketch"></div>
	<div class="centered">click and drag</div>

	<pre><code>graph.<span class="token function">addEdgeWithVertices</span>( <span id="var1">x1</span>, <span id="var2">y1</span>, <span id="var3">x2</span>, <span id="var4">y2</span> );</code></pre>

	<div class="third p5sketch" id="divTest01"></div>
	<div class="third p5sketch" id="divTest02"></div>
	<div class="third p5sketch" id="divTest03"></div>

	<pre><code><span id="spanAddEdge1">graph.<span class="token function">addEdgeWithVertices</span>( x1, y1, x2, y2 )</span>    <span class="token comment">//(float, float, float, float)</span><br><span id="spanAddEdge2">graph.<span class="token function">addEdgeFromVertex</span>( firstNodeIndex, x, y )</span>    <span class="token comment">//(uint, float, float)</span><br><span id="spanAddEdge3">graph.<span class="token function">addEdgeFromVertex</span>( lastNodeIndex, x, y )</span>    <span class="token comment">//(uint, float, float)</span></code></pre>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/03_add_nodes.js"></script>
<script language="javascript" type="text/javascript" src="../tests/03_add_nodes_drag.js"></script>
<script language="javascript" type="text/javascript" src="../tests/03_add_nodes_03.js"></script>
<script>
	var p501 = new p5(test03, 'divTest01');
	p501.pattern = 0;
	var p502 = new p5(test03, 'divTest02');
	p502.pattern = 1;
	var p503 = new p5(test03, 'divTest03');
	p503.pattern = 2;
	var p503_drag = new p5(test03_drag, 'divTest03_drag');

	var callback = function(e){
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

	p503_drag.callback = callback;

	$("#spanAddEdge1").mouseenter(function(){ p501.setHighlight(true); })
	                  .mouseleave(function(){ p501.setHighlight(false); });
	$("#spanAddEdge2").mouseenter(function(){ p502.setHighlight(true); })
	                  .mouseleave(function(){ p502.setHighlight(false); });
	$("#spanAddEdge3").mouseenter(function(){ p503.setHighlight(true); })
	                  .mouseleave(function(){ p503.setHighlight(false); });
</script>

<?php include 'footer.php';?>