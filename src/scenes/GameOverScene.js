export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene'); 
    }

    init(data) {
        this.totalTimeSurvived = data.totalTimeSurvived;  
    }

    create() {
        
        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.7);  
        graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        this.add.text(this.sys.game.config.width / 2, 200, 'Destruyeron tu nido :(', {
            fontSize: '70px',
            fontFamily: 'Arial',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(this.sys.game.config.width / 2, 300, `Tiempo sobrevivido: ${this.totalTimeSurvived}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.sys.game.config.width / 2, 400, 'click para volver a intentarlo', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('GameScene'); 
        });
    }
}
