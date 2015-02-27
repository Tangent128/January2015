var _5gon = _5gon || [];
_5gon.push(function(loaded) {

           
    loaded("$", "Entities").then(function($, Entities) {
	/* Components */
	   
    function Sprite(img, size, angle) {
		this.img = img;
		this.size = size;
		this.angle = 0;
    }
	   
	/* Helper Functions */

    function PhysicsObject(sprite) {
		Entities.Entity.call(this);
		this.location = new Entities.Location(0,0);
		this.velocity = new Entities.Velocity(0,0);
		this.size = 50;
		this.sprite = sprite;
		this.gScale = 1;
    };
    
    function spawnAsteroid(objects, location, image, size) {
        var spawnAngle = (Math.random()) * (Math.PI * 2);
		var asteroid = new PhysicsObject(new Sprite(image, size || 50, spawnAngle));
		   
		asteroid.location = location;
        asteroid.angle = spawnAngle;
		asteroid.velocity.x = Math.cos(asteroid.angle) * 1;
		asteroid.velocity.y = Math.sin(asteroid.angle) * 1;
		   
		asteroid.isAsteroid = true;
		   
		objects.add(asteroid);
    };
	   
    function spawnShip(objects, location, image, size) {
		var ship = new PhysicsObject(new Sprite(image, size || 50, 0));
		   
		ship.location = location;
		//ship.sprite.angle = rand(Math.PI * 2);
		ship.velocity.x = 0;
		ship.velocity.y = 0;
		ship.gScale = 1;
		   
		ship.angle = 0;
		ship.thrust = 0;
		
		ship.attackTarget = null;
		
		ship.cooldown = 0;
		   
		ship.isShip = true;
		   
		objects.add(ship);

		//return ship;
    }
	   
	// TODO: use entity.js timer/dieOnTimeout components for lifespan instead
    function spawnBullet(objects, location, image, angle, size) {
		var bullet = new PhysicsObject(new Sprite(image, size || 50, angle));
		bullet.location = location;
		// This will now be retrieved from the sprite
		//bullet.angle = angle;
		bullet.velocity.x = 75 * Math.sin(angle);
		bullet.velocity.y = 75 * Math.cos(angle);
		bullet.think = bulletThink;
		bullet.gScale = 0;
		   
		bullet.isBullet = true;
		   
		bullet.lifespan = 3.5;
		   
		objects.add(bullet);
    }
                                 
    function spawnWell(objects, image, size) {
    
		var well = new PhysicsObject(new Sprite(image, size || 50, 0));
        well.location = new Entities.Location(0,0);
                                 
        return well;
                                 
    }
	   
	/* State Objects */
	
	function GameState() {
		this.state = "start"; // start, playing, won, lost
	};
	
	function MessageHolder($wrapper, $text) {
		this.$wrapper = $wrapper; // DOM element representing entire textbox
		this.$text = $text; // DOM element whose contents are the displayed text
		this.displaying = false;
	};
	
	/* Systems */
	
	function GameResetSystem(set) {
	};
	
	function ThrustSystem(set) {
		set.each("thrust", function(entity) {
			var v = entity.velocity;
			var t = entity.thrust;
			var a = entity.angle;
			this.vx += t * Math.sin(a) * timeScale;
			this.vy += t * Math.cos(a) * timeScale;
		});
	};
	
	function GravitySystem(targetSet, sourceSet, G) {
		sourceSet.each(function(source) {
			var sourceX = source.location.x;
			var sourceY = source.location.y;
			targetSet.each(function(target) {
				// calc. normalized gravity direction
				var dx = sourceX - target.location.x;
				var dy = sourceY - target.location.y;
				var dist = Math.sqrt(dx*dx + dy*dy);
				dx /= dist;
				dy /= dist;
				
				// apply
				var force = target.gScale * G / dist;
				
				target.velocity.x += dx * force;
				target.velocity.y += dy * force;
			});
		});
	};
	
	function WrapSystem(set, bounds) {
		set.each("location", function(entity) {
			var loc = entity.location;
			if(loc.x > bounds.x + bounds.w) loc.x -= bounds.w;
			if(loc.y > bounds.y + bounds.h) loc.y -= bounds.h;
			if(loc.x < bounds.x) loc.x += bounds.w;
			if(loc.y < bounds.y) loc.y += bounds.h;
		});
	};
	
	var TAU = Math.PI * 2;
	function AngleNormalizeSystem(set) {
		set.each("angle", function(entity) {
			if(this.entity < 0) entity.angle = (entity.angle % TAU) + TAU;
			if(this.entity > TAU) entity.angle = entity.angle % TAU;
		});
	};
	
	function GravityWellControlSystem(well, set, mouse) {
		if(mouse.pressed) {
			set.add(well);
			well.location.x = mouse.x;
			well.location.y = mouse.y;
		} else {
			set.remove(well);
		}
	};
	
	function EnemyAiTargetingSystem(timeScale, shipSet, asteroidSet) {
		shipSet.each(function(ship) {
			
			// Find the nearest object
			var nearestRock = null;
			var nearestDist = 0;

			asteroidSet.each(function(object) {
				if (object.isAsteroid) {
					var dx = object.location.x - ship.location.x;
					var dy = object.location.y - ship.location.y;
					var dist = Math.sqrt(dx*dx + dy*dy);
					if (dist < nearestDist || nearestRock == null) {
						nearestDist = dist;
						nearestRock = object;
					}
				}
			});
			
			ship.attackTarget = nearestRock;
		});
	};
	function EnemyAiNavSystem(timeScale, shipSet, asteroidSet, turnSpeed) {
		
		shipSet.each(function(ship) {
		
			var nearestRock = ship.attackTarget;
			if(attackTarget == null) { return; }
			
			// Turn towards target

			var dx = nearestRock.location.x - ship.x;
			var dy = nearestRock.location.y - ship.y;

			var targetAngle = Math.atan2(dx, -dy);

			var angleDiff = targetAngle - ship.angle;

			if(angleDiff > Math.PI) angleDiff -= TAU;
			if(angleDiff < -Math.PI) angleDiff += TAU;

			if(angleDiff > 0) {
				ship.angle += turnSpeed * timeScale;
			} else {
				ship.angle -= turnSpeed * timeScale;
			}
			
		});

	};

	function EnemyAiGunSystem(timeScale, shipSet, bulletSet, rate) {
		shipSet.each(function(ship) {
			ship.cooldown -= timeScale;

			if (ship.cooldown <= 0) {
				ship.cooldown = rate;
				spawnBullet(bulletSet, ship.x, ship.y, resource.bullet, ship.angle);
			}
		});
	};

	function GameWinLossSystem(set, messageBox, winMessage, loseMessage) {
	};

	function UpdateSpriteFromPhysicsSystem(set) {
		set.each("sprite", function(entity) {
			var sprite = entty.sprite;
			
			if("angle" in entity) {
				sprite.angle = entity.angle;
			}
			if("size" in entity) {
				sprite.size = entity.size;
			}
		});
	};
	
	function RenderSystem(set, bounds, cx) {
		function drawAt(sprite, x, y) {
			cx.save();
				cx.translate(x, y);
				cx.rotate(sprite.angle);
				cx.drawImage(sprite.img, -sprite.size/2, -sprite.size/2, sprite.size, sprite.size);
			cx.restore();
		};
		
		set.each("sprite", function(entity) {
			var loc = entity.location;
			
			// draw copies to make wrapping look nice
			var xSign = (loc.x > bounds.x + bounds.w / 2) ? -1 : 1;
			var ySign = (loc.y > bounds.y + bounds.h / 2) ? -1 : 1;
			
			drawAt(entity.sprite, loc.x, loc.y);
			drawAt(entity.sprite, loc.x + bounds.w * xSign, loc.y);
			drawAt(entity.sprite, loc.x, loc.y + bounds.h * ySign);
			drawAt(entity.sprite, loc.x + bounds.w * xSign, loc.y + bounds.h * ySign);
		});
	};
	   
	/* Exports */

	loaded("sdioretsa").resolve({
		Sprite: Sprite,
		PhysicsObject: PhysicsObject,
		spawnAsteroid: spawnAsteroid,
		spawnShip: spawnShip,
		spawnBullet: spawnBullet,
        spawnWell: spawnWell,
		GameState: GameState,
		GameResetSystem: GameResetSystem,
		ThrustSystem: ThrustSystem,
		AngleNormalizeSystem: AngleNormalizeSystem,
		GravitySystem: GravitySystem,
		GravityWellControlSystem: GravityWellControlSystem,
		WrapSystem: WrapSystem,
		UpdateSpriteFromPhysicsSystem: UpdateSpriteFromPhysicsSystem,
		RenderSystem: RenderSystem,
        EnemyAiTargetingSystem: EnemyAiTargetingSystem,
        EnemyAiNavSystem: EnemyAiNavSystem,
        EnemyAiGunSystem: EnemyAiGunSystem
	});
    });
});
