module HollowMoon {
    export class Level1 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Player;
        map: Phaser.Tilemap;
        layer1: Phaser.TilemapLayer;
        layer2: Phaser.TilemapLayer;
        layer3: Phaser.TilemapLayer;

        /**
         * Used for going into Fullscreen mode.
         */
        startFull() {
          this.game.scale.startFullScreen();
        }
        create() {
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
            this.player = new Player(this.game, 0, 0);
            this.game.camera.follow(this.player);
            //creates tap eventListener and calls starFull() when triggered
            this.game.input.onTap.add(this.startFull, this.game.scale);
        }

        update() {

            this.game.physics.arcade.collide(this.player, this.layer3);
        }
    }
}
