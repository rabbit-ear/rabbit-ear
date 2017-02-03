<?php include 'header.php';?>

<section id="chop">
	<h2>Chopping</h2>
	<div class="accordion">
		<p>Avoid crossing lines. Get the the X &amp; Y of the intersection:</p>
	</div>

	<div class="centered">
		<pre><code>graph.<span class="token function">chop</span>()</code></pre>
	</div>

	<div class="centered p5sketch" id="divTest06"></div>
	<p class="quote">press and hold</p>

	<div class="centered">
		<pre><code>graph.<f>edgesIntersect</f>(<span class="token argument" id="spanEdgeIntersect1"> edge1</span>,<span class="token argument" id="spanEdgeIntersect2"> edge2 </span>)</code></pre>
	</div>
	<p>the goal is to turn any overlapping lines into segments, adding the point of intersection between them</p>
</section>

<section id="chop">
	<div class="centered p5sketch" id="divTest07"></div>
	<div class="centered">
		<pre><code><c></c><n><span class="span_intersection_count"></span></n></code></pre>
	</div>
	<div class="accordion">
		<pre><code class="span_more_intersections"></code></pre>
	</div>
</section>


<script language="javascript" type="text/javascript" src="../tests/planarGraph/06_chop.js"></script>
<script language="javascript" type="text/javascript" src="../tests/planarGraph/07_chop_many.js"></script>
<script>
	$(".accordion-title").html("MORE");
	var p506 = new p5(test06, 'divTest06');
	var p507 = new p5(test07, 'divTest07');

	$("#spanEdgeIntersect1").mouseenter(function(){ p506.setHighlight1(true); })
	                        .mouseleave(function(){ p506.setHighlight1(false); });
	$("#spanEdgeIntersect2").mouseenter(function(){ p506.setHighlight2(true); })
	                        .mouseleave(function(){ p506.setHighlight2(false); });

	p507.callback = function(intersections){
		if(intersections != undefined){
			var count = intersections.length;
			if(count != undefined){
				$('.span_intersection_count').html( parseInt(count) );
				var text = "[";
				for(var i = 0; i < intersections.length; i++){
					text += '{' + intersections[i].x + ',' + intersections[i].y + '}, '
				}
				text += "]";
				$('.span_more_intersections').html(text);
			}
		}
		else if(intersections == undefined){
			$('.span_intersection_count').html("");
			// $('.span_more_intersections').html("");
		}
	}
</script>

<?php include 'footer.php';?>