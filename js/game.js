var debug, updateSpeed, lastUpdate, p1, p2, star, sizeElement, electroHammer, cursors, gamearea, maxLife,emitter,victoryfx, looseLifefx, mainLoop, coinfx;

var Game = {
	preload: function() {
	    game.load.image('background', 'assets/bg@2x.png');
	    game.load.image('player1', 'assets/snake_yellow@2x.png',20,20);
	    game.load.image('player2', 'assets/snake_bleu@2x.png',20,20);
	    game.load.image('submarine', 'assets/submarine@2x.png');
        game.load.audio('Electrostatic Hammer', 'assets/audio/ElectrostaticHammer_3Hits.wav');
        game.load.audio('loose Life','assets/audio/fx/button/191754__fins__button-5.wav');
        game.load.audio('Victory','assets/audio/Victory.wav');
        game.load.audio('MainLoop','assets/audio/MainLoop.wav');
        game.load.audio('Coin','assets/audio/fx/coin/341231__jeremysykes__coin00.wav');
        game.load.spritesheet('stars', 'assets/sprite_star@2x.png', 53, 38);
	},

	create: function() {
		direction = {
			up: 0,
			right: 1,
			down: 2,
			left: 3
		};

		debug = false;
		updateSpeed = 150;
		lastUpdate = 0;

		maxLife = 3;


		star = {};
		sizeElement = 20;

		gamearea = {
			top: 220,
			right: 920,
			bottom: 680,
			left: 120,
		};

	    var background = game.add.sprite(0, 0, 'background');
	    background.scale.setTo(0.5, 0.5);
		game.physics.startSystem(Phaser.Physics.ARCADE);
        p1 = new Player("player1", direction.right, 160, 280, {x: 228, y: 172, direction: 'right', icon: 0}, {x: 163, y: 168} );
        p2 = new Player("player2", direction.left, 860, 620, {x: 783, y: 172, direction: 'left', icon: 2}, {x: 849, y: 168});
        //audio
        electroHammer = game.add.audio('Electrostatic Hammer');
        victoryfx = game.add.audio('Victory');
        looseLifefx = game.add.audio('loose Life');
        coinfx = game.add.audio('Coin');
        mainLoop = game.add.audio('MainLoop',0.5,true);
        mainLoop.play();

		//  Our controls.
	    cursors = game.input.keyboard.createCursorKeys();
	    wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		};
        this.popStar();
	    //game.physics.arcade.enable(p1.body);
	    //game.physics.arcade.enable(p2.body);

	    //this.initGame();
	},

	update: function() {

        this.updateTargetedDirectionP1();
        this.updateTargetedDirectionP2();
		if((this.getTimeStamp() - lastUpdate) < updateSpeed) {
			return;
		}
        
        if(!p1.Update() || !p2.Update()) {
        	this.Reset();
        }

        if(p1.numberLife == 0) {
    		this.state.start('Game_Over');
    	} else if(p2.numberLife == 0) {
    		this.state.start('Game_Over');
    	}

        
        var result = p1.CollideBetween(p2);
        if(typeof result === "object") {
        	result.LoseLife();
        	this.Reset();
        	// game.state.start('Game_Over');
        } else if(typeof result === 'boolean' && result) {
        	this.Reset();
        }

		lastUpdate = this.getTimeStamp();
	},

	Reset: function() {
        star.kill();

        p1.Restart();
        p2.Restart();
		this.popStar();
	},
    
    SetWinner: function(p){
        if(p==p1)
            p1.Win();
        if(p==p2)
            p2.Win();
    },
    SetLooser: function(p){
        if(p==p1)
            p2.Win();
        if(p==p2)
            p1.Win();
    },

	popStar: function() {
		var x = this.getRandomInt(gamearea.left, gamearea.right - sizeElement*2);
		var y = this.getRandomInt(gamearea.top, gamearea.bottom - sizeElement*2);

		if(x % sizeElement == 0 && y % sizeElement == 0) {
			star = game.add.sprite(x,y,'submarine');
			star.scale.setTo(0.5, 0.5);
		} else {
			this.popStar();
		}
	},

	updateTargetedDirectionP2: function() {
		if (cursors.left.isDown){
			p2.TargetedDirection(direction.left);
	    } else if (cursors.right.isDown ) {
			p2.TargetedDirection(direction.right);
	    } else if(cursors.up.isDown) {
			p2.TargetedDirection(direction.up);
	    } else if(cursors.down.isDown) {
			p2.TargetedDirection(direction.down);
	    }
        
	},  

	updateTargetedDirectionP1: function() {
		if(wasd.left.isDown) {
	    	p1.TargetedDirection(direction.left);
	    } else if (wasd.right.isDown) {
			p1.TargetedDirection(direction.right);
	    } else if(wasd.up.isDown) {
			p1.TargetedDirection(direction.up);
	    } else if(wasd.down.isDown) {
			p1.TargetedDirection(direction.down);
	    }
	},

	getTimeStamp: function() {
		return new Date().getTime();
	},
    
    getRandomInt: function(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
}