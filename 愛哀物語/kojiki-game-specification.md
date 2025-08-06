# 古事記サウンドノベル「愛哀物語」開発仕様書

## プロジェクト概要

### 基本情報
- **プロジェクト名**: 愛哀物語（あいあいものがたり）
- **ジャンル**: サウンドノベル / ビジュアルノベル
- **プラットフォーム**: Web（HTML5/JavaScript）
- **開発ツール**: Claude Code
- **想定プレイ時間**: 2-3時間（1周）
- **エンディング数**: 6種類

### 開発目標
「かまいたちの夜」のようなサスペンスフルな演出と、古事記の神話を現代的に解釈した感動的なストーリーを融合させたサウンドノベルゲームを作成する。

---

## ディレクトリ構造

```
kojiki-sound-novel/
├── index.html              # メインHTML
├── css/
│   ├── main.css           # メインスタイル
│   ├── animations.css     # アニメーション定義
│   └── responsive.css     # レスポンシブ対応
├── js/
│   ├── game-engine.js     # ゲームエンジン本体
│   ├── scenario-loader.js # シナリオ読み込み
│   ├── save-system.js     # セーブ/ロード機能
│   ├── effects.js         # 演出効果
│   └── audio-manager.js   # 音声管理
├── data/
│   ├── scenario/
│   │   ├── prologue.json  # 序章データ
│   │   ├── chapter1.json  # 第1章データ
│   │   ├── chapter2.json  # 第2章データ
│   │   ├── chapter3.json  # 第3章データ
│   │   ├── chapter4.json  # 第4章データ
│   │   ├── chapter5.json  # 第5章データ
│   │   └── endings.json   # 各エンディングデータ
│   ├── characters.json    # キャラクター設定
│   └── config.json        # ゲーム設定
├── assets/
│   ├── images/
│   │   ├── backgrounds/   # 背景画像
│   │   ├── characters/    # 立ち絵
│   │   ├── cg/           # イベントCG
│   │   └── ui/           # UI素材
│   ├── audio/
│   │   ├── bgm/          # BGM
│   │   ├── se/           # 効果音
│   │   └── voice/        # ボイス（将来的に）
│   └── fonts/            # フォント
└── README.md             # プロジェクト説明
```

---

## 技術仕様

### コア機能

```javascript
// 1. ゲームエンジンクラスの基本構造
class GameEngine {
    constructor() {
        this.currentChapter = 0;
        this.currentScene = 0;
        this.currentLine = 0;
        this.gameState = {
            flags: {},
            affection: 50,
            route: 'main',
            choices: [],
            readText: []
        };
    }
    
    // 主要メソッド
    init() {}           // 初期化
    loadScenario() {}   // シナリオ読み込み
    displayText() {}    // テキスト表示
    showChoices() {}    // 選択肢表示
    processChoice() {}  // 選択処理
    checkFlags() {}     // フラグチェック
    saveGame() {}       // セーブ
    loadGame() {}       // ロード
}
```

### シナリオデータ形式

```json
{
    "chapter": 1,
    "title": "高天原での出会い",
    "scenes": [
        {
            "id": "scene1-1",
            "background": "takamagahara",
            "bgm": "daily_life",
            "lines": [
                {
                    "type": "narration",
                    "text": "昔々、まだ日本という国に...",
                    "effect": null
                },
                {
                    "type": "dialogue",
                    "speaker": "イザナギ",
                    "text": "ああ～！暇だ！暇だ！",
                    "voice": null,
                    "character": {
                        "name": "izanagi",
                        "expression": "bored",
                        "position": "center"
                    }
                },
                {
                    "type": "choice",
                    "text": "イザナミの誘いにどう答える？",
                    "options": [
                        {
                            "text": "積極的に応じる",
                            "next": "scene1-2a",
                            "effects": {
                                "affection": 10,
                                "flag": "positive_response"
                            }
                        },
                        {
                            "text": "渋々応じる",
                            "next": "scene1-2b",
                            "effects": {
                                "affection": 0
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```

---

## 実装優先順位

### Phase 1: 基本システム（必須）
1. **テキスト表示システム**
   - 1文字ずつ表示
   - クリックで次へ
   - 既読スキップ

2. **選択肢システム**
   - 選択肢の表示と選択
   - 選択結果の保存
   - フラグ管理

3. **セーブ/ロード**
   - ローカルストレージ使用
   - 複数スロット対応
   - オートセーブ

### Phase 2: 演出強化
1. **画面効果**
   - フェードイン/アウト
   - 画面振動
   - フラッシュ効果

2. **音声システム**
   - BGM再生/切り替え
   - 効果音再生
   - 音量調整

3. **立ち絵システム**
   - キャラクター表示
   - 表情変更
   - 位置調整

### Phase 3: 追加機能
1. **システム機能**
   - バックログ
   - 設定画面
   - CG/音楽鑑賞モード

2. **演出追加**
   - 天候エフェクト
   - パーティクル効果
   - トランジション追加

---

## ゲームフロー管理

### 変数管理
```javascript
// グローバル変数
const gameVariables = {
    // 好感度・親密度
    affection: 50,        // 0-100
    trust: 50,           // 0-100
    
    // ルートフラグ
    route: 'main',       // main, true, false_happy, bad1, bad2, secret
    
    // イベントフラグ
    flags: {
        promise_made: false,
        marriage_correct: false,
        waited_at_yomi: false,
        called_kukurihime: false
    },
    
    // 選択履歴
    choices: []
};
```

### エンディング判定ロジック
```javascript
function determineEnding() {
    // SECRET END判定
    if (gameVariables.affection >= 80 && 
        gameVariables.flags.called_kukurihime) {
        return 'secret_end';
    }
    
    // TRUE END判定
    if (gameVariables.affection >= 70 && 
        gameVariables.flags.waited_at_yomi) {
        return 'true_end';
    }
    
    // FALSE HAPPY END判定
    if (gameVariables.flags.avoided_fire_god) {
        return 'false_happy_end';
    }
    
    // BAD END判定
    if (gameVariables.affection < 30) {
        return 'bad_end1';
    }
    
    // NORMAL END
    return 'normal_end';
}
```

---

## UI/UX設計

### 画面レイアウト
```
┌─────────────────────────────────┐
│  [メニュー] [セーブ] [ロード] [設定]  │ <- ヘッダー
├─────────────────────────────────┤
│                                   │
│         背景画像エリア              │
│                                   │
│     [立ち絵1]    [立ち絵2]         │ <- キャラクター表示
│                                   │
├─────────────────────────────────┤
│ 【キャラ名】                       │
│                                   │ <- テキストウィンドウ
│  ここにセリフや地の文が表示される     │
│                                   │
└────