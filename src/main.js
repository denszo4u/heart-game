import Phaser from 'phaser'
import './style.css'

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    // TITLE
    this.add
      .text(400, 50, 'Heart Collector ❤️', {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Arial'
      })
      .setOrigin(0.5)

    // GROUND
    this.ground = this.add.rectangle(
      400,
      560,
      800,
      80,
      0x4b5563
    )

    this.physics.add.existing(this.ground, true)

    // PLAYER
    this.player = this.add.rectangle(
      150,
      450,
      45,
      60,
      0xff8fab
    )

    this.physics.add.existing(this.player)

    this.player.body.setCollideWorldBounds(true)

    // PLAYER + GROUND COLLISION
    this.physics.add.collider(
      this.player,
      this.ground
    )

    // KEYBOARD
    this.cursors =
      this.input.keyboard.createCursorKeys()

    // INSTRUCTION
    this.add.text(
      20,
      20,
      '← → Move   SPACE / ↑ Jump',
      {
        fontSize: '18px',
        color: '#ffffff'
      }
    )
  }

  update() {
    const speed = 220

    // LEFT
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed)
    }

    // RIGHT
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed)
    }

    // STOP
    else {
      this.player.body.setVelocityX(0)
    }

    // JUMP
    if (
      (this.cursors.space.isDown ||
        this.cursors.up.isDown) &&
      this.player.body.blocked.down
    ) {
      this.player.body.setVelocityY(-500)
    }
  }
}

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  backgroundColor: '#1e1e2f',

  physics: {
    default: 'arcade',

    arcade: {
      gravity: {
        y: 900
      },

      debug: false
    }
  },

  scene: GameScene
}

new Phaser.Game(config)