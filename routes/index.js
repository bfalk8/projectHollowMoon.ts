var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Hollow Moon',
    phaserPath: 'bower/phaser/build/phaser.js',
    gamePath: 'gameRes/scripts/game.js'});
});

module.exports = router;
