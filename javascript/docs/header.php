<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script language="javascript" type="text/javascript" src="../lib/jquery-3.1.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../lib/jquery-ui.min.js"></script>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/graph.js"></script>
<script language="javascript" type="text/javascript" src="../src/planarGraph.js"></script>
<script language="javascript" type="text/javascript" src="../src/creasePattern.js"></script>
<script language="javascript" type="text/javascript" src="../render.js"></script>
<link href="https://fonts.googleapis.com/css?family=Cormorant:300,500,700" rel="stylesheet">
<link href="../dist/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
<link href="style.css" rel="stylesheet" />
</head>
<body>
	<nav>
		<ul>
		<li><a href="../editor/" class="link-fa"><i class="fa fa-chevron-left fa-lg back-arrow"></i><i class="fa fa-pencil-square-o fa-2x"></i></a></li>
		<li class="dropdown">
			<a href="/" class="dropbtn">INTRO</a>
			<div class="dropdown-content">
			<a href="/">WELCOME</a>
			<a href="download.php">DOWNLOAD</a>
			</div>
		</li>
		<li>
			<a href="graph.php" class="dropbtn">I. GRAPH</a>
		</li>
		<li class="dropdown">
			<a href="javascript:void(0)" class="dropbtn">II. PLANAR GRAPH</a>
			<div class="dropdown-content">
			<a href="addedge.php">CREASE</a>
			<a href="cleanup.php">CLEAN</a>
			<a href="intersections.php">INTERSECTIONS</a>
			<a href="chop.php">CHOP</a>
			<a href="face.php">FACE</a>
			<a href="select.php">NEIGHBORS</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="javascript:void(0)" class="dropbtn">III. CREASE PATTERN</a>
			<div class="dropdown-content">
			<a href="">PLACEHOLDER</a>
			</div>
		</li>
		</ul>
	</nav>