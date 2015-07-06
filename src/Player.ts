module HollowMoon {
    export class Player extends Phaser.Sprite {
      walkSpeed: number;
      jumpSpeed: number;
      isGrounded: boolean;
      p2World: Phaser.Physics.P2;

      constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'elisa', 0);
        this.anchor.setTo(0.5);
        this.animations.add('walk', [21, 22, 23, 24, 25], 10, true);
        this.animations.add('jump', [9, 10, 11, 12], 10, true);
        game.add.existing(this);
        this.p2World = this.game.physics.p2;
        game.physics.p2.enable(this);
        this.body.fixedRotation = true;
        this.body.collideWorldBounds = true;
        this.body.onBeginContact.add(this.setGrounded, this);
        this.body.onEndContact.add(this.setGrounded, this);
        //set Player parameters
        this.walkSpeed = 150;
        this.jumpSpeed = 350;
        this.isGrounded = false;
      }

      update() {
        this.body.velocity.x = 0;

        if(this.game.input.keyboard.isDown(KeyBindings.moveRight)) {
          this.body.moveRight(this.walkSpeed);
          this.animations.play('walk');
        } else if (this.game.input.keyboard.isDown(KeyBindings.moveLeft)) {
          this.body.moveLeft(this.walkSpeed);
          this.animations.play('jump');
        } else {
          this.animations.frame = 0;
        }
        if(this.game.input.keyboard.isDown(KeyBindings.jump) && this.isGrounded) {
          this.body.velocity.y = -this.jumpSpeed;
        }
      }

      /** Checks if the player is grounded */
      checkFloor(): boolean {
        //console.log(this.body.data);
        var result:boolean = false;
        var yAxis = p2.vec2.fromValues(0,1);
        for(var i=0; i<this.p2World.world.narrowphase.contactEquations.length; i++){
          var c = this.p2World.world.narrowphase.contactEquations[i];
          if(c.bodyA === this.body.data || c.bodyB === this.body.data){
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if(c.bodyA === this.body.data) d *= -1;
            if(d > 0.5) result = true;
          }
        }
        return result;
      }

      /** onBeginCollision and onEndCollision callback */
      setGrounded(a, b, c, d) {
        this.isGrounded = !this.isGrounded;
      }

    }
}
