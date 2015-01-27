var _5gon = _5gon || [];
_5gon.push(function(loaded) {
           
           /* Global State container */
           
           function GameState() {
                 this.score = 0;
                 this.mode = "intro"; // intro, playing, won, lost
            };
           
           /* Components */
           
           function Color(r, g, b) {
                this.r = r;
                this.g = g;
                this.b = b;
           };
           
           function CollisionRectangle(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
           }
           
           function Mode(mode) {
                this.mode = mode;
           }
           
           /* Systems */

           
           function MoveObjectSystem() {
           };

           function BallCollisionSystem() {
           };
           
           function WallCollisionSystem() {
           };
           
           function ReaperSystem() {
           };
           
           function PaddleControlSystem() {
           };
           
           function MessagingSystem() {
           };
           
           function SpriteRenderSystem() {
            };

           function BlockRenderSystem(set, cx) {
           
                set.each("isBlock", function(block) {
                         // If no location or bounds, don't bother
                         if (block.bounds && block.color) {
                            // Fill white, then attempt to assign a color if one exists
                            if (block.color) {
                            cx.fillStyle = "#" + ((block.color.r).toString(16)) + ((block.color.g).toString(16)) + ((block.color.b).toString(16));
                            }
                         cx.fillRect(block.bounds.x, block.bounds.y, block.bounds.w, block.bounds.h);
                         }
                         });
           };

            loaded("Breakout").resolve({
                  Color: Color,
                  CollisionRectangle: CollisionRectangle,
                  BlockRenderSystem: BlockRenderSystem
            });
           
});
