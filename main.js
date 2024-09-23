import MenuScene from './src/scenes/MenuScene.js';
import GameScene from './src/scenes/GameScene.js';
import GameOverScene from './src/scenes/GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [MenuScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.RESIZE,  //redimensión del canvas ;/ 
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
