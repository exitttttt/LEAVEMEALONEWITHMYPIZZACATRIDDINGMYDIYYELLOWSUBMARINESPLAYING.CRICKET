var stars = [];
var winnerMessages = ['OMG YOU WON', 'You are a star', 'You rock', 'Good job'];
var looserMessages = ['You almost won', 'You are a looser', 'GO DIE', 'Kill yourself'];

var Game_Over = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('background', './assets/game_over@2x.png');
        game.load.image('quit_btn', '/assets/quit_btn@2x.png');
        game.load.image('retry_btn', '/assets/retry_btn@2x.png');

    },

    create : function() {
        mainLoop.stop();
        var styleText = {
            font: "20px monospace",
            fill: "#ffffff",
        };

         spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        // Create button to start game like in Menu.
        var background = game.add.sprite(0, 0, 'background');
        background.scale.setTo(0.5, 0.5);

        var quit_btn = this.add.button(340, 541, 'quit_btn', this.goToEpicWebsite, this);
        quit_btn.scale.setTo(0.5, 0.5);

        var retry_btn = this.add.button(541, 541, 'retry_btn', this.startGame, this);
        retry_btn.scale.setTo(0.5, 0.5);

        this.drawPlayerInfos(p1, {x: 161, y: 168} );
        this.drawPlayerInfos(p2, {x: 848, y: 168});

        var t1 = game.add.text(190, 415, '', styleText);
        var t2 = game.add.text(669, 415, '', styleText);

        if(p1.numberLife == 0) {
            t1.text = looserMessages[Math.floor(Math.random()*looserMessages.length)];
            t2.text = winnerMessages[Math.floor(Math.random()*winnerMessages.length)];
        } else {
            t1.text = winnerMessages[Math.floor(Math.random()*winnerMessages.length)];
            t2.text = looserMessages[Math.floor(Math.random()*looserMessages.length)];
        }

        // Add text with information about the score from last game.
        // game.add.text(235, 350, "LAST SCORE", { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center"});
        // game.add.text(350, 348, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });

    },

    update: function() {
        if (spaceKey.isDown){
            this.startGame();
        }
    },

    startGame: function () {
        this.state.start('Menu');
    },

    goToEpicWebsite: function() {
        window.location.replace('https://epicgamejam.com/');
    },

    drawPlayerInfos: function(player, pointSetup) {

        //DRAW LIFES
        var lifes = player.numberLife;

        for(var i = 0; i < player.lifes.length; i++) {
            var l = player.lifes[i];

            var star = game.add.sprite(l.x, l.y, 'stars');
            star.scale.setTo(0.5, 0.5);
            if(lifes <= 0) {
                star.frame = 1;
            } else {
                star.frame = player.lifeSetup.icon;
            }

            lifes -= 1;
        }

        //DRAW SCORE
        score = (player.points < 10) ? '0' + player.points.toString() : player.points.toString();
        game.add.text(pointSetup.x, pointSetup.y, score, { fontSize: '25px', fill: '#fff' });
    },

};
