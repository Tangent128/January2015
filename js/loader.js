
var _5gon = _5gon || [];

var JQUERY_URL = "js/jquery-1.11.0.min.js";

(function() {
	
	function PushProcessor(backlog, push) {
		this.push = push;
		for(var i = 0; i < backlog.length; i++) {
			push(backlog[i]);
		}
	};
	
	var script = document.createElement("script");
	script.src = JQUERY_URL;
	script.onload = function() {
		var $ = jQuery.noConflict();
		
		var loadMap = {};
		function grabDeferred(name) {
			if(loadMap[name]) return loadMap[name];
			loadMap[name] = $.Deferred();
			return loadMap[name];
		}
		function loaded() {
			if(arguments.length == 1) {
				// don't wrap, so resolve() can be called on it
				return grabDeferred(arguments[0]);
			}
			var deferreds = [];
			for(var i = 0; i < arguments.length; i++) {
				deferreds.push(grabDeferred(arguments[i]));
			}
			return $.when.apply($, deferreds);
		}
		loaded("$").resolve($);
		
		_5gon = new PushProcessor(_5gon, function(callback) {
			callback(loaded);
		});
		
		$(function() {
			loaded("$.ready").resolve($);
		});
	};
	document.head.appendChild(script);
	
})();

