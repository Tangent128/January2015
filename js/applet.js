var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
	function KeyControl() {
		
		var self = this;
		var keyNames = {};
		
		// set up a keybind
		this.mapKey = function(code, name) {
			keyNames[code] = name;
		};
		
		// attach event listeners to a DOM element
		this.listenTo = function(target) {
			function setKey(evt, state) {
				var name = keyNames[evt.which];
				if(name != null) {
					self[name] = state;
				}				
			};
			target.on("keydown", function(evt) {
				setKey(evt, true);
			});
			target.on("keyup", function(evt) {
				setKey(evt, true);
			});
		};
		
	}
	
	/* Constructor takes a jQuery-wrapped <canvas> tag,
	 * preps it for keyboard events.
	 * Can pass in an existing KeyControl if multiple applets
	 * need to share it, else it will create a new one. */
	function Applet(canvas, keys) {
		this.context = canvas.getContext("2d");
		
		// make canvas focusable if it isn't already
		var tabindex = canvas.attr("tabindex");
		if(tabindex == null) {
			canvas.attr("tabindex", -1);
		}
		
		// hook up key control
		if(keys == null) {
			keys = new KeyControl();
		}
		
		keys.listenTo(canvas);
		
		this.keys = keys;
	};

	/* Exports */
	
	loaded("KeyControl").resolve(KeyControl);
	loaded("Applet").resolve(Applet);

});
