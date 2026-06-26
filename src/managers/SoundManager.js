export class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.context = null;
    this.enabled = true;
  }

  unlock() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.context.state === "suspended") {
      this.context.resume();
    }
  }

  playLaunch() {
    this.tone(180, 0.05, "sine", 0.08);
    this.tone(360, 0.07, "triangle", 0.05, 0.035);
  }

  playBounce(force = 1) {
    this.tone(240 + force * 110, 0.035, "square", Math.min(0.05, 0.018 + force * 0.008));
  }

  playCollision(force = 1) {
    this.tone(520 + force * 80, 0.045, "triangle", Math.min(0.06, 0.02 + force * 0.008));
  }

  playWin() {
    [0, 0.09, 0.18, 0.3].forEach((delay, index) => {
      this.tone([440, 554, 659, 880][index], 0.12, "sine", 0.075, delay);
    });
  }

  tone(frequency, duration, type, volume, delay = 0) {
    if (!this.enabled || !this.context) return;

    const now = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }
}
