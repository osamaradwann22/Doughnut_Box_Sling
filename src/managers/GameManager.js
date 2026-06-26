export class GameManager {
  constructor(scene) {
    this.scene = scene;
    this.mode = scene.registry.get("mode") || "pvp";
    this.difficulty = scene.registry.get("difficulty") || "medium";
    this.humanTeam = scene.registry.get("humanTeam") || "glazed";
    this.opponentTeam = this.humanTeam === "glazed" ? "chocolate" : "glazed";
    this.hasModeSelected = Boolean(scene.registry.get("modeSelected"));
    this.isPlaying = this.hasModeSelected;
    this.winner = null;
    this.lastWinCheck = 0;
  }

  update(time) {
    if (!this.isPlaying || time - this.lastWinCheck < this.scene.config.winCheckDelay) return;

    this.lastWinCheck = time;
    const counts = this.scene.playerManager.getCounts();
    if (counts.player1 === 0) this.endGame(`${this.getHumanTeamName()} Wins`);
    if (counts.player2 === 0) this.endGame(`${this.getOpponentTeamName()} Wins`);
  }

  startGame(mode, difficulty = "medium", humanTeam = "glazed") {
    this.mode = mode;
    this.difficulty = difficulty;
    this.humanTeam = humanTeam;
    this.opponentTeam = humanTeam === "glazed" ? "chocolate" : "glazed";
    this.hasModeSelected = true;
    this.isPlaying = true;
    this.scene.registry.set("mode", mode);
    this.scene.registry.set("difficulty", difficulty);
    this.scene.registry.set("humanTeam", humanTeam);
    this.scene.registry.set("modeSelected", true);
    this.scene.playerManager.applySideColors();
    this.scene.uiManager.updateModeLabel();
    this.scene.uiManager.hideModeSelect();
  }

  showModeSelect() {
    this.isPlaying = false;
    this.scene.inputManager.cancelDrag();
    this.scene.registry.remove("modeSelected");
    this.scene.uiManager.showModeSelect();
  }

  endGame(message) {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.winner = message;
    this.scene.inputManager.cancelDrag();
    this.scene.uiManager.showWin(message);
    this.scene.soundManager.playWin();
  }

  restart() {
    this.scene.scene.restart();
  }

  getHumanTeamName() {
    return `Team ${this.scene.config.teamStyles[this.humanTeam].name}`;
  }

  getOpponentTeamName() {
    return `Team ${this.scene.config.teamStyles[this.opponentTeam].name}`;
  }
}
