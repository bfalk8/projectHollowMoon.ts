module HollowMoon {
    export class Game extends Phaser.Game {
      constructor() {
          super(1024, 576, Phaser.CANVAS, '');
          this.state.add('Boot', Boot, false);
          this.state.add('Preloader', Preloader, false);
          this.state.add('MainMenu', MainMenu, false);
          this.state.add('GameWorld', GameWorld, false);
          this.state.start('Boot');
      }

    }
}
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

window.onload = () => {
    new HollowMoon.Game();
};
