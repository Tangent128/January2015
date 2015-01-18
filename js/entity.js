var _5gon = _5gon || [];
_5gon.push(function(loaded) {

    var idCounter = 0;

    loaded("$").then(function($) {
	
	/*** Data Structures ***/
	function EntitySet() {
	    var self = this;
	    var memberSet = {};
	    var entityList = [];

	    this.add = function(entity) {
		if ( ! memberSet[entity.id]) {
		    memberSet[entity.id] = true;
		    entityList.splice(entityList.length, 0, entity);
		}
	    };

	    this.remove = function(entity) {
		if (memberSet[entity.id]) {
		    delete memberSet[entity.id];
		    entityList.splice(entityList.indexOf(entity), 1);
		}
	    };
	    
	    this.each = function(filter, callback) {
		
		if((typeof filter) != "string") {
		    callback = filter;
		    filter = "id"; // all entities have an id
		}
		
		$.each(entityList, function() {
		    if(this[filter]) {
			callback(this);
		    }
		});
	    };
	    
	    this.get = function(index) {
		return entityList[index];
	    };

	};
    
	function Entity() {
	    this.id = idCounter++;
	};

    function Location(x, y) {
        this.x = x;
        this.y = y;
    };
                     
    function Velocity(x, y) {
        this.x = x;
        this.y = y;
    };
                     
	function Timer(interval, randomAdd) {
	    this.countdown = 0;
	    this.resetTo = interval || 0;
	    this.resetRandom = randomAdd || 0;
	};


	/*** Systems ***/

	function TimerTickSystem(set, timeStep, componentName) {
	    set.each(componentName || "timer", function(entity) {
		var t = entity.timer;
		if(t.countdown == 0) {
		    if(t.resetTo > 0) {
			t.countdown = t.resetTo;
			if(t.resetRandom > 0) {
			    t.countdown += t.resetRandom * Math.random();
			}
		    }
		} else {
		    t.countdown -= timeStep;
		    if(t.countdown <= 0) {
			t.countdown = 0;
		    }
		}
	    });
	};

	function TimerExpireSystem(set) {
	    var dead = [];
	    // remember: deleting items from a collection
	    // while you are iterating over it ends badly
	    set.each("dieOnTimeout", function(entity) {
		var t = entity.timer;
		if(t.countdown == 0) {
		    dead.push(entity);
		}
	    });
	    
	    // safe to delete items now
	    $.each(dead, function() {
		set.remove(this);
	    });
	};
	

	/*** Exports ***/
	loaded("Entities").resolve({
	    Entity: Entity,
	    EntitySet: EntitySet,

        Location: Location,
        Velocity: Velocity,
                               
	    Timer: Timer,
	    TimerTickSystem: TimerTickSystem,
	    TimerExpireSystem: TimerExpireSystem
	});
	
	// deprecated, use above exported object instead
	loaded("EntitySet").resolve(EntitySet);
	loaded("Entity").resolve(Entity);

    });
    
});
