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

           
           function MoveObjectSystem(set) {
                set.each(function(entity) {
                    // If no location or velocity, don't bother
                    if (entity.velocity && entity.bounds) {
                         entity.bounds.x += entity.velocity.x;
                         entity.bounds.y += entity.velocity.y;
                    }
                    });
           };

           function BallCollisionSystem() {
           };
           
            function WallCollisionSystem(set, field) {
                  
                  function xBounce(entity, newX) {
                        entity.bounds.x = newX;
                        entity.velocity.x *= -1;
                  }
                  
                  set.each("velocity", function(entity) {
                        var b = entity.bounds;
                        if(b.x < field.x) {
                              xBounce(entity, field.x);
                        } else if(b.x + b.w > field.x + field.w) {
                              xBounce(entity, field.x + field.w - b.w);
                        }
                  });
            };
           
           function ReaperSystem() {
           };
           
           function PaddleControlSystem(set, k) {
           set.each("isPlayerControlled", function(block) {
                    
                    var left = k.left;
                    var right = k.right;
                    
                     if (left) {
                        block.velocity.x = -5;
                    } else if (right) {
                        block.velocity.x = 5;
                    } else {
                        block.velocity.x = 0;
                    }
                    
                });
           };

           function MessagingSystem() {
           };

           function SpriteRenderSystem() {
            };

           function BlockRenderSystem(set, cx) {
           
                function Pad(string) {
                    if (string.length < 2) {
                        return "0" + string;
                    }
                    return string;
                };
           
                set.each("isBlock", function(block) {
                         // If no location or bounds, don't bother
                         if (block.bounds && block.color) {
                            // Fill white, then attempt to assign a color if one exists
                            if (block.color) {
                                var red = Pad((block.color.r).toString(16));
                                var green = Pad((block.color.g).toString(16));
                                var blue = Pad((block.color.b).toString(16));
                                cx.fillStyle = "#" + red + green + blue;
                            }
                         cx.fillRect(block.bounds.x, block.bounds.y, block.bounds.w, block.bounds.h);
                         }
                });
           };

            loaded("Breakout").resolve({
                  Color: Color,
                  CollisionRectangle: CollisionRectangle,
                  
                  MoveObjectSystem: MoveObjectSystem,
                  WallCollisionSystem: WallCollisionSystem,
                  BlockRenderSystem: BlockRenderSystem,
                  PaddleControlSystem: PaddleControlSystem
            });
           
});
