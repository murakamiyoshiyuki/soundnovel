class SaveSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.maxSlots = 20;
        this.autoSaveSlot = 0;
        this.quickSaveSlot = 1;
    }
    
    save(slotNumber) {
        const saveData = {
            timestamp: new Date().toISOString(),
            gameState: JSON.parse(JSON.stringify(this.gameEngine.gameState)),
            currentChapter: this.gameEngine.currentChapter,
            currentScene: this.gameEngine.currentScene,
            currentLine: this.gameEngine.currentLine,
            backlog: this.gameEngine.backlog.slice(-20),
            displayText: this.gameEngine.elements.textContent.textContent,
            speakerName: this.gameEngine.elements.speakerName.textContent,
            backgroundImage: this.gameEngine.elements.backgroundLayer.style.backgroundImage,
            version: '1.0.0'
        };
        
        const saveKey = `save_slot_${slotNumber}`;
        localStorage.setItem(saveKey, JSON.stringify(saveData));
        
        this.showSaveNotification(slotNumber);
        return true;
    }
    
    load(slotNumber) {
        const saveKey = `save_slot_${slotNumber}`;
        const savedData = localStorage.getItem(saveKey);
        
        if (!savedData) {
            console.log('No save data found in slot', slotNumber);
            return false;
        }
        
        try {
            const saveData = JSON.parse(savedData);
            
            // ゲーム状態を復元
            this.gameEngine.gameState = saveData.gameState;
            this.gameEngine.currentChapter = saveData.currentChapter;
            this.gameEngine.currentScene = saveData.currentScene;
            this.gameEngine.currentLine = saveData.currentLine;
            this.gameEngine.backlog = saveData.backlog || [];
            
            // 画面を復元
            this.gameEngine.elements.textContent.textContent = saveData.displayText || '';
            this.gameEngine.elements.speakerName.textContent = saveData.speakerName || '';
            this.gameEngine.elements.backgroundLayer.style.backgroundImage = saveData.backgroundImage || '';
            
            // ゲーム画面を表示
            this.gameEngine.elements.titleScreen.style.display = 'none';
            this.gameEngine.elements.mainScreen.style.display = 'block';
            this.gameEngine.elements.saveLoadScreen.style.display = 'none';
            
            // シナリオをロードして続きから再生
            this.gameEngine.scenarioLoader.loadChapter(this.getChapterName(saveData.currentChapter))
                .then(() => {
                    console.log('Game loaded from slot', slotNumber);
                });
            
            return true;
        } catch (error) {
            console.error('Failed to load save data:', error);
            return false;
        }
    }
    
    getSaveData(slotNumber) {
        const saveKey = `save_slot_${slotNumber}`;
        const savedData = localStorage.getItem(saveKey);
        
        if (!savedData) {
            return null;
        }
        
        try {
            return JSON.parse(savedData);
        } catch {
            return null;
        }
    }
    
    deleteSave(slotNumber) {
        const saveKey = `save_slot_${slotNumber}`;
        localStorage.removeItem(saveKey);
    }
    
    showSaveScreen() {
        this.showSaveLoadScreen('save');
    }
    
    showLoadScreen() {
        this.showSaveLoadScreen('load');
    }
    
    showSaveLoadScreen(mode) {
        const screen = this.gameEngine.elements.saveLoadScreen;
        const title = document.getElementById('save-load-title');
        const slotsContainer = document.getElementById('save-load-slots');
        
        title.textContent = mode === 'save' ? 'セーブ' : 'ロード';
        screen.style.display = 'block';
        slotsContainer.innerHTML = '';
        
        // クイックセーブスロット
        this.createSlotElement(this.quickSaveSlot, mode, true);
        
        // 通常のセーブスロット
        for (let i = 2; i <= this.maxSlots; i++) {
            this.createSlotElement(i, mode, false);
        }
    }
    
    createSlotElement(slotNumber, mode, isQuickSave) {
        const slotsContainer = document.getElementById('save-load-slots');
        const saveData = this.getSaveData(slotNumber);
        const slotDiv = document.createElement('div');
        slotDiv.className = 'save-slot';
        
        if (saveData) {
            const date = new Date(saveData.timestamp);
            const dateStr = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            slotDiv.innerHTML = `
                <div class="save-slot-number">${isQuickSave ? 'クイック' : 'スロット'} ${slotNumber}</div>
                <div class="save-slot-date">${dateStr}</div>
                <div class="save-slot-text">${this.getChapterTitle(saveData.currentChapter)}</div>
                <div class="save-slot-text">${saveData.displayText ? saveData.displayText.substring(0, 50) + '...' : ''}</div>
            `;
            
            if (mode === 'load') {
                slotDiv.addEventListener('click', () => {
                    if (confirm(`スロット${slotNumber}からロードしますか？`)) {
                        this.load(slotNumber);
                    }
                });
            } else {
                slotDiv.addEventListener('click', () => {
                    if (confirm(`スロット${slotNumber}に上書きセーブしますか？`)) {
                        this.save(slotNumber);
                        this.showSaveLoadScreen('save');
                    }
                });
            }
        } else {
            slotDiv.innerHTML = `
                <div class="save-slot-empty">
                    <div class="save-slot-number">${isQuickSave ? 'クイック' : 'スロット'} ${slotNumber}</div>
                    <div>-- 空き --</div>
                </div>
            `;
            
            if (mode === 'save') {
                slotDiv.addEventListener('click', () => {
                    if (confirm(`スロット${slotNumber}にセーブしますか？`)) {
                        this.save(slotNumber);
                        this.showSaveLoadScreen('save');
                    }
                });
            }
        }
        
        slotsContainer.appendChild(slotDiv);
    }
    
    autoSave() {
        this.save(this.autoSaveSlot);
        console.log('Auto saved');
    }
    
    showSaveNotification(slotNumber) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 15px 25px;
            border-radius: 5px;
            border: 1px solid #ffd700;
            z-index: 1000;
            animation: fadeIn 0.3s;
        `;
        notification.textContent = `スロット${slotNumber}にセーブしました`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    getChapterName(chapterNumber) {
        const chapterNames = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'endings'];
        return chapterNames[chapterNumber] || 'prologue';
    }
    
    getChapterTitle(chapterNumber) {
        const titles = [
            '序章：運命の逃走',
            '第1章：高天原での出会い',
            '第2章：国生みの使命',
            '第3章：結婚と島産み',
            '第4章：幸せな日々と転機',
            '第5章：黄泉の国',
            '終章：それぞれの結末'
        ];
        return titles[chapterNumber] || '序章';
    }
    
    exportSaveData() {
        const allSaves = {};
        for (let i = 0; i <= this.maxSlots; i++) {
            const saveData = this.getSaveData(i);
            if (saveData) {
                allSaves[`slot_${i}`] = saveData;
            }
        }
        
        const dataStr = JSON.stringify(allSaves, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aiai_monogatari_save_${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    importSaveData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const allSaves = JSON.parse(e.target.result);
                Object.keys(allSaves).forEach(key => {
                    const slotNumber = parseInt(key.replace('slot_', ''));
                    const saveKey = `save_slot_${slotNumber}`;
                    localStorage.setItem(saveKey, JSON.stringify(allSaves[key]));
                });
                alert('セーブデータをインポートしました');
            } catch (error) {
                alert('セーブデータのインポートに失敗しました');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }
}