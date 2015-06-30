module HollowMoon {
    export class Player extends Phaser.Sprite {
      constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'elisa', 0);
        this.anchor.setTo(0.5);
        this.animations.add('walk', [21, 22, 23, 24, 25], 10, true);
        this.animations.add('jump', [9, 10, 11, 12], 10, true);
        game.add.existing(this);
        game.physics.enable(this);
        game.physics.arcade.gravity.y = 600;
      }


      update() {

        this.body.velocity.x = 0;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.body.velocity.x = -150;
            // if(this.body.onFloor()) {
            //   this.animations.play('walk');
            // } else {
              this.animations.play('jump');
            // }
            // if (this.scale.x === 1) {
            //     this.scale.x = -1;
            // }
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.body.velocity.x = 150;
            // if(this.body.onFloor()) {
              this.animations.play('walk');
            // } else {
            //   this.animations.play('jump');
            // }
            // if (this.scale.x === -1) {
            //     this.scale.x = 1;
            // }
        } else {
            this.animations.frame = 0;
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)  && this.body.onFloor()) {
          this.body.velocity.y = -300;
        }
      }
    }
}
