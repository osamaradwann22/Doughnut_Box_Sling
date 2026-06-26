export class Effects {
  constructor(scene) {
    this.scene = scene;
  }

  launch(x, y) {
    this.burst(x, y, 8, [0xffffff, 0xff77a8, 0xffdd5e]);
  }

  impact(x, y, speed) {
    this.burst(x, y, Math.min(12, 4 + Math.floor(speed)), [0xffffff, 0x76c9ff, 0xffdd5e, 0xff77a8]);
  }

  burst(x, y, count, colors) {
    for (let i = 0; i < count; i += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(12, 34);
      const particle = this.scene.add.rectangle(x, y, 8, 3, Phaser.Utils.Array.GetRandom(colors), 1)
        .setDepth(35)
        .setRotation(angle);
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scaleX: 0.25,
        scaleY: 0.25,
        duration: Phaser.Math.Between(220, 360),
        ease: "Sine.easeOut",
        onComplete: () => particle.destroy()
      });
    }
  }
}
