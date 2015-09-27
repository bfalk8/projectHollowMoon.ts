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
            //trying 720p as that seems to be the best for scaling
            /*super(1280, 720, Phaser.CANVAS, '');*/
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
            this.createMap('map1');
            this.parallaxAmmount = 0.3;
            //creates tap eventListener and calls starFull() when triggered. This is only used for testing until a more permanent implementation.
            this.game.input.onTap.add(this.startFull, this.game.scale);
            this.game.time.advancedTiming = true;
            this.stair = new Phaser.Line(250, 224, 400, 40);
            console.log(this.stair.perpSlope);
        };
        /** Called every frame, heart of the game loop */
        GameWorld.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, this.layerPlatforms);
            //this.checkStairs();
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
                this.game.time.fpsMin = 60;
            }
            this.checkZoneEdges();
            if (this.game.input.keyboard.isDown(HollowMoon.KeyBindings.openDoor)) {
                this.checkZoneDoors();
            }
            //add parallax effect
            this.imagePara.tilePosition.set(-this.game.camera.x * this.parallaxAmmount, -this.game.camera.y * this.parallaxAmmount);
        };
        /** Use for debug information, called after update() */
        GameWorld.prototype.render = function () {
            //this.game.debug.body(this.player);
            this.game.debug.text('current: ' + this.game.time.fps.toString(), 10, 20);
            this.game.debug.text('min: ' + this.game.time.fpsMin.toString(), 10, 40);
            this.game.debug.text('x: ' + this.player.position.x.toPrecision(6), 10, 60);
            this.game.debug.text('y: ' + this.player.position.y.toPrecision(6), 10, 80);
            this.game.debug.geom(this.stairs[0], 'green');
            this.game.debug.text('stairs: ' + this.player.onStairs, 10, 100);
            this.game.debug.geom(this.player.stairsLine, 'green');
            this.game.debug.geom(this.stair, 'red');
        };
        /** Used for going into Fullscreen mode.*/
        GameWorld.prototype.startFull = function () {
            this.game.scale.startFullScreen();
        };
        /** Creates the level from tile map data.*/
        GameWorld.prototype.createMap = function (mapName) {
            this.mapName = mapName;
            console.log(mapName);
            //destroy the old map and player
            if (this.map !== undefined) {
                this.map.destroy();
                this.imageBG.destroy();
                this.imagePara.destroy();
                this.imageFG.destroy();
                this.layerPlatforms.destroy();
                this.player.destroy();
            }
            //create the new map
            var tilePath = 'gameRes/tilemaps/';
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
                if (jsonFile.layers[elem].name === "zones") {
                    zones = jsonFile.layers[elem];
                }
            }
            //creates the zones for the edges of the current room
            var zoneEdges = zones.objects.filter(function (element) {
                return element.type === 'zoneEdge';
            });
            this.zoneEdges = [];
            for (var zone in zoneEdges) {
                var currZone = zoneEdges[zone];
                this.zoneEdges.push(new HollowMoon.Zone(currZone.x, currZone.y, currZone.width, currZone.height, currZone.name));
            }
            //creates the zones that are used as 'doors'
            var zoneDoors = zones.objects.filter(function (element) {
                return element.type === 'zoneDoor';
            });
            this.zoneDoors = [];
            for (var zone in zoneDoors) {
                var currZone = zoneDoors[zone];
                this.zoneDoors.push(new HollowMoon.Zone(currZone.x, currZone.y, currZone.width, currZone.height, currZone.name));
            }
            //stairs
            var zoneStairs = zones.objects.filter(function (element) {
                return element.type === 'stairs';
            });
            this.stairs = [];
            for (var zone in zoneStairs) {
                var currZone = zoneStairs[zone];
                this.stairs.push(new HollowMoon.Slope(currZone.x, currZone.y - currZone.height, currZone.width, currZone.height, currZone.name));
            }
        };
        /** Finds object with proper property */
        GameWorld.prototype.findElement = function (prop) {
        };
        /** Sets up player in new zone */
        GameWorld.prototype.createPlayer = function () {
            var playerPos = this.cache.getJSON(this.mapName + 'J').layers[7].objects.filter(function (playerPos) {
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
        /** Checks if player is overlapping with a zone door */
        GameWorld.prototype.checkZoneDoors = function () {
            var playerCheck = new Phaser.Rectangle(this.player.x, this.player.y, this.player.width, this.player.height);
            for (var zone in this.zoneDoors) {
                if (Phaser.Rectangle.intersects(playerCheck, this.zoneDoors[zone])) {
                    this.createMap(this.zoneDoors[zone].name);
                }
            }
        };
        /** Checks if player collides with stairs */
        GameWorld.prototype.checkStairs = function () {
            var playerCheck = new Phaser.Rectangle(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height);
            /*for(var zone in this.stairs) {
              if(Phaser.Rectangle.intersects(playerCheck, this.stairs[zone])) {
                this.player.onStairs = true;
                break;
              } else {
                this.player.onStairs = false;
              }
            }*/
            if (this.stairsMath(this.stair)) {
                this.player.setStairs(this.stair);
            }
        };
        GameWorld.prototype.stairsMath = function (slope) {
            if (slope.intersects(this.player.stairsLine)) {
                return true;
            }
            return false;
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
        jump: Phaser.Keyboard.SPACEBAR,
        crouch: Phaser.Keyboard.DOWN,
        dodge: Phaser.Keyboard.CONTROL,
        openDoor: Phaser.Keyboard.UP
    };
    /**
     * Changes key bindings for use within game.
     * @param {string} binding - The name of the binding to change
     * @param {number} key - The Phaser.Keyboard key to set binding to
     */
    function changeKey(binding, key) {
        HollowMoon.KeyBindings[binding] = key;
    }
    HollowMoon.changeKey = changeKey;
    HollowMoon.ControllerBindings = {
        moveLeft: Phaser.Gamepad.XBOX360_DPAD_LEFT,
        moveRight: Phaser.Gamepad.XBOX360_DPAD_RIGHT,
        jump: Phaser.Gamepad.XBOX360_A,
        crouch: Phaser.Gamepad.XBOX360_DPAD_DOWN,
        dodge: Phaser.Gamepad.XBOX360_B,
        openDoor: Phaser.Gamepad.XBOX360_DPAD_UP
    };
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
        mapSecond: 'mapSecond.json',
        map1: 'map1.json'
    };
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'charSprite', 'standing');
            this.anchor.setTo(0.5, 1);
            //create the animations
            this.animations.add('walkRight', ['walkRight'], 10, true);
            this.animations.add('walkLeft', ['walkLeft'], 10, true);
            this.animations.add('jumpRight', ['jumpRight'], 10, true);
            this.animations.add('jumpLeft', ['jumpLeft'], 10, true);
            /*this.animations.add('walkRight', Phaser.Animation.generateFrameNames('octopus', 0, 24, '', 4), 30, true);*/
            //set Player parameters
            this.walkSpeed = 200;
            this.jumpSpeed = -400;
            this.fallSpeed = this.walkSpeed;
            this.runSpeed = this.walkSpeed * 1.5;
            this.runAccel = 0.5;
            this.runTimer = 0.0;
            this.jumped = false;
            this.onStairs = false;
            this.facing = CharacterFacing.RIGHT;
            this.baseGravity = 800;
            this.dodgeSpeed = 800;
            this.dodgeTime = 250;
            this.dodging = false;
            this.moveable = true;
            this.maxV = new Phaser.Point(this.runSpeed, this.fallSpeed);
            game.add.existing(this);
            game.physics.arcade.enable(this);
            this.body.gravity.y = this.baseGravity;
            this.body.fixedRotation = true;
            this.body.collideWorldBounds = true;
            this.pWorld = this.game.physics.arcade;
            this.pBody = this.body;
            //this.pBody.maxVelocity = this.maxV;
            this.stairsLine = new Phaser.Line(0, 0, 100, 100);
            this.onStartGamepad();
        }
        Player.prototype.update = function () {
            this.body.velocity.x = 0;
            if (this.pBody.onFloor())
                this.grounded = true;
            // this.keyboardUpdate();
            this.controllerUpdate();
            this.otherMovement();
            this.stairsLine.setTo(this.x - 50, this.y - 20, this.x + 50, this.y - 20);
        };
        Player.prototype.otherMovement = function () {
            if (this.dodging) {
                switch (this.dodgeType) {
                    case DodgeType.RIGHT:
                        this.pBody.velocity.x = this.dodgeSpeed;
                        break;
                    case DodgeType.LEFT:
                        this.pBody.velocity.x = -this.dodgeSpeed;
                        break;
                    case DodgeType.BACKRIGHT:
                        this.pBody.velocity.x = this.dodgeSpeed;
                        break;
                    case DodgeType.BACKLEFT:
                        this.pBody.velocity.x = -this.dodgeSpeed;
                        break;
                }
            }
        };
        /** Initial controller connect */
        Player.prototype.onStartGamepad = function () {
            /*if(this.game.input.gamepad.active) {
                this.game.input.gamepad.stop();
            } else {
                this.game.input.gamepad.start();
                this.pad1 = this.game.input.gamepad.pad1;
            }*/
            this.game.input.gamepad.start();
            this.pad1 = this.game.input.gamepad.pad1;
            // sets up callbacks for controller
            this.game.input.gamepad.addCallbacks(this, {
                onConnect: function (padIndex) { console.log("Pad1 Connected!"); this.onStartGamepad(); },
                onDisconnect: function (padIndex) { console.log("Pad1 Disconnected!"); },
                onDown: function (buttonCode, value, padIndex) { },
                onUp: this.padUp,
                onAxis: function (pad, axis, value, padIndex) { },
                onFloat: function (buttonCode, value, padIndex) { },
            });
        };
        /** Handles keyboard input */
        Player.prototype.keyboardUpdate = function () {
            if (this.game.input.keyboard.isDown(HollowMoon.KeyBindings.moveRight)) {
                if (this.pBody.onFloor()) {
                    this.pBody.velocity.x = this.walkSpeed;
                    this.animations.play('walkRight');
                }
                else {
                    this.pBody.velocity.x = this.fallSpeed;
                    this.animations.play('jumpRight');
                }
            }
            else if (this.game.input.keyboard.isDown(HollowMoon.KeyBindings.moveLeft)) {
                if (this.pBody.onFloor()) {
                    this.pBody.velocity.x = -this.walkSpeed;
                    this.animations.play('walkLeft');
                }
                else {
                    this.pBody.velocity.x = -this.fallSpeed;
                    this.animations.play('jumpLeft');
                }
            }
            else {
                this.animations.frameName = 'standing';
            }
            if (this.game.input.keyboard.isDown(HollowMoon.KeyBindings.jump) && this.pBody.onFloor()) {
                this.body.velocity.y = this.jumpSpeed;
            }
        };
        /** Handles Controller input */
        Player.prototype.controllerUpdate = function () {
            // this.pBody.velocity.x = this.walkSpeed * this.pad1.axis(0);
            if (this.pad1.isDown(HollowMoon.ControllerBindings.moveRight)) {
                // this.runTimer += this.game.time.physicsElapsed;
                this.walkRight();
            }
            else if (this.pad1.isDown(HollowMoon.ControllerBindings.moveLeft)) {
                this.walkLeft();
            }
            else {
                this.animations.frameName = 'standing';
                this.runTimer = 0.0;
            }
            if (this.pad1.isDown(HollowMoon.ControllerBindings.jump)) {
                this.jump();
            }
            if (this.pad1.isDown(HollowMoon.ControllerBindings.dodge)) {
            }
        };
        /** Gets called when a gamepad button is released */
        Player.prototype.padUp = function (buttonCode, value, padIndex) {
            switch (buttonCode) {
                case HollowMoon.ControllerBindings.jump:
                    this.jumpCancel();
                    break;
                case HollowMoon.ControllerBindings.dodge:
                    this.dodge();
                    break;
            }
        };
        Player.prototype.walkRight = function () {
            if (this.onStairs) {
                this.pBody.velocity.x = this.walkSpeed;
                this.pBody.velocity.y = -this.walkSpeed;
                this.animations.play('walkRight');
                this.jumped = false;
            }
            else if (this.pBody.onFloor()) {
                this.pBody.velocity.x = this.walkSpeed;
                this.animations.play('walkRight');
                this.jumped = false;
            }
            else {
                this.pBody.velocity.x = this.fallSpeed;
                this.animations.play('jumpRight');
            }
            this.facing = CharacterFacing.RIGHT;
        };
        Player.prototype.walkLeft = function () {
            if (this.pBody.onFloor()) {
                this.pBody.velocity.x = -this.walkSpeed;
                this.animations.play('walkLeft');
                this.jumped = false;
            }
            else {
                this.pBody.velocity.x = -this.fallSpeed;
                this.animations.play('jumpLeft');
            }
            this.facing = CharacterFacing.LEFT;
        };
        Player.prototype.jump = function () {
            if (this.pBody.onFloor() || this.dodging && !this.jumped) {
                this.body.velocity.y = this.jumpSpeed;
                this.jumped = true;
                //cancels dodges
                this.dodging = false;
            }
        };
        Player.prototype.jumpCancel = function () {
            if (this.jumped && this.pBody.velocity.y < 0) {
                this.pBody.velocity.y = 0;
            }
        };
        Player.prototype.dodge = function () {
            //this.pBody.velocity.y = 0;
            if (this.pad1.isDown(HollowMoon.ControllerBindings.moveRight)) {
                this.dodgeType = DodgeType.RIGHT;
            }
            else if (this.pad1.isDown(HollowMoon.ControllerBindings.moveLeft)) {
                this.dodgeType = DodgeType.LEFT;
            }
            else {
                switch (this.facing) {
                    case CharacterFacing.RIGHT:
                        this.dodgeType = DodgeType.BACKLEFT;
                        break;
                    case CharacterFacing.LEFT:
                        this.dodgeType = DodgeType.BACKRIGHT;
                }
            }
            if (this.grounded) {
                this.dodging = true;
                this.grounded = false;
                this.dodgeTimer = this.game.time.create(false);
                this.dodgeTimer.add(this.dodgeTime, function () { this.dodging = false; }, this);
                this.dodgeTimer.start();
            }
        };
        Player.prototype.setStairs = function (stair) {
            this.onStairs = true;
            this.pBody.gravity.y = 0;
            this.pBody.velocity.y = 0;
        };
        return Player;
    })(Phaser.Sprite);
    HollowMoon.Player = Player;
    var DodgeType;
    (function (DodgeType) {
        DodgeType[DodgeType["RIGHT"] = 0] = "RIGHT";
        DodgeType[DodgeType["LEFT"] = 1] = "LEFT";
        DodgeType[DodgeType["BACKRIGHT"] = 2] = "BACKRIGHT";
        DodgeType[DodgeType["BACKLEFT"] = 3] = "BACKLEFT";
    })(DodgeType || (DodgeType = {}));
    (function (CharacterFacing) {
        CharacterFacing[CharacterFacing["RIGHT"] = 0] = "RIGHT";
        CharacterFacing[CharacterFacing["LEFT"] = 1] = "LEFT";
    })(HollowMoon.CharacterFacing || (HollowMoon.CharacterFacing = {}));
    var CharacterFacing = HollowMoon.CharacterFacing;
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
            this.load.spritesheet('elisa', 'gameRes/sprites/elisa.png', 56, 56);
            this.load.atlas('charSprite', 'gameRes/sprites/charSprite.png', 'gameRes/sprites/charSprite.json');
            //Load all the data required for TileMaps
            for (var map in HollowMoon.MapList) {
                var jsonFile = this.cache.getJSON(map + 'J');
                var tilePath = 'gameRes/tilemaps/';
                this.load.tilemap(map, '', jsonFile, Phaser.Tilemap.TILED_JSON);
                //finds all the image layers in the Tiled json
                var imageArr = jsonFile.layers.filter(function (element) {
                    return element.type === 'imagelayer';
                });
                //loads all the images from the image layers
                for (var image in imageArr) {
                    this.load.image(map + imageArr[image].name, tilePath + imageArr[image].image);
                }
                //finds and loads the sprite sheet for the platform tilemap layer
                var platformPath = tilePath + jsonFile.tilesets.filter(function (element) {
                    return element.name === 'platformTiles';
                })[0].image;
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
    var Slope = (function (_super) {
        __extends(Slope, _super);
        function Slope(x, y, width, height, name) {
            _super.call(this, x, y, width, height);
            this.name = name;
        }
        return Slope;
    })(Phaser.Rectangle);
    HollowMoon.Slope = Slope;
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    var Zone = (function (_super) {
        __extends(Zone, _super);
        function Zone(x, y, width, height, name) {
            _super.call(this, x, y, width, height);
            this.name = name;
        }
        return Zone;
    })(Phaser.Rectangle);
    HollowMoon.Zone = Zone;
})(HollowMoon || (HollowMoon = {}));
//# sourceMappingURL=game.js.map