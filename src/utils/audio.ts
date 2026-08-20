/**
 * Utility for playing subtle, pleasant audio notifications using Web Audio API
 * No external mp3/wav files required, zero latency and 100% reliable across browsers.
 */

class SoundController {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Check localStorage preference if available
    try {
      const saved = localStorage.getItem('the_home_pipo_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('the_home_pipo_sound_enabled', enabled ? 'true' : 'false');
    } catch {}
  }

  /**
   * Plays a delicate, elegant order confirmation chime:
   * A warm, ascending 3-note harmonic arpeggio (C5 -> E5 -> G5 / A5) with warm sine-triangle waves
   * and soft exponential decay simulating a fine brass bell / marimba chime.
   */
  public playOrderSuccessSound() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note chords: F5 (698.46 Hz), A5 (880.00 Hz), C6 (1046.50 Hz), E6 (1318.51 Hz)
      const notes = [
        { freq: 587.33, delay: 0.00, duration: 0.45, gain: 0.14 }, // D5
        { freq: 739.99, delay: 0.09, duration: 0.50, gain: 0.16 }, // F#5
        { freq: 880.00, delay: 0.18, duration: 0.65, gain: 0.18 }, // A5
        { freq: 1174.66, delay: 0.28, duration: 0.95, gain: 0.22 }, // D6 (Sparkling finish)
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Sine wave with soft harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);

        // Soft envelope: attack -> exponential decay
        const startTime = now + note.delay;
        const endTime = startTime + note.duration;

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(note.gain, startTime + 0.025);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime + 0.05);
      });

      // Add a subtle warm sub-resonance
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(293.66, now); // D4 warmth
      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.75);

    } catch (e) {
      console.warn('Audio playback not supported or user gesture required', e);
    }
  }

  /**
   * Subtle soft click sound for button interactions or item adding
   */
  public playSoftPop() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }
}

export const soundService = new SoundController();
