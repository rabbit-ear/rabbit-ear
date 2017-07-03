	</div> <!-- main-content (header.php) -->

	<script>
	$( function() {
		$( ".accordion" ).accordion({
			active: false,
			collapsible: true
		});
	} );
	$('.accordion').each(function(i, obj) {
		obj.innerHTML = '<h3>● EXPLAIN ●</h3>' + obj.innerHTML;
	});
	</script>


</body>
</html>