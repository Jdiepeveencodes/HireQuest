class VillageScene extends Phaser.Scene {
    constructor() {
        super("VillageScene");
    }

    preload() {
        // Correct GitHub Pages paths
        this.load.tilemapTiledJSON("village", "assets/Maps/village_level1.json");

        this.load.image(
            "roguelikeSheet_transparent",
            "assets/TileSets/roguelikeSheet_transparent.png"
        );

        this.load.spritesheet("player", "assets/Sprites/player.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        const map = this.make.tilemap({ key: "village" });
        const tileset = map.addTilesetImage(
            "roguelikeSheet_transparent",
            "roguelikeSheet_transparent"
        );

        map.createLayer("Ground", tileset, 0, 0);
        map.createLayer("Details", tileset, 0, 0);

        const collision = map.createLayer("Collision", tileset, 0, 0);
        collision.setCollisionByExclusion([-1]);

        const objects = map.getObjectLayer("Objects").objects;

        const spawnObj = objects.find(o => o.name === "PlayerSpawn");
        const spawn = spawnObj
            ? { x: spawnObj.x, y: spawnObj.y - 8 }
            : { x: 200, y: 200 };

        this.player = this.physics.add.sprite(spawn.x, spawn.y, "player", 0);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, collision);

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.player.play("walk");

        this.cursors = this.input.keyboard.createCursorKeys();

        this.W = this.input.keyboard.addKey("W");
        this.A = this.input.keyboard.addKey("A");
        this.S = this.input.keyboard.addKey("S");
        this.D = this.input.keyboard.addKey("D");

        this.E = this.input.keyboard.addKey("E");

        // Camera
        this.cameras.main.startFollow(this.player);
    }

    update() {
        const p = this.player;
        p.setVelocity(0);

        if (this.cursors.left.isDown || this.A.isDown) p.setVelocityX(-120);
        else if (this.cursors.right.isDown || this.D.isDown) p.setVelocityX(120);

        if (this.cursors.up.isDown || this.W.isDown) p.setVelocityY(-120);
        else if (this.cursors.down.isDown || this.S.isDown) p.setVelocityY(120);

        p.body.velocity.normalize().scale(120);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 750,
    height: 650,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [VillageScene]
};

new Phaser.Game(config);
