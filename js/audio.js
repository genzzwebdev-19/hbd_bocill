/**
 * THE GRAND BIRTHDAY EXPERIENCE — AUDIO ENGINE
 * Seamlessly handles external MP3 playback or an elegant, generative
 * ambient piano/celeste synthesizer via Web Audio API if no MP3 is present.
 */

class BirthdayAudioEngine {
  constructor(config = {}) {
    this.config = Object.assign(
      {
        src: "assets/audio/birthday.mp3",
        enableSynthesizerFallback: true,
        volume: 0.65,
      },
      config
    );

    this.isPlaying = false;
    this.isMuted = false;
    this.usingSynth = false;
    this.audioElement = null;
    this.audioCtx = null;
    this.gainNode = null;
    this.synthInterval = null;
    this.currentNoteIndex = 0;
    this.hasUserInteracted = false;

    this.initAudioElement();
  }

  initAudioElement() {
    this.audioElement = new Audio();
    this.audioElement.src = this.config.src;
    this.audioElement.loop = true;
    this.audioElement.volume = this.config.volume;
    this.audioElement.preload = "auto";

    // Handle error or missing file by falling back to procedural synthesizer
    this.audioElement.addEventListener("error", () => {
      // Missing or invalid mp3 file is expected on initial clone before user adds custom mp3
      this.usingSynth = true;
      if (this.isPlaying) {
        this.startSynth();
      }
    });

    // Detect if browser allows playing
    this.audioElement.addEventListener("canplaythrough", () => {
      this.usingSynth = false;
    });
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.setValueAtTime(
          this.config.volume,
          this.audioCtx.currentTime
        );
        this.gainNode.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  async play() {
    this.hasUserInteracted = true;
    this.isPlaying = true;

    // First try loading & playing the audio element
    if (!this.usingSynth && this.audioElement) {
      try {
        await this.audioElement.play();
        this.updateUiState();
        return;
      } catch (err) {
        // Autoplay policy or 404
        if (this.config.enableSynthesizerFallback) {
          this.usingSynth = true;
        }
      }
    }

    if (this.usingSynth && this.config.enableSynthesizerFallback) {
      this.startSynth();
    }

    this.updateUiState();
  }

  pause() {
    this.isPlaying = false;
    if (this.audioElement && !this.usingSynth) {
      this.audioElement.pause();
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.updateUiState();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(vol) {
    this.config.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.config.volume;
    }
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(
        this.config.volume,
        this.audioCtx.currentTime
      );
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(
        this.isMuted ? 0 : this.config.volume,
        this.audioCtx.currentTime
      );
    }
    this.updateUiState();
  }

  /**
   * Procedural Generative Ambient Dream Music:
   * Plays a delicate, warm, romantic music box / piano celeste melody
   * with soft warm chords, tailored to sound like an emotional film soundtrack.
   */
  startSynth() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (this.synthInterval) {
      clearInterval(this.synthInterval);
    }

    // Melodic notes in Hz (Pentatonic / Diatonic C major & A minor dreamy scale)
    // C4, E4, G4, B4, C5, D5, E5, G5, A5
    const chords = [
      // Fmaj9
      [174.61, 261.63, 329.63, 392.0, 523.25],
      // G6
      [196.0, 293.66, 392.0, 493.88, 587.33],
      // Em7
      [164.81, 246.94, 329.63, 392.0, 659.25],
      // Am9
      [220.0, 261.63, 329.63, 440.0, 523.25],
      // Fmaj7
      [174.61, 261.63, 329.63, 440.0, 659.25],
      // Cmaj7
      [130.81, 261.63, 329.63, 392.0, 493.88],
    ];

    let chordIdx = 0;
    let step = 0;

    const playBellTone = (freq, time, duration = 2.4, level = 0.15) => {
      if (!this.isPlaying || this.isMuted) return;

      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, time);
      filter.frequency.exponentialRampToValueAtTime(320, time + duration);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);

      oscHarmonic.type = "triangle";
      oscHarmonic.frequency.setValueAtTime(freq * 2, time);

      const peak = level * (this.config.volume || 0.6);
      noteGain.gain.setValueAtTime(0.0001, time);
      noteGain.gain.exponentialRampToValueAtTime(peak, time + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(time);
      oscHarmonic.start(time);
      osc.stop(time + duration + 0.1);
      oscHarmonic.stop(time + duration + 0.1);
    };

    const tick = () => {
      if (!this.isPlaying) return;
      const now = ctx.currentTime;
      const currentChord = chords[chordIdx];

      // Bass root on downbeat
      if (step % 4 === 0) {
        playBellTone(currentChord[0], now, 3.8, 0.22);
      }

      // Arpeggiated chime tones
      const noteOffset = (step % (currentChord.length - 1)) + 1;
      const noteFreq = currentChord[noteOffset];
      playBellTone(noteFreq, now + 0.04, 2.2, 0.12);

      // Occasional high sparkle
      if (Math.random() > 0.5) {
        const sparkleFreq = noteFreq * 2;
        playBellTone(sparkleFreq, now + 0.35, 1.6, 0.05);
      }

      step++;
      if (step >= 8) {
        step = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    };

    tick();
    this.synthInterval = setInterval(tick, 900);
  }

  updateUiState() {
    const btn = document.getElementById("musicToggleBtn");
    const label = document.getElementById("musicToggleLabel");
    const visualizer = document.getElementById("musicVisualizer");

    if (btn) {
      if (this.isPlaying && !this.isMuted) {
        btn.classList.add("is-playing");
        btn.setAttribute("aria-label", "Jeda Musik");
        if (label) label.textContent = "Music: On";
        if (visualizer) visualizer.classList.add("animate");
      } else {
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "Putar Musik");
        if (label) label.textContent = "Music: Off";
        if (visualizer) visualizer.classList.remove("animate");
      }
    }
  }
}

window.BirthdayAudio = BirthdayAudioEngine;
