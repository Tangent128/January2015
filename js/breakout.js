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
           
           function Rectangle(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
           }
           
           /* Helpers */
           
           function rectIntersect(r1, r2) {
                  return !(
                        (r1.x + r1.w < r2.x) || (r2.x + r2.w < r1.x)
                        ||
                        (r1.y + r1.h < r2.y) || (r2.y + r2.h < r1.y)
                  );
            }
           
            function xBounce(entity, xEdge) {
                  entity.velocity.x *= -1;
                  if(entity.velocity.x < 0) {
                        entity.bounds.x = xEdge - entity.bounds.w;
                  } else if(entity.velocity.x > 0) {
                        entity.bounds.x = xEdge;
                  }
            }
            function yBounce(entity, yEdge) {
                  entity.velocity.y *= -1;
                  if(entity.velocity.y < 0) {
                        entity.bounds.y = yEdge - entity.bounds.h;
                  } else if(entity.velocity.y > 0) {
                        entity.bounds.y = yEdge;
                  }
            }
      
           /* Systems */

           
           function VelocitySystem(set) {
                set.each(function(entity) {
                    // If no location or velocity, don't bother
                    if (entity.velocity && entity.bounds) {
                         entity.bounds.x += entity.velocity.x;
                         entity.bounds.y += entity.velocity.y;
                    }
                    });
           };

           function BallCollisionSystem(ballSet, blockSet) {
                 ballSet.each("isBall", function(ball) {
                       var bab = ball.bounds;
                       var bav = ball.velocity;
                       
                       blockSet.each("isBlock", function(block) {
                             var blockBounds = block.bounds;
                             
                             if(!rectIntersect(bab, blockBounds)) {
                                    return;
                              }
                             
                             var blockVel = block.velocity;
                             
                             // determine relevant edges
                             var vx = bav.x - blockVel.x;
                             var vy = bav.y - blockVel.y;
                             
                             var xWall = blockBounds.x;
                             var xEdge = bab.x;
                             if(vx < 0) {
                                    xWall += blockBounds.w;
                              } else {
                                    xEdge += bab.w;
                              }

                             var yWall = blockBounds.y;
                             var yEdge = bab.y;
                             if(vy < 0) {
                                    yWall += blockBounds.h;
                              } else {
                                    yEdge += bab.h;
                              }
                              
                              // calculate how long ago each axis's collision could have been
                              
                              var dx = xEdge - xWall;
                              var dy = yEdge - yWall;
                              
                              var tx = dx/vx;
                              var ty = dy/vy;
                              
                              if(tx < ty) {
                                    // collision on vertical edge, so bounce horizontally
                                    xBounce(ball, xEdge);
                              } else {
                                    // collision on horizontal edge, so bounce verticaly
                                    yBounce(ball, yEdge);
                              }
                             
                        });
                  });
           };
           
            function WallCollisionSystem(set, field) {
                  
                  set.each("velocity", function(entity) {
                        var b = entity.bounds;
                        if(b.x < field.x) {
                              xBounce(entity, field.x);
                        } else if(b.x + b.w > field.x + field.w) {
                              xBounce(entity, field.x + field.w);
                        }
                        
                        if(b.y < field.y) {
                              yBounce(entity, field.y);
                        } else if(b.y + b.h > field.y + field.h) {
                              yBounce(entity, field.y + field.h);
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

           function BallRenderSystem(set, cx) {
           
                function Pad(string) {
                    if (string.length < 2) {
                        return "0" + string;
                    }
                    return string;
                };
           
                set.each("isBall", function(ball) {
           
                    if (ball.bounds && ball.radius && ball.color) {
                        cx.beginPath();
                        cx.arc(ball.bounds.x + ball.radius, ball.bounds.y + ball.radius, ball.radius, 0, 2 * Math.PI, false);
           
                        var red = Pad((ball.color.r).toString(16));
                        var green = Pad((ball.color.g).toString(16));
                        var blue = Pad((ball.color.b).toString(16));
                        cx.fillStyle = "#" + red + green + blue;
                        cx.fill();
                    }
           
                });

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
                                var red = Pad((block.color.r).toString(16));
                                var green = Pad((block.color.g).toString(16));
                                var blue = Pad((block.color.b).toString(16));
                                cx.fillStyle = "#" + red + green + blue;
                         cx.fillRect(block.bounds.x, block.bounds.y, block.bounds.w, block.bounds.h);
                         }
                });
           };

            loaded("Breakout").resolve({
                  Color: Color,
                  Rectangle: Rectangle,
                  
                  VelocitySystem: VelocitySystem,
                  WallCollisionSystem: WallCollisionSystem,
                  BallCollisionSystem: BallCollisionSystem,
                  BlockRenderSystem: BlockRenderSystem,
                  BallRenderSystem: BallRenderSystem,
                  PaddleControlSystem: PaddleControlSystem
            });
           
});
