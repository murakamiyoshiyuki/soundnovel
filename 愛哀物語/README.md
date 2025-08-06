# 愛哀物語 - 古事記サウンドノベル

## 概要
『愛哀物語』は、古事記の「国生み神話」を題材にした選択型サウンドノベルゲームです。
イザナギとイザナミの愛と別離の物語を、現代的な解釈と「かまいたちの夜」のようなサスペンスフルな演出で描きます。

## ゲームの特徴
- **マルチエンディング**: 6種類のエンディング（TRUE END、NORMAL END、FALSE HAPPY END、BAD END×2、SECRET END）
- **選択による分岐**: プレイヤーの選択により物語が変化
- **愛情度システム**: 選択によって変動する愛情度がエンディングに影響
- **フルボイス対応準備**: 将来的なボイス実装を想定した設計

## 起動方法
1. `index.html`をウェブブラウザで開く
2. 推奨ブラウザ: Chrome、Firefox、Safari、Edge（最新版）

## 操作方法
### マウス操作
- **左クリック**: テキスト送り、選択肢決定
- **右クリック**: バックログ表示

### キーボード操作
- **Enter/Space**: テキスト送り
- **Ctrl**: スキップ（既読のみ）
- **A**: オートモード切り替え
- **Ctrl+S**: クイックセーブ
- **Ctrl+L**: クイックロード
- **Escape**: メニュー表示

## 必要な素材（別途用意が必要）

### 背景画像 (`assets/images/backgrounds/`)
- `darkness.jpg` - 暗闇
- `takamagahara.jpg` - 高天原
- `nakatsu_view.jpg` - 中つ国を見下ろす場所
- `minakanushi_shrine.jpg` - ミナカヌシの社
- `onogoro_island.jpg` - オノゴロ島
- `yomi_entrance.jpg` - 黄泉平坂
- `yomi_palace.jpg` - 黄泉の宮殿

### キャラクター立ち絵 (`assets/images/characters/`)
イザナギとイザナミの各表情差分（PNG形式、透過背景推奨）
- `izanagi_normal.png`
- `izanagi_smile.png`
- `izanagi_sad.png`
- `izanami_normal.png`
- `izanami_smile.png`
- `izanami_happy.png`
- など（characters.jsonに定義された全表情）

### BGM (`assets/audio/bgm/`)
- `daily_life.mp3` - 日常シーン
- `tension.mp3` - 緊張シーン
- `mystical.mp3` - 神秘的なシーン
- `sad.mp3` - 悲しいシーン
- `horror.mp3` - 黄泉シーン

### 効果音 (`assets/audio/se/`)
- `footsteps_running.wav` - 走る足音
- `monster_growl.wav` - 物の怪の声
- `sigh.wav` - ため息
- `sparkle.wav` - キラキラ音
- など

## ディレクトリ構造
```
愛哀物語/
├── index.html              # メインHTML
├── css/                    # スタイルシート
│   ├── main.css
│   ├── animations.css
│   └── responsive.css
├── js/                     # JavaScriptファイル
│   ├── game-engine.js
│   ├── scenario-loader.js
│   ├── save-system.js
│   ├── effects.js
│   └── audio-manager.js
├── data/                   # ゲームデータ
│   ├── scenario/          # シナリオJSON
│   ├── characters.json
│   └── config.json
├── assets/                # 素材ファイル
│   ├── images/
│   ├── audio/
│   └── fonts/
└── README.md
```

## 開発情報
- **開発**: VIBE CODING
- **バージョン**: 1.0.0
- **ライセンス**: プロプライエタリ

## 注意事項
- 本ゲームは開発中のため、一部機能が実装されていない場合があります
- 画像・音声素材は別途用意する必要があります
- ローカル環境での実行時、一部ブラウザではCORS制限により正常に動作しない場合があります
  その場合は、簡易的なローカルサーバーを立てて実行してください

## トラブルシューティング
### ゲームが起動しない
- JavaScriptが有効になっているか確認してください
- ブラウザのコンソールでエラーを確認してください

### 音声が再生されない
- ブラウザの自動再生ポリシーにより、初回クリックまで音声が再生されない場合があります
- 「音声を有効にする」ボタンが表示された場合はクリックしてください

### セーブデータが消えた
- ブラウザのローカルストレージをクリアすると、セーブデータも削除されます
- 定期的にセーブデータのエクスポート機能を使用してバックアップすることをお勧めします