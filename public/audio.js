class AudioSystem {
    constructor() {
        this.context = null;
        this.gainNode = null;
        this.isMuted = localStorage.getItem('plumber_muted') !== 'false'; 
        this.buffers = {};
        this.init();
    }

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
            
            this.updateVolume();
            
            this.loadSounds();
        } catch (e) {
            console.warn("AudioContext not supported");
        }
    }

    loadSounds() {
        const sounds = {
            hover: 'sounds/hover.mp3',
            click: 'sounds/click.mp3',
            lock: 'sounds/lock.mp3',
            albedo: 'sounds/albedo_transform.mp3' 
        };

        for (const [key, url] of Object.entries(sounds)) {
            fetch(url)
                .then(res => res.arrayBuffer())
                .then(data => this.context.decodeAudioData(data))
                .then(buffer => { this.buffers[key] = buffer; })
                .catch(() => {}); 
        }
    }

    playSound(name, force = false) {
        if ((this.isMuted && !force) || !this.context || !this.buffers[name]) return;

        if (this.context.state === 'suspended') this.context.resume();

        const source = this.context.createBufferSource();
        source.buffer = this.buffers[name];
        source.connect(this.gainNode);
        source.start(0);
    }

    playFile(url, force = false) {
        if ((this.isMuted && !force) || !this.context) return;
        
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play blocked"));
    }

    setMute(shouldMute) {
        this.isMuted = shouldMute;
        localStorage.setItem('plumber_muted', shouldMute);
        this.updateVolume();
    }

    updateVolume() {
        if (this.gainNode) {
            const now = this.context.currentTime;
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.5, now + 0.1);
        }
    }

    playBeep() { this.playSound('hover'); }
    playClick() { this.playSound('click'); }
    playLock() { this.playSound('lock'); }
    playTheme(url) { this.playFile(url, true); } 
}


window.audioSystem = new AudioSystem();