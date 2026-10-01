import Phaser from 'phaser'
import './style.css'

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.score = 0
    this.totalHearts = 7
    this.hasWon = false

    // TITLE
    this.add
      .text(400, 35, 'Heart Collector ❤️', {
        fontSize: '30px',
        color: '#ffffff',
        fontFamily: 'Arial'
      })
      .setOrigin(0.5)

    // SCORE
    this.scoreText = this.add.text(
      20,
      20,
      `Hearts: 0 / ${this.totalHearts}`,
      {
        fontSize: '18px',
        color: '#ffffff'
      }
    )

    // INSTRUCTION
    this.add.text(
      540,
      20,
      '← → Move   ↑ / SPACE Jump',
      {
        fontSize: '14px',
        color: '#ffffff'
      }
    )

    // PLATFORM GROUP
    this.platforms = this.physics.add.staticGroup()

    // GROUND
    this.createPlatform(
      400,
      575,
      800,
      50,
      0x475569
    )

    // FLOATING PLATFORMS
    this.createPlatform(
      180,
      460,
      180,
      25,
      0x64748b
    )

    this.createPlatform(
      430,
      380,
      180,
      25,
      0x64748b
    )

    this.createPlatform(
      680,
      300,
      180,
      25,
      0x64748b
    )

    this.createPlatform(
      400,
      210,
      170,
      25,
      0x64748b
    )

    this.createPlatform(
      140,
      160,
      160,
      25,
      0x64748b
    )

    // PLAYER
    this.player = this.add.rectangle(
      80,
      500,
      42,
      58,
      0xff8fab
    )

    this.physics.add.existing(this.player)

    this.player.body.setCollideWorldBounds(true)

    // PLAYER COLLISION WITH PLATFORMS
    this.physics.add.collider(
      this.player,
      this.platforms
    )

    // HEART GROUP
    this.hearts = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })

    // HEART POSITIONS
    const heartPositions = [
      { x: 240, y: 525 },
      { x: 180, y: 420 },
      { x: 430, y: 340 },
      { x: 680, y: 260 },
      { x: 400, y: 170 },
      { x: 140, y: 120 },
      { x: 740, y: 525 }
    ]

    heartPositions.forEach((position) => {
      const heart = this.add.text(
        position.x,
        position.y,
        '❤️',
        {
          fontSize: '32px'
        }
      )

      heart.setOrigin(0.5)

      this.physics.add.existing(heart)

      heart.body.setAllowGravity(false)
      heart.body.setImmovable(true)

      this.hearts.add(heart)
    })

    // COLLECT HEART
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
  }

  createPlatform(x, y, width, height, color) {
    const platform = this.add.rectangle(
      x,
      y,
      width,
      height,
      color
    )

    this.platforms.add(platform)
  }

  collectHeart(player, heart) {
    heart.destroy()

    this.score++

    this.scoreText.setText(
      `Hearts: ${this.score} / ${this.totalHearts}`
    )

    if (this.score === this.totalHearts) {
      this.showWinMessage()
    }
  }

  showWinMessage() {
    this.hasWon = true

    this.player.body.setVelocity(0)

    this.add.rectangle(
      400,
      300,
      500,
      190,
      0x111827,
      0.9
    )

    this.add
      .text(
        400,
        270,
        'YOU WIN! ❤️',
        {
          fontSize: '48px',
          color: '#ff8fab',
          fontFamily: 'Arial',
          fontStyle: 'bold'
        }
      )
      .setOrigin(0.5)

    this.add
      .text(
        400,
        325,
        'All hearts collected!',
        {
          fontSize: '22px',
          color: '#ffffff'
        }
      )
      .setOrigin(0.5)
  }

  update() {
    if (this.hasWon) {
      this.player.body.setVelocityX(0)
      return
    }

    const speed = 230
    const jumpPower = -520

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
      Phaser.Input.Keyboard.JustDown(
        this.cursors.space
      ) ||
      Phaser.Input.Keyboard.JustDown(
        this.cursors.up
      )
    ) {
      if (this.player.body.blocked.down) {
        this.player.body.setVelocityY(jumpPower)
      }
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