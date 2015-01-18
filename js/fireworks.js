var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
	function GravitySystem(set, g) {
		set.each(function(entity) {
			entity.velocity.y += g;
		});
    };
	
	function PhysicsSystem(set) {
		set.each("velocity", function(entity) {
			entity.location.x += entity.velocity.x;
			entity.location.y += entity.velocity.y;
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
		PhysicsSystem: PhysicsSystem,
		GravitySystem: GravitySystem
	});
	
});
