class GameEngine {
    constructor() {
        this.currentChapter = 0;
        this.currentScene = 0;
        this.currentLine = 0;
        this.currentScenario = null;
        this.scenarios = {};
        this.isAutoMode = false;
        this.isSkipMode = false;
        this.textSpeed = 50;
        this.autoSpeed = 50;
        this.backlog = [];
        this.isTextAnimating = false;
        this.currentTextAnimation = null;
        this.debugLogging = false; // デバッグログのON/OFF
        
        this.gameState = {
            flags: {
                promise_made: false,
                marriage_correct: false,
                waited_at_yomi: false,
                called_kukurihime: false,
                avoided_fire_god: false,
                positive_response: false
            },
            affection: 50,
            trust: 50,
            route: 'main',
            choices: [],
            readText: [],
            currentPosition: {
                chapter: 0,
                scene: 0,
                line: 0
            }
        };
        
        this.elements = {};
        this.audioManager = null;
        this.saveSystem = null;
        this.effectsManager = null;
        this.scenarioLoader = null;
    }
    
    init() {
        this.initElements();
        this.initManagers();
        this.bindEvents();
        this.loadConfig();
        this.showTitleScreen();
    }
    
    initElements() {
        this.elements = {
            titleScreen: document.getElementById('title-screen'),
            mainScreen: document.getElementById('main-screen'),
            textWindow: document.getElementById('text-window'),
            textContent: document.getElementById('text-content'),
            speakerName: document.getElementById('speaker-name'),
            nextIndicator: document.getElementById('next-indicator'),
            choiceWindow: document.getElementById('choice-window'),
            choiceContainer: document.getElementById('choice-container'),
            backgroundLayer: document.getElementById('background-layer'),
            characterLayer: document.getElementById('character-layer'),
            characterLeft: document.getElementById('character-left'),
            characterCenter: document.getElementById('character-center'),
            characterRight: document.getElementById('character-right'),
            effectLayer: document.getElementById('effect-layer'),
            saveLoadScreen: document.getElementById('save-load-screen'),
            configScreen: document.getElementById('config-screen'),
            backlogElement: document.getElementById('backlog'),
            backlogContent: document.getElementById('backlog-content')
        };
    }
    
    initManagers() {
        this.audioManager = new AudioManager();
        this.saveSystem = new SaveSystem(this);
        this.effectsManager = new EffectsManager(this);
        this.scenarioLoader = new ScenarioLoader(this);
    }
    
