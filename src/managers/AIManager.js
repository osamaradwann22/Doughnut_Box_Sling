export class AIManager {
  constructor(scene) {
    this.scene = scene;
    this.nextShotAt = 0;
  }

  update(time) {
    const game = this.scene.gameManager;
    if (!game.isPlaying || game.mode !== "ai" || time < this.nextShotAt) return;

    const settings = this.scene.config.aiDifficulties[game.difficulty];
    const doughnut = this.pickDoughnut();
    if (!doughnut) {
      this.nextShotAt = time + settings.shotDelay;
      return;
    }

    const target = this.pickTarget(settings);
    const vector = new Phaser.Math.Vector2(target.x - doughnut.x, target.y - doughnut.y);
    if (vector.length() < 1) return;

    vector.normalize().scale(Phaser.Math.FloatBetween(settings.speedMin, settings.speedMax));
    this.scene.inputManager.launchDoughnut(doughnut, vector.x, vector.y);
    this.nextShotAt = time + settings.shotDelay + Phaser.Math.Between(-160, 220);
  }

  pickDoughnut() {
    const midY = this.scene.layout.centerY;
    const candidates = this.scene.playerManager.doughnuts.filter((doughnut) => {
      if (!doughnut.body || doughnut.y > midY) return false;
      const speed = Math.hypot(doughnut.body.velocity.x, doughnut.body.velocity.y);
      return speed < 0.9 && !doughnut.body.isStatic;
    });

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => Math.abs(a.x - this.scene.layout.centerX) - Math.abs(b.x - this.scene.layout.centerX));
    const topPickCount = Math.min(3, candidates.length);
    return candidates[Phaser.Math.Between(0, topPickCount - 1)];
  }

  pickTarget(settings) {
    const { centerX, centerY } = this.scene.layout;
    return {
      x: centerX + Phaser.Math.Between(-settings.aimNoise, settings.aimNoise),
      y: centerY + 120 + Phaser.Math.Between(-settings.aimNoise * 0.4, settings.aimNoise * 0.5)
    };
  }
}
