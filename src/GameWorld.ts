module HollowMoon {
    export class GameWorld extends Phaser.State {

        worldGroup: Phaser.Group;
        uiGroup: Phaser.Group;
        player: Player;
        map: Phaser.Tilemap;
        layerBG: Phaser.TilemapLayer;
        layerParallax: Phaser.TilemapLayer;
        layerPlatforms: Phaser.TilemapLayer;
        zoneEdges: Phaser.Rectangle[];
        p2PlayerGroup: Phaser.Physics.P2.CollisionGroup;
        p2PlatformGroup: Phaser.Physics.P2.CollisionGroup;
        p2ZoneGroup: Phaser.Physics.P2.CollisionGroup;

        /** Called once on load */
        create() {
          this.worldGroup = new Phaser.Group(this.game, this.world, 'worldGroup');
          this.uiGroup = new Phaser.Group(this.game, this.world, 'uiGroup');
          this.physics.startSystem(Phaser.Physics.P2JS);
          this.physics.setBoundsToWorld();
          this.stage.backgroundColor = '2f9d8c';
          /*this.player = new Player(this.game, 0, 0);
          this.player.name = 'player';
          this.worldGroup.add(this.player);*/
          this.createMap('mapStart');

          /*this.game.camera.follow(this.player);*/
          //creates tap eventListener and calls starFull() when triggered. This is only used for testing until a more permanent implementation.
          this.game.input.onTap.add(this.startFull, this.game.scale);
          this.game.time.advancedTiming = true;
        }

        /** Called every frame, heart of the game loop */
        update() {
          if(this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
            this.game.time.fpsMin = 60;
          }
          this.checkZoneEdges();
        }

        /** Use for debug information, called after update() */
        render() {
          this.game.debug.body(this.player);
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
            /*this.game.physics.p2.clearTilemapLayerBodies(this.map);*/
            this.game.physics.p2.clear();
            this.map.destroy();
            this.layerBG.destroy();
            this.layerPlatforms.destroy();
            /*this.player.kill();*/
            this.player.destroy();
          }
          //create the new map
          var tilePath:string = 'gameRes/tilemaps/';
          var jsonFile = this.cache.getJSON(mapName + 'J');
          this.map = this.game.add.tilemap(mapName);

          this.map.addTilesetImage('bg', mapName + 'BG');
          this.map.addTilesetImage('platformTiles', mapName + 'Platforms');
          this.layerBG = this.map.createLayer('background');
          this.layerPlatforms = this.map.createLayer('platforms');

          //set up character
          var playerPos = jsonFile.layers[2].objects.filter(function ( playerPos ) {
            return playerPos.type === 'playerSpawn';
            })[0];

          this.player = new Player(this.game, playerPos.x, playerPos.y);
          this.player.name = 'player';
          this.camera.follow(this.player);

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
          this.game.physics.p2.restitution = 0;
          this.game.physics.p2.friction = 1;
          this.game.physics.p2.gravity.y = 300;

          //setup character properly...needs to change when the data is imported from Tiled JSON
          /*var playerPos = jsonFile.layers[2].objects.filter(function ( playerPos ) {
            return playerPos.type === 'playerSpawn';
            })[0];*/
          //this.player.body.reset(playerPos.x, playerPos.y);
          //this.player.revive();
          //this.game.physics.p2.enable(this.player);

          //zone init
          var zoneEdges = jsonFile.layers[2].objects.filter(function ( element ) {
            return element.type === 'zoneEdge';
          });
          this.zoneEdges = [];
          console.log(zoneEdges);
          for(var zone in zoneEdges){
            console.log(zoneEdges[zone]);
            var currZone = zoneEdges[zone];
            this.zoneEdges.push(new Phaser.Rectangle(currZone.x, currZone.y, currZone.width, currZone.height));
          }
          console.log(this.player.body.data);
          /*this.zones = this.game.make.sprite(zoneSpot.x, zoneSpot.y, 'elisa', 1);*/
          /*this.world.add(this.zones);*/
          /*this.game.physics.p2.enable(this.zones);*/
          /*this.zones.body.onBeginContact.add(this.checkCollision, this);*/
        }

        checkZoneEdges() {
          var playerCheck = new Phaser.Rectangle(this.player.x, this.player.y, this.player.width, this.player.height);
          for(var zone in this.zoneEdges) {
            if(Phaser.Rectangle.intersects(playerCheck, this.zoneEdges[zone])) {
              this.createMap('mapSecond');
            }
          }
        }

    }
}
