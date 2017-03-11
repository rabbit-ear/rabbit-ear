<?php include 'header.php';?>

<h1>Chop</h1>
<section id="chop">
	<h2>edgesIntersect</h2>
	<div class="accordion">
		<p>Chopping will scan the entire graph for intersecting edges, chop lines at these segments so that no edges are overlapping.</p>
	</div>

	<div class="centered">
		<pre><code><span id="chop-1-result"></span><span class="comment-rest">graph.<f>edgesIntersect</f>(<n><span class="token argument" id="spanEdgeIntersect1">0</span></n>,<n><span class="token argument" id="spanEdgeIntersect2">1</span></n>)</span></code></pre>
	</div>

	<div class="centered p5sketch" id="divTest06"></div>
	<p class="quote">press and hold</p>

	<div class="centered">
		<pre><code>graph.<span class="token function">chop</span>()</code></pre>
	</div>

	<p>the goal is to turn any overlapping lines into segments, adding the point of intersection between them</p>
</section>

<section id="chop">
	<div class="centered p5sketch" id="divTest07"></div>

	<div class="centered">
		<p style="font-family:monospace; font-size:2.5em; margin-top:0"><span id="span_intersection_count">0</span> intersections</p>
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

	$("#spanEdgeIntersect1").mouseenter(function(){ 
								p506.setHighlight1(true);
								$("#spanEdgeIntersect2").css('color', '#F00');
							})
							.mouseleave(function(){ 
								p506.setHighlight1(false); 
								$("#spanEdgeIntersect2").css('color', '#AE81FF');
							});
	$("#spanEdgeIntersect2").mouseenter(function(){ 
								p506.setHighlight2(true); 
								$("#spanEdgeIntersect2").css('color', '#F00');
							})
							.mouseleave(function(){ 
								p506.setHighlight2(false); 
								$("#spanEdgeIntersect2").css('color', '#AE81FF');
							});

	p506.callback = function(intersection){
		if(intersection == undefined){ 

			$(".comment-rest").css('opacity', '0.4');
			$("#span-result-arrow").css('opacity', '0.4');
			// $("#spanEdgeIntersect1").html("0");
			// $("#spanEdgeIntersect2").html("1");
			// $("#chop-1-result").html("");
		}
		else{
			$(".comment-rest").css('opacity', '1.0');
			$("#spanEdgeIntersect1").html(intersection.e1);
			$("#spanEdgeIntersect2").html(intersection.e2);
			$("#chop-1-result").html("{x:<n>" + (intersection.x).toFixed(2) + "</n>, y:<n>" + (intersection.y).toFixed(2) + "</n>}<span id='span-result-arrow'> ← </span>");
		}
	}

	p507.callback = function(intersections){
		if(intersections != undefined){
			var count = intersections.length;
			if(count != undefined){
				$('#span_intersection_count').html( parseInt(count) );
				var text = "[";
				for(var i = 0; i < intersections.length; i++){
					text += '{' + intersections[i].x + ',' + intersections[i].y + '},'
				}
				text += "]";
				$('.span_more_intersections').html(text);
			}
		}
		else if(intersections == undefined){
			$('#span_intersection_count').html("0");
			// $('.span_more_intersections').html("");
		}
	}
</script>

<?php include 'footer.php';?>