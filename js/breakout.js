var _5gon = _5gon || [];
_5gon.push(function(loaded) {
	
	loaded("$", "Entities").then(function($, Entities) {
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
		};

		/* Helpers */

		function rectIntersect(r1, r2) {
			return !(
				(r1.x + r1.w <= r2.x) || (r2.x + r2.w <= r1.x)
				||
				(r1.y + r1.h <= r2.y) || (r2.y + r2.h <= r1.y)
			);
		};

		function xBounce(entity, xWall, edgeSpeed) {
			edgeSpeed = edgeSpeed || 0;
			entity.velocity.x *= -1;
			entity.velocity.x += edgeSpeed;
			if(entity.velocity.x < 0) {
				entity.bounds.x = xWall - entity.bounds.w;
			} else if(entity.velocity.x > 0) {
				entity.bounds.x = xWall;
				//console.log("bounce", xWall, edgeSpeed, entity.bounds.x, entity.velocity.x);
			}
		};
		function yBounce(entity, yWall, edgeSpeed) {
			edgeSpeed = edgeSpeed || 0;
			entity.velocity.y *= -1;
			entity.velocity.y += edgeSpeed;
			if(entity.velocity.y < 0) {
				entity.bounds.y = yWall - entity.bounds.h;
			} else if(entity.velocity.y > 0) {
				entity.bounds.y = yWall;
			}
		};

		function hitWall(entity, wall) {
			if("lastWallHit" in entity) {
				entity.lastWallHit = wall;
			}
		};

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

		function VelocityDampenSystem(set) {
			set.each("velocityLimit", function(entity) {
				var limit = entity.velocityLimit;
				var v = entity.velocity;

				var speed = Math.sqrt((v.x*v.x) + (v.y*v.y));

				if(speed > limit) {
					var factor = limit / speed;
					v.x *= factor;
					v.y *= factor;
				}
			});
		};
		function VelocityBoostSystem(set) {
			set.each("minimumVelocity", function(entity) {
				var floor = entity.minimumVelocity;
				var v = entity.velocity;

				var speed = Math.sqrt((v.x*v.x) + (v.y*v.y));

				if (speed < floor) {
					var factor = floor / speed;
					v.x *= factor;
					v.y *= factor;
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
						xBounce(ball, xWall, blockVel.x);
						bav.y += blockVel.y;
					} else {
						// collision on horizontal edge, so bounce verticaly
						yBounce(ball, yWall, blockVel.y);
						bav.x += blockVel.x;
					}

					if ("hitsRemaining" in block) {
						block.hitsRemaining -= 1;
					}

				});
			});
		};

		function BreakBlockSystem(set, gameState) {
			set.each("isBlock", function(block) {
				if ("hitsRemaining" in block) {
					if (block.hitsRemaining == 0) {
						block.isDead = true;
						gameState.score += 10;
					}
				}
			});
		};

		function WallCollisionSystem(set, field) {
			set.each("velocity", function(entity) {
				var b = entity.bounds;
				if(b.x < field.x) {
					xBounce(entity, field.x);
					hitWall(entity, "left");
				} else if(b.x + b.w > field.x + field.w) {
					xBounce(entity, field.x + field.w);
					hitWall(entity, "right");
				}

				if(b.y < field.y) {
					yBounce(entity, field.y);
					hitWall(entity, "top");
				} else if(b.y + b.h > field.y + field.h) {
					yBounce(entity, field.y + field.h);
					hitWall(entity, "bottom");
				}
			});
		};
		
		function LoseBallSystem(set) {
			set.each("isBall", function(entity) {
				if (entity.lastWallHit == "bottom") {
					entity.isDead = true;
				}
			});
		};

		function GameJudgeSystem(ballSet, brickSet, gameState) {
			if(gameState.mode != "playing") {
				return;
			}
			
			var ballsInPlay = false;
			var bricksInPlay = false;
			
			ballSet.each("isBall", function(ball) {
				ballsInPlay = true;
			});
			brickSet.each("isBrick", function(block) {
				bricksInPlay = true;
			});
			
			if(!bricksInPlay) {
				gameState.mode = "won";
			} else if(!ballsInPlay) {
				gameState.mode = "lost";
			}
		};
		
		function ReaperSystem(set) {
			var toRemove = [];

			set.each("isDead", function(entity) {
				if (entity.isDead) {
					toRemove.push(entity);
				}
			});

			$.each(toRemove, function() {
				set.remove(this);
			});
		};

		function PaddleControlSystem(set, k, tickLength) {
			set.each("isPlayerControlled", function(block) {

				var left = k.left;
				var right = k.right;
				
				var v = block.velocity;

				if (left) {
					v.x -= 20*tickLength;
				} else if (right) {
					v.x += 20*tickLength;
				} else {
					v.x = 0;
				}

			});
		};

		function MessagingSystem(gameState, cx) {
			if (gameState.mode) {
				cx.fillStyle = "#ffffff";
				//cx.fillRect(500,500,100,100);
				if (gameState.mode === "won") {
					cx.font = "48px serif";
					cx.fillText("You Won", 150, 100);
				} else if (gameState.mode === "lost") {
					cx.font = "48px serif";
					cx.fillText("You Lost", 150, 100);
				} else if (gameState.mode === "intro") {
					cx.font = "48px serif";
					cx.fillText("Press Spacebar to Start", 150, 100);
				} else if (gameState.mode === "playing") {
					cx.font = "48px serif";
					cx.fillText("Score: "+gameState.score, 150, 100);
				}
			}
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
                                 
    function initGame(blocks) {
                function addBlock(x,y,w,h, r,g,b) {
                     var block = new Entities.Entity();
                     block.bounds = new Rectangle(x, y, w, h);
                     block.color = new Color(r, g, b);
                     block.isBlock = true;
                     block.isBrick = true;
                     block.velocity = new Entities.Velocity(0, 0);
                     block.hitsRemaining = 3;
                     blocks.add(block);
                };
                     
                function addPaddle (x,y,w,h, r,g,b) {
                     var paddle = new Entities.Entity();
                     paddle.bounds = new Rectangle(x, y, w, h);
                     paddle.color = new Color(r, g, b);
                     paddle.isBlock = true;
                     paddle.velocity = new Entities.Velocity(0, 0);
                     paddle.velocityLimit = 7;
                     paddle.isPlayerControlled = true;
                     blocks.add(paddle);
                };
                     
                function addBall(x, y, radius, r, g, b) {
                     var ball = new Entities.Entity();
                     ball.bounds = new Rectangle(x, y, radius*2, radius*2);
                     ball.velocity = new Entities.Velocity(-2,-2);
                     ball.velocityLimit = 7;
                     ball.minimumVelocity = 4;
                     ball.radius = radius;
                     ball.color = new Color(r, g, b);
                     ball.isBall = true;
                     ball.lastWallHit = "none";
                     blocks.add(ball);
                     return ball;
                };
                     
                function addBlocks (width, depth) {
                     var counter = 0;
                     var startX = 0;
                     var startY = 50;
                     for (i = 0; i < width; i++) {
                        startX = (i * 100);
                        for (j = 0; j < depth; j++) {
                            startY = 50 + (j * 50);
                            if ((counter % 2) == 0) {
                                addBlock(startX, startY, 100, 50, 255,255,200);
                            } else {
                                addBlock(startX, startY, 100, 50, 255,200,100);
                            }
                        counter++;
                        }
                     }
                };
                     
                addPaddle(200,350,200,40, 200,0,255);
                addBlocks(6, 3);
                     
                var ball = addBall(300, 230, 10, 255, 0, 0);
                ball.velocity.y = -3;
                ball.velocity.x = -1;
    };

    function GameResetSystem(blocks, gameState, k) {
                                 
        var reset = k.reset;
                                 
        if (reset) {
                                 
            blocks = new Entities.EntitySet();
            gameState.score = 0;
            gameState.mode = "playing";
            initGame(blocks);
            return blocks;
            }
        return blocks;
                                 
        };
                                 
        loaded("Breakout").resolve({
			Color: Color,
			Rectangle: Rectangle,
			GameState: GameState,
            initGame: initGame,

			VelocitySystem: VelocitySystem,
			VelocityDampenSystem: VelocityDampenSystem,
			VelocityBoostSystem: VelocityBoostSystem,
			
			WallCollisionSystem: WallCollisionSystem,
			BallCollisionSystem: BallCollisionSystem,
			
			BreakBlockSystem: BreakBlockSystem,
			LoseBallSystem: LoseBallSystem,
			GameJudgeSystem: GameJudgeSystem,
			
			BlockRenderSystem: BlockRenderSystem,
			BallRenderSystem: BallRenderSystem,
			PaddleControlSystem: PaddleControlSystem,
			MessagingSystem: MessagingSystem,
			
            GameResetSystem: GameResetSystem,
			ReaperSystem: ReaperSystem
		});

	});
});
