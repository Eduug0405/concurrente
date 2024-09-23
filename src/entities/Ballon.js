export default class Ballon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ballon');  

        scene.add.existing(this);
        scene.physics.add.existing(this); 
        this.setScale(0.5);
        this.body.setAllowGravity(false);

        this.body.setVelocityY(-100); 
    }

    update() {
        this.body.setVelocityY(-100);
        if (this.y <= 150) {
            console.log('Globo destruido');
            this.destroy();
        }
    }
    
}
