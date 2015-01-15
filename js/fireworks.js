var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
	function SparkRenderSystem(set, cx) {
		set.each(function(spark) {
			cx.fillStyle = "#f00";
            spark.location.x += spark.velocity.x;
            spark.location.y += spark.velocity.y;
			cx.fillRect(spark.location.x, spark.location.y, 16, 16);
		});
	};
	
	/* Exports */
	loaded("Fireworks").resolve({
		SparkRenderSystem: SparkRenderSystem
	});

	
});
