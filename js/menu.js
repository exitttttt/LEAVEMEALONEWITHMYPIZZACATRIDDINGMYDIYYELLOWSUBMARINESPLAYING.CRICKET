var spaceKey;

var Menu = {
    preload : function() {
        // Load all the needed resources for the menu.
        game.load.image('menu', '/assets/menu@2x.png');
    },

    create: function () {
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        // Add menu screen.
        // It will act as a button to start the game.
        var bt = this.add.button(0, 0, 'menu', this.startGame, this);
        game.canvas.style.cursor = "pointer";
        bt.scale.setTo(0.5, 0.5);
    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');
    },

    update: function() {
        if (spaceKey.isDown){
            this.startGame();
        }
    }

};