module HollowMoon {
    export class Boot extends Phaser.State {
      preload() {
        this.load.image('preloadBar' , 'gameRes/sprites/loader.png');
        //load all tilemap json files listed in MapList var in MapData.ts
        var tilePath:string = 'gameRes/tilemaps/';
        for(var map in MapList) {
          this.load.json(map + 'J', tilePath + MapList[map]);
          //console.log(map);
        }
      }

      create() {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
          // desktop settings
          this.scale.pageAlignHorizontally = true;
          this.scale.pageAlignVertically = true;
          this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        } else {
          // mobile settings
          this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          this.scale.minWidth = 480;
          this.scale.minHeight = 260;
          this.scale.maxWidth = 1024;
          this.scale.maxHeight = 768;
          this.scale.forceLandscape = true;
          this.scale.pageAlignHorizontally = true;
          this.scale.refresh();
        }

        this.setKeyCapture();
        this.game.state.start('Preloader', true, false);
      }

      setKeyCapture() {

      }

    }
}
