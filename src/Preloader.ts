module HollowMoon {
    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {
            this.preloadBar = this.game.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            this.load.spritesheet('elisa', 'gameRes/sprites/elisa.png', 56, 56);
            
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
