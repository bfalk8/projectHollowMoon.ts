module HollowMoon {
    export class Player extends Phaser.Sprite {
      walkSpeed: number;
      jumpSpeed: number;
      fallSpeed: number;
      runSpeed: number;
      runAccel: number;
      runTimer: number;
      baseGravity: number;
      pWorld: Phaser.Physics.Arcade;
      pBody: Phaser.Physics.Arcade.Body;
      pad1: Phaser.SinglePad;
      jumped: boolean;
      onStairs: boolean;
      stairsLine: Phaser.Line;

      constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'charSprite', 'standing');
        this.anchor.setTo(0.5,1);
        //create the animations
        this.animations.add('walkRight', ['walkRight'], 10, true);
        this.animations.add('walkLeft', ['walkLeft'], 10, true);
        this.animations.add('jumpRight', ['jumpRight'], 10, true);
        this.animations.add('jumpLeft', ['jumpLeft'], 10, true);
        /*this.animations.add('walkRight', Phaser.Animation.generateFrameNames('octopus', 0, 24, '', 4), 30, true);*/
        //set Player parameters
        this.walkSpeed = 200;
        this.jumpSpeed = -400;
        this.fallSpeed = this.walkSpeed;
        this.runSpeed = this.walkSpeed * 1.5;
        this.runAccel = 0.5;
        this.runTimer = 0.0;
        this.jumped = false;
        this.onStairs = false;
        this.baseGravity = 800;

        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.gravity.y = this.baseGravity;

        this.body.fixedRotation = true;
        this.body.collideWorldBounds = true;
        this.pWorld = this.game.physics.arcade;
        this.pBody = this.body;
        this.stairsLine = new Phaser.Line(0,0,100,100);
        this.onStartInput();
      }

      update() {
        this.body.velocity.x = 0;
        // this.keyboardUpdate();
        this.controllerUpdate();
        this.stairsLine.setTo(this.x-50, this.y-20, this.x+50, this.y-20);

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
        if(this.pad1.isDown(ControllerBindings.moveRight)) {
          if(this.pBody.onFloor()) {
            // this.runTimer += this.game.time.physicsElapsed;
            this.pBody.velocity.x = this.walkSpeed;
            this.animations.play('walkRight');
            this.jumped = false;
          } else if(this.onStairs) {
            this.pBody.velocity.x = this.walkSpeed;
            this.pBody.velocity.y = -this.walkSpeed;
            this.animations.play('walkRight');
            this.jumped = false;
          } else {
            this.pBody.velocity.x = this.fallSpeed;
            this.animations.play('jumpRight');
          }
        } else if (this.pad1.isDown(ControllerBindings.moveLeft)) {
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
        if(this.pad1.isDown(ControllerBindings.jump) && this.pBody.onFloor()) {
          this.body.velocity.y = this.jumpSpeed;
          this.jumped = true;
        }
        if(this.pad1.isUp(ControllerBindings.jump) && this.jumped && this.pBody.velocity.y < 0) {
          this.pBody.velocity.y = 0;
        }
        if(this.pad1.isDown(ControllerBindings.dodge)){
          //this.onStairs = true;
          this.pBody.gravity.y = 0;
          this.pBody.velocity.y = 0;
          // this.pBody.enable = false;
        } else {
          //this.onStairs = false;
          //this.pBody.gravity.y = this.baseGravity;
          // this.pBody.enable = true;
        }
      }

      setStairs(stair: Phaser.Line) {
        this.onStairs = true;
        this.pBody.gravity.y = 0;
        this.pBody.velocity.y = 0;
      }

    }
}
