import { GameConfig } from "../config/GameConfig.js";
import { Effects } from "../effects/Effects.js";
import { AIManager } from "../managers/AIManager.js";
import { GameManager } from "../managers/GameManager.js";
import { InputManager } from "../managers/InputManager.js";
import { PhysicsManager } from "../managers/PhysicsManager.js";
import { PlayerManager } from "../managers/PlayerManager.js";
import { SoundManager } from "../managers/SoundManager.js";
import { UIManager } from "../managers/UIManager.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.config = GameConfig;
  }

  create() {
    this.layout = this.getLayout();
    this.soundManager = new SoundManager(this);
    this.effects = new Effects(this);
    this.gameManager = new GameManager(this);
    this.aiManager = new AIManager(this);
    this.physicsManager = new PhysicsManager(this);
    this.playerManager = new PlayerManager(this);
    this.inputManager = new InputManager(this);
    this.uiManager = new UIManager(this);

    this.physicsManager.createBoard();
    this.playerManager.createDoughnuts();
    this.physicsManager.attachCollisionEffects();
    this.inputManager.bind();
    this.uiManager.create();
    if (!this.gameManager.hasModeSelected) {
      this.uiManager.showModeSelect();
    }

    this.scale.on("resize", this.handleResize, this);
  }

  update(time) {
    this.keepDoughnutsInside();
    this.playerManager.updateHoleColors();
    this.uiManager.updateCounts();
    this.aiManager.update(time);
    this.gameManager.update(time);
  }

  getLayout() {
    const width = this.scale.width;
    const height = this.scale.height;
    return {
      width,
      height,
      centerX: width / 2,
      centerY: height / 2
    };
  }

  keepDoughnutsInside() {
    const radius = this.config.doughnutRadius;
    for (const doughnut of this.playerManager.doughnuts) {
      if (!doughnut.body) continue;
      const x = Phaser.Math.Clamp(doughnut.x, radius + 8, this.layout.width - radius - 8);
      const y = Phaser.Math.Clamp(doughnut.y, radius + 8, this.layout.height - radius - 8);
      if (x !== doughnut.x || y !== doughnut.y) {
        this.matter.body.setPosition(doughnut.body, { x, y });
      }
    }
  }

  handleResize() {
    this.scale.off("resize", this.handleResize, this);
    this.scene.restart();
  }

  shutdown() {
    this.scale.off("resize", this.handleResize, this);
  }
}
