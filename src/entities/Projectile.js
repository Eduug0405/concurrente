export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'projectile');

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setScale(0.5);
        this.body.setAllowGravity(false);
        this.body.setVelocityY(700);
    }

    update() {
        if (this.y > window.innerHeight) {
            this.destroy();
        }
    }
}
