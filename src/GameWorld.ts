module HollowMoon {
    export class GameWorld extends Phaser.State {

        worldGroup: Phaser.Group;
        uiGroup: Phaser.Group;
        player: Player;
        map: Phaser.Tilemap;
        layerPlatforms: Phaser.TilemapLayer;
        imagePara: Phaser.TileSprite;
        imageBG: Phaser.Image;
        imageFG: Phaser.Image;
        mapName: string;
        zoneEdges: Zone[];
        zoneDoors: Zone[];
        parallaxAmmount: number;

        /** Called once on load */
        create() {
          this.worldGroup = new Phaser.Group(this.game, this.world, 'worldGroup');
          this.uiGroup = new Phaser.Group(this.game, this.world, 'uiGroup');
          this.physics.startSystem(Phaser.Physics.ARCADE);
          this.physics.setBoundsToWorld();
          this.stage.backgroundColor = '2f9d8c';
          this.createMap('map1');
          this.parallaxAmmount = 0.3;

          //creates tap eventListener and calls starFull() when triggered. This is only used for testing until a more permanent implementation.
          this.game.input.onTap.add(this.startFull, this.game.scale);
          this.game.time.advancedTiming = true;
        }

        /** Called every frame, heart of the game loop */
        update() {
          this.game.physics.arcade.collide(this.player, this.layerPlatforms);
          if(this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
            this.game.time.fpsMin = 60;
          }
          this.checkZoneEdges();
          if(this.game.input.keyboard.isDown(KeyBindings.openDoor)) {
            this.checkZoneDoors();
          }

          //add parallax effect
          this.imagePara.tilePosition.set(-this.game.camera.x*this.parallaxAmmount, -this.game.camera.y*this.parallaxAmmount);

        }

        /** Use for debug information, called after update() */
        render() {
          //this.game.debug.body(this.player);
          this.game.debug.text('current: ' + this.game.time.fps.toString(), 10, 20);
          this.game.debug.text('min: ' + this.game.time.fpsMin.toString(), 10, 40);
          this.game.debug.text('x: ' + this.player.position.x.toPrecision(6), 10, 60);
          this.game.debug.text('y: ' + this.player.position.y.toPrecision(6), 10, 80);
        }

        /** Used for going into Fullscreen mode.*/
        startFull() {
          this.game.scale.startFullScreen();
        }

        /** Creates the level from tile map data.*/
        createMap(mapName: string) {
          this.mapName = mapName;
          console.log(mapName);
          //destroy the old map and player
          if(this.map !== undefined) {
            this.map.destroy();
            this.imageBG.destroy();
            this.imagePara.destroy();
            this.imageFG.destroy();
            this.layerPlatforms.destroy();
            this.player.destroy();
          }
          //create the new map
          var tilePath:string = 'gameRes/tilemaps/';
          var jsonFile = this.cache.getJSON(mapName + 'J');
          this.map = this.game.add.tilemap(mapName);

          this.map.addTilesetImage('platformTiles', mapName + 'Platforms');
          this.imagePara = this.game.add.tileSprite(0, 0, 1024, 576, mapName + 'Para');
          this.imageBG = this.game.add.image(0, 0, mapName + 'BG');
          this.imageFG = this.game.add.image(0, 0, mapName + 'FG');
          this.layerPlatforms = this.map.createLayer('platforms');

          //parallax effects
          /*this.layerBG.scrollFactorX = 0.5;*/
          this.imagePara.fixedToCamera = true;

          //set up character
          this.createPlayer();

          //add all the tilemap layers to the worldGroup
          this.worldGroup.addMultiple([this.imagePara, this.imageBG, this.layerPlatforms, this.player, this.imageFG]);
          this.layerPlatforms.resizeWorld();

          //set rendering order and sort the group fro proper rendering
          this.imagePara.z = 0;
          this.imageBG.z = 1;
          this.layerPlatforms.z = 2;
          this.player.z = 3;
          this.imageFG.z = 4;
          this.worldGroup.sort();

          /*this.imagePara.fixedToCamera = true;*/

          //collisions
          this.map.setCollisionByExclusion([0], true, 'platforms');

          //zone init
          var zones;
          for (var elem in jsonFile.layers) {
            if(jsonFile.layers[elem].name === "zones") {
              zones = jsonFile.layers[elem];
            }
          }
          //creates the zones for the edges of the current room
          var zoneEdges = zones.objects.filter(function ( element ) {
            return element.type === 'zoneEdge';
          });
          this.zoneEdges = [];
          for(var zone in zoneEdges) {
            var currZone = zoneEdges[zone];
            this.zoneEdges.push(new Zone(currZone.x, currZone.y, currZone.width, currZone.height, currZone.name));
          }
          //creates the zones that are used as 'doors'
          var zoneDoors = zones.objects.filter(function (element) {
            return element.type === 'zoneDoor';
            });
          this.zoneDoors = [];
          for(var zone in zoneDoors) {
            var currZone = zoneDoors[zone];
            this.zoneDoors.push(new Zone(currZone.x, currZone.y, currZone.width, currZone.height, currZone.name));
          }

        }

        /** Finds object with proper property */
        findElement(prop:string) {

        }

        /** Sets up player in new zone */
        createPlayer() {
          var playerPos = this.cache.getJSON(this.mapName + 'J').layers[7].objects.filter(function ( playerPos ) {
            return playerPos.type === 'playerSpawn';
          })[0];

          this.player = new Player(this.game, playerPos.x, playerPos.y);
          this.player.name = 'player';
          this.camera.follow(this.player);
        }

        /** Checks if player is passing into a new zone */
        checkZoneEdges() {
          var playerCheck = new Phaser.Rectangle(this.player.x, this.player.y, this.player.width, this.player.height);
          for(var zone in this.zoneEdges) {
            if(Phaser.Rectangle.intersects(playerCheck, this.zoneEdges[zone])) {
              this.createMap(this.zoneEdges[zone].name);
            }
          }
        }
        /** Checks if player is overlapping with a zone door */
        checkZoneDoors() {
          var playerCheck = new Phaser.Rectangle(this.player.x, this.player.y, this.player.width, this.player.height);
          for(var zone in this.zoneDoors) {
            if(Phaser.Rectangle.intersects(playerCheck, this.zoneDoors[zone])) {
              this.createMap(this.zoneDoors[zone].name);
            }
          }
        }

    }
}
