var _5gon = _5gon || [];
_5gon.push(function(loaded) {

           
    loaded("$", "Entities").then(function($, Entities) {
	/* Components */
	   
    function Sprite(img, size, angle) {
		this.img = img;
		this.size = size;
		this.angle = 0;
    }
	
	function Message(html, slot) {
		this.html = html || "";
		this.slot = slot || null;
	}
	
	/* Helper Functions */

    function PhysicsObject(sprite) {
		Entities.Entity.call(this);
		this.location = new Entities.Location(0,0);
		this.velocity = new Entities.Velocity(0,0);
		this.size = sprite.size;
		this.sprite = sprite;
		this.gScale = 1;
    };
    
    function spawnAsteroid(splits, objects, location, image, size) {
        var spawnAngle = (Math.random()) * (Math.PI * 2);
		var asteroid = new PhysicsObject(new Sprite(image, size || 60, spawnAngle));
		   
        asteroid.splits = splits;
		asteroid.location = location;
        asteroid.angle = spawnAngle;
		asteroid.velocity.x = Math.cos(asteroid.angle) * 1;
		asteroid.velocity.y = Math.sin(asteroid.angle) * 1;
        asteroid.image = image;
                                 
		asteroid.isAsteroid = true;
		   
		objects.add(asteroid);
    };
	   
    function spawnShip(objects, location, image, size) {
		var ship = new PhysicsObject(new Sprite(image, size || 60, 0));
		   
		ship.location = location;
		//ship.sprite.angle = rand(Math.PI * 2);
		ship.velocity.x = 0;
		ship.velocity.y = 0;
		ship.gScale = 1;
		   
		ship.angle = 0;
		ship.thrust = -0.5;
		
		ship.attackTarget = null;
		
		ship.cooldown = 0;
		   
		ship.isShip = true;
		   
		objects.add(ship);

		//return ship;
    }
	   
	var BULLET_SPEED = 3;
    function spawnBullet(objects, x, y, image, angle, size) {
		var bullet = new PhysicsObject(new Sprite(image, size || 60, angle));
		bullet.location.x = x;
		bullet.location.y = y;
		bullet.velocity.x = BULLET_SPEED * Math.sin(angle);
		bullet.velocity.y = BULLET_SPEED * -Math.cos(angle);
		bullet.gScale = 0;
		   
		bullet.isBullet = true;
		   
		bullet.lifespan = 3.5;
        bullet.timer = new Entities.Timer(bullet.lifespan);
        bullet.dieOnTimeout = true;
                                 
		objects.add(bullet);
    }
                                 
    function spawnWell(objects, image, size) {
    
		var well = new PhysicsObject(new Sprite(image, size || 60, 0));
        well.location = new Entities.Location(0,0);
                                 
        return well;
                                 
    }
    
    function showMessage(entity, slot) {
		if(!entity.message.slot) {
			entity.timer = new Entities.Timer();
			entity.timer.countdown = 0.3; //seconds
		}
		entity.message.slot = slot;
	};
	   
	/* State Objects */
	
	function GameState() {
		this.state = "start"; // start, playing, won, lost
	};
	
	function MessageHolder($wrapper, $text, slot) {
		// TODO: does this make more sense as a component?
		this.$wrapper = $wrapper; // DOM element representing entire textbox
		this.$text = $text; // DOM element whose contents are the displayed text
		this.displaying = false;
		this.slotName = slot || "default";
	};
	
	/* Systems */
	
	function GameResetSystem(set) {
	};
	
	function ThrustSystem(set, timeScale) {
		set.each("thrust", function(entity) {
			var v = entity.velocity;
			var t = entity.thrust;
			var a = entity.angle;
			v.x += t * Math.sin(a) * timeScale;
			v.y += t * Math.cos(a) * timeScale;
			//console.log("v", v.x, v.y);
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
			if(nearestRock == null) { return; }
			
			// Turn towards target

			var dx = nearestRock.location.x - ship.location.x;
			var dy = nearestRock.location.y - ship.location.y;

			var targetAngle = Math.atan2(dx, -dy);

			var angleDiff = targetAngle - ship.angle;

			if(angleDiff > Math.PI) angleDiff -= TAU;
			if(angleDiff < -Math.PI) angleDiff += TAU;

			if(angleDiff > 0.1) {
				ship.angle += turnSpeed * timeScale * 0.5;
			} else if (angleDiff < -0.1) {
				ship.angle -= turnSpeed * timeScale * 0.5;
			}
			
		});

	};

	function EnemyAiGunSystem(timeScale, shipSet, bulletSet, bulletSprite, rate) {
		shipSet.each(function(ship) {
			ship.cooldown -= timeScale;

			if (ship.cooldown <= 0) {
				ship.cooldown = rate;
				spawnBullet(bulletSet, ship.location.x, ship.location.y, bulletSprite, ship.angle);
			}
		});
	};

	/**
	 * Identify overlapping objects and add an entity to collisionGroup
	 * for each one. (remember to clear collisionGroup at the end of
	 * each frame)
	 */
	function CollisionGenerationSystem(groupA, groupB, collisionGroup) {
		groupA.each(function(a) {
			groupB.each(function(b) {
				if (a == b) {return;}
				
				var dx = a.location.x - b.location.x;
				var dy = a.location.y - b.location.y;
				
				var dist = Math.sqrt(dx*dx + dy*dy);
				var sizeSum = a.size + b.size;
				sizeSum /= 3; // 2 is more "correct", but 3 looks more intuitive.
				
				if(dist < sizeSum) {
					var collision = new Entities.Entity();
					collision.colliderA = a;
					collision.colliderB = b;
					collisionGroup.add(collision);
				}
			});
		});
	};
                                 
    function BulletCollisionSystem(collisionGroup) {
    
        collisionGroup.each(function (collision) {
                                 
            // Assumes asteroid-bullet collisions are passed as asteroid=groupA / bullet=groupB
            if(collision.colliderA.isAsteroid && collision.colliderB.isBullet) {
                collision.colliderA.isDead=true;
                collision.colliderB.isDead=true;
            }

        });
    }
                                 
    function ShipCollisionSystem(collisionGroup) {
                                 
        collisionGroup.each(function (collision) {
                                                     
            // Assumes asteroid-ship collisions are passed as asteroid=groupA / ship=groupB
            if(collision.colliderA.isAsteroid && collision.colliderB.isShip) {
                collision.colliderB.isDead=true;
            }
        });
    }

    function AsteroidSplitSystem(asteroidSet) {
        asteroidSet.each(function(asteroid) {
            if (asteroid.isDead && (asteroid.splits > 0)) {
                var angleA = Math.random() * Math.PI * 2;
                var angleB = Math.random() * Math.PI * 2;
                         
                var locationA = new Entities.Location(asteroid.location.x + (asteroid.size * Math.cos(angleA)), asteroid.location.y + (asteroid.size * Math.sin(angleA)));
                
                var locationB = new Entities.Location(asteroid.location.x + (asteroid.size * Math.cos(angleB)), asteroid.location.y + (asteroid.size * Math.sin(angleB)));
                         
                spawnAsteroid(asteroid.splits-1, asteroidSet, locationA, asteroid.image, (asteroid.size/2));
                spawnAsteroid(asteroid.splits-1, asteroidSet, locationB, asteroid.image, (asteroid.size/2));
            }
        });
    }
                                 
	function GameWinLossSystem(asteroidSet, shipSet, gameState) {
		if(asteroidSet.isEmpty()) {
			gameState.state = "lost";
		}
		
		if(shipSet.isEmpty()) {
			gameState.state = "won";
		}
	};

	function GameStateMessageSystem(messageSet, gameState, messageSlot) {
		messageSet.each(function(messageEntity) {
			if(messageEntity.showForState == gameState.state) {
				showMessage(messageEntity, (messageSlot || "default"));
			}
		});
	};

	function MessageBoxSystem(messageSet, messageBox) {
		var messageToShow = false;
		messageSet.each(function(messageEntity) {
			if(messageEntity.message.slot == messageBox.slotName) {
				messageToShow = messageEntity.message;
			}
		});
		
		if(messageToShow) {
			if(messageBox.displaying != messageToShow) {
				messageBox.$text.html(messageToShow.html);
				messageBox.$wrapper.show();
				messageBox.displaying = messageToShow;
			}
		} else {
			messageBox.$wrapper.hide();
			messageBox.displaying = false;
		}
	};
	
	function MessageDismissSystem(messageSet, mouse, callback) {
		if(mouse.pressed) {
			messageSet.each(function(messageEntity) {
				if(messageEntity.message.slot != null) {
					var countdown = 0;
					if(messageEntity.timer) {
						countdown = messageEntity.timer.countdown;
					}
					if(countdown == 0) {
						messageEntity.message.slot = null;
						if(callback) {
							callback(messageEntity);
						}
					}
				}
			});
		}
	};
	
	function UpdateSpriteFromPhysicsSystem(set) {
		set.each("sprite", function(entity) {
			var sprite = entity.sprite;
			
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
			
        	//console.log(entity.sprite);
                 
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
        EnemyAiGunSystem: EnemyAiGunSystem,
        CollisionGenerationSystem:CollisionGenerationSystem,
        BulletCollisionSystem:BulletCollisionSystem,
        ShipCollisionSystem:ShipCollisionSystem,
        GameWinLossSystem: GameWinLossSystem,
        AsteroidSplitSystem: AsteroidSplitSystem,
        Message: Message,
        MessageHolder: MessageHolder,
        GameStateMessageSystem: GameStateMessageSystem,
        MessageBoxSystem: MessageBoxSystem,
        showMessage: showMessage,
        MessageDismissSystem:MessageDismissSystem
	});
    });
});
