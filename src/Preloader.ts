module HollowMoon {
    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {
            this.preloadBar = this.game.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            // this.load.image('titlepage', 'gameRes/titlepage.jpg');
            // this.load.image('logo', 'gameRes/logo.png');
            // this.load.audio('music', 'gameRes/title.mp3', true);
            this.load.spritesheet('elisa', 'gameRes/sprites/elisa.png', 56, 56);
            // this.load.image('level1', 'gameRes/level1.png');
            this.load.tilemap('tiled', 'gameRes/tilemaps/test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('tiled2', 'gameRes/tilemaps/test2.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('extBG', 'gameRes/tilemaps/extBG.png');
            this.load.image('extPara', 'gameRes/tilemaps/extPara.png');
            this.load.image('platformTiles', 'gameRes/tilemaps/platformTiles.png');
            this.load.json('tiledJson', 'gameRes/tilemaps/test2.json');

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
