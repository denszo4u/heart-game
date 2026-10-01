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

    this.createBackground()
    this.createPlayerTextures()
    this.createPlayerAnimations()

    // TITLE
    this.add
      .text(400, 35, 'Heart Collector ❤️', {
        fontSize: '30px',
        color: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold'
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

    // CONTROLS
    this.add.text(
      540,
      20,
      '← → Move   ↑ / SPACE Jump',
      {
        fontSize: '14px',
        color: '#ffffff'
      }
    )

    // PLATFORMS
    this.platforms = this.physics.add.staticGroup()

    this.createPlatform(400, 575, 800, 50)
    this.createPlatform(180, 460, 180, 25)
    this.createPlatform(430, 380, 180, 25)
    this.createPlatform(680, 300, 180, 25)
    this.createPlatform(400, 210, 170, 25)
    this.createPlatform(140, 160, 160, 25)

    // PLAYER
    this.player = this.physics.add.sprite(
      80,
      500,
      'player_idle1'
    )

    this.player.setCollideWorldBounds(true)
    this.player.body.setSize(24, 50)
    this.player.body.setOffset(8, 6)
    this.player.play('idle')

    this.physics.add.collider(
      this.player,
      this.platforms
    )

    // HEARTS
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

    heartPositions.forEach((position, index) => {
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

      // HEART BOUNCE
      this.tweens.add({
        targets: heart,
        y: position.y - 10,
        duration: 700 + index * 80,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })

      // HEART GLOW / SCALE
      this.tweens.add({
        targets: heart,
        scale: 1.15,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })

    this.physics.add.overlap(
      this.player,
      this.hearts,
      this.collectHeart,
      null,
      this
    )

    this.cursors =
      this.input.keyboard.createCursorKeys()
  }

  createBackground() {
    // SKY
    this.add.rectangle(
      400,
      300,
      800,
      600,
      0x87ceeb
    )

    // SUN
    this.add.circle(
      700,
      90,
      45,
      0xfff3b0
    )

    this.add.circle(
      700,
      90,
      65,
      0xfff3b0,
      0.15
    )

    // CLOUDS
    this.createCloud(120, 90)
    this.createCloud(360, 120)
    this.createCloud(600, 150)

    // FAR HILLS
    this.add.ellipse(
      120,
      520,
      320,
      180,
      0x86c98d
    )

    this.add.ellipse(
      400,
      530,
      400,
      200,
      0x76b982
    )

    this.add.ellipse(
      700,
      520,
      360,
      180,
      0x86c98d
    )

    // SMALL DECORATIVE FLOWERS
    this.add.text(70, 535, '🌼', {
      fontSize: '20px'
    })

    this.add.text(350, 535, '🌸', {
      fontSize: '20px'
    })

    this.add.text(650, 535, '🌼', {
      fontSize: '20px'
    })
  }

  createCloud(x, y) {
    const cloudColor = 0xffffff

    this.add.circle(
      x,
      y,
      22,
      cloudColor,
      0.9
    )

    this.add.circle(
      x + 25,
      y - 8,
      26,
      cloudColor,
      0.9
    )

    this.add.circle(
      x + 52,
      y,
      20,
      cloudColor,
      0.9
    )

    this.add.rectangle(
      x + 26,
      y + 10,
      60,
      22,
      cloudColor,
      0.9
    )
  }

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

    const hijabColor = 0x111111
    const outfitColor = 0x1d4ed8
    const skinColor = 0xd8a07a
    const shoeColor = 0x222222
    const eyeColor = 0x111111
    const faceShade = 0xc98f6c
    const blushColor = 0xf29bb2
    const lipColor = 0xe56b8a

    // HIJAB
    graphics.fillStyle(hijabColor)
    graphics.fillRect(10, 4, 20, 8)
    graphics.fillRect(6, 8, 28, 8)

    graphics.fillRect(4, 16, 6, 16)
    graphics.fillRect(30, 16, 6, 16)

    // FACE
    graphics.fillStyle(skinColor)
    graphics.fillRect(12, 14, 16, 16)

    graphics.fillStyle(faceShade)
    graphics.fillRect(12, 26, 16, 4)

    // EYEBROWS
    graphics.fillStyle(0x2b1d1d)
    graphics.fillRect(14, 17, 3, 1)
    graphics.fillRect(23, 17, 3, 1)

    // EYES
    graphics.fillStyle(eyeColor)
    graphics.fillRect(15, 20, 2, 2)
    graphics.fillRect(23, 20, 2, 2)

    // EYELASHES
    graphics.fillRect(14, 19, 1, 1)
    graphics.fillRect(13, 20, 1, 1)

    graphics.fillRect(25, 19, 1, 1)
    graphics.fillRect(26, 20, 1, 1)

    // BLUSH
    graphics.fillStyle(blushColor)
    graphics.fillRect(12, 23, 2, 2)
    graphics.fillRect(26, 23, 2, 2)

    // LIPS
    graphics.fillStyle(lipColor)
    graphics.fillRect(18, 26, 4, 1)

    // HIJAB CHEST
    graphics.fillStyle(hijabColor)
    graphics.fillRect(8, 30, 24, 8)

    // BODY
    graphics.fillStyle(outfitColor)
    graphics.fillRect(10, 38, 20, 16)

    // ARMS
    graphics.fillStyle(skinColor)

    if (pose === 'run1') {
      graphics.fillRect(6, 40, 4, 12)
      graphics.fillRect(30, 44, 4, 10)
    } else if (pose === 'run2') {
      graphics.fillRect(6, 44, 4, 10)
      graphics.fillRect(30, 40, 4, 12)
    } else if (pose === 'jump') {
      graphics.fillRect(6, 36, 4, 12)
      graphics.fillRect(30, 36, 4, 12)
    } else {
      graphics.fillRect(6, 42, 4, 10)
      graphics.fillRect(30, 42, 4, 10)
    }

    // LOWER DRESS
    graphics.fillStyle(outfitColor)
    graphics.fillRect(8, 54, 24, 8)

    // SHOES
    graphics.fillStyle(shoeColor)

    if (pose === 'run1') {
      graphics.fillRect(10, 62, 6, 4)
      graphics.fillRect(22, 60, 8, 6)
    } else if (pose === 'run2') {
      graphics.fillRect(10, 60, 8, 6)
      graphics.fillRect(24, 62, 6, 4)
    } else if (pose === 'jump') {
      graphics.fillRect(10, 60, 6, 4)
      graphics.fillRect(24, 60, 6, 4)
    } else {
      graphics.fillRect(10, 60, 6, 6)
      graphics.fillRect(24, 60, 6, 6)
    }

    if (pose === 'idle2') {
      graphics.fillStyle(0x60a5fa)
      graphics.fillRect(16, 42, 8, 2)
    }

    graphics.generateTexture(
      key,
      40,
      68
    )

    graphics.destroy()
  }

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

  createPlatform(x, y, width, height) {
    // DIRT
    const dirt = this.add.rectangle(
      x,
      y,
      width,
      height,
      0x8b5a2b
    )

    this.platforms.add(dirt)

    // GRASS TOP
    this.add.rectangle(
      x,
      y - height / 2,
      width,
      7,
      0x4caf50
    )

    // GRASS HIGHLIGHT
    this.add.rectangle(
      x,
      y - height / 2 - 3,
      width,
      3,
      0x7ed957
    )
  }

  collectHeart(player, heart) {
    const x = heart.x
    const y = heart.y

    heart.destroy()

    // LITTLE COLLECTION EFFECT
    const effect = this.add.text(
      x,
      y,
      '+1 ❤️',
      {
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    )

    effect.setOrigin(0.5)

    this.tweens.add({
      targets: effect,
      y: y - 35,
      alpha: 0,
      duration: 700,
      onComplete: () => {
        effect.destroy()
      }
    })

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
    this.player.play('idle')

    this.add.rectangle(
      400,
      300,
      500,
      190,
      0x172033,
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

  update() {
    if (this.hasWon) {
      this.player.body.setVelocityX(0)
      return
    }

    const speed = 230
    const jumpPower = -520
    const onGround =
      this.player.body.blocked.down

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed)
      this.player.setFlipX(true)

      if (onGround) {
        this.player.play('run', true)
      }
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed)
      this.player.setFlipX(false)

      if (onGround) {
        this.player.play('run', true)
      }
    } else {
      this.player.body.setVelocityX(0)

      if (onGround) {
        this.player.play('idle', true)
      }
    }

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

    if (!onGround) {
      this.player.anims.stop()
      this.player.setTexture(
        'player_jump'
      )
    }
  }
}

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

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