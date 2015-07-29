module HollowMoon {
    export class Player extends Phaser.Sprite {
      walkSpeed: number;
      jumpSpeed: number;
      fallSpeed: number;
      pWorld: Phaser.Physics.Arcade;
      pBody: Phaser.Physics.Arcade.Body;

      constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'charSprite', 'standing');
        /*this.anchor.setTo(0.5);*/
        //create the animations
        this.animations.add('walkRight', ['walkRight'], 10, true);
        this.animations.add('walkLeft', ['walkLeft'], 10, true);
        this.animations.add('jumpRight', ['jumpRight'], 10, true);
        this.animations.add('jumpLeft', ['jumpLeft'], 10, true);
        /*this.animations.add('walkRight', Phaser.Animation.generateFrameNames('octopus', 0, 24, '', 4), 30, true);*/
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
            this.animations.play('walkRight');
          } else {
            this.pBody.velocity.x = this.fallSpeed;
            this.animations.play('jumpRight');
          }
        } else if (this.game.input.keyboard.isDown(KeyBindings.moveLeft)) {
          if(this.pBody.onFloor()){
            this.pBody.velocity.x = -this.walkSpeed;
            this.animations.play('walkLeft');
          } else {
            this.pBody.velocity.x = -this.fallSpeed;
            this.animations.play('jumpLeft');
          }
        } else {
          this.animations.frameName = 'standing';
        }
        if(this.game.input.keyboard.isDown(KeyBindings.jump) && this.pBody.onFloor()) {
          this.body.velocity.y = this.jumpSpeed;
        }
      }

    }
}
