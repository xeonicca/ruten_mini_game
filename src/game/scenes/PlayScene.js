import { Scene } from 'phaser'

export default class PlayScene extends Scene {
  constructor() {
    super({ key: 'PlayScene' })
    this.maxBombs = 10
    this.bombs = []
  }

  addBomb() {
    const bomb = this.physics.add.image(400, 200, 'bomb')
    bomb.setCollideWorldBounds(true)
    bomb.body.onWorldBounds = true // enable worldbounds collision event
    bomb.setBounce(.4)
    bomb.setVelocity(100, 20)
    bomb.setCollideWorldBounds(true);


    return bomb
  }

  addPlayer() {
    const player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    player.body.setGravityY(300)


    return player
  }

  create() {
    this.add.image(400, 300, 'sky')
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    this.player = this.addPlayer()

    let timer = setInterval(() => {
      if (this.maxBombs > this.bombs.length) {
        const bomb = this.addBomb()
        this.physics.add.collider(bomb, platforms);
        this.physics.add.overlap(this.player, bomb, this.collectStar.bind(this), null, this);
        this.bombs.push(bomb)
      } else {
        // clearInterval(timer)
      }
    }, 500)



    this.physics.add.collider(this.player, platforms);

    this.cursors = this.input.keyboard.createCursorKeys();


    this.sound.add('thud')
    this.physics.world.on('worldbounds', () => {
      // this.sound.play('thud', { volume: 0.75 })
    })
  }

  collectStar(player, bomb) {
    this.bombs.splice(this.bombs.indexOf(bomb), 1)
    bomb.disableBody(true, true);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}