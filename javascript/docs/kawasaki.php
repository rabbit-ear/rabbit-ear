<?php include 'header.php';?>

<h1>Kawasaki's Theorem</h1>
<section id="cleanup">
	
	<h2>Flat foldable around a point</h2>


	<div id="divP5_kawasaki_3" class="centered p5sketch" style="margin-bottom:1em;"></div>
	<div class="centered">
		<pre style="min-width:240px; margin-top:0"><code id="kawasaki-3-halves"></code></pre>
	</div>
	<div class="centered">
		<p><em>press to reset</em></p>
	</div>


	<p>For a unit to be flat foldable, the sum of even and odd pairings of angles must each add up to 180 degrees</p>

	<div id="divP5_kawasaki_4" class="centered p5sketch" style="margin-bottom:1em;"></div>
	<div class="centered">
		<pre style="min-width:240px; margin-top:0"><code id="kawasaki-4-code"></code></pre>
	</div>



	<div id="divP5_kawasaki_2" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code><span id="kawasaki-2-result"></span> ⬅︎ <span class="comment-rest">cp.<f>kawasaki</f>(<n><span class="token argument" id="spanEdgeIntersect1">0</span></n>)</span></code></pre>
	</div>

	<div class="centered">
		<pre><code><span id="kawasaki-2-halves"></span></code></pre>
	</div>

</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/creasePattern/02_kawasaki.js"></script>
<script language="javascript" type="text/javascript" src="../tests/creasePattern/03_kawasaki.js"></script>
<script language="javascript" type="text/javascript" src="../tests/creasePattern/04_kawasaki.js"></script>

<script>
	var p5b = new p5(_02_kawasaki, 'divP5_kawasaki_2');
	p5b.callback = function(data){
		var string1 = '';
		if(data != undefined){
			string1 += '[';
			for(var i = 0; i < data.length; i++){
				var deg = parseInt(data[i].arc * 180 / Math.PI);
				string1 += deg + '°';
				if(i != data.length-1){
					string1 += ', ';
				}
			}
			string1 += ']';
		}
		$("#kawasaki-2-result").html(string1);
		var stringEven = '';
		var stringOdd = '';
		var sumEven = 0;
		var sumOdd = 0;
		if(data != undefined){
			for(var i = 0; i < data.length; i+=2){
				var deg = data[i].arc * 180 / Math.PI;
				sumEven += deg;
				stringEven += parseInt(deg) + '°';
				if(i < data.length-2){
					stringEven += ' + ';
				}
			}
			stringEven += " = " + sumEven + "°";
			for(var i = 1; i < data.length; i+=2){
				var deg = data[i].arc * 180 / Math.PI;
				sumOdd += deg;
				stringOdd += parseInt(deg) + '°';
				if(i < data.length-2){
					stringOdd += ' + ';
				}
			}
			stringOdd += " = " + sumOdd + "°";
		}
		$("#kawasaki-2-halves").html(stringEven + "<br>" + stringOdd);
	}

	var p5c = new p5(_03_kawasaki, 'divP5_kawasaki_3');
	p5c.callback = function(data){
		var stringEven = '<span style="color:#FF0000">';
		var stringOdd = '<span style="color:#677eff">';  // 3c5aff
		var sumEven = 0;
		var sumOdd = 0;
		if(data != undefined){
			for(var i = 0; i < data.length; i+=2){
				var deg = data[i].arc * 180 / Math.PI;
				sumEven += deg;
				stringEven += deg.toFixed(1) + '°';
				if(i < data.length-2){
					stringEven += '</span> + <span style="color:#FF0000">';
				}
			}
			stringEven += "</span> = " + sumEven.toFixed(1) + "°";
			for(var i = 1; i < data.length; i+=2){
				var deg = data[i].arc * 180 / Math.PI;
				sumOdd += deg;
				stringOdd += deg.toFixed(1) + '°';
				if(i < data.length-2){
					stringOdd += '</span> + <span style="color:#677eff">';
				}
			}
			stringOdd += "</span> = " + sumOdd.toFixed(1) + "°";
		}
		$("#kawasaki-3-halves").html(stringEven + "<br>" + stringOdd);
	}

	var p5d = new p5(_04_kawasaki, 'divP5_kawasaki_4');
	p5d.callback = function(data){
		var stringEven = '<span style="color:#FF0000">';
		var stringOdd = '<span style="color:#677eff">';  // 3c5aff
		var sumEven = 0;
		var sumOdd = 0;
		if(data != undefined){
			for(var i = 0; i < data.length; i+=2){
				var deg = data[i].arc * 180 / Math.PI;
				sumEven += deg;
				stringEven += deg.toFixed(1) + '°';
				if(i < data.length-2){
					stringEven += '</span> + <span style="color:#FF0000">';
				}
			}
			stringEven += "</span> = " + sumEven.toFixed(1) + "°";
			for(var i = 1; i < data.length; i+=2){
				var deg = data[i].arc * 180 / Math.PI;
				sumOdd += deg;
				stringOdd += deg.toFixed(1) + '°';
				if(i < data.length-2){
					stringOdd += '</span> + <span style="color:#677eff">';
				}
			}
			stringOdd += "</span> = " + sumOdd.toFixed(1) + "°";
		}
		$("#kawasaki-4-code").html(stringEven + "<br>" + stringOdd);
	}

</script>

<?php include 'footer.php';?>