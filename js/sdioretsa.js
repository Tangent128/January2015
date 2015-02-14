var _5gon = _5gon || [];
_5gon.push(function(loaded) {

	/* Components */
	
	/* Helper Functions */

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
	};
	
	function GravitySystem(targetSet, sourceSet, G) {
	};
	
	function WrapSystem(set) {
	};
	
	function GravityWellControlSystem(set) {
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
