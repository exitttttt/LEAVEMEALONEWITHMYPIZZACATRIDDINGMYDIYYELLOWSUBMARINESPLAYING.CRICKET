var game = new Phaser.Game(1024, 768, Phaser.AUTO, '');


// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);
game.state.start('Menu');

// Adding the Game state.
game.state.add('Game', Game);
game.state.add('Game_Over', Game_Over)
