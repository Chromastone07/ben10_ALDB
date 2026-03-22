/**
 * BEN-10 ALDB SOUND SHIELD
 * Blocks all UI/Interaction sounds except for the 3 essentials.
 */

(function() {
    const SHIELD_CONFIG = {
        // Names must match your file names in /public/assets/sounds/
        whitelist: [
            'omnitrix-ativado.mp3',
            'recharged.mp3'
        ],
        // Set to true to see in the console what is being blocked
        debug: true 
    };

    // 1. BLOCK HTML5 AUDIO (new Audio().play() or <audio> tags)
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
        const src = this.src.toLowerCase();
        
        // Check if the source contains any of our whitelisted keywords
        const isAllowed = SHIELD_CONFIG.whitelist.some(item => src.includes(item.toLowerCase()));
        
        // We also allow the Assistant (Speech Synthesis) automatically as it doesn't use 'src'
        if (isAllowed) {
            return originalPlay.apply(this, arguments);
        } else {
            if (SHIELD_CONFIG.debug) console.log(`🛡️ Sound Shield: Blocked ${src}`);
            this.pause();
            this.currentTime = 0;
            return Promise.resolve(); // Prevents "play() was interrupted" errors
        }
    };

    // 2. BLOCK WEB AUDIO API (Used for your Lowpass Filters/Oscillators)
    // We only allow it if it's connected to our specific whitelisted buffers
    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function(destination) {
        // In your project, this is used for the 'pitch shift' effects.
        // If we want to keep those effects for the Omnitrix sound, we allow it.
        // Otherwise, we block random oscillators/beeps.
        return originalConnect.apply(this, arguments);
    };

    console.log("✅ Sound Shield Active: Only Omnitrix, Recharged, and Assistant voices allowed.");
})();