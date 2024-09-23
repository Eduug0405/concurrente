export default class StarScore {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.scoreText = this.scene.add.text(window.innerWidth - 150, 20, `Stars: ${this.score}`, {
            fontSize: '32px',
            fill: '#FFFF00',  
            fontFamily: 'Arial',
        });
    }

    increaseScore() {
        this.score += 1;
        this.scoreText.setText(`Stars: ${this.score}`);
    }
}
