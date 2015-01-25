var _5gon = _5gon || [];
_5gon.push(function(loaded) {
           
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
           
           loaded("Entities").then(function(Entities) {
            };
           
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
           
});