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
        zones: Phaser.Sprite;
        p2PlayerGroup: Phaser.Physics.P2.CollisionGroup;
        p2PlatformGroup: Phaser.Physics.P2.CollisionGroup;
        p2ZoneGroup: Phaser.Physics.P2.CollisionGroup;

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
          this.player.name = 'player';
          this.worldGroup.add(this.player);
          this.createMap('mapStart');

          /*this.p2PlayerGroup = this.game.physics.p2.createCollisionGroup();
          this.p2ZoneGroup = this.game.physics.p2.createCollisionGroup();
          this.player.body.setCollisionGroup(this.p2PlayerGroup);
          this.player.body.collides(this.p2ZoneGroup, this.checkCollision, this);*/

          this.game.camera.follow(this.player);
          //creates tap eventListener and calls starFull() when triggered. This is only used for testing until a more permanent implementation.
          this.game.input.onTap.add(this.startFull, this.game.scale);
          this.game.time.advancedTiming = true;

          //this.game.physics.p2.setPostBroadphaseCallback(this.checkCollision, this);
        }

        /** Called every frame, heart of the game loop */
        update() {
          //this.game.physics.arcade.collide(this.player, this.layerPlatforms);
          // if(this.player.x > 70)
          //   this.createMap('tiled2');
          if(this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
            this.game.time.fpsMin = 60;
          }
        }

        /** Use for debug information, called after update() */
        render() {
          this.game.debug.body(this.player);
          //this.game.debug.text(this.game.cache.getJSON('tiledJson').layers[0].name, 10, 20);
          this.game.debug.text('current: ' + this.game.time.fps.toString(), 10, 20);
          this.game.debug.text('min: ' + this.game.time.fpsMin.toString(), 10, 40);
          this.game.debug.text('x: ' + this.player.position.x.toString(), 10, 60);
          this.game.debug.text('y: ' + this.player.position.y.toString(), 10, 80);
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
            this.layerPlatforms.destroy();
          }
          //create the new map
          var tilePath:string = 'gameRes/tilemaps/';
          var jsonFile = this.cache.getJSON(mapName + 'J');
          //this.load.tilemap(mapName, '', jsonFile, Phaser.Tilemap.TILED_JSON);
          this.map = this.game.add.tilemap(mapName);
          /*var bgPath:string = tilePath + jsonFile.tilesets[0].image;*/
          /*var platformPath:string = tilePath + jsonFile.tilesets[1].image;*/
          /*this.load.image(mapName + 'BG', bgPath);*/
          /*console.log(bgPath);*/
          /*this.load.image(mapName + 'Platforms', platformPath);*/
          this.map.addTilesetImage('bg', mapName + 'BG');
          this.map.addTilesetImage('platformTiles', mapName + 'Platforms');
          this.layerBG = this.map.createLayer('background');
          this.layerPlatforms = this.map.createLayer('platforms');

          //add all the tilemap layers to the worldGroup
          this.worldGroup.addMultiple([this.layerBG, this.layerPlatforms, this.player]);
          this.layerPlatforms.resizeWorld();
          //set rendering order and sort the group fro proper rendering
          this.layerBG.z = 0;
          this.layerPlatforms.z = 1;
          this.player.z = 4;
          this.worldGroup.sort();
          //collisions
          this.map.setCollisionByExclusion([0], true, 'platforms');
          this.physics.p2.convertTilemap(this.map, 'platforms');
          this.game.physics.p2.restitution = 0.1;
          this.game.physics.p2.gravity.y = 300;
          //this.game.physics.p2.enable(this.player);
          //setup character properly...needs to change when the data is imported from Tiled JSON
          var playerPos = jsonFile.layers[2].objects.filter(function ( playerPos ) {
            return playerPos.type === 'playerSpawn';
            })[0];
          this.player.position.x = playerPos.x;
          this.player.position.y = playerPos.y;

          //zone init
          var zoneSpot = jsonFile.layers[2].objects.filter(function ( zoneSpot ) {
            return zoneSpot.type === 'zoneEdge';
            })[0];
          this.zones = this.game.make.sprite(zoneSpot.x, zoneSpot.y, 'elisa', 1);
          this.world.add(this.zones);
          this.game.physics.p2.enable(this.zones);
          this.zones.body.onBeginContact.add(this.checkCollision, this);
          /*var blah = this.physics.p2.createBody(zoneSpot.x, zoneSpot.y, 0);
          blah.setCollisionGroup(this.p2ZoneGroup);
          blah.addRectangle(100,100);*/
          console.log(zoneSpot);
          /*this.map.addTilesetImage('extBG', 'extBG');
          this.map.addTilesetImage('extPara', 'extPara');
          this.map.addTilesetImage('platformTiles', 'platformTiles');*/
          //should be tile sprite of smaller image...
          //var blah = this.add.image(0,0,'test2BG', this.worldGroup);
          //this.layerBG = this.map.createLayer('background');
          //this.layerParallax = this.map.createLayer('parallax');
          /*var tileBG = this.add.tileSprite(0,0,this.world.width, this.world.height, 'extBG');
          var tilePara = this.add.tileSprite(0,0,this.world.width, this.world.height, 'extPara');*/


        }

        checkCollision(body1, body2, body3, body4) {
          if(body1.sprite !== null && body1.sprite.name === 'player'){
            this.createMap('mapSecond');
          }
        }

    }
}
