var _5gon = _5gon || [];
_5gon.push(function(loaded) {

	/* Components */
           
    function Sprite(img, size, angle) {
        this.img = img;
        this.size = size;
        this.angle = 0;
    }
           
	/* Helper Functions */

    function PhysicsObject(sprite) {
        this.position = new Entities.Position(0,0);
        this.velocity = new Entities.Velocity(0,0);
        this.size = 50;
        this.sprite = sprite;
    	this.gScale = 1;
    };
    
    function Asteroid(objects, position) {
        var asteroid = new PhysicsObject(resource.asteroid, 50);
           
        asteroid.position = position;
        //asteroid.angle = rand(Math.PI * 2);
        asteroid.velocity.x = Math.cos(asteroid.angle) * 100;
        asteroid.velocity.y = Math.sin(asteroid.angle) * 100;
           
        asteroid.isAsteroid = true;
           
        objects.push(asteroid);
    };
           
    function Ship(objects, position, sprite, ai) {
        var ship = new PhysicsObject(sprite);
           
        ship.position = position;
        //ship.sprite.angle = rand(Math.PI * 2);
        ship.velocity.x = 0;
        ship.velocity.y = 0;
        ship.think = ai;
        ship.gScale = 0;
           
        ship.angle = 0;
        ship.thrust = 0;
        
        ship.cooldown = 0;
           
        ship.isShip = true;
           
        objects.push(ship);
           
        return ship;
    }
           
           
    function spawnBullet(objects, position, sprite, angle) {
        var bullet = new PhysicsObject(sprite);
        bullet.position = position;
        // This will now be retrieved from the sprite
        //bullet.angle = angle;
        bullet.velocity.x = 75 * Math.sin(angle);
        bullet.velocity.y = 75 * Math.cos(angle);
        bullet.think = bulletThink;
        bullet.gScale = 0;
           
        bullet.isBullet = true;
           
        bullet.lifespan = 3.5;
           
        objects.push(bullet);
    }
           
	/* State Objects */
	
	function GameState() {
		this.state = "start"; // start, playing, won, lost
	};
	
	function MouseState() {
		this.pressed = false;
		this.x = 0;
		this.y = 0;
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
			if(loc.x > bounds.x + bounds.w) loc.x += bounds.w;
			if(loc.y > bounds.y + bounds.h) loc.y += bounds.h;
			if(loc.x < bounds.x) loc.x -= bounds.w;
			if(loc.y < bounds.y) loc.y -= bounds.h;
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
	};
	
	function EnemyAiSystem(shipSet, asteroidSet) {
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
	
	function RenderSystem(set, bounds) {
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
			
			drawAt(this.x, this.y);
			drawAt(this.x + W * xSign, this.y);
			drawAt(this.x, this.y + H * ySign);
			drawAt(this.x + W * xSign, this.y + H * ySign);
		});
	};
           
	/* Exports */

	loaded("sdioretsa").resolve({
           
	});
});