    bindEvents() {
        // タイトル画面のボタン
        document.getElementById('start-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.showLoadScreen());
        document.getElementById('gallery-btn').addEventListener('click', () => this.showGallery());
        document.getElementById('config-title-btn').addEventListener('click', () => this.showConfig());
        
        // ヘッダーメニューのボタン
        document.getElementById('save-btn').addEventListener('click', () => this.showSaveScreen());
        document.getElementById('load-btn').addEventListener('click', () => this.showLoadScreen());
        document.getElementById('config-btn').addEventListener('click', () => this.showConfig());
        document.getElementById('skip-btn').addEventListener('click', () => this.toggleSkipMode());
        document.getElementById('auto-btn').addEventListener('click', () => this.toggleAutoMode());
        document.getElementById('menu-btn').addEventListener('click', () => this.showMenu());
        
        // テキストウィンドウクリック
        this.elements.textWindow.addEventListener('click', () => this.onTextWindowClick());
        
        // キーボードイベント
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // 設定画面
        document.getElementById('text-speed').addEventListener('change', (e) => {
            this.textSpeed = parseInt(e.target.value);
            this.saveConfig();
        });
        
        document.getElementById('auto-speed').addEventListener('change', (e) => {
            this.autoSpeed = parseInt(e.target.value);
            this.saveConfig();
        });
        
        document.getElementById('bgm-volume').addEventListener('change', (e) => {
            this.audioManager.setBGMVolume(parseInt(e.target.value) / 100);
            this.saveConfig();
        });
        
        document.getElementById('se-volume').addEventListener('change', (e) => {
            this.audioManager.setSEVolume(parseInt(e.target.value) / 100);
            this.saveConfig();
        });
        
        // 閉じるボタン
        document.getElementById('save-load-close').addEventListener('click', () => {
            this.elements.saveLoadScreen.style.display = 'none';
        });
        
        document.getElementById('config-close').addEventListener('click', () => {
            this.elements.configScreen.style.display = 'none';
        });
        
        document.getElementById('backlog-close').addEventListener('click', () => {
            this.elements.backlogElement.style.display = 'none';
        });
        
        // 右クリックでバックログ
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showBacklog();
        });
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
            case 'Enter':
                this.onTextWindowClick();
                break;
            case 'Escape':
                this.showMenu();
                break;
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.quickSave();
                }
                break;
            case 'l':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.quickLoad();
                }
                break;
            case 'a':
                this.toggleAutoMode();
                break;
            case 'Control':
                this.toggleSkipMode();
                break;
            case 'd':
                if (e.ctrlKey && e.shiftKey) {
                    e.preventDefault();
                    this.toggleDebugMode();
                }
                break;
        }
    }
    
    showTitleScreen() {
        this.elements.titleScreen.style.display = 'flex';
        this.elements.mainScreen.style.display = 'none';
    }
    
    async startNewGame() {
        this.gameState = {
            flags: {
                promise_made: false,
                marriage_correct: false,
                waited_at_yomi: false,
                called_kukurihime: false,
                avoided_fire_god: false,
                positive_response: false
            },
            affection: 50,
            trust: 50,
            route: 'main',
            choices: [],
            readText: [],
            currentPosition: {
                chapter: 0,
                scene: 0,
                line: 0
            }
        };
        
        this.elements.titleScreen.style.display = 'none';
        this.elements.mainScreen.style.display = 'block';
        
        await this.scenarioLoader.loadChapter('prologue');
        this.playScene();
    }
    
    async playScene() {
        if (this.debugLogging) console.log('playScene: chapter', this.currentChapter, 'scene', this.currentScene);
        const chapter = this.scenarios[this.currentChapter];
        if (!chapter) {
            if (this.debugLogging) console.log('No chapter loaded for:', this.currentChapter);
            return;
        }
        
        const scene = chapter.scenes[this.currentScene];
        if (!scene) {
            if (this.debugLogging) console.log('No scene found, moving to next chapter');
            // 章の終わり、次の章へ
            this.currentChapter++;
            this.currentScene = 0;
            this.currentLine = 0;
            await this.loadNextChapter();
            return;
        }
        
        if (this.debugLogging) console.log('Playing scene:', scene.id);
        
        // 背景設定
        if (scene.background) {
            this.setBackground(scene.background);
        }
        
        // BGM設定
        if (scene.bgm) {
            this.audioManager.playBGM(scene.bgm);
        }
        
        // シーンの行を処理
        this.processLine();
    }
    
    processLine() {
        const chapter = this.scenarios[this.currentChapter];
        const scene = chapter.scenes[this.currentScene];
        const line = scene.lines[this.currentLine];
        
        console.log('processLine: line', this.currentLine, 'of', scene?.lines?.length || 0);
        
        if (!line) {
            console.log('No more lines in scene, moving to next scene');
            // シーンの終わり、次のシーンへ
            this.currentScene++;
            this.currentLine = 0;
            this.playScene();
            return;
        }
        
        console.log('Line type:', line.type);
        
        // 既読フラグを立てる
        const textId = `${this.currentChapter}-${this.currentScene}-${this.currentLine}`;
        if (!this.gameState.readText.includes(textId)) {
            this.gameState.readText.push(textId);
        }
        
        switch (line.type) {
            case 'narration':
                this.showNarration(line.text);
                break;
            case 'dialogue':
                this.showDialogue(line.speaker, line.text, line.character);
                break;
            case 'choice':
                this.showChoices(line.text, line.options);
                break;
            case 'effect':
                this.effectsManager.playEffect(line.effect);
                this.currentLine++;
                this.processLine();
                break;
            case 'wait':
                setTimeout(() => {
                    this.currentLine++;
                    this.processLine();
                }, line.duration || 1000);
                break;
            case 'scene_change':
                this.changeScene(line.next);
                break;
            default:
                this.currentLine++;
                this.processLine();
        }
    }
    
    showNarration(text) {
        this.elements.speakerName.textContent = '';
        this.elements.speakerName.style.display = 'none';
        this.displayText(text);
        this.addToBacklog('', text);
    }
    
    showDialogue(speaker, text, character) {
        this.elements.speakerName.textContent = speaker;
        this.elements.speakerName.style.display = 'block';
        
        if (character) {
            this.setCharacter(character);
        }
        
        this.displayText(text);
        this.addToBacklog(speaker, text);
    }
    
    displayText(text) {
        if (this.isTextAnimating && this.currentTextAnimation) {
            clearInterval(this.currentTextAnimation);
            this.elements.textContent.textContent = this.currentFullText;
            this.isTextAnimating = false;
            this.elements.nextIndicator.style.display = 'block';
            return;
        }
        
        this.currentFullText = text;
        this.elements.textContent.textContent = '';
        this.elements.nextIndicator.style.display = 'none';
        
        if (this.isSkipMode && this.isTextRead()) {
            this.elements.textContent.textContent = text;
            this.elements.nextIndicator.style.display = 'block';
            if (this.isAutoMode || this.isSkipMode) {
                setTimeout(() => this.advanceText(), 100);
            }
            return;
        }
        
        let charIndex = 0;
        const speed = 101 - this.textSpeed;
        this.isTextAnimating = true;
        
        this.currentTextAnimation = setInterval(() => {
            if (charIndex < text.length) {
                this.elements.textContent.textContent += text[charIndex];
                charIndex++;
            } else {
                clearInterval(this.currentTextAnimation);
                this.isTextAnimating = false;
                this.elements.nextIndicator.style.display = 'block';
                
                if (this.isAutoMode) {
                    const autoDelay = (101 - this.autoSpeed) * 30;
                    setTimeout(() => this.advanceText(), autoDelay);
                }
            }
        }, speed);
    }
    
    showChoices(prompt, options) {
        console.log('Showing choices:', options);
        this.elements.choiceWindow.style.display = 'block';
        this.elements.choiceContainer.innerHTML = '';
        
        if (prompt) {
            const promptElement = document.createElement('div');
            promptElement.className = 'choice-prompt';
            promptElement.textContent = prompt;
            this.elements.choiceContainer.appendChild(promptElement);
        }
        
        // 実際に表示される選択肢のインデックスを保持
        const validOptions = [];
        
        options.forEach((option, originalIndex) => {
            // 条件チェック
            if (option.condition) {
                const conditionMet = this.evaluateCondition(option.condition);
                if (!conditionMet) {
                    console.log('Skipping option due to condition:', option.text, option.condition);
                    // 条件を満たさない選択肢は表示しない
                    return;
                }
            }
            
            validOptions.push({ option, originalIndex });
        });
        
        // 有効な選択肢を表示
        validOptions.forEach((item, displayIndex) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = item.option.text;
            // originalIndexを使用して正しい選択肢を参照
            button.addEventListener('click', () => this.selectChoice(item.originalIndex, item.option));
            this.elements.choiceContainer.appendChild(button);
            console.log(`Choice ${displayIndex + 1}: "${item.option.text}" -> ${item.option.next}`);
        });
        
        console.log('Choice buttons created:', validOptions.length);
    }
    
    evaluateCondition(condition) {
        // 条件式を評価（簡易的な実装）
        // 例: "affection >= 80"
        if (condition.includes('affection')) {
            const match = condition.match(/affection\s*([><=]+)\s*(\d+)/);
            if (match) {
                const operator = match[1];
                const value = parseInt(match[2]);
                const affection = this.gameState.affection;
                
                switch(operator) {
                    case '>=': return affection >= value;
                    case '>': return affection > value;
                    case '<=': return affection <= value;
                    case '<': return affection < value;
                    case '==': return affection == value;
                }
            }
        }
        
        // フラグチェック
        if (condition.includes('flags.')) {
            const flagName = condition.split('flags.')[1];
            return this.gameState.flags[flagName] === true;
        }
        
        return true; // デフォルトは表示
    }
    
    selectChoice(index, option) {
        console.log('Selected choice:', index, option);
        this.elements.choiceWindow.style.display = 'none';
        
        // 選択を記録
        this.gameState.choices.push({
            chapter: this.currentChapter,
            scene: this.currentScene,
            line: this.currentLine,
            selected: index,
            text: option.text
        });
        
        // エフェクトを適用
        if (option.effects) {
            if (option.effects.affection !== undefined) {
                const oldAffection = this.gameState.affection;
                this.gameState.affection += option.effects.affection;
                this.gameState.affection = Math.max(0, Math.min(100, this.gameState.affection));
                console.log('Affection changed:', oldAffection, '->', this.gameState.affection);
                
                // 愛情度変化の表示（デバッグ用）
                if (this.debugPanel && this.debugPanel.style.display === 'block') {
                    this.showAffectionChange(option.effects.affection);
                    this.updateDebugInfo();
                }
            }
            if (option.effects.trust !== undefined) {
                this.gameState.trust += option.effects.trust;
                this.gameState.trust = Math.max(0, Math.min(100, this.gameState.trust));
            }
            if (option.effects.flag) {
                this.gameState.flags[option.effects.flag] = true;
                console.log('Flag set:', option.effects.flag);
            }
            if (option.effects.route) {
                this.gameState.route = option.effects.route;
            }
        }
        
        // 次のシーンへ
        if (option.next) {
            console.log('Changing scene to:', option.next);
            this.changeScene(option.next);
        } else {
            console.log('No next scene specified, advancing line');
            this.currentLine++;
            this.processLine();
        }
    }
    
    changeScene(sceneId) {
        console.log('changeScene called with:', sceneId);
        console.log('Current chapter:', this.currentChapter, 'Current scene:', this.currentScene);
        
        // chapter移動の場合
        if (sceneId && sceneId.startsWith('chapter')) {
            const chapterMap = {
                'chapter1': 1,
                'chapter2': 2,
                'chapter3': 3,
                'chapter4': 4,
                'chapter5': 5,
                'endings': 6
            };
            
            if (chapterMap[sceneId] !== undefined) {
                console.log('Moving to chapter:', chapterMap[sceneId]);
                this.currentChapter = chapterMap[sceneId];
                this.currentScene = 0;
                this.currentLine = 0;
                this.loadNextChapter();
                return;
            }
        }
        
        // 同じchapter内のシーンIDから次のシーンを探す
        if (this.scenarios[this.currentChapter]) {
            for (let i = 0; i < this.scenarios[this.currentChapter].scenes.length; i++) {
                if (this.scenarios[this.currentChapter].scenes[i].id === sceneId) {
                    console.log('Found scene at index:', i);
                    this.currentScene = i;
                    this.currentLine = 0;
                    this.playScene();
                    return;
                }
            }
            console.log('Scene not found in current chapter:', sceneId);
        } else {
            console.log('No scenarios loaded for chapter:', this.currentChapter);
        }
        
        // 見つからない場合は次のシーンへ
        console.log('Scene not found, moving to next scene');
        this.currentScene++;
        this.currentLine = 0;
        this.playScene();
    }
    
    onTextWindowClick() {
        if (this.elements.choiceWindow.style.display === 'block') {
            return;
        }
        
        if (this.isTextAnimating) {
            // テキストアニメーションをスキップ
            clearInterval(this.currentTextAnimation);
            this.elements.textContent.textContent = this.currentFullText;
            this.isTextAnimating = false;
            this.elements.nextIndicator.style.display = 'block';
        } else {
            this.advanceText();
        }
    }
    
    advanceText() {
        if (this.isTextAnimating) return;
        
        this.currentLine++;
        this.processLine();
    }
    
    setBackground(backgroundName) {
        const path = `assets/images/backgrounds/${backgroundName}.jpg`;
        this.elements.backgroundLayer.style.backgroundImage = `url(${path})`;
    }
    
    setCharacter(character) {
        const position = character.position || 'center';
        const element = this.elements[`character${position.charAt(0).toUpperCase() + position.slice(1)}`];
        
        if (character.name === 'none' || character.name === '') {
            element.style.backgroundImage = '';
            return;
        }
        
        const expression = character.expression || 'normal';
        const path = `assets/images/characters/${character.name}_${expression}.png`;
        element.style.backgroundImage = `url(${path})`;
    }
    
    isTextRead() {
        const textId = `${this.currentChapter}-${this.currentScene}-${this.currentLine}`;
        return this.gameState.readText.includes(textId);
    }
    
    addToBacklog(speaker, text) {
        this.backlog.push({ speaker, text });
        if (this.backlog.length > 100) {
            this.backlog.shift();
        }
    }
    
    showBacklog() {
        this.elements.backlogElement.style.display = 'block';
        this.elements.backlogContent.innerHTML = '';
        
        this.backlog.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'backlog-entry';
            
            if (entry.speaker) {
                const speakerDiv = document.createElement('div');
                speakerDiv.className = 'backlog-speaker';
                speakerDiv.textContent = entry.speaker;
                div.appendChild(speakerDiv);
            }
            
            const textDiv = document.createElement('div');
            textDiv.className = 'backlog-text';
            textDiv.textContent = entry.text;
            div.appendChild(textDiv);
            
            this.elements.backlogContent.appendChild(div);
        });
        
        this.elements.backlogContent.scrollTop = this.elements.backlogContent.scrollHeight;
    }
    
    toggleAutoMode() {
        this.isAutoMode = !this.isAutoMode;
        document.getElementById('auto-btn').style.background = this.isAutoMode ? 
            'rgba(255, 215, 0, 0.3)' : 'transparent';
        
        if (this.isAutoMode && !this.isTextAnimating) {
            const autoDelay = (101 - this.autoSpeed) * 30;
            setTimeout(() => this.advanceText(), autoDelay);
        }
    }
    
    toggleSkipMode() {
        this.isSkipMode = !this.isSkipMode;
        document.getElementById('skip-btn').style.background = this.isSkipMode ? 
            'rgba(255, 215, 0, 0.3)' : 'transparent';
        
        if (this.isSkipMode && !this.isTextAnimating) {
            this.advanceText();
        }
    }
    
    showSaveScreen() {
        this.saveSystem.showSaveScreen();
    }
    
    showLoadScreen() {
        this.saveSystem.showLoadScreen();
    }
    
    showConfig() {
        this.elements.configScreen.style.display = 'block';
        document.getElementById('text-speed').value = this.textSpeed;
        document.getElementById('auto-speed').value = this.autoSpeed;
        document.getElementById('bgm-volume').value = this.audioManager.bgmVolume * 100;
        document.getElementById('se-volume').value = this.audioManager.seVolume * 100;
    }
    
    showMenu() {
        // メニュー画面の実装
    }
    
    showGallery() {
        // ギャラリー画面の実装
    }
    
    quickSave() {
        this.saveSystem.save(0);
    }
    
    quickLoad() {
        this.saveSystem.load(0);
    }
    
    saveConfig() {
        const config = {
            textSpeed: this.textSpeed,
            autoSpeed: this.autoSpeed,
            bgmVolume: this.audioManager.bgmVolume,
            seVolume: this.audioManager.seVolume
        };
        localStorage.setItem('gameConfig', JSON.stringify(config));
    }
    
    loadConfig() {
        const saved = localStorage.getItem('gameConfig');
        if (saved) {
            const config = JSON.parse(saved);
            this.textSpeed = config.textSpeed || 50;
            this.autoSpeed = config.autoSpeed || 50;
            if (this.audioManager) {
                this.audioManager.setBGMVolume(config.bgmVolume || 0.7);
                this.audioManager.setSEVolume(config.seVolume || 0.7);
            }
        }
    }
    
    async loadNextChapter() {
        const chapterNames = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'endings'];
        if (this.currentChapter < chapterNames.length) {
            await this.scenarioLoader.loadChapter(chapterNames[this.currentChapter]);
            this.playScene();
        } else {
            // ゲーム終了
            this.showEnding();
        }
    }
    
    showEnding() {
        // エンディング判定
        const ending = this.determineEnding();
        console.log('Ending:', ending);
        // エンディング画面の表示
    }
    
    determineEnding() {
        if (this.gameState.affection >= 80 && this.gameState.flags.called_kukurihime) {
            return 'secret_end';
        }
        if (this.gameState.affection >= 70 && this.gameState.flags.waited_at_yomi) {
            return 'true_end';
        }
        if (this.gameState.flags.avoided_fire_god) {
            return 'false_happy_end';
        }
        if (this.gameState.affection < 30) {
            return 'bad_end1';
        }
        return 'normal_end';
    }
    
    toggleDebugMode() {
        if (!this.debugPanel) {
            this.createDebugPanel();
        }
        
        if (this.debugPanel.style.display === 'none') {
            this.debugPanel.style.display = 'block';
            this.updateDebugInfo();
        } else {
            this.debugPanel.style.display = 'none';
        }
    }
    
    createDebugPanel() {
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'debug-panel';
        this.debugPanel.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            width: 300px;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 15px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            overflow-y: auto;
            display: none;
        `;
        
        this.debugPanel.innerHTML = `
            <h3 style="margin-top: 0; color: #00ff00;">DEBUG MODE</h3>
            <hr style="border-color: #00ff00;">
            <div id="debug-info"></div>
            <hr style="border-color: #00ff00;">
            <h4>Controls:</h4>
            <button onclick="game.modifyAffection(10)">愛情度+10</button>
            <button onclick="game.modifyAffection(-10)">愛情度-10</button>
            <br><br>
            <button onclick="game.jumpToChapter(0)">序章へ</button>
            <button onclick="game.jumpToChapter(1)">第1章へ</button>
            <button onclick="game.jumpToChapter(2)">第2章へ</button>
            <button onclick="game.jumpToChapter(3)">第3章へ</button>
            <button onclick="game.jumpToChapter(4)">第4章へ</button>
            <button onclick="game.jumpToChapter(5)">第5章へ</button>
            <br><br>
            <button onclick="game.testEnding('true_end')">TRUE END</button>
            <button onclick="game.testEnding('normal_end')">NORMAL END</button>
            <button onclick="game.testEnding('false_happy_end')">FALSE HAPPY</button>
            <button onclick="game.testEnding('bad_end1')">BAD END 1</button>
            <button onclick="game.testEnding('bad_end2')">BAD END 2</button>
            <button onclick="game.testEnding('secret_end')">SECRET END</button>
        `;
        
        document.body.appendChild(this.debugPanel);
        
        // グローバル変数として自身を登録（デバッグ用）
        window.game = this;
    }
    
    updateDebugInfo() {
        if (!this.debugPanel) return;
        
        const infoDiv = document.getElementById('debug-info');
        if (!infoDiv) return;
        
        const flags = Object.entries(this.gameState.flags)
            .filter(([key, value]) => value)
            .map(([key]) => key)
            .join(', ') || 'なし';
        
        infoDiv.innerHTML = `
            <strong>現在の状態:</strong><br>
            章: ${this.currentChapter}<br>
            シーン: ${this.currentScene}<br>
            行: ${this.currentLine}<br>
            <br>
            <strong>ゲーム変数:</strong><br>
            愛情度: ${this.gameState.affection}<br>
            信頼度: ${this.gameState.trust}<br>
            ルート: ${this.gameState.route}<br>
            <br>
            <strong>フラグ:</strong><br>
            ${flags}<br>
            <br>
            <strong>選択履歴:</strong><br>
            ${this.gameState.choices.length}個の選択<br>
        `;
    }
    
    modifyAffection(amount) {
        this.gameState.affection += amount;
        this.gameState.affection = Math.max(0, Math.min(100, this.gameState.affection));
        this.updateDebugInfo();
        console.log('愛情度:', this.gameState.affection);
    }
    
    showAffectionChange(amount) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: ${amount > 0 ? '#00ff00' : '#ff0000'};
            padding: 10px 20px;
            border-radius: 5px;
            border: 1px solid ${amount > 0 ? '#00ff00' : '#ff0000'};
            z-index: 9999;
            font-size: 18px;
            animation: fadeIn 0.3s;
        `;
        notification.textContent = `愛情度 ${amount > 0 ? '+' : ''}${amount}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    jumpToChapter(chapterNum) {
        this.currentChapter = chapterNum;
        this.currentScene = 0;
        this.currentLine = 0;
        const chapterNames = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'];
        this.scenarioLoader.loadChapter(chapterNames[chapterNum])
            .then(() => {
                this.playScene();
                this.updateDebugInfo();
            });
    }
    
    testEnding(endingId) {
        this.currentChapter = 6;
        this.currentScene = 0;
        this.currentLine = 0;
        this.scenarioLoader.loadChapter('endings')
            .then(() => {
                // エンディングシーンを探す
                for (let i = 0; i < this.scenarios[6].scenes.length; i++) {
                    if (this.scenarios[6].scenes[i].id === endingId) {
                        this.currentScene = i;
                        break;
                    }
                }
                this.playScene();
                this.updateDebugInfo();
            });
    }
}