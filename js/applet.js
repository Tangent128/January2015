var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
	loaded("$").then(function($) {
	
	function KeyControl() {
		
		var self = this;
		var keyNames = {};
		
		// set up a keybind
		this.mapKey = function(code, name) {
			keyNames[code] = name;
		};
		
		// attach event listeners to a DOM element
		this.listenTo = function($target) {
			function setKey(evt, state) {
				var name = keyNames[evt.which];
				if(name != null) {
					self[name] = state;
				}
			};
			$target.on("keydown", function(evt) {
				setKey(evt, true);
			});
			$target.on("keyup", function(evt) {
				setKey(evt, false);
			});
		};
		
	}

	function MouseControl() {
		this.pressed = false;
		this.x = 0;
		this.y = 0;
		
		// attach event listeners to a DOM element
		this.listenTo = function($target) {
			var $doc = $(document);
			var self = this;
			var offset = $target.offset();
			
			function xyUpdate(evt) {
				self.x = evt.pageX - offset.left;
				self.y = evt.pageY - offset.top;
			};
			
			$target.on("mousedown", function(evt) {
				self.pressed = true;
				offset = $target.offset();
				$doc.on("mousemove", xyUpdate);
				evt.preventDefault();
			});
			$doc.on("mouseup", function(evt) {
				self.pressed = false;
				$doc.off("mousemove", xyUpdate);
				evt.preventDefault();
			});
			$target.on("mousemove", xyUpdate);
		};
	}
	
	/* Constructor takes a jQuery-wrapped <canvas> tag (optionally
	 * with <div> wrappers) and preps it for keyboard events.
	 * Can pass in an existing KeyControl if multiple applets
	 * need to share it, else it will create a new one. */
	function Applet($applet, keys, mouse) {
		var $canvas;
		if($applet.is("canvas")) {
			$canvas = $applet;
		} else {
			$canvas = $applet.find("canvas");
		}
		
		var canvasTag = $canvas[0];
		this.context = canvasTag.getContext("2d");
		this.width = $applet.width();
		this.height = $applet.height();
		
		// make canvas focusable if it isn't already
		var tabindex = $canvas.attr("tabindex");
		if(tabindex == null) {
			$canvas.attr("tabindex", -1);
		}
		
		// hook up key control
		if(keys == null) {
			keys = new KeyControl();
		}
		
		keys.listenTo($applet);
		
		this.keys = keys;
		
		// make new mouse control
		this.mouse = new MouseControl();
		this.mouse.listenTo($applet);
	};

	/* Exports */
	
	loaded("KeyControl").resolve(KeyControl);
	loaded("Applet").resolve(Applet);
	
	});

});
