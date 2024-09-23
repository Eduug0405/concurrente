export default class Turret extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'turret');  
        scene.add.existing(this); 
        this.setOrigin(0.5, 1);  

        this.setScale(0.3);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true); 
    }
    updatePosition(newX) {
        this.x = newX;
    }
}
