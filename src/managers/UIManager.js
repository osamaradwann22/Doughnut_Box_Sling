export class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.elements = {};
    this.pendingMode = scene.gameManager.mode;
    this.pendingDifficulty = scene.gameManager.difficulty;
    this.pendingTeam = scene.gameManager.humanTeam;
  }

  create() {
    const { width, height, centerX } = this.scene.layout;
    const labelStyle = {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#4d2f24",
      fontStyle: "bold",
      align: "center"
    };

    this.elements.logo = this.scene.add.text(centerX, 52, "Doughnut Box Sling", {
      fontFamily: "Arial",
      fontSize: `${Math.min(22, Math.max(17, width * 0.045))}px`,
      color: "#7b3a2d",
      fontStyle: "900"
    }).setOrigin(0.5).setDepth(40);

    this.elements.p2 = this.scene.add.text(centerX, 86, "", labelStyle).setOrigin(0.5).setDepth(40);
    this.elements.p1 = this.scene.add.text(centerX, height - 44, "", labelStyle).setOrigin(0.5).setDepth(40);
    this.elements.mode = this.createButton(28, 38, "M", () => this.scene.gameManager.showModeSelect());
    this.elements.pause = this.createButton(width - 64, 38, "II", () => this.togglePause());
    this.elements.restart = this.createButton(width - 28, 38, "R", () => this.scene.gameManager.restart());
    this.createModeSelect();
    this.createOverlay();
    this.updateCounts();
    this.updateModeLabel();
  }

  createButton(x, y, text, callback) {
    const button = this.scene.add.container(x, y).setDepth(45);
    const bg = this.scene.add.circle(0, 0, 16, 0xffffff, 0.92);
    bg.setStrokeStyle(2, 0xff9bba, 1);
    const label = this.scene.add.text(0, 0, text, {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#7b3a2d",
      fontStyle: "bold"
    }).setOrigin(0.5);
    button.add([bg, label]);
    button.setSize(38, 38).setInteractive({ useHandCursor: true });
    button.on("pointerdown", (pointer) => {
      pointer.event.stopPropagation();
      this.scene.soundManager.unlock();
      callback();
    });
    return button;
  }

  createModeSelect() {
    const { width, height, centerX, centerY } = this.scene.layout;
    this.elements.modeSelect = this.scene.add.container(centerX, centerY).setDepth(80).setVisible(false);
    const veil = this.scene.add.rectangle(0, 0, width, height, 0x2c1a16, 0.42);
    const panel = this.scene.add.graphics();
    panel.fillStyle(0xffffff, 0.98);
    panel.fillRoundedRect(-150, -206, 300, 412, 20);
    panel.lineStyle(3, 0xff9bba, 1);
    panel.strokeRoundedRect(-150, -206, 300, 412, 20);

    const title = this.scene.add.text(0, -136, "Choose Match", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#7b3a2d",
      fontStyle: "900"
    }).setOrigin(0.5);
    const modeLabel = this.scene.add.text(0, -92, "Mode", {
      fontFamily: "Arial",
      fontSize: "15px",
      color: "#7b3a2d",
      fontStyle: "bold"
    }).setOrigin(0.5);
    const teamLabel = this.scene.add.text(0, 4, "Your Team", {
      fontFamily: "Arial",
      fontSize: "15px",
      color: "#7b3a2d",
      fontStyle: "bold"
    }).setOrigin(0.5);
    const diffLabel = this.scene.add.text(0, 92, "AI Difficulty", {
      fontFamily: "Arial",
      fontSize: "15px",
      color: "#7b3a2d",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.elements.modeButtons = {
      pvp: this.createPanelButton(-68, -54, 124, 42, "2 Players", () => this.setPendingMode("pvp")),
      ai: this.createPanelButton(68, -54, 124, 42, "Vs AI", () => this.setPendingMode("ai"))
    };
    this.elements.teamButtons = {
      glazed: this.createPanelButton(-68, 40, 124, 42, "Glazed", () => this.setPendingTeam("glazed")),
      chocolate: this.createPanelButton(68, 40, 124, 42, "Chocolate", () => this.setPendingTeam("chocolate"))
    };
    this.elements.difficultyButtons = {
      easy: this.createPanelButton(-86, 130, 78, 38, "Easy", () => this.setPendingDifficulty("easy")),
      medium: this.createPanelButton(0, 130, 86, 38, "Medium", () => this.setPendingDifficulty("medium")),
      hard: this.createPanelButton(90, 130, 78, 38, "Hard", () => this.setPendingDifficulty("hard"))
    };
    this.elements.start = this.createPanelButton(0, 178, 176, 48, "Start Game", () => {
      this.scene.gameManager.startGame(this.pendingMode, this.pendingDifficulty, this.pendingTeam);
    }, 0xff6f9f, 0xd94c7b, "#ffffff");

    this.elements.modeSelect.add([
      veil,
      panel,
      title,
      modeLabel,
      teamLabel,
      diffLabel,
      this.elements.modeButtons.pvp,
      this.elements.modeButtons.ai,
      this.elements.teamButtons.glazed,
      this.elements.teamButtons.chocolate,
      this.elements.difficultyButtons.easy,
      this.elements.difficultyButtons.medium,
      this.elements.difficultyButtons.hard,
      this.elements.start
    ]);
    this.refreshModeButtons();
  }

  createPanelButton(x, y, width, height, text, callback, fill = 0xfff0cb, stroke = 0xff9bba, color = "#7b3a2d") {
    const button = this.scene.add.container(x, y).setSize(width, height).setInteractive({ useHandCursor: true });
    const bg = this.scene.add.rectangle(0, 0, width, height, fill, 1);
    bg.setStrokeStyle(3, stroke, 1);
    const label = this.scene.add.text(0, 0, text, {
      fontFamily: "Arial",
      fontSize: "15px",
      color,
      fontStyle: "bold"
    }).setOrigin(0.5);
    button.add([bg, label]);
    button.bg = bg;
    button.label = label;
    button.on("pointerdown", (pointer) => {
      pointer.event.stopPropagation();
      this.scene.soundManager.unlock();
      callback();
    });
    return button;
  }

  setPendingMode(mode) {
    this.pendingMode = mode;
    this.refreshModeButtons();
  }

  setPendingDifficulty(difficulty) {
    this.pendingDifficulty = difficulty;
    this.refreshModeButtons();
  }

  setPendingTeam(team) {
    this.pendingTeam = team;
    this.refreshModeButtons();
  }

  refreshModeButtons() {
    if (!this.elements.modeButtons) return;
    Object.entries(this.elements.modeButtons).forEach(([mode, button]) => {
      const selected = this.pendingMode === mode;
      button.bg.setFillStyle(selected ? 0xff6f9f : 0xfff0cb, 1);
      button.bg.setStrokeStyle(3, selected ? 0xd94c7b : 0xff9bba, 1);
      button.label.setColor(selected ? "#ffffff" : "#7b3a2d");
    });

    Object.entries(this.elements.teamButtons).forEach(([team, button]) => {
      const selected = this.pendingTeam === team;
      const fill = team === "glazed" ? 0xfff4dd : 0x5c2f20;
      const stroke = team === "glazed" ? 0xd94c7b : 0x2f1810;
      button.bg.setFillStyle(selected ? fill : 0xfff0cb, 1);
      button.bg.setStrokeStyle(3, selected ? stroke : 0xff9bba, 1);
      button.label.setColor(selected && team === "chocolate" ? "#ffffff" : "#7b3a2d");
    });

    Object.entries(this.elements.difficultyButtons).forEach(([difficulty, button]) => {
      const selected = this.pendingDifficulty === difficulty;
      const enabled = this.pendingMode === "ai";
      button.setAlpha(enabled ? 1 : 0.42);
      button.bg.setFillStyle(selected && enabled ? 0x8ee06d : 0xfff0cb, 1);
      button.bg.setStrokeStyle(3, selected && enabled ? 0x45b86d : 0xff9bba, 1);
      button.label.setColor(selected && enabled ? "#254d26" : "#7b3a2d");
    });
  }

  showModeSelect() {
    this.pendingMode = this.scene.gameManager.mode;
    this.pendingDifficulty = this.scene.gameManager.difficulty;
    this.pendingTeam = this.scene.gameManager.humanTeam;
    this.refreshModeButtons();
    this.elements.modeSelect.setVisible(true).setAlpha(0);
    this.scene.tweens.add({
      targets: this.elements.modeSelect,
      alpha: 1,
      duration: 160,
      ease: "Sine.easeOut"
    });
  }

  hideModeSelect() {
    this.elements.modeSelect.setVisible(false).setAlpha(0);
  }

  createOverlay() {
    const { width, height, centerX, centerY } = this.scene.layout;
    this.elements.overlay = this.scene.add.container(centerX, centerY).setDepth(70).setVisible(false).setAlpha(0);
    const veil = this.scene.add.rectangle(0, 0, width, height, 0x2c1a16, 0.38);
    const panel = this.scene.add.graphics();
    panel.fillStyle(0xffffff, 0.98);
    panel.fillRoundedRect(-142, -92, 284, 184, 18);
    panel.lineStyle(3, 0xff9bba, 1);
    panel.strokeRoundedRect(-142, -92, 284, 184, 18);
    this.elements.winText = this.scene.add.text(0, -38, "", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#7b3a2d",
      fontStyle: "900",
      align: "center",
      lineSpacing: 4
    }).setOrigin(0.5);
    const again = this.scene.add.container(0, 44).setSize(158, 46).setInteractive({ useHandCursor: true });
    const againBg = this.scene.add.rectangle(0, 0, 158, 46, 0xff6f9f, 1).setStrokeStyle(3, 0xd94c7b, 1);
    const againText = this.scene.add.text(0, 0, "Play Again", {
      fontFamily: "Arial",
      fontSize: "17px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);
    again.add([againBg, againText]);
    again.on("pointerdown", () => this.scene.gameManager.restart());
    this.elements.overlay.add([veil, panel, this.elements.winText, again]);
  }

  togglePause() {
    if (!this.scene.gameManager.isPlaying) return;
    if (this.scene.matter.world.enabled) {
      this.scene.inputManager.cancelDrag();
      this.scene.matter.world.enabled = false;
      this.elements.pause.list[1].setText(">");
    } else {
      this.scene.matter.world.enabled = true;
      this.elements.pause.list[1].setText("II");
    }
  }

  showWin(message) {
    this.elements.winText.setText(message.replace(" Wins", "\nWins"));
    this.elements.overlay.setVisible(true);
    this.scene.tweens.add({
      targets: this.elements.overlay,
      alpha: 1,
      scaleX: { from: 0.94, to: 1 },
      scaleY: { from: 0.94, to: 1 },
      duration: 180,
      ease: "Back.easeOut"
    });
  }

  updateCounts() {
    const counts = this.scene.playerManager.getCounts();
    this.elements.p2.setText(`${this.scene.gameManager.getOpponentTeamName()}  ${counts.player2}`);
    this.elements.p1.setText(`${this.scene.gameManager.getHumanTeamName()}  ${counts.player1}`);
  }

  updateModeLabel() {
    if (!this.elements.logo) return;
    this.elements.logo.setText("Doughnut Box Sling");
  }
}
