# 対訳文庫 (Taiyaku Bunko)

著作権の切れた海外の古典を、**原文と新しい日本語訳の対訳**で無料公開する静的サイトです。

## 収録作品
- フランツ・カフカ『変身』（英訳: David Wyllie / [Project Gutenberg #5200](https://www.gutenberg.org/ebooks/5200)、パブリックドメイン）
  - 全3章・97段落を、原文と日本語訳で段落ごとに対応表示

## 構成
```
taiyaku-bunko/
├── index.html              # 蔵書一覧（トップ）
├── assets/
│   ├── style.css           # 共通スタイル
│   └── reader.js           # 対訳リーダー（表示切替・文字サイズ）
└── works/
    └── henshin/
        ├── index.html      # 『変身』読書ページ
        └── data.js         # 対訳データ（window.BOOK）
```

## ローカルで見る
`index.html` をブラウザで開くだけで動きます（データは `data.js` に埋め込み済みのため、サーバー不要）。

## 公開（GitHub Pages）
1. このフォルダを GitHub リポジトリの内容として push する。
2. リポジトリの **Settings → Pages** で、Source を `main` ブランチの `/ (root)` に設定。
3. 数分後 `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

## ライセンス / 権利
- 原文テキスト（英訳）はパブリックドメイン（Project Gutenberg）。
- 日本語訳は本サイトのために新しく作成（AIの支援により翻訳）。自由に閲覧できます。

## 作品を追加するには
1. `works/<作品名>/` フォルダを作る。
2. 対訳データを `data.js` として置く（`window.BOOK = { title, author, ..., parts:[{label, paras:[{ja,en}]}] }`）。
3. `works/<作品名>/index.html` を『変身』のページを雛形にして作る。
4. トップ `index.html` の `.shelf` にカードを1枚追加する。
