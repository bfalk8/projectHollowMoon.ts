module Castlevania {
    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {
            this.preloadBar = this.game.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            this.load.image('titlepage', 'gameRes/titlepage.jpg');
            this.load.image('logo', 'gameRes/logo.png');
            this.load.audio('music', 'gameRes/title.mp3', true);
            this.load.spritesheet('simon', 'gameRes/simon.png', 58, 96, 5);
            this.load.image('level1', 'gameRes/level1.png');
        }

        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000,
                Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }

        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }
    }
}
