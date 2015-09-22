module HollowMoon {
    export class Player extends Phaser.Sprite {
      walkSpeed: number;
      jumpSpeed: number;
      fallSpeed: number;
      runAccel: number;
      runTimer: number;
      pWorld: Phaser.Physics.Arcade;
      pBody: Phaser.Physics.Arcade.Body;
      pad1: Phaser.SinglePad;
      jumped: boolean;

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
        this.body.gravity.y = 800;

        this.body.fixedRotation = true;
        this.body.collideWorldBounds = true;
        this.pWorld = this.game.physics.arcade;
        this.pBody = this.body;

        //set Player parameters
        this.walkSpeed = 200;
        this.jumpSpeed = -400;
        this.fallSpeed = this.walkSpeed;
        this.runAccel = 0.5;
        this.runTimer = 0.0;
        this.jumped = false;
        this.onStartInput();
      }

      update() {
        this.body.velocity.x = 0;
        // this.keyboardUpdate();
        this.controllerUpdate();

      }

      /** Initial controller connect */
      onStartInput() {
        if(this.game.input.gamepad.active) {
            this.game.input.gamepad.stop();
        } else {
            this.game.input.gamepad.start();
            this.pad1 = this.game.input.gamepad.pad1;
        }
      }

      /** Handles keyboard input */
      keyboardUpdate() {
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

      /** Handles Controller input */
      controllerUpdate() {
        // this.pBody.velocity.x = this.walkSpeed * this.pad1.axis(0);
        if(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)) {
          if(this.pBody.onFloor()) {
            // this.runTimer += this.game.time.physicsElapsed;
            this.pBody.velocity.x = this.walkSpeed;
            this.animations.play('walkRight');
            this.jumped = false;
          } else {
            this.pBody.velocity.x = this.fallSpeed;
            this.animations.play('jumpRight');
          }
        } else if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)) {
          if(this.pBody.onFloor()){
            this.pBody.velocity.x = -this.walkSpeed;
            this.animations.play('walkLeft');
            this.jumped = false;
          } else {
            this.pBody.velocity.x = -this.fallSpeed;
            this.animations.play('jumpLeft');
          }
        } else {
          this.animations.frameName = 'standing';
          this.runTimer = 0.0;
        }
        if(this.pad1.isDown(Phaser.Gamepad.XBOX360_A) && this.pBody.onFloor()) {
          this.body.velocity.y = this.jumpSpeed;
          this.jumped = true;
        }
        if(this.pad1.isUp(Phaser.Gamepad.XBOX360_A) && this.jumped && this.pBody.velocity.y < 0) {
          this.pBody.velocity.y = 0;
        }
      }

    }
}
