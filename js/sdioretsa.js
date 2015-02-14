var _5gon = _5gon || [];
_5gon.push(function(loaded) {

	/* Components */
           
    function Sprite(img, size, angle) {
        this.img = img;
        this.size = size;
        this.angle = 0;
    }
           
    function PhysicsObject(sprite) {
        this.position = new Entities.Position(0,0);
        this.velocity = new Entities.Velocity(0,0);
        this.thrust = 0;
        this.sprite = sprite;
    	this.gScale = 1;
    };
	
	/* Helper Functions */

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
	};
	
	function GravitySystem(targetSet, sourceSet, G) {
	};
	
	function WrapSystem(set) {
	};
	
	function GravityWellControlSystem(set, mouse) {
	};
	
	function EnemyAiSystem(shipSet, asteroidSet) {
	};

	function GameWinLossSystem(set, messageBox, winMessage, loseMessage) {
	};

	function UpdateSpriteFromPhysicsSystem(set) {
	};
	
	function RenderSystem(set) {
	};
           
	/* Exports */

	loaded("sdioretsa").resolve({
           
	});
});
