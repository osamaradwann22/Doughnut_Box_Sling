import { GameScene } from "./scenes/GameScene.js";

window.addEventListener("load", () => {
  if (!window.Phaser) {
    document.body.innerHTML = "<p style='padding:24px;font-family:sans-serif'>Phaser failed to load. Serve this folder with an internet connection or bundle Phaser locally.</p>";
    return;
  }

  const config = {
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#f9d9e4",
    scale: {
      mode: Phaser.Scale.RESIZE,
      parent: "game",
      width: window.innerWidth,
      height: window.innerHeight,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: "matter",
      matter: {
        gravity: { y: 0 },
        enableSleeping: false,
        debug: false
      }
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false
    },
    scene: [GameScene]
  };

  new Phaser.Game(config);
});
