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
			set.each("isSpark", function(spark) {
				cx.fillStyle = "#f00";
				cx.fillRect(spark.location.x, spark.location.y, 4, 4);
			});
		};
			   
		function RocketRenderSystem(set, cx) {
			set.each("isRocket", function(rocket) {
				cx.fillStyle = "#88f";
				cx.fillRect(rocket.location.x, rocket.location.y, 12, 12);
			});
		};
		
		function RocketTrailSystem(set) {
			set.each("isRocket", function(rocket) {
				if(Math.random() < 0.5) {
					var spark = new Entities.Entity();
					spark.location = new Entities.Location(rocket.location.x, rocket.location.y);
					// Sparks are made to radiate out
					spark.velocity = new Entities.Velocity(rocket.velocity.x + (Math.random()*2 - 1), rocket.velocity.y * 0.5);
					spark.timer = new Entities.Timer(1);
					spark.isSpark = true;
					set.add(spark);
				}
			});
		};
		
		function RocketDetonationSystem(set) {
			   set.each(function(entity) {
					if (entity.isRocket && entity.timer.countdown == 0) {
						// Randomly make n^2 sparks where 4 <= n <= 8
						var baseNumber = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
						var particleCount = baseNumber * baseNumber;
						var radianIncrement = 2 * Math.PI / (particleCount);
					
						for(var i = 0; i < (particleCount - 1); i++) {
							var spark = new Entities.Entity();
                            spark.location = new Entities.Location(entity.location.x, entity.location.y);
							// Sparks are made to radiate out
                            spark.velocity = new Entities.Velocity(entity.velocity.x + (2 * Math.cos(radianIncrement * i)), entity.velocity.y + (2 * Math.sin(radianIncrement * i)));
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
			RocketRenderSystem: RocketRenderSystem,
			PhysicsSystem: PhysicsSystem,
			GravitySystem: GravitySystem,
			RocketTrailSystem: RocketTrailSystem,
			RocketDetonationSystem: RocketDetonationSystem
		});
	});
	
});
