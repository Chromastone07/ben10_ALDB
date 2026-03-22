
(function() {
    const SHIELD_CONFIG = {
        whitelist: [
            'omnitrix-ativado.mp3',
            'recharged.mp3'
        ],
        debug: true 
    };

    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
        const src = this.src.toLowerCase();
        
        const isAllowed = SHIELD_CONFIG.whitelist.some(item => src.includes(item.toLowerCase()));
        
        if (isAllowed) {
            return originalPlay.apply(this, arguments);
        } else {
            if (SHIELD_CONFIG.debug) console.log(`🛡️ Sound Shield: Blocked ${src}`);
            this.pause();
            this.currentTime = 0;
            return Promise.resolve(); 
        }
    };

 
    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function(destination) {
     
        return originalConnect.apply(this, arguments);
    };

    console.log(" Sound Shield Active: Only Omnitrix, Recharged, and Assistant voices allowed.");
})();