export class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.selected = null;
    this.anchor = null;
    this.aimLine = scene.add.graphics().setDepth(30);
  }

  bind() {
    this.scene.input.on("pointerdown", (pointer) => this.onPointerDown(pointer));
    this.scene.input.on("pointermove", (pointer) => this.onPointerMove(pointer));
    this.scene.input.on("pointerup", (pointer) => this.onPointerUp(pointer));
    this.scene.input.on("pointerupoutside", (pointer) => this.onPointerUp(pointer));
  }

  onPointerDown(pointer) {
    if (!this.scene.gameManager.isPlaying) return;
    this.scene.soundManager.unlock();

    const hit = this.findDoughnut(pointer.worldX, pointer.worldY);
    if (!hit) return;

    this.selected = hit;
    this.anchor = new Phaser.Math.Vector2(hit.x, hit.y);
    this.scene.matter.body.setStatic(hit.body, true);
    this.scene.matter.body.setVelocity(hit.body, { x: 0, y: 0 });
    this.scene.matter.body.setAngularVelocity(hit.body, 0);
    hit.setDepth(25);
  }

  onPointerMove(pointer) {
    if (!this.selected || !this.anchor) return;

    const pull = new Phaser.Math.Vector2(pointer.worldX - this.anchor.x, pointer.worldY - this.anchor.y);
    if (pull.length() > this.scene.config.maxPullDistance) {
      pull.setLength(this.scene.config.maxPullDistance);
    }

    const x = this.anchor.x + pull.x;
    const y = this.anchor.y + pull.y;
    this.scene.matter.body.setPosition(this.selected.body, { x, y });
    this.selected.setPosition(x, y);
    this.drawAim();
  }

  onPointerUp() {
    if (!this.selected || !this.anchor) return;

    const launch = new Phaser.Math.Vector2(this.anchor.x - this.selected.x, this.anchor.y - this.selected.y);
    this.launchDoughnut(this.selected, launch.x * this.scene.config.launchPower, launch.y * this.scene.config.launchPower);
    this.selected.setDepth(12);
    this.selected = null;
    this.anchor = null;
    this.aimLine.clear();
  }

  launchDoughnut(doughnut, velocityX, velocityY) {
    const body = doughnut.body;
    this.scene.matter.body.setStatic(body, false);
    this.scene.matter.body.setVelocity(body, {
      x: velocityX,
      y: velocityY
    });
    this.scene.matter.body.setAngularVelocity(body, Phaser.Math.Clamp(velocityX * 0.025, -0.18, 0.18));
    this.scene.tweens.add({
      targets: doughnut,
      scaleX: 1.16,
      scaleY: 0.82,
      duration: 55,
      yoyo: true,
      ease: "Sine.easeOut"
    });
    this.scene.effects.launch(doughnut.x, doughnut.y);
    this.scene.soundManager.playLaunch();
  }

  cancelDrag() {
    if (this.selected?.body) {
      this.scene.matter.body.setStatic(this.selected.body, false);
      this.selected.setDepth(12);
    }
    this.selected = null;
    this.anchor = null;
    this.aimLine.clear();
  }

  findDoughnut(x, y) {
    const radius = this.scene.config.doughnutRadius + 10;
    return this.scene.playerManager.doughnuts.find((doughnut) => {
      if (!doughnut.body || doughnut.body.isStatic) return false;
      if (this.scene.gameManager.mode === "ai" && doughnut.y < this.scene.layout.centerY) return false;
      return Phaser.Math.Distance.Between(x, y, doughnut.x, doughnut.y) <= radius;
    });
  }

  drawAim() {
    const launch = new Phaser.Math.Vector2(this.anchor.x - this.selected.x, this.anchor.y - this.selected.y);
    const strength = Phaser.Math.Clamp(launch.length() / this.scene.config.maxPullDistance, 0, 1);
    const tip = new Phaser.Math.Vector2(this.anchor.x + launch.x * 1.2, this.anchor.y + launch.y * 1.2);

    this.aimLine.clear();
    this.aimLine.lineStyle(5, 0xffffff, 0.8);
    this.aimLine.lineBetween(this.selected.x, this.selected.y, this.anchor.x, this.anchor.y);
    this.aimLine.lineStyle(4, 0xff5c8a, 0.5 + strength * 0.35);
    this.aimLine.lineBetween(this.anchor.x, this.anchor.y, tip.x, tip.y);
    this.aimLine.fillStyle(0xff5c8a, 0.9);
    this.aimLine.fillCircle(tip.x, tip.y, 5 + strength * 4);
  }
}
