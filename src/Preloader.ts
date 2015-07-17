module HollowMoon {
    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {
            this.preloadBar = this.game.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            this.load.spritesheet('elisa', 'gameRes/sprites/elisa.png', 56, 56);
            this.load.atlas('charSprite', 'gameRes/sprites/charSprite.png', 'gameRes/sprites/charSprite.json');

            //Load all the data required for TileMaps
            for(var map in MapList) {
              var jsonFile = this.cache.getJSON(map + 'J');
              var tilePath = 'gameRes/tilemaps/';
              this.load.tilemap(map, '', jsonFile, Phaser.Tilemap.TILED_JSON);
              //finds all the image layers in the Tiled json
              var imageArr = jsonFile.layers.filter(function ( element ) {
                return element.type === 'imagelayer';
              });
              //loads all the images from the image layers
              for (var image in imageArr) {
                this.load.image(map + imageArr[image].name, tilePath + imageArr[image].image);
              }
              //finds and loads the sprite sheet for the platform tilemap layer
              var platformPath:string = tilePath + jsonFile.tilesets.filter(function (element) {
                return element.name === 'platformTiles';
              })[0].image;
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
