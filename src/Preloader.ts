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
            //this.load.tilemap('mapStart', 'gameRes/tilemaps/mapStart.json', null, Phaser.Tilemap.TILED_JSON);
            //this.load.tilemap('mapSecond', 'gameRes/tilemaps/mapSecond.json', null, Phaser.Tilemap.TILED_JSON);
            /*this.load.image('extBG', 'gameRes/tilemaps/extBG.png');
            this.load.image('extPara', 'gameRes/tilemaps/extPara.png');
            this.load.image('platformTiles', 'gameRes/tilemaps/platformTiles.png');*/
            /*this.load.json('mapStartJ', 'gameRes/tilemaps/mapStart.json');
            this.load.json('mapSecondJ', 'gameRes/tilemaps/mapSecond.json');*/
            //this.load.image('test2BG', 'gameRes/tilemaps/test2.png');

            //Load all the data required for TileMaps
            for(var map in MapList) {
              var jsonFile = this.cache.getJSON(map + 'J');
              var tilePath = 'gameRes/tilemaps/'
              this.load.tilemap(map, '', jsonFile, Phaser.Tilemap.TILED_JSON);
              var bgPath:string = tilePath + jsonFile.tilesets[0].image;
              var platformPath:string = tilePath + jsonFile.tilesets[1].image;
              this.load.image(map + 'BG', bgPath);
              this.load.image(map + 'Platforms', platformPath);
            }

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
