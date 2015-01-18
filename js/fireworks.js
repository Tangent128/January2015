var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
	loaded("Entities").then(function(Entities) {
		function GravitySystem(set, g) {
			set.each("velocity", function(entity) {
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
			   
		function RocketDetonationSystem(set) {
			   set.each(function(entity) {
					if (entity.isRocket && entity.timer.countdown == 0) {
						// Randomly make n^2 sparks where 4 <= n <= 8
						var baseNumber = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
						var particleCount = baseNumber * baseNumber;
						var radianIncrement = Math.PI / (particleCount);
					
						for(var i = 0; i < (particleCount - 1); i++) {
							var spark = new Entities.Entity();
							spark.location = {};
							spark.velocity = {};
							spark.location.x = entity.location.x;
							spark.location.y = entity.location.y;
							// Sparks are made to radiate out
							spark.velocity.x = entity.velocity.x + (2 * Math.cos(radianIncrement * i));
							spark.velocity.y = entity.velocity.y + (2 * Math.sin(radianIncrement * i))
							// Die in 3 seconds
							spark.timer = new Entities.Timer(3);
							spark.isSpark = true;
							set.add(spark);
						}
					}
				});
		};
			   
		
		/* Exports */
		loaded("Fireworks").resolve({
			SparkRenderSystem: SparkRenderSystem,
			PhysicsSystem: PhysicsSystem,
			GravitySystem: GravitySystem,
			RocketDetonationSystem: RocketDetonationSystem
		});
	});
	
});
