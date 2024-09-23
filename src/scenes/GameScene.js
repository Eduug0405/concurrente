import Projectile from '../entities/Projectile.js';
import Turret from '../entities/Turret.js';
import Eggs from '../entities/Eggs.js';
import Ballon from '../entities/Ballon.js';
import Timer from '../utils/Timer.js';
import StarScore from '../utils/StartScore.js';  

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.canShoot = true;
        this.enemySpawnDelay = 2000;
        this.difficultyIncreaseTime = 30;
        this.worker = null;
        this.messageWorker = null;
        this.starWorker = null; 
        this.firstMessage = null;
        this.secondMessage = null; 
    }

    preload() {
        this.load.audio('backgroundMusic', './assets/sounds/audio.ogg');
        this.load.image('background', './assets/images/juego-fondo.jpg');
        this.load.image('eggs', './assets/images/egg.png');
        this.load.image('turret', './assets/images/player.png');
        this.load.image('projectile', './assets/images/bomb.png');
        this.load.image('ballon', './assets/images/ballon.png');
        this.load.image('hpBar', './assets/images/hp_bar.png');
        this.load.image('star', './assets/images/start.png');  
    }

    create() {
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        let scaleX = window.innerWidth / this.background.width;
        let scaleY = window.innerHeight / this.background.height;
        let scale = Math.max(scaleX, scaleY);
        this.background.setScale(scale).setScrollFactor(0);
        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 });
        this.backgroundMusic.play();

        this.nestWithEggs = new Eggs(this, window.innerWidth / 2, 150);
        this.turret = new Turret(this, window.innerWidth / 2, window.innerHeight / 3);


        this.worker = new Worker('src/workers/movementWorker.js');
        this.worker.postMessage({ width: window.innerWidth });

        this.worker.onmessage = (event) => {
            const newX = event.data.positionX;
            this.turret.setX(newX);
        };
 
        
        this.messageWorker = new Worker('src/workers/messageWorker.js');

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.messageWorker.postMessage(this.timer.elapsedTime);
                console.log(`Enviando tiempo al worker: ${this.timer.elapsedTime}`);
            },
            callbackScope: this,
            loop: true
        });

        this.messageWorker.onmessage = (event) => {
            console.log(`Recibiendo mensaje del worker: ${event.data.message}`);
            this.showDifficultyMessage(event.data.message);
        };

        // ----------------------------------------------------------------------
        this.starWorker = new Worker('src/workers/starWorker.js');
        console.log('Star Worker inicializado correctamente');

        this.starWorker.onmessage = (event) => {
            if (event.data === 'spawnStar') {
                console.log('Mensaje recibido del starWorker: Spawning star');
                this.spawnStar();  
            }
        };
        this.time.addEvent({
            delay: 15000,  
            callback: () => {
                console.log('Enviando mensaje al starWorker para revisar el tiempo');
                this.starWorker.postMessage('checkTime');
            },
            callbackScope: this,
            loop: true
        });

        this.projectiles = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.stars = this.physics.add.group();  
        this.spawnEnemiesLoop();

        this.physics.add.collider(this.projectiles, this.enemies, this.handleCollision, null, this);

        this.timer = new Timer(this, 10, 10);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.starScore = new StarScore(this);  

        this.time.addEvent({
            delay: 20000, 
            callback: this.increaseDifficulty,  
            callbackScope: this, 
            loop: true  
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.worker.postMessage({ direction: 'left', speed: 5 });
        } else if (this.cursors.right.isDown) {
            this.worker.postMessage({ direction: 'right', speed: 5 });
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.shootProjectile();
        }

        let balloonsToDestroy = [];

        this.enemies.children.iterate((ballon) => {
            if (ballon && ballon.active) {
                ballon.update();

                if (ballon.y <= 150) {
                    this.nestWithEggs.takeDamage(10);
                    balloonsToDestroy.push(ballon);
                }
            }
        });

        balloonsToDestroy.forEach((ballon) => {
            ballon.setActive(false);
            ballon.setVisible(false);
            ballon.destroy();
        });

        if (this.nestWithEggs.hp <= 0) {
            this.endGame();
        }
    }

    shootProjectile() {
        if (this.canShoot) {
            const projectile = new Projectile(this, this.turret.x, this.turret.y);
            this.projectiles.add(projectile);
            projectile.body.setVelocityY(800);
            this.canShoot = false;
            this.time.delayedCall(400, () => {
                this.canShoot = true;
            }, null, this);
        }
    }

    spawnEnemy() {
        let randomX = Phaser.Math.Between(50, window.innerWidth - 50);
        const ballon = new Ballon(this, randomX, window.innerHeight + 50);

        this.physics.world.enable(ballon);
        ballon.body.setCollideWorldBounds(false);
        ballon.body.setGravityY(0);
        ballon.body.setVelocityY(-100);

        this.enemies.add(ballon);
    }

    spawnStar() {
        let randomX = Phaser.Math.Between(50, window.innerWidth - 50);
        let randomY = Phaser.Math.Between(150, window.innerHeight - 100);

        console.log(`Spawning star at X: ${randomX}, Y: ${randomY}`);
        const star = this.physics.add.image(randomX, randomY, 'star').setScale(0.3);
        this.stars.add(star);
 // choque estrellas y los cohetes 
        this.physics.add.collider(this.projectiles, star, (projectile, star) => {
            star.destroy();
            projectile.destroy();
            this.starScore.increaseScore(); 
        }, null, this);
    }

    handleCollision(projectile, ballon) {
        projectile.destroy();
        ballon.destroy();
    }

    increaseDifficulty() {
        this.enemySpawnDelay -= 50; 
        if (this.enemySpawnDelay < 500) {
            this.enemySpawnDelay = 500;
        }
        this.additionalEnemies += 2; 
        this.spawnEnemiesLoop(this.additionalEnemies);
    }

    spawnEnemiesLoop(additionalEnemies = 0) {
        this.time.addEvent({
            delay: this.enemySpawnDelay,
            callback: () => {
                this.spawnEnemy();  
                for (let i = 0; i < additionalEnemies; i++) {
                    this.spawnEnemy();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    endGame() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        this.scene.start('GameOverScene', { totalTimeSurvived: this.timer.elapsedTime + ' ' + 'segundos',
         });
        
    }

    showDifficultyMessage(message) {
        console.log(`Mostrando mensaje: ${message}`);

        if (message === 'Modo imposible activado') {
            this.secondMessage = this.add.text(window.innerWidth / 2, window.innerHeight / 2, message, {
                fontSize: '48px',
                fill: '#ff0000',
                fontFamily: 'Arial',
            }).setOrigin(0.5);
        } else if (message === 'La dificultad aumentó') {
            this.firstMessage = this.add.text(window.innerWidth / 2, window.innerHeight / 2, message, {
                fontSize: '48px',
                fill: '#00ff00',
                fontFamily: 'Arial',
            }).setOrigin(0.5);
            
            this.time.delayedCall(15000, () => {
                if (this.firstMessage) {
                    console.log('Destruyendo el primer mensaje');
                    this.firstMessage.destroy();
                    this.firstMessage = null;
                }
            });
        }
    }
}
