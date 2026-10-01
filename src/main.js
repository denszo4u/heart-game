import Phaser from 'phaser'
import './style.css'

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.score = 0

    // TITLE
    this.add
      .text(400, 50, 'Heart Collector ❤️', {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Arial'
      })
      .setOrigin(0.5)

    // SCORE
    this.scoreText = this.add.text(
      20,
      20,
      'Hearts: 0 / 5',
      {
        fontSize: '20px',
        color: '#ffffff'
      }
    )

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
      100,
      450,
      45,
      60,
      0xff8fab
    )

    this.physics.add.existing(this.player)

    this.player.body.setCollideWorldBounds(true)

    // PLAYER + GROUND
    this.physics.add.collider(
      this.player,
      this.ground
    )

    // HEART GROUP
    this.hearts = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })

    const heartPositions = [
      { x: 200, y: 480 },
      { x: 320, y: 480 },
      { x: 440, y: 480 },
      { x: 560, y: 480 },
      { x: 680, y: 480 }
    ]

    heartPositions.forEach((position) => {
      const heart = this.add.text(
        position.x,
        position.y,
        '❤️',
        {
          fontSize: '35px'
        }
      )

      heart.setOrigin(0.5)

      this.physics.add.existing(heart)

      heart.body.setAllowGravity(false)
      heart.body.setImmovable(true)

      this.hearts.add(heart)
    })

    // PLAYER COLLECT HEART
    this.physics.add.overlap(
      this.player,
      this.hearts,
      this.collectHeart,
      null,
      this
    )

    // KEYBOARD
    this.cursors =
      this.input.keyboard.createCursorKeys()

    // INSTRUCTION
    this.add.text(
      530,
      20,
      '← → Move   SPACE / ↑ Jump',
      {
        fontSize: '16px',
        color: '#ffffff'
      }
    )
  }

  collectHeart(player, heart) {
    heart.destroy()

    this.score++

    this.scoreText.setText(
      `Hearts: ${this.score} / 5`
    )

    if (this.score === 5) {
      this.showWinMessage()
    }
  }

  showWinMessage() {
    this.player.body.setVelocity(0)

    this.add
      .text(
        400,
        250,
        'YOU WIN! ❤️',
        {
          fontSize: '52px',
          color: '#ff8fab',
          fontFamily: 'Arial',
          fontStyle: 'bold'
        }
      )
      .setOrigin(0.5)

    this.add
      .text(
        400,
        310,
        'All hearts collected!',
        {
          fontSize: '24px',
          color: '#ffffff'
        }
      )
      .setOrigin(0.5)
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