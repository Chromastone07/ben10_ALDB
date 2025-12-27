/* ==========================================================================
   PLUMBER OS: GLOBAL AUDIO SYSTEM (UI + BATTLE)
   ========================================================================== */
class GlobalAudio {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.volume = 0.3; 
        
        this.muted = localStorage.getItem('plumber_muted') === 'true';
        this.applyMuteState();
        this.initListeners();
    }

    /* --- CORE SYNTHESIZER --- */
    playTone(freq, type, duration, delay = 0) {
        if (this.muted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration);
    }

    /* --- SPECIAL FX: NOISE (For Battle Impacts) --- */
    playNoise(duration = 0.5) {
        if (this.muted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate White Noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const gain = this.ctx.createGain();
        // Filter to make it sound like a "thud" rather than static
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        gain.gain.setValueAtTime(this.volume * 1.5, this.ctx.currentTime); // Slightly louder for impact
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start();
    }

    /* --- UI PRESETS --- */
    sfxHover() {
        const base = this.getBaseFreq();
        this.playTone(base, 'sine', 0.05);
        this.playTone(base * 1.5, 'sine', 0.05, 0.05);
    }

    sfxClick() {
        const base = this.getBaseFreq();
        this.playTone(base * 0.8, 'square', 0.1);
        this.playTone(base * 0.4, 'sawtooth', 0.15, 0.05);
    }

    sfxSuccess() {
        const base = this.getBaseFreq();
        this.playTone(base, 'sine', 0.1);
        this.playTone(base * 1.5, 'sine', 0.2, 0.1);
    }

    sfxError() {
        this.playTone(150, 'sawtooth', 0.15);
        this.playTone(100, 'sawtooth', 0.2, 0.1);
    }

    /* --- BATTLE PRESETS --- */
    sfxImpact() {
        this.playNoise(0.4); // Calls the noise generator
    }

    sfxPowerUp() {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    /* --- SYSTEM --- */
    getBaseFreq() {
        const body = document.body;
        if (body.classList.contains('theme-red')) return 300;
        if (body.classList.contains('theme-blue')) return 800;
        return 440;
    }

    setMute(isMuted) {
        this.muted = isMuted;
        localStorage.setItem('plumber_muted', isMuted);
        this.applyMuteState();
    }

    applyMuteState() {
        this.masterGain.gain.value = this.muted ? 0 : this.volume;
    }

    initListeners() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .alien-card, input')) this.sfxHover();
        });
        document.addEventListener('click', (e) => {
            if (e.target.closest('a, button, .alien-card')) this.sfxClick();
            if (this.ctx.state === 'suspended') this.ctx.resume();
        });
    }
}

const audioSystem = new GlobalAudio();
window.playSuccess = () => audioSystem.sfxSuccess();
window.playError = () => audioSystem.sfxError();
// Expose Battle Sounds globally
window.playImpact = () => audioSystem.sfxImpact();
window.playPowerUp = () => audioSystem.sfxPowerUp();