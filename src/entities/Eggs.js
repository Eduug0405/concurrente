export default class Eggs extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'eggs');  
        scene.add.existing(this); 
        this.setOrigin(0.5, 1.2); 
        this.setScale(0.28);  
        this.health = 50; 
        this.createHealthBar(scene);
    }
    createHealthBar(scene) {
        this.hpBar = scene.add.graphics();
        this.hpBar.fillStyle(0x00ff00, 1);  
        this.hpBar.fillRect(this.x - 50, this.y - 100, 100, 10); 
    }

    updateHealthBar() {
        let healthPercentage = this.health / 50;  

        this.hpBar.clear();

      
        if (healthPercentage > 0.5) {
            this.hpBar.fillStyle(0x00ff00, 1);  
        } else if (healthPercentage > 0.25) {
            this.hpBar.fillStyle(0xffff00, 1); 
        } else {
            this.hpBar.fillStyle(0xff0000, 1);  
        }
        this.hpBar.fillRect(this.x - 50, this.y - 100, 100 * healthPercentage, 10);
    }

    takeDamage(amount) {
        this.health -= amount; 
        this.updateHealthBar();  
        if (this.health <= 0) {
            this.health = 0;
            this.scene.endGame(); 
        }
    }
}
