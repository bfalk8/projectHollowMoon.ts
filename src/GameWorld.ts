module HollowMoon {
    export class GameWorld extends Phaser.State {

        //background: Phaser.Sprite;
        //music: Phaser.Sound;
        worldGroup: Phaser.Group;
        uiGroup: Phaser.Group;
        player: Player;
        map: Phaser.Tilemap;
        layerBG: Phaser.TilemapLayer;
        layerParallax: Phaser.TilemapLayer;
        layerPlatforms: Phaser.TilemapLayer;

        /** Called once on load */
        create() {
          // this.physics.startSystem(Phaser.Physics.ARCADE);
          // this.background = this.add.sprite(0, 0, 'level1');
          // this.music = this.add.audio('music', 1, false);
          // this.music.play();
          this.worldGroup = new Phaser.Group(this.game, this.world, 'worldGroup');
          this.uiGroup = new Phaser.Group(this.game, this.world, 'uiGroup');
          this.physics.startSystem(Phaser.Physics.P2JS);
          this.physics.setBoundsToWorld();
          this.stage.backgroundColor = '2f9d8c';
          this.player = new Player(this.game, 0, 0);
          this.worldGroup.add(this.player);
          this.createMap('tiled2');

          this.game.camera.follow(this.player);
          //creates tap eventListener and calls starFull() when triggered. This is only used for testing until a more permanent implementation.
          this.game.input.onTap.add(this.startFull, this.game.scale);
        }

        /** Called every frame, heart of the game loop */
        update() {
          //this.game.physics.arcade.collide(this.player, this.layerPlatforms);
          // if(this.player.x > 70)
          //   this.createMap('tiled2');
        }

        /** Use for debug information, called after update() */
        render() {
          this.game.debug.body(this.player);
          this.game.debug.text(this.game.cache.getJSON('tiledJson').layers[0].name, 10, 20);
        }

        /** Used for going into Fullscreen mode.*/
        startFull() {
          this.game.scale.startFullScreen();
        }

        /** Creates the level from tile map data.*/
        createMap(mapName: string) {
          //destroy the old map
          if(this.map !== undefined) {
            this.map.destroy();
            this.layerBG.destroy();
            this.layerParallax.destroy();
            this.layerPlatforms.destroy();
          }
          //create the new map
          this.map = this.game.add.tilemap(mapName);
          this.map.addTilesetImage('extBG', 'extBG');
          this.map.addTilesetImage('extPara', 'extPara');
          this.map.addTilesetImage('platformTiles', 'platformTiles');
          this.layerBG = this.map.createLayer('background');
          this.layerParallax = this.map.createLayer('parallax');
          this.layerPlatforms = this.map.createLayer('platforms');
          //add all the tilemap layers to the worldGroup
          this.worldGroup.addMultiple([this.layerBG, this.layerParallax, this.layerPlatforms, this.player]);
          this.layerBG.resizeWorld();
          //set rendering order and sort the group fro proper rendering
          this.layerBG.z = 0;
          this.layerParallax.z = 1;
          this.layerPlatforms.z = 2;
          this.player.z = 4;
          this.worldGroup.sort();
          //collisions
          this.map.setCollisionByExclusion([0], true, 'platforms');
          this.physics.p2.convertTilemap(this.map, 'platforms');
          this.game.physics.p2.restitution = 0.1;
          this.game.physics.p2.gravity.y = 300;
          //this.game.physics.p2.enable(this.player);
          //setup character properly...needs to change when the data is imported from Tiled JSON
          this.player.position.x = 0;
          this.player.position.y = 0;

        }
    }
}
