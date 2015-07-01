module HollowMoon {
    export class Game extends Phaser.Game {
        constructor() {
            super(800, 600, Phaser.AUTO, '');
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Level1', Level1, false);
            this.state.start('Boot');

        }

        create() {
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            console.log("does this even run?");
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
