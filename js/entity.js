var _5gon = _5gon || [];
_5gon.push(function(loaded) {

    var idCounter = 0;

    loaded("$").then(function($) {
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
	    
	    this.each = function(callback) {
		$.each(entityList, function() {
		    callback(this);
		});
	    };

	};
    
	function Entity() {
	    this.id = idCounter++;
        this.location = {};
	};

	/* Exports */
	loaded("EntitySet").resolve(EntitySet);
	loaded("Entity").resolve(Entity);

    });
    
});
