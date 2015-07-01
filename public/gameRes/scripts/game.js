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
            this.game.state.start('Preloader', true, false);
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
            _super.call(this, 800, 600, Phaser.AUTO, '');
            this.state.add('Boot', HollowMoon.Boot, false);
            this.state.add('Preloader', HollowMoon.Preloader, false);
            this.state.add('MainMenu', HollowMoon.MainMenu, false);
            this.state.add('Level1', HollowMoon.Level1, false);
            this.state.start('Boot');
        }
        Game.prototype.create = function () {
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            console.log("does this even run?");
        };
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
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        /**
         * Used for going into Fullscreen mode.
         */
        Level1.prototype.startFull = function () {
            this.game.scale.startFullScreen();
        };
        Level1.prototype.create = function () {
            // this.physics.startSystem(Phaser.Physics.ARCADE);
            // this.background = this.add.sprite(0, 0, 'level1');
            // this.music = this.add.audio('music', 1, false);
            // this.music.play();
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.stage.backgroundColor = '2f9d8c';
            this.map = this.game.add.tilemap('tiled');
            this.map.addTilesetImage('intBG', 'intBG');
            this.map.addTilesetImage('intPara', 'intPara');
            this.map.addTilesetImage('extBG', 'extBG');
            this.map.addTilesetImage('extPara', 'extPara');
            this.map.addTilesetImage('platformTiles', 'platformTiles');
            this.layer1 = this.map.createLayer('background');
            this.layer2 = this.map.createLayer('parallax');
            this.layer3 = this.map.createLayer('platforms');
            this.map.setCollisionByExclusion([0], true, 'platforms');
            this.layer1.resizeWorld();
            this.player = new HollowMoon.Player(this.game, 0, 0);
            this.game.camera.follow(this.player);
            //creates tap eventListener and calls starFull() when triggered
            this.game.input.onTap.add(this.startFull, this.game.scale);
        };
        Level1.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, this.layer3);
        };
        return Level1;
    })(Phaser.State);
    HollowMoon.Level1 = Level1;
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
            this.add.text(0, 0, "Hollow Moon", '');
            this.input.onDown.addOnce(this.startGame, this);
        };
        MainMenu.prototype.fadeOut = function () {
            // this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            // var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            // tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('Level1', true, false);
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
            game.physics.enable(this);
            game.physics.arcade.gravity.y = 600;
        }
        Player.prototype.update = function () {
            this.body.velocity.x = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -150;
                // if(this.body.onFloor()) {
                //   this.animations.play('walk');
                // } else {
                this.animations.play('jump');
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = 150;
                // if(this.body.onFloor()) {
                this.animations.play('walk');
            }
            else {
                this.animations.frame = 0;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.body.onFloor()) {
                this.body.velocity.y = -300;
            }
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
            this.load.image('extBG', 'gameRes/tilemaps/extBG.png');
            this.load.image('extPara', 'gameRes/tilemaps/extPara.png');
            this.load.image('intBG', 'gameRes/tilemaps/intBG.png');
            this.load.image('intPara', 'gameRes/tilemaps/intPara.png');
            this.load.image('platformTiles', 'gameRes/tilemaps/platformTiles.png');
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