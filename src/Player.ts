module HollowMoon {
    export class Player extends Phaser.Sprite {
      walkSpeed: number;
      jumpSpeed: number;
      fallSpeed: number;
      pWorld: Phaser.Physics.Arcade;
      pBody: Phaser.Physics.Arcade.Body;

      constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'elisa', 0);
        this.anchor.setTo(0.5);
        this.animations.add('walk', [21, 22, 23, 24, 25], 10, true);
        this.animations.add('jump', [9, 10, 11, 12], 10, true);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.gravity.y = 300;

        this.body.fixedRotation = true;
        this.body.collideWorldBounds = true;
        this.pWorld = this.game.physics.arcade;
        this.pBody = this.body;

        //set Player parameters
        this.walkSpeed = 150;
        this.jumpSpeed = -200;
        this.fallSpeed = 100;

      }

      update() {
        this.body.velocity.x = 0;
        if(this.game.input.keyboard.isDown(KeyBindings.moveRight)) {
          if(this.pBody.onFloor()) {
            this.pBody.velocity.x = this.walkSpeed;
            this.animations.play('walk');
          } else {
            this.pBody.velocity.x = this.fallSpeed;
            /*this.animations.play('fall');*/
          }
        } else if (this.game.input.keyboard.isDown(KeyBindings.moveLeft)) {
          if(this.pBody.onFloor()){
            this.pBody.velocity.x = -this.walkSpeed;
            this.animations.play('jump');
          } else {
            this.pBody.velocity.x = -this.fallSpeed;
            /*this.animations.play('fall');*/
          }
        } else {
          this.animations.frame = 0;
        }
        if(this.game.input.keyboard.isDown(KeyBindings.jump) && this.pBody.onFloor()) {
          this.body.velocity.y = this.jumpSpeed;
        }
      }

    }
}
