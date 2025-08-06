class AudioManager {
    constructor() {
        this.bgmVolume = 0.7;
        this.seVolume = 0.7;
        this.voiceVolume = 0.8;
        this.currentBGM = null;
        this.bgmAudio = null;
        this.seAudios = [];
        this.audioCache = {};
        this.fadeInterval = null;
    }
    
    init() {
        // オーディオコンテキストの初期化（必要に応じて）
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    async preloadAudio(audioList) {
        const loadPromises = audioList.map(async (audioName) => {
            if (!this.audioCache[audioName]) {
                try {
                    const audio = new Audio();
                    audio.src = this.getAudioPath(audioName);
                    audio.load();
                    this.audioCache[audioName] = audio;
                } catch (error) {
                    console.error(`Failed to preload audio: ${audioName}`, error);
                }
            }
        });
        
        await Promise.all(loadPromises);
    }
    
    getAudioPath(audioName) {
        // 拡張子が含まれていない場合は追加
        if (!audioName.includes('.')) {
            // BGMかSEかを判断して適切な拡張子を付ける
            if (audioName.includes('bgm') || audioName.includes('theme')) {
                audioName += '.mp3';
            } else {
                audioName += '.wav';
            }
        }
        
        // パスを判断
        if (audioName.includes('bgm') || audioName.includes('theme') || audioName.includes('music')) {
            return `assets/audio/bgm/${audioName}`;
        } else {
            return `assets/audio/se/${audioName}`;
        }
    }
    
    playBGM(bgmName, fadeIn = true) {
        if (this.currentBGM === bgmName) {
            return; // 同じBGMが既に再生中
        }
        
        const fadeOutDuration = fadeIn ? 1000 : 0;
        const fadeInDuration = fadeIn ? 1000 : 0;
        
        // 現在のBGMをフェードアウト
        if (this.bgmAudio) {
            this.fadeOut(this.bgmAudio, fadeOutDuration, () => {
                this.bgmAudio.pause();
                this.bgmAudio = null;
                this.startNewBGM(bgmName, fadeInDuration);
            });
        } else {
            this.startNewBGM(bgmName, fadeInDuration);
        }
    }
    
    startNewBGM(bgmName, fadeInDuration) {
        try {
            const audio = new Audio();
            audio.src = this.getAudioPath(bgmName);
            audio.loop = true;
            audio.volume = fadeInDuration > 0 ? 0 : this.bgmVolume;
            
            this.bgmAudio = audio;
            this.currentBGM = bgmName;
            
            audio.play().then(() => {
                if (fadeInDuration > 0) {
                    this.fadeIn(audio, fadeInDuration, this.bgmVolume);
                }
            }).catch(error => {
                console.error('Failed to play BGM:', error);
                // 自動再生がブロックされた場合の処理
                this.handleAutoplayBlock();
            });
        } catch (error) {
            console.error('Error playing BGM:', error);
        }
    }
    
    stopBGM(fadeOut = true) {
        if (!this.bgmAudio) return;
        
        if (fadeOut) {
            this.fadeOut(this.bgmAudio, 1000, () => {
                this.bgmAudio.pause();
                this.bgmAudio = null;
                this.currentBGM = null;
            });
        } else {
            this.bgmAudio.pause();
            this.bgmAudio = null;
            this.currentBGM = null;
        }
    }
    
    pauseBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
        }
    }
    
    resumeBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.play();
        }
    }
    
    playSE(seName, volume = null) {
        try {
            const audio = new Audio();
            audio.src = this.getAudioPath(seName);
            audio.volume = volume !== null ? volume : this.seVolume;
            
            audio.play().catch(error => {
                console.error('Failed to play SE:', error);
            });
            
            // SEの管理
            this.seAudios.push(audio);
            audio.addEventListener('ended', () => {
                const index = this.seAudios.indexOf(audio);
                if (index > -1) {
                    this.seAudios.splice(index, 1);
                }
            });
            
            // 最大同時再生数を制限
            if (this.seAudios.length > 10) {
                const oldAudio = this.seAudios.shift();
                oldAudio.pause();
            }
            
            return audio;
        } catch (error) {
            console.error('Error playing SE:', error);
            return null;
        }
    }
    
    playVoice(voiceName, volume = null) {
        // ボイス再生（将来的な実装用）
        try {
            const audio = new Audio();
            audio.src = `assets/audio/voice/${voiceName}`;
            audio.volume = volume !== null ? volume : this.voiceVolume;
            audio.play();
            return audio;
        } catch (error) {
            console.error('Error playing voice:', error);
            return null;
        }
    }
    
    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.bgmVolume;
        }
    }
    
    setSEVolume(volume) {
        this.seVolume = Math.max(0, Math.min(1, volume));
    }
    
    setVoiceVolume(volume) {
        this.voiceVolume = Math.max(0, Math.min(1, volume));
    }
    
    setMasterVolume(volume) {
        const masterVolume = Math.max(0, Math.min(1, volume));
        this.setBGMVolume(this.bgmVolume * masterVolume);
        this.setSEVolume(this.seVolume * masterVolume);
        this.setVoiceVolume(this.voiceVolume * masterVolume);
    }
    
    fadeIn(audio, duration, targetVolume) {
        if (!audio) return;
        
        const startVolume = 0;
        const volumeStep = (targetVolume - startVolume) / (duration / 50);
        audio.volume = startVolume;
        
        clearInterval(this.fadeInterval);
        this.fadeInterval = setInterval(() => {
            audio.volume = Math.min(audio.volume + volumeStep, targetVolume);
            if (audio.volume >= targetVolume) {
                clearInterval(this.fadeInterval);
            }
        }, 50);
    }
    
    fadeOut(audio, duration, callback) {
        if (!audio) {
            if (callback) callback();
            return;
        }
        
        const startVolume = audio.volume;
        const volumeStep = startVolume / (duration / 50);
        
        clearInterval(this.fadeInterval);
        this.fadeInterval = setInterval(() => {
            audio.volume = Math.max(audio.volume - volumeStep, 0);
            if (audio.volume <= 0) {
                clearInterval(this.fadeInterval);
                if (callback) callback();
            }
        }, 50);
    }
    
    crossFade(fromBGM, toBGM, duration = 2000) {
        if (this.bgmAudio && this.currentBGM === fromBGM) {
            this.fadeOut(this.bgmAudio, duration / 2, () => {
                this.bgmAudio.pause();
                this.playBGM(toBGM, true);
            });
        } else {
            this.playBGM(toBGM, true);
        }
    }
    
    stopAllSE() {
        this.seAudios.forEach(audio => {
            audio.pause();
        });
        this.seAudios = [];
    }
    
    muteAll() {
        if (this.bgmAudio) {
            this.bgmAudio.muted = true;
        }
        this.seAudios.forEach(audio => {
            audio.muted = true;
        });
    }
    
    unmuteAll() {
        if (this.bgmAudio) {
            this.bgmAudio.muted = false;
        }
        this.seAudios.forEach(audio => {
            audio.muted = false;
        });
    }
    
    handleAutoplayBlock() {
        // 自動再生がブロックされた場合の処理
        const playButton = document.createElement('button');
        playButton.textContent = '音声を有効にする';
        playButton.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px 40px;
            font-size: 18px;
            background: #ffd700;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10000;
        `;
        
        playButton.addEventListener('click', () => {
            this.audioContext.resume();
            if (this.bgmAudio) {
                this.bgmAudio.play();
            }
            document.body.removeChild(playButton);
        });
        
        document.body.appendChild(playButton);
    }
    
    // 特殊エフェクト音
    playSystemSound(type) {
        const systemSounds = {
            select: 'select.wav',
            cancel: 'cancel.wav',
            save: 'save.wav',
            load: 'load.wav',
            error: 'error.wav'
        };
        
        if (systemSounds[type]) {
            this.playSE(systemSounds[type], this.seVolume * 0.5);
        }
    }
}