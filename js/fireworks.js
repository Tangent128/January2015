var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
	function SparkRenderSystem(set, cx) {
		set.each(function(spark) {
			cx.fillStyle = "#f00";
			cx.fillRect(spark.x, spark.y, 16, 16);
		});
	};
	
	/* Exports */
	loaded("Fireworks").resolve({
		SparkRenderSystem: SparkRenderSystem
	});

	
});
