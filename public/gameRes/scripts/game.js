var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HollowMoon;
(function (HollowMoon) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'gameRes/sprites/loader.png');
            //load all tilemap json files listed in MapList var in MapData.ts
            var tilePath = 'gameRes/tilemaps/';
            for (var map in HollowMoon.MapList) {
                this.load.json(map + 'J', tilePath + HollowMoon.MapList[map]);
            }
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                // desktop settings
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
            else {
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
        };
        Boot.prototype.setKeyCapture = function () {
        };
        return Boot;
    })(Phaser.State);
    HollowMoon.Boot = Boot;
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 1024, 576, Phaser.CANVAS, '');
            this.state.add('Boot', HollowMoon.Boot, false);
            this.state.add('Preloader', HollowMoon.Preloader, false);
            this.state.add('MainMenu', HollowMoon.MainMenu, false);
            this.state.add('GameWorld', HollowMoon.GameWorld, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    HollowMoon.Game = Game;
})(HollowMoon || (HollowMoon = {}));
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
window.onload = function () {
    new HollowMoon.Game();
};
var HollowMoon;
(function (HollowMoon) {
    var GameWorld = (function (_super) {
        __extends(GameWorld, _super);
        function GameWorld() {
            _super.apply(this, arguments);
        }
        /** Called once on load */
        GameWorld.prototype.create = function () {
            this.worldGroup = new Phaser.Group(this.game, this.world, 'worldGroup');
            this.uiGroup = new Phaser.Group(this.game, this.world, 'uiGroup');
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.physics.setBoundsToWorld();
            this.stage.backgroundColor = '2f9d8c';
            this.createMap('mapStart');
            //creates tap eventListener and calls starFull() when triggered. This is only used for testing until a more permanent implementation.
            this.game.input.onTap.add(this.startFull, this.game.scale);
            this.game.time.advancedTiming = true;
        };
        /** Called every frame, heart of the game loop */
        GameWorld.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, this.layerPlatforms);
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
                this.game.time.fpsMin = 60;
            }
            this.checkZoneEdges();
        };
        /** Use for debug information, called after update() */
        GameWorld.prototype.render = function () {
            this.game.debug.body(this.player);
            this.game.debug.text('current: ' + this.game.time.fps.toString(), 10, 20);
            this.game.debug.text('min: ' + this.game.time.fpsMin.toString(), 10, 40);
            this.game.debug.text('x: ' + this.player.position.x.toString(), 10, 60);
            this.game.debug.text('y: ' + this.player.position.y.toString(), 10, 80);
        };
        /** Used for going into Fullscreen mode.*/
        GameWorld.prototype.startFull = function () {
            this.game.scale.startFullScreen();
        };
        /** Creates the level from tile map data.*/
        GameWorld.prototype.createMap = function (mapName) {
            this.mapName = mapName;
            //destroy the old map
            if (this.map !== undefined) {
                /*this.game.physics.arcade.clearTilemapLayerBodies(this.map, this.layerPlatforms);*/
                /*this.game.physics.p2.clear();*/
                this.map.destroy();
                this.layerBG.destroy();
                this.layerPlatforms.destroy();
                /*this.player.kill();*/
                this.player.destroy();
            }
            //create the new map
            var tilePath = 'gameRes/tilemaps/';
            var jsonFile = this.cache.getJSON(mapName + 'J');
            this.map = this.game.add.tilemap(mapName);
            this.map.addTilesetImage('bg', mapName + 'BG');
            this.map.addTilesetImage('platformTiles', mapName + 'Platforms');
            this.layerBG = this.map.createLayer('background');
            this.layerPlatforms = this.map.createLayer('platforms');
            //set up character
            this.createPlayer();
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
            /*this.physics.ninja.convertTilemap(this.map, 'platforms',{});*/
            /*this.game.physics.p2.restitution = 0;
            this.game.physics.p2.friction = 1;
            this.game.physics.p2.gravity.y = 300;*/
            //zone init
            var zoneEdges = jsonFile.layers[2].objects.filter(function (element) {
                return element.type === 'zoneEdge';
            });
            this.zoneEdges = [];
            for (var zone in zoneEdges) {
                var currZone = zoneEdges[zone];
                this.zoneEdges.push(new HollowMoon.ZoneEdge(currZone.x, currZone.y, currZone.width, currZone.height, currZone.name));
            }
        };
        /** Sets up player in new zone */
        GameWorld.prototype.createPlayer = function () {
            var playerPos = this.cache.getJSON(this.mapName + 'J').layers[2].objects.filter(function (playerPos) {
                return playerPos.type === 'playerSpawn';
            })[0];
            this.player = new HollowMoon.Player(this.game, playerPos.x, playerPos.y);
            this.player.name = 'player';
            this.camera.follow(this.player);
        };
        /** Checks if player is passing into a new zone */
        GameWorld.prototype.checkZoneEdges = function () {
            var playerCheck = new Phaser.Rectangle(this.player.x, this.player.y, this.player.width, this.player.height);
            for (var zone in this.zoneEdges) {
                if (Phaser.Rectangle.intersects(playerCheck, this.zoneEdges[zone])) {
                    this.createMap(this.zoneEdges[zone].name);
                }
            }
        };
        return GameWorld;
    })(Phaser.State);
    HollowMoon.GameWorld = GameWorld;
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    /** Assign Default Keybindings here, they can be changed with changeKey func*/
    HollowMoon.KeyBindings = {
        moveLeft: Phaser.Keyboard.LEFT,
        moveRight: Phaser.Keyboard.RIGHT,
        jump: Phaser.Keyboard.UP,
        crouch: Phaser.Keyboard.DOWN,
        dodge: Phaser.Keyboard.CONTROL,
    };
    /**
     * Changes key bindings for use withing game.
     * @param {string} binding - The name of the binding to change
     * @param {number} key - The Phaser.Keyboard key to set binding to
     */
    function changeKey(binding, key) {
        HollowMoon.KeyBindings[binding] = key;
    }
    HollowMoon.changeKey = changeKey;
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            // this.background = this.add.sprite(0, 0, 'titlepage');
            // this.background.alpha = 0;
            //
            // this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            // this.logo.anchor.setTo(0.5);
            //
            // this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            // this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            //
            // this.input.onDown.addOnce(this.fadeOut, this);
            this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, "Hollow Moon", { fill: '#2b918e' });
            this.input.onDown.addOnce(this.startGame, this);
        };
        MainMenu.prototype.fadeOut = function () {
            // this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            // var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            // tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('GameWorld', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    HollowMoon.MainMenu = MainMenu;
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    HollowMoon.MapList = {
        mapStart: 'mapStart.json',
        mapSecond: 'mapSecond.json'
    };
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'elisa', 0);
            this.anchor.setTo(0.5);
            this.animations.add('walk', [21, 22, 23, 24, 25], 10, true);
            this.animations.add('jump', [9, 10, 11, 12], 10, true);
            game.add.existing(this);
            game.physics.arcade.enable(this);
            this.body.gravity.y = 100;
            this.body.fixedRotation = true;
            this.body.collideWorldBounds = true;
            this.pWorld = this.game.physics.arcade;
            this.pBody = this.body;
            //set Player parameters
            this.walkSpeed = 150;
            this.jumpSpeed = 350;
            this.isGrounded = false;
            this.fallSpeed = 600;
        }
        Player.prototype.update = function () {
            this.body.velocity.x = 0;
            if (this.game.input.keyboard.isDown(HollowMoon.KeyBindings.moveRight)) {
                this.pBody.velocity.x = this.walkSpeed;
                this.animations.play('walk');
            }
            else if (this.game.input.keyboard.isDown(HollowMoon.KeyBindings.moveLeft)) {
                this.pBody.velocity.x = -this.walkSpeed;
                this.animations.play('jump');
            }
            else {
                this.animations.frame = 0;
            }
            if (this.game.input.keyboard.isDown(HollowMoon.KeyBindings.jump) && this.pBody.onFloor()) {
                this.body.velocity.y = -this.jumpSpeed;
            }
        };
        /** Checks if the player is grounded */
        /*checkFloor(): boolean {
          //console.log(this.body.data);
          var result:boolean = false;
          var yAxis = p2.vec2.fromValues(0,1);
          for(var i=0; i<this.p2World.world.narrowphase.contactEquations.length; i++){
            var c = this.p2World.world.narrowphase.contactEquations[i];
            if(c.bodyA === this.body.data || c.bodyB === this.body.data){
              var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
              if(c.bodyA === this.body.data) d *= -1;
              if(d > 0.5) result = true;
            }
          }
          return result;
        }*/
        /** onBeginCollision and onEndCollision callback */
        Player.prototype.setGrounded = function (a, b, c, d) {
            console.log('blah');
            this.isGrounded = !this.isGrounded;
        };
        return Player;
    })(Phaser.Sprite);
    HollowMoon.Player = Player;
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
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
            for (var map in HollowMoon.MapList) {
                var jsonFile = this.cache.getJSON(map + 'J');
                var tilePath = 'gameRes/tilemaps/';
                this.load.tilemap(map, '', jsonFile, Phaser.Tilemap.TILED_JSON);
                var bgPath = tilePath + jsonFile.tilesets[0].image;
                var platformPath = tilePath + jsonFile.tilesets[1].image;
                this.load.image(map + 'BG', bgPath);
                this.load.image(map + 'Platforms', platformPath);
            }
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    HollowMoon.Preloader = Preloader;
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    var ZoneEdge = (function (_super) {
        __extends(ZoneEdge, _super);
        function ZoneEdge(x, y, width, height, name) {
            _super.call(this, x, y, width, height);
            this.name = name;
        }
        return ZoneEdge;
    })(Phaser.Rectangle);
    HollowMoon.ZoneEdge = ZoneEdge;
})(HollowMoon || (HollowMoon = {}));
//# sourceMappingURL=game.js.map