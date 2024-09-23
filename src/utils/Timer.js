export default class Timer {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.elapsedTime = 0; 
        this.text = this.scene.add.text(this.x, this.y, 'Time: 00:00', { fontSize: '32px', fill: '#00ff00' }).setScrollFactor(0);

        this.scene.time.addEvent({
            delay: 1000, 
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        this.elapsedTime++;  
        const minutes = Math.floor(this.elapsedTime / 60);  //mis calulos m/s
        const seconds = this.elapsedTime % 60; 
        const formattedTime = `Time: ${this.pad(minutes)}:${this.pad(seconds)}`;
        this.text.setText(formattedTime);
    }

 
    pad(num) {
        return num.toString().padStart(2, '0');
    }

    getElapsedTime() {
        return this.elapsedTime;
    }
}
