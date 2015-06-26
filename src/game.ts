module Castlevania {
    export class Game extends Phaser.Game {
        constructor() {
            super(800, 600, Phaser.AUTO, '');
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Level1', Level1, false);
            this.state.start('Boot');
        }
    }
}

window.onload = () => {
    new Castlevania.Game();
};
