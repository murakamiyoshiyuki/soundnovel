class ScenarioLoader {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.loadedChapters = {};
    }
    
    async loadChapter(chapterName) {
        if (this.loadedChapters[chapterName]) {
            this.gameEngine.scenarios[this.gameEngine.currentChapter] = this.loadedChapters[chapterName];
            return this.loadedChapters[chapterName];
        }
        
        try {
            const response = await fetch(`data/scenario/${chapterName}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load chapter: ${chapterName}`);
            }
            
            const chapterData = await response.json();
            this.loadedChapters[chapterName] = chapterData;
            this.gameEngine.scenarios[this.gameEngine.currentChapter] = chapterData;
            
            return chapterData;
        } catch (error) {
            console.error('Error loading chapter:', error);
            // フォールバック: ハードコードされたシナリオを使用
            const fallbackScenario = this.getFallbackScenario(chapterName);
            this.gameEngine.scenarios[this.gameEngine.currentChapter] = fallbackScenario;
            return fallbackScenario;
        }
    }
    
    getFallbackScenario(chapterName) {
        // 基本的なシナリオ構造を返す
        const scenarios = {
            prologue: {
                chapter: 0,
                title: "序章：運命の逃走",
                scenes: [
                    {
                        id: "scene0-1",
                        background: "darkness",
                        bgm: "tension",
                        lines: [
                            {
                                type: "effect",
                                effect: { type: "sound", sound: "footsteps" }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "はあ、はあ、はあ………。",
                                character: null
                            },
                            {
                                type: "effect",
                                effect: { type: "sound", sound: "monster" }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "どうして…。",
                                character: null
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "待って…。",
                                character: null
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "どうして、こんなことになったんだ。",
                                character: null
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "どこにいくの…。",
                                character: null
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "こんなつもりじゃなかったのに。\nこんなはずじゃなかったのに。\n何がいけなかったんだろう。\nなんでこうなっちゃったんだろう。\nなんで…？なんで…？！",
                                character: null
                            },
                            {
                                type: "effect",
                                effect: { type: "sound", sound: "silence" }
                            },
                            {
                                type: "narration",
                                text: "これは、一組の兄妹の物語。\n愛と哀しみ、そして選択の物語――"
                            },
                            {
                                type: "effect",
                                effect: { type: "fadeout" }
                            },
                            {
                                type: "scene_change",
                                next: "chapter1"
                            }
                        ]
                    }
                ]
            },
            chapter1: {
                chapter: 1,
                title: "第1章：高天原での出会い",
                scenes: [
                    {
                        id: "scene1-1",
                        background: "takamagahara",
                        bgm: "daily_life",
                        lines: [
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "昔々。まだ日本という国に神様もいなかった頃。\nまず、すごい偉いけどあんまり登場シーンがない神様が5人生まれた。",
                                character: {
                                    name: "izanagi",
                                    expression: "normal",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "その神様たちの中で紆余曲折があった後、12人の神様が生まれる。\nその12人の神様たちは神代七代といって、\n一番上の2人の他は全員が双子の兄妹だった。",
                                character: {
                                    name: "izanagi",
                                    expression: "normal",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "そしてその末っ子として、僕・イザナギと妹のイザナミの2人が誕生した。\nそう、これは、僕たち2人を巡る物語だ。",
                                character: {
                                    name: "izanagi",
                                    expression: "normal",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "ああ～！暇だ！暇だ！ひ・ま・だ！",
                                character: {
                                    name: "izanagi",
                                    expression: "bored",
                                    position: "center"
                                }
                            },
                            {
                                type: "effect",
                                effect: { type: "sound", sound: "sigh" }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "ミナカヌシたちは引きこもっちゃうし、\n兄さん姉さんたちは皆、ペアの相手のことに夢中で僕のことなんか見てないし。\nやることないんだよなぁ…。",
                                character: {
                                    name: "izanagi",
                                    expression: "bored",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "お兄ちゃん。",
                                character: {
                                    name: "izanami",
                                    expression: "normal",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "イザナミだって、ミナカヌシに懐いて家に遊びに行ってばっかりだし…。",
                                character: {
                                    name: "izanagi",
                                    expression: "bored",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "イザナギお兄ちゃんっ。",
                                character: {
                                    name: "izanami",
                                    expression: "normal",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "うわぁ！",
                                character: {
                                    name: "izanagi",
                                    expression: "surprised",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "きゃっ。びっくりしたぁ。",
                                character: {
                                    name: "izanami",
                                    expression: "surprised",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "暇だしさ、散歩行こうよ。",
                                character: {
                                    name: "izanami",
                                    expression: "smile",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "散歩？どこか行きたいのか？",
                                character: {
                                    name: "izanagi",
                                    expression: "normal",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "中つ国。",
                                character: {
                                    name: "izanami",
                                    expression: "smile",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "だから、葦原の中つ国。覗きに行こっ。\nイザナギお兄ちゃんなら一緒に行ってくれるかなって。\n覗きに行くだけだから、ね？",
                                character: {
                                    name: "izanami",
                                    expression: "smile",
                                    position: "right"
                                }
                            },
                            {
                                type: "choice",
                                text: "イザナミの誘いにどう答える？",
                                options: [
                                    {
                                        text: "もちろん！イザナミと一緒なら楽しそうだ",
                                        next: "scene1-2a",
                                        effects: {
                                            affection: 10,
                                            flag: "positive_response"
                                        }
                                    },
                                    {
                                        text: "別に、暇だし、良いけど",
                                        next: "scene1-2b",
                                        effects: {
                                            affection: 0
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "scene1-2a",
                        background: "takamagahara",
                        bgm: "daily_life",
                        lines: [
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "もちろん！イザナミと一緒なら楽しそうだ。",
                                character: {
                                    name: "izanagi",
                                    expression: "smile",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "本当？！嬉しい！",
                                character: {
                                    name: "izanami",
                                    expression: "happy",
                                    position: "right"
                                }
                            },
                            {
                                type: "effect",
                                effect: { type: "sound", sound: "hug" }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "お兄ちゃん大好きっ！",
                                character: {
                                    name: "izanami",
                                    expression: "happy",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "わっ！",
                                character: {
                                    name: "izanagi",
                                    expression: "embarrassed",
                                    position: "center"
                                }
                            },
                            {
                                type: "narration",
                                text: "急に抱きつかれて…心臓が…"
                            },
                            {
                                type: "scene_change",
                                next: "scene1-3"
                            }
                        ]
                    },
                    {
                        id: "scene1-2b",
                        background: "takamagahara",
                        bgm: "daily_life",
                        lines: [
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "別に、暇だし、良いけど。",
                                character: {
                                    name: "izanagi",
                                    expression: "normal",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "ホントに！？やったぁっ。お兄ちゃん大好きっ。",
                                character: {
                                    name: "izanami",
                                    expression: "happy",
                                    position: "right"
                                }
                            },
                            {
                                type: "scene_change",
                                next: "scene1-3"
                            }
                        ]
                    },
                    {
                        id: "scene1-3",
                        background: "nakatsu_view",
                        bgm: "mystical",
                        lines: [
                            {
                                type: "narration",
                                text: "中つ国を見下ろす場所にやってきた。"
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナギ",
                                text: "こんな、油が漂ってるみたいな世界、見てて楽しい？",
                                character: {
                                    name: "izanagi",
                                    expression: "normal",
                                    position: "center"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "え？うん。",
                                character: {
                                    name: "izanami",
                                    expression: "smile",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "だって、高天原だって、ミナカヌシ様が生まれる前はなんにもなかったんだよ？\nミナカヌシ様たちが生まれてから、こうやって世界が確立していったんだもの。",
                                character: {
                                    name: "izanami",
                                    expression: "normal",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "きっと中つ国だって、きっといつか変わるんだわ。\nお社がたったり、綺麗な自然が出来たりするのよ。\nそう考えると素敵じゃない？",
                                character: {
                                    name: "izanami",
                                    expression: "smile",
                                    position: "right"
                                }
                            },
                            {
                                type: "dialogue",
                                speaker: "イザナミ",
                                text: "いつか、そうなったら。中つ国にも、高天原みたいな素敵な世界が出来たら。\nお兄ちゃん、一緒に遊びに行ってみない？",
                                character: {
                                    name: "izanami",
                                    expression: "smile",
                                    position: "right"
                                }
                            },
                            {
                                type: "choice",
                                text: "約束への返答",
                                options: [
                                    {
                                        text: "絶対に一緒に行こう。約束だ",
                                        effects: {
                                            affection: 15,
                                            flag: "promise_made"
                                        }
                                    },
                                    {
                                        text: "その時になったら考えるよ",
                                        effects: {
                                            affection: -5
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };
        
        return scenarios[chapterName] || scenarios.prologue;
    }
    
    async preloadAssets(chapterData) {
        const assets = {
            backgrounds: new Set(),
            characters: new Set(),
            sounds: new Set(),
            bgm: new Set()
        };
        
        // シーンからアセットを抽出
        chapterData.scenes.forEach(scene => {
            if (scene.background) assets.backgrounds.add(scene.background);
            if (scene.bgm) assets.bgm.add(scene.bgm);
            
            scene.lines.forEach(line => {
                if (line.character) {
                    const charPath = `${line.character.name}_${line.character.expression || 'normal'}`;
                    assets.characters.add(charPath);
                }
                if (line.effect) {
                    if (line.effect.sound) assets.sounds.add(line.effect.sound);
                }
            });
        });
        
        // アセットをプリロード
        const loadPromises = [];
        
        assets.backgrounds.forEach(bg => {
            const img = new Image();
            img.src = `assets/images/backgrounds/${bg}.jpg`;
            loadPromises.push(new Promise(resolve => img.onload = resolve));
        });
        
        assets.characters.forEach(char => {
            const img = new Image();
            img.src = `assets/images/characters/${char}.png`;
            loadPromises.push(new Promise(resolve => img.onload = resolve));
        });
        
        await Promise.all(loadPromises);
    }
}