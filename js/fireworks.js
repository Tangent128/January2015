var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
    function SparkPhysicsSystem(set) {
        set.each(function(spark) {
           spark.location.x += spark.velocity.x;
           spark.location.y += spark.velocity.y;
        });
    };
                 
	function SparkRenderSystem(set, cx) {
		set.each(function(spark) {
			cx.fillStyle = "#f00";
			cx.fillRect(spark.location.x, spark.location.y, 16, 16);
		});
	};
	
	/* Exports */
	loaded("Fireworks").resolve({
                                SparkRenderSystem: SparkRenderSystem,
                                SparkPhysicsSystem: SparkPhysicsSystem
                                       });
	
});
