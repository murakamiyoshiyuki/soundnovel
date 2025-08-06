class EffectsManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.effectLayer = gameEngine.elements.effectLayer;
        this.mainScreen = gameEngine.elements.mainScreen;
    }
    
    playEffect(effect) {
        if (!effect || !effect.type) return;
        
        switch (effect.type) {
            case 'fadeout':
                this.fadeOut(effect.duration || 1000);
                break;
            case 'fadein':
                this.fadeIn(effect.duration || 1000);
                break;
            case 'flash':
                this.flash(effect.color || '#ffffff', effect.duration || 300);
                break;
            case 'shake':
                this.shake(effect.intensity || 10, effect.duration || 500);
                break;
            case 'sound':
                this.gameEngine.audioManager.playSE(effect.sound);
                break;
            case 'red_filter':
                this.applyFilter('red', effect.opacity || 0.3);
                break;
            case 'blue_filter':
                this.applyFilter('blue', effect.opacity || 0.2);
                break;
            case 'yomi_effect':
                this.yomiEffect();
                break;
            case 'glitch':
                this.glitchEffect(effect.duration || 300);
                break;
            case 'weather':
                this.weatherEffect(effect.weather);
                break;
            case 'particle':
                this.particleEffect(effect.particle);
                break;
            default:
                console.log('Unknown effect:', effect.type);
        }
    }
    
    fadeOut(duration = 1000) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 0;
            z-index: 999;
            transition: opacity ${duration}ms;
        `;
        this.effectLayer.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            this.effectLayer.removeChild(overlay);
        }, duration + 100);
    }
    
    fadeIn(duration = 1000) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 1;
            z-index: 999;
            transition: opacity ${duration}ms;
        `;
        this.effectLayer.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            this.effectLayer.removeChild(overlay);
        }, duration + 100);
    }
    
    flash(color = '#ffffff', duration = 300) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            opacity: 0;
            z-index: 999;
        `;
        this.effectLayer.appendChild(flash);
        
        flash.style.animation = `flash ${duration}ms`;
        
        setTimeout(() => {
            this.effectLayer.removeChild(flash);
        }, duration);
    }
    
    shake(intensity = 10, duration = 500) {
        const originalTransform = this.mainScreen.style.transform || '';
        const shakeFrames = 10;
        const frameTime = duration / shakeFrames;
        let frame = 0;
        
        const shakeInterval = setInterval(() => {
            if (frame >= shakeFrames) {
                this.mainScreen.style.transform = originalTransform;
                clearInterval(shakeInterval);
                return;
            }
            
            const x = (Math.random() - 0.5) * intensity * 2;
            const y = (Math.random() - 0.5) * intensity * 2;
            this.mainScreen.style.transform = `translate(${x}px, ${y}px)`;
            frame++;
        }, frameTime);
    }
    
    applyFilter(color, opacity = 0.3) {
        const existingFilter = this.effectLayer.querySelector('.color-filter');
        if (existingFilter) {
            this.effectLayer.removeChild(existingFilter);
        }
        
        const filter = document.createElement('div');
        filter.className = 'color-filter';
        filter.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color === 'red' ? `rgba(255, 0, 0, ${opacity})` : `rgba(0, 0, 255, ${opacity})`};
            pointer-events: none;
            z-index: 10;
            animation: fadeIn 2s;
        `;
        this.effectLayer.appendChild(filter);
    }
    
    removeFilter() {
        const filter = this.effectLayer.querySelector('.color-filter');
        if (filter) {
            filter.style.animation = 'fadeOut 1s';
            setTimeout(() => {
                if (filter.parentNode) {
                    this.effectLayer.removeChild(filter);
                }
            }, 1000);
        }
    }
    
    yomiEffect() {
        this.mainScreen.classList.add('yomi-effect');
        
        // 不気味な色調変化
        const filter = document.createElement('div');
        filter.className = 'yomi-filter';
        filter.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                to bottom,
                rgba(128, 0, 128, 0.2),
                rgba(0, 0, 0, 0.4)
            );
            mix-blend-mode: multiply;
            pointer-events: none;
            z-index: 15;
        `;
        this.effectLayer.appendChild(filter);
        
        // ランダムな影を追加
        for (let i = 0; i < 5; i++) {
            const shadow = document.createElement('div');
            shadow.style.cssText = `
                position: absolute;
                width: ${Math.random() * 200 + 100}px;
                height: ${Math.random() * 300 + 200}px;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 50%;
                filter: blur(50px);
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 5 + 5}s infinite ease-in-out;
                pointer-events: none;
                z-index: 14;
            `;
            this.effectLayer.appendChild(shadow);
        }
    }
    
    clearYomiEffect() {
        this.mainScreen.classList.remove('yomi-effect');
        const yomiElements = this.effectLayer.querySelectorAll('.yomi-filter, [style*="float"]');
        yomiElements.forEach(elem => this.effectLayer.removeChild(elem));
    }
    
    glitchEffect(duration = 300) {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        
        // グリッチラインを生成
        for (let i = 0; i < 10; i++) {
            const line = document.createElement('div');
            const height = Math.random() * 5 + 1;
            const top = Math.random() * 100;
            const delay = Math.random() * duration;
            
            line.style.cssText = `
                position: absolute;
                width: 100%;
                height: ${height}px;
                top: ${top}%;
                background: rgba(255, 255, 255, 0.5);
                animation: glitchLine ${duration}ms ${delay}ms;
            `;
            glitchOverlay.appendChild(line);
        }
        
        this.effectLayer.appendChild(glitchOverlay);
        
        // テキストにもグリッチ効果
        this.gameEngine.elements.textContent.classList.add('glitch');
        
        setTimeout(() => {
            this.effectLayer.removeChild(glitchOverlay);
            this.gameEngine.elements.textContent.classList.remove('glitch');
        }, duration);
    }
    
    weatherEffect(type) {
        const weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-effect';
        weatherContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 20;
        `;
        
        switch (type) {
            case 'rain':
                this.createRain(weatherContainer);
                break;
            case 'snow':
                this.createSnow(weatherContainer);
                break;
            case 'sakura':
                this.createSakura(weatherContainer);
                break;
        }
        
        this.effectLayer.appendChild(weatherContainer);
    }
    
    createRain(container) {
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.style.cssText = `
                position: absolute;
                width: 2px;
                height: ${Math.random() * 20 + 10}px;
                background: rgba(174, 194, 224, 0.5);
                left: ${Math.random() * 100}%;
                top: -20px;
                animation: fall ${Math.random() * 1 + 0.5}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(drop);
        }
        
        // CSSアニメーション追加
        if (!document.getElementById('rain-animation')) {
            const style = document.createElement('style');
            style.id = 'rain-animation';
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createSnow(container) {
        for (let i = 0; i < 50; i++) {
            const flake = document.createElement('div');
            const size = Math.random() * 10 + 5;
            flake.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: ${Math.random() * 0.6 + 0.4};
                animation: snowfall ${Math.random() * 3 + 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(flake);
        }
        
        if (!document.getElementById('snow-animation')) {
            const style = document.createElement('style');
            style.id = 'snow-animation';
            style.textContent = `
                @keyframes snowfall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createSakura(container) {
        for (let i = 0; i < 30; i++) {
            const petal = document.createElement('div');
            petal.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: #ffb7c5;
                border-radius: 0 100% 0 100%;
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: sakurafall ${Math.random() * 5 + 5}s linear infinite;
                animation-delay: ${Math.random() * 3}s;
            `;
            container.appendChild(petal);
        }
        
        if (!document.getElementById('sakura-animation')) {
            const style = document.createElement('style');
            style.id = 'sakura-animation';
            style.textContent = `
                @keyframes sakurafall {
                    0% {
                        transform: translateY(0) rotate(0deg) translateX(0);
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg) translateX(100px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    clearWeatherEffect() {
        const weatherEffect = this.effectLayer.querySelector('.weather-effect');
        if (weatherEffect) {
            weatherEffect.style.animation = 'fadeOut 1s';
            setTimeout(() => {
                if (weatherEffect.parentNode) {
                    this.effectLayer.removeChild(weatherEffect);
                }
            }, 1000);
        }
    }
    
    particleEffect(type) {
        // パーティクルエフェクトの実装
        console.log('Particle effect:', type);
    }
    
    transitionTo(sceneName, duration = 1000) {
        this.fadeOut(duration / 2);
        setTimeout(() => {
            // シーン切り替え処理
            this.fadeIn(duration / 2);
        }, duration / 2);
    }
}