import Phaser from 'phaser'
import './style.css'

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  preload() {
    // Assets kita masukkan nanti
  }

  create() {
    this.add
      .text(400, 250, 'MY FIRST GAME 🎮', {
        fontSize: '40px',
        color: '#ffffff',
        fontFamily: 'Arial'
      })
      .setOrigin(0.5)

    this.add
      .text(400, 310, 'Heart Collector ❤️', {
        fontSize: '24px',
        color: '#ff9eb5'
      })
      .setOrigin(0.5)
  }
}

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  backgroundColor: '#1e1e2f',

  scene: GameScene
}

new Phaser.Game(config)