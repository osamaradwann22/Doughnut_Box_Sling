export class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.doughnuts = [];
  }

  createDoughnuts() {
    const { width, height, centerX } = this.scene.layout;
    const radius = this.scene.config.doughnutRadius;
    const columns = Math.min(5, this.scene.config.doughnutsPerPlayer);
    const spacing = Math.min(62, (width - 120) / columns);
    const startX = centerX - ((columns - 1) * spacing) / 2;

    for (let i = 0; i < this.scene.config.doughnutsPerPlayer; i += 1) {
      const x = startX + (i % columns) * spacing;
      const topRow = Math.floor(i / columns);
      this.addDoughnut(x, height * 0.25 + topRow * 58, "player2", i);
      this.addDoughnut(x, height * 0.75 - topRow * 58, "player1", i);
    }
  }

  addDoughnut(x, y, owner, index) {
    const radius = this.scene.config.doughnutRadius;
    const style = this.getStyleForOwner(owner);
    const image = this.scene.add.container(x, y).setDepth(12);
    image.owner = owner;

    const shadow = this.scene.add.ellipse(4, 7, radius * 2.05, radius * 1.45, 0x000000, 0.18);
    const pastry = this.scene.add.circle(0, 0, radius, style.pastry);
    const icing = this.scene.add.circle(0, -2, radius * 0.78, style.icing);
    const hole = this.scene.add.circle(0, 0, radius * 0.4, this.getHoleColor(y));
    hole.setStrokeStyle(4, style.pastry, 1);
    const shine = this.scene.add.ellipse(-7, -11, radius * 0.42, radius * 0.16, 0xffffff, 0.55).setRotation(-0.4);
    const sprinkleLayer = this.scene.add.graphics();
    this.drawSprinkles(sprinkleLayer, radius, style.sprinkles);

    image.add([shadow, pastry, icing, hole, shine, sprinkleLayer]);
    image.pastry = pastry;
    image.icing = icing;
    image.hole = hole;
    image.sprinkleLayer = sprinkleLayer;
    image.doughnutIndex = index;
    this.scene.matter.add.gameObject(image, {
      shape: { type: "circle", radius },
      restitution: this.scene.config.restitution,
      friction: 0.01,
      frictionAir: this.scene.config.frictionAir,
      density: 0.0016,
      label: "doughnut"
    });

    image.body.label = "doughnut";
    image.body.gameObject = image;
    image.body.owner = owner;
    image.body.ignoreGravity = true;
    image.setInteractive(new Phaser.Geom.Circle(0, 0, radius + 8), Phaser.Geom.Circle.Contains);
    this.doughnuts.push(image);
    return image;
  }

  applySideColors() {
    for (const doughnut of this.doughnuts) {
      const style = this.getStyleForOwner(doughnut.owner);
      doughnut.pastry.setFillStyle(style.pastry);
      doughnut.icing.setFillStyle(style.icing);
      doughnut.hole.setStrokeStyle(4, style.pastry, 1);
      doughnut.sprinkleLayer.clear();
      this.drawSprinkles(doughnut.sprinkleLayer, this.scene.config.doughnutRadius, style.sprinkles);
    }
  }

  updateHoleColors() {
    for (const doughnut of this.doughnuts) {
      if (!doughnut.hole) continue;
      doughnut.hole.setFillStyle(this.getHoleColor(doughnut.y));
    }
  }

  getHoleColor(y) {
    return y < this.scene.layout.centerY
      ? this.scene.config.palette.linerTop
      : this.scene.config.palette.linerBottom;
  }

  getStyleForOwner(owner) {
    const teamKey = owner === "player1" ? this.scene.gameManager.humanTeam : this.scene.gameManager.opponentTeam;
    return this.scene.config.teamStyles[teamKey];
  }

  drawSprinkles(graphics, radius, colors) {
    graphics.lineStyle(3, 0xffffff, 1);
    for (let i = 0; i < 10; i += 1) {
      const angle = (i / 10) * Math.PI * 2;
      const dist = radius * (0.44 + (i % 3) * 0.08);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist - 2;
      graphics.lineStyle(3, colors[i % colors.length], 1);
      graphics.lineBetween(x - 3, y - 1, x + 3, y + 1);
    }
  }

  getCounts() {
    const midY = this.scene.layout.centerY;
    let player1 = 0;
    let player2 = 0;

    for (const doughnut of this.doughnuts) {
      if (!doughnut.body) continue;
      if (doughnut.y > midY) player1 += 1;
      if (doughnut.y < midY) player2 += 1;
    }

    return { player1, player2 };
  }
}
