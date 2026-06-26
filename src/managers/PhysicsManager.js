export class PhysicsManager {
  constructor(scene) {
    this.scene = scene;
    this.staticBodies = [];
  }

  createBoard() {
    const { width, height, centerX, centerY } = this.scene.layout;
    const c = this.scene.config;
    const t = c.wallThickness;
    const board = this.scene.add.graphics().setDepth(1);

    board.fillStyle(c.palette.shadow, 0.18);
    board.fillRoundedRect(16, 18, width - 32, height - 28, 30);
    board.fillStyle(c.palette.cardboard, 1);
    board.fillRoundedRect(12, 10, width - 24, height - 24, 30);
    board.lineStyle(5, c.palette.cardboardDark, 1);
    board.strokeRoundedRect(12, 10, width - 24, height - 24, 30);

    board.fillStyle(c.palette.linerTop, 1);
    board.fillRoundedRect(28, 28, width - 56, centerY - 42, 20);
    board.fillStyle(c.palette.linerBottom, 1);
    board.fillRoundedRect(28, centerY + 14, width - 56, centerY - 42, 20);

    board.lineStyle(2, 0xffffff, 0.38);
    for (let y = 72; y < height; y += 36) {
      board.lineBetween(46, y, width - 46, y);
    }

    this.addRect(centerX, -t / 2, width, t, "wall");
    this.addRect(centerX, height + t / 2, width, t, "wall");
    this.addRect(-t / 2, centerY, t, height, "wall");
    this.addRect(width + t / 2, centerY, t, height, "wall");

    const dividerHalf = (width - c.goalWidth) / 2;
    const dividerY = centerY;
    const leftX = dividerHalf / 2;
    const rightX = width - dividerHalf / 2;
    this.drawDivider(board, leftX, rightX, dividerHalf, dividerY);
    this.addRect(leftX, dividerY, dividerHalf, c.dividerThickness, "divider");
    this.addRect(rightX, dividerY, dividerHalf, c.dividerThickness, "divider");
  }

  drawDivider(graphics, leftX, rightX, segmentWidth, y) {
    const c = this.scene.config;
    const h = c.dividerThickness;
    graphics.fillStyle(c.palette.divider, 1);
    graphics.fillRoundedRect(leftX - segmentWidth / 2, y - h / 2, segmentWidth, h, 10);
    graphics.fillRoundedRect(rightX - segmentWidth / 2, y - h / 2, segmentWidth, h, 10);
    graphics.lineStyle(3, c.palette.cardboardDark, 0.9);
    graphics.strokeRoundedRect(leftX - segmentWidth / 2, y - h / 2, segmentWidth, h, 10);
    graphics.strokeRoundedRect(rightX - segmentWidth / 2, y - h / 2, segmentWidth, h, 10);

    graphics.fillStyle(c.palette.goalTrim, 1);
    graphics.fillRoundedRect(this.scene.layout.centerX - c.goalWidth / 2 - 6, y - h / 2 - 5, 12, h + 10, 6);
    graphics.fillRoundedRect(this.scene.layout.centerX + c.goalWidth / 2 - 6, y - h / 2 - 5, 12, h + 10, 6);
  }

  addRect(x, y, width, height, label) {
    const body = this.scene.matter.add.rectangle(x, y, width, height, {
      isStatic: true,
      restitution: this.scene.config.restitution,
      friction: 0.01,
      label
    });
    this.staticBodies.push(body);
    return body;
  }

  attachCollisionEffects() {
    this.scene.matter.world.on("collisionstart", (event) => {
      if (!this.scene.gameManager.isPlaying) return;
      for (const pair of event.pairs) {
        const a = pair.bodyA;
        const b = pair.bodyB;
        if (a.label !== "doughnut" && b.label !== "doughnut") continue;

        const doughnutBody = a.label === "doughnut" ? a : b;
        const other = doughnutBody === a ? b : a;
        const speed = Math.hypot(doughnutBody.velocity.x, doughnutBody.velocity.y);
        if (speed < 2.2) continue;

        this.scene.effects.impact(doughnutBody.position.x, doughnutBody.position.y, speed);
        if (other.label === "doughnut") this.scene.soundManager.playCollision(speed);
        else this.scene.soundManager.playBounce(speed);
        if (speed > 8.5) this.scene.cameras.main.shake(55, 0.003);

        const obj = doughnutBody.gameObject;
        if (obj && !obj.isTweening) {
          obj.isTweening = true;
          this.scene.tweens.add({
            targets: obj,
            scaleX: 1.08,
            scaleY: 0.93,
            duration: 45,
            yoyo: true,
            onComplete: () => {
              obj.scaleX = 1;
              obj.scaleY = 1;
              obj.isTweening = false;
            }
          });
        }
      }
    });
  }
}
