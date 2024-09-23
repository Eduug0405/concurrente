import GameScene from "./GameScene.js";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuBackground', './assets/images/menu-fondo.png'); 
    }

    create() {
      
        this.background1 = this.add.image(0, 0, 'menuBackground').setOrigin(0, 0);
        this.background2 = this.add.image(0, 0, 'menuBackground').setOrigin(0, 0);

        let scaleX = window.innerWidth / this.background1.width;
        let scaleY = window.innerHeight / this.background1.height;
        let scale = Math.max(scaleX, scaleY);

        this.background1.setScale(scale).setScrollFactor(0);
        this.background2.setScale(scale).setScrollFactor(0);

        this.background2.x = this.background1.displayWidth;
        const titleText = this.add.text(window.innerWidth / 2, window.innerHeight / 4, 'EGGVASION', {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        
        const playButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Start Game', {
            fontSize: '32px',
            color: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        playButton.setInteractive();
        playButton.on('pointerover', () => {
            playButton.setStyle({ color: '#ff0000' });
        });
        playButton.on('pointerout', () => {
            playButton.setStyle({ color: '#00ff00' });
        });
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene'); 
        });

        const instructionsButton = this.add.text(window.innerWidth / 2, window.innerHeight / 1.5, 'Instructions', {
            fontSize: '28px',
            color: '#00ffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        instructionsButton.setInteractive();
        instructionsButton.on('pointerover', () => {
            instructionsButton.setStyle({ color: '#ff0000' });
        });
        instructionsButton.on('pointerout', () => {
            instructionsButton.setStyle({ color: '#00ffff' });
        });
        instructionsButton.on('pointerdown', () => {
            console.log("Instructions button clicked");
        });
    }

    update() {
        this.background1.x -= 1;
        this.background2.x -= 1;

        if (this.background1.x <= -this.background1.displayWidth) {
            this.background1.x = this.background2.x + this.background2.displayWidth;
        }
        if (this.background2.x <= -this.background2.displayWidth) {
            this.background2.x = this.background1.x + this.background1.displayWidth;
        }
    }
}
