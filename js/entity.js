var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
    var idCounter = 0;
           
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
           }
           
		};
		
	}
	
	/* Constructor takes a jQuery-wrapped <canvas> tag,
	 * preps it for keyboard events.
	 * Can pass in an existing KeyControl if multiple applets
	 * need to share it, else it will create a new one. */
	function Entity(componentSet) {
            var self = this;
            var components = {};
           
            this.components = componentSet;
            this.id = idCounter++;
           
            /* If for some reason we need to change the entire set of components an entity is bound to */
           
            this.replaceComponents = function(components) {
            this.components = components;
           }
           
	};

	/* Exports */
	
	loaded("EntitySet").resolve(EntitySet);
	loaded("Entity").resolve(Entity);

});
