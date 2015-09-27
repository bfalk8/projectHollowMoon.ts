module HollowMoon {
    export class Player extends Phaser.Sprite {
      walkSpeed: number;
      jumpSpeed: number;
      fallSpeed: number;
      runSpeed: number;
      runAccel: number;
      runTimer: number;
      dodgeSpeed: number;
      dodgeTime: number;          //time to dodge in ms
      dodgeType: DodgeType;
      dodging: boolean;
      dodgeTimer: Phaser.Timer;
      grounded: boolean;        //check for if dodge is reset by touching ground
      baseGravity: number;
      facing: CharacterFacing;
      moveable: boolean;
      maxV: Phaser.Point;
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
        this.facing = CharacterFacing.RIGHT;
        this.baseGravity = 800;
        this.dodgeSpeed = 800;
        this.dodgeTime = 250;
        this.dodging = false;
        this.moveable = true;
        this.maxV = new Phaser.Point(this.runSpeed, this.fallSpeed);

        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.gravity.y = this.baseGravity;

        this.body.fixedRotation = true;
        this.body.collideWorldBounds = true;
        this.pWorld = this.game.physics.arcade;
        this.pBody = this.body;
        //this.pBody.maxVelocity = this.maxV;
        this.stairsLine = new Phaser.Line(0,0,100,100);
        this.onStartGamepad();


      }

      update() {
        this.body.velocity.x = 0;
        if (this.pBody.onFloor())
          this.grounded = true;
        // this.keyboardUpdate();
        this.controllerUpdate();
        this.otherMovement();
        this.stairsLine.setTo(this.x-50, this.y-20, this.x+50, this.y-20);

      }

      otherMovement() {
        if(this.dodging) {
          switch (this.dodgeType){
            case DodgeType.RIGHT:
              this.pBody.velocity.x = this.dodgeSpeed;
              break;
            case DodgeType.LEFT:
              this.pBody.velocity.x = -this.dodgeSpeed;
              break;
            case DodgeType.BACKRIGHT:
              this.pBody.velocity.x = this.dodgeSpeed;
              break;
            case DodgeType.BACKLEFT:
              this.pBody.velocity.x = -this.dodgeSpeed;
              break;
          }
        }
      }

      /** Initial controller connect */
      onStartGamepad() {
        /*if(this.game.input.gamepad.active) {
            this.game.input.gamepad.stop();
        } else {
            this.game.input.gamepad.start();
            this.pad1 = this.game.input.gamepad.pad1;
        }*/
        this.game.input.gamepad.start();
        this.pad1 = this.game.input.gamepad.pad1;
        // sets up callbacks for controller
        this.game.input.gamepad.addCallbacks(this, {
          onConnect: function(padIndex){console.log("Pad1 Connected!");this.onStartGamepad();},
          onDisconnect: function(padIndex){console.log("Pad1 Disconnected!")},
          onDown: function(buttonCode, value, padIndex){},
          onUp: this.padUp,//function(buttonCode, value){console.log(this.walkSpeed)},
          onAxis: function(pad, axis, value, padIndex){},
          onFloat: function(buttonCode, value, padIndex){},
        });
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
          // this.runTimer += this.game.time.physicsElapsed;
          this.walkRight();
        } else if (this.pad1.isDown(ControllerBindings.moveLeft)) {
          this.walkLeft();
        } else {
          this.animations.frameName = 'standing';
          this.runTimer = 0.0;
        }
        if(this.pad1.isDown(ControllerBindings.jump)) {
          this.jump();
        }
        if(this.pad1.isDown(ControllerBindings.dodge)){
          //this.dodge();
        }
      }

      /** Gets called when a gamepad button is released */
      padUp(buttonCode, value, padIndex) {
        switch(buttonCode) {
          case ControllerBindings.jump :
            this.jumpCancel();
            break;
          case ControllerBindings.dodge :
            this.dodge();
            break;
        }
      }

      walkRight() {
        if(this.onStairs) {
          this.pBody.velocity.x = this.walkSpeed;
          this.pBody.velocity.y = -this.walkSpeed;
          this.animations.play('walkRight');
          this.jumped = false;
        } else if(this.pBody.onFloor()) {
          this.pBody.velocity.x = this.walkSpeed;
          this.animations.play('walkRight');
          this.jumped = false;
        } else {
          this.pBody.velocity.x = this.fallSpeed;
          this.animations.play('jumpRight');
        }
        this.facing = CharacterFacing.RIGHT;
      }

      walkLeft() {
        if(this.pBody.onFloor()){
          this.pBody.velocity.x = -this.walkSpeed;
          this.animations.play('walkLeft');
          this.jumped = false;
        } else {
          this.pBody.velocity.x = -this.fallSpeed;
          this.animations.play('jumpLeft');
        }
        this.facing = CharacterFacing.LEFT;
      }

      jump() {
        if(this.pBody.onFloor() || this.dodging && !this.jumped) {
          this.body.velocity.y = this.jumpSpeed;
          this.jumped = true;
          //cancels dodges
          this.dodging = false;
        }
      }

      jumpCancel() {
        if(this.jumped && this.pBody.velocity.y < 0) {
          this.pBody.velocity.y = 0;
        }
      }

      dodge() {
        //this.pBody.velocity.y = 0;
        if (this.pad1.isDown(ControllerBindings.moveRight)) {
          this.dodgeType = DodgeType.RIGHT;
        } else if (this.pad1.isDown(ControllerBindings.moveLeft)) {
          this.dodgeType = DodgeType.LEFT;
        } else {
          switch(this.facing) {
            case CharacterFacing.RIGHT:
              this.dodgeType = DodgeType.BACKLEFT;
              break;
            case CharacterFacing.LEFT:
              this.dodgeType = DodgeType.BACKRIGHT;
          }
        }
        if (this.grounded) {
          this.dodging = true;
          this.grounded = false;
          this.dodgeTimer = this.game.time.create(false);
          this.dodgeTimer.add(this.dodgeTime, function(){this.dodging = false;}, this);
          this.dodgeTimer.start();
        }
      }

      setStairs(stair: Phaser.Line) {
        this.onStairs = true;
        this.pBody.gravity.y = 0;
        this.pBody.velocity.y = 0;
      }

    }

    enum DodgeType {
      RIGHT,
      LEFT,
      BACKRIGHT,
      BACKLEFT
    }

    export enum CharacterFacing {
      RIGHT,
      LEFT
    }
}
