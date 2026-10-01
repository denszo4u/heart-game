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

    // =========================
    // CREATE PIXEL CHARACTER
    // =========================
    this.createPlayerTextures()
    this.createPlayerAnimations()

    // =========================
    // TITLE
    // =========================
    this.add
      .text(400, 35, 'Heart Collector ❤️', {
        fontSize: '30px',
        color: '#ffffff',
        fontFamily: 'Arial'
      })
      .setOrigin(0.5)

    // =========================
    // SCORE
    // =========================
    this.scoreText = this.add.text(
      20,
      20,
      `Hearts: 0 / ${this.totalHearts}`,
      {
        fontSize: '18px',
        color: '#ffffff'
      }
    )

    // =========================
    // CONTROLS
    // =========================
    this.add.text(
      540,
      20,
      '← → Move   ↑ / SPACE Jump',
      {
        fontSize: '14px',
        color: '#ffffff'
      }
    )

    // =========================
    // PLATFORMS
    // =========================
    this.platforms = this.physics.add.staticGroup()

    // Ground
    this.createPlatform(
      400,
      575,
      800,
      50,
      0x475569
    )

    // Floating platforms
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

    // =========================
    // PLAYER
    // =========================
    this.player = this.physics.add.sprite(
      80,
      500,
      'player_idle1'
    )

    this.player.setCollideWorldBounds(true)

    // Slightly smaller collision body
    this.player.body.setSize(24, 46)
    this.player.body.setOffset(8, 8)

    this.player.play('idle')

    // Player collision
    this.physics.add.collider(
      this.player,
      this.platforms
    )

    // =========================
    // HEARTS
    // =========================
    this.hearts = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })

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

    // =========================
    // COLLECT HEART
    // =========================
    this.physics.add.overlap(
      this.player,
      this.hearts,
      this.collectHeart,
      null,
      this
    )

    // =========================
    // KEYBOARD
    // =========================
    this.cursors =
      this.input.keyboard.createCursorKeys()
  }

  // =========================
  // PIXEL CHARACTER TEXTURES
  // =========================

  createPlayerTextures() {
    this.drawPlayer('player_idle1', 'idle1')
    this.drawPlayer('player_idle2', 'idle2')

    this.drawPlayer('player_run1', 'run1')
    this.drawPlayer('player_run2', 'run2')

    this.drawPlayer('player_jump', 'jump')
  }

  drawPlayer(key, pose) {
    const graphics = this.make.graphics({
      x: 0,
      y: 0,
      add: false
    })

    // Hair
    graphics.fillStyle(0x3b2f2f)
    graphics.fillRect(8, 4, 24, 8)
    graphics.fillRect(4, 8, 32, 8)

    // Face
    graphics.fillStyle(0xffd6b0)
    graphics.fillRect(8, 16, 24, 16)

    // Eyes
    graphics.fillStyle(0x222222)
    graphics.fillRect(12, 20, 4, 4)
    graphics.fillRect(24, 20, 4, 4)

    // Shirt
    graphics.fillStyle(0xff8fab)
    graphics.fillRect(8, 32, 24, 16)

    // Arms
    graphics.fillStyle(0xffd6b0)

    if (pose === 'run1') {
      graphics.fillRect(4, 32, 4, 16)
      graphics.fillRect(32, 36, 4, 12)
    } else if (pose === 'run2') {
      graphics.fillRect(4, 36, 4, 12)
      graphics.fillRect(32, 32, 4, 16)
    } else if (pose === 'jump') {
      graphics.fillRect(4, 28, 4, 16)
      graphics.fillRect(32, 28, 4, 16)
    } else {
      graphics.fillRect(4, 34, 4, 14)
      graphics.fillRect(32, 34, 4, 14)
    }

    // Pants
    graphics.fillStyle(0x6366f1)
    graphics.fillRect(8, 48, 24, 8)

    // Legs
    graphics.fillStyle(0x222222)

    if (pose === 'run1') {
      graphics.fillRect(8, 56, 8, 4)
      graphics.fillRect(24, 52, 8, 8)
    } else if (pose === 'run2') {
      graphics.fillRect(8, 52, 8, 8)
      graphics.fillRect(24, 56, 8, 4)
    } else if (pose === 'jump') {
      graphics.fillRect(8, 52, 8, 4)
      graphics.fillRect(24, 52, 8, 4)
    } else {
      graphics.fillRect(8, 52, 8, 8)
      graphics.fillRect(24, 52, 8, 8)
    }

    // Idle breathing effect
    if (pose === 'idle2') {
      graphics.fillStyle(0xffffff)
      graphics.fillRect(18, 38, 4, 4)
    }

    graphics.generateTexture(
      key,
      40,
      64
    )

    graphics.destroy()
  }

  // =========================
  // PLAYER ANIMATIONS
  // =========================

  createPlayerAnimations() {
    this.anims.create({
      key: 'idle',

      frames: [
        { key: 'player_idle1' },
        { key: 'player_idle2' }
      ],

      frameRate: 2,
      repeat: -1
    })

    this.anims.create({
      key: 'run',

      frames: [
        { key: 'player_run1' },
        { key: 'player_run2' }
      ],

      frameRate: 8,
      repeat: -1
    })
  }

  // =========================
  // PLATFORM
  // =========================

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

  // =========================
  // HEART COLLECTION
  // =========================

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

  // =========================
  // WIN SCREEN
  // =========================

  showWinMessage() {
    this.hasWon = true

    this.player.body.setVelocity(0)

    this.player.play('idle')

    this.add.rectangle(
      400,
      300,
      500,
      190,
      0x111827,
      0.95
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

  // =========================
  // GAME LOOP
  // =========================

  update() {
    if (this.hasWon) {
      this.player.body.setVelocityX(0)
      return
    }

    const speed = 230
    const jumpPower = -520

    const onGround =
      this.player.body.blocked.down

    // =========================
    // MOVEMENT
    // =========================

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed)

      this.player.setFlipX(true)

      if (onGround) {
        this.player.play('run', true)
      }
    }

    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed)

      this.player.setFlipX(false)

      if (onGround) {
        this.player.play('run', true)
      }
    }

    else {
      this.player.body.setVelocityX(0)

      if (onGround) {
        this.player.play('idle', true)
      }
    }

    // =========================
    // JUMP
    // =========================

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(
        this.cursors.space
      ) ||
      Phaser.Input.Keyboard.JustDown(
        this.cursors.up
      )

    if (
      jumpPressed &&
      onGround
    ) {
      this.player.body.setVelocityY(
        jumpPower
      )
    }

    // =========================
    // JUMP ANIMATION
    // =========================

    if (!onGround) {
      this.player.anims.stop()

      this.player.setTexture(
        'player_jump'
      )
    }
  }
}

// =========================
// GAME CONFIG
// =========================

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  backgroundColor: '#1e1e2f',

  pixelArt: true,

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