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
            // this.physics.startSystem(Phaser.Physics.ARCADE);
            // this.background = this.add.sprite(0, 0, 'level1');
            // this.music = this.add.audio('music', 1, false);
            // this.music.play();
            this.worldGroup = new Phaser.Group(this.game, this.world, 'worldGroup');
            this.uiGroup = new Phaser.Group(this.game, this.world, 'uiGroup');
            this.physics.startSystem(Phaser.Physics.P2JS);
            this.physics.setBoundsToWorld();
            this.stage.backgroundColor = '2f9d8c';
            this.player = new HollowMoon.Player(this.game, 0, 0);
            this.worldGroup.add(this.player);
            this.createMap('tiled2');
            this.game.camera.follow(this.player);
            //creates tap eventListener and calls starFull() when triggered. This is only used for testing until a more permanent implementation.
            this.game.input.onTap.add(this.startFull, this.game.scale);
        };
        /** Called every frame, heart of the game loop */
        GameWorld.prototype.update = function () {
            //this.game.physics.arcade.collide(this.player, this.layerPlatforms);
            // if(this.player.x > 70)
            //   this.createMap('tiled2');
        };
        /** Use for debug information, called after update() */
        GameWorld.prototype.render = function () {
            this.game.debug.body(this.player);
            this.game.debug.text(this.game.cache.getJSON('tiledJson').layers[0].name, 10, 20);
        };
        /** Used for going into Fullscreen mode.*/
        GameWorld.prototype.startFull = function () {
            this.game.scale.startFullScreen();
        };
        /** Creates the level from tile map data.*/
        GameWorld.prototype.createMap = function (mapName) {
            //destroy the old map
            if (this.map !== undefined) {
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
        };
        return GameWorld;
    })(Phaser.State);
    HollowMoon.GameWorld = GameWorld;
})(HollowMoon || (HollowMoon = {}));
var HollowMoon;
(function (HollowMoon) {
    /** Assign Default Keybindings here, they can be changed with changeKey func*/
    HollowMoon.keyBindings = {
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
        HollowMoon.keyBindings[binding] = key;
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
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'elisa', 0);
            this.anchor.setTo(0.5);
            this.animations.add('walk', [21, 22, 23, 24, 25], 10, true);
            this.animations.add('jump', [9, 10, 11, 12], 10, true);
            game.add.existing(this);
            game.physics.p2.enable(this);
            this.body.fixedRotation = true;
            this.body.collideWorldBounds = true;
            console.log(HollowMoon.keyBindings.moveLeft);
            HollowMoon.keyBindings.moveLeft = 9;
            console.log(HollowMoon.keyBindings.moveLeft);
            //  KeyBindings.moveLeft;
        }
        Player.prototype.update = function () {
            this.body.setZeroVelocity();
            /*this.body.velocity.x = 0;
    
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -150;
                // if(this.body.onFloor()) {
                //   this.animations.play('walk');
                // } else {
                  this.animations.play('jump');
                // }
                // if (this.scale.x === 1) {
                //     this.scale.x = -1;
                // }
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = 150;
                // if(this.body.onFloor()) {
                  this.animations.play('walk');
                // } else {
                //   this.animations.play('jump');
                // }
                // if (this.scale.x === -1) {
                //     this.scale.x = 1;
                // }
            } else {
                this.animations.frame = 0;
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)  && this.body.onFloor()) {
              this.body.velocity.y = -300;
            }*/
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
            // this.load.image('level1', 'gameRes/level1.png');
            this.load.tilemap('tiled', 'gameRes/tilemaps/test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('tiled2', 'gameRes/tilemaps/test2.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('extBG', 'gameRes/tilemaps/extBG.png');
            this.load.image('extPara', 'gameRes/tilemaps/extPara.png');
            this.load.image('platformTiles', 'gameRes/tilemaps/platformTiles.png');
            this.load.json('tiledJson', 'gameRes/tilemaps/test2.json');
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
//# sourceMappingURL=game.js.map