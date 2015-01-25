var _5gon = _5gon || [];
_5gon.push(function(loaded) {

           function Sprite(resource) {
                this.sprite = resource;
           };
           
           function Color(r, g, b) {
                this.color = {};
                this.color.r = r;
                this.color.g = g;
                this.color.b = b;
           };
           
           function RemainingHits(remainingHits) {
                this.remainingHits = remainingHits;
           };
           
           function CollisionRectangle(x, y, w, h) {
                this.collisionRectangle = {};
                this.collisionRectangle.x = x;
                this.collisionRectangle.y = y;
                this.collisionRectangle.w = w;
                this.collisionRectangle.h = h;
           }
           
           function UserControlledPaddle() {
                this.UserControlledPaddle = true;
           }
           
           function IsABall() {
                this.isABall = true;
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