# Kyuubi Project Overview

## プロジェクトの目的
KyuubiはObsidian風のMarkdownエディタで、知識の「収集・整形・吸収」を効率化する個人向け知識管理システムです。

主な特徴：
- Obsidian Live Previewモードの完全再現
- 単一エディタでのリアルタイムMarkdown変換
- 選択時のみMD記法を表示、未選択時は装飾済み表示
- 内部リンク、タグ、チェックボックスなどのObsidian記法対応

## 技術スタック

### フロントエンド
- **Next.js 15.5.2** (App Router, Turbopack使用)
- **React 19.1.0** (最新版)
- **TypeScript 5** (型安全性)
- **TailwindCSS 4** (スタイリング)

### エディタライブラリ
- **CodeMirror 6** - メインエディタエンジン
  - @codemirror/view - エディタビュー
  - @codemirror/state - 状態管理
  - @codemirror/lang-markdown - Markdown記法
  - @codemirror/theme-one-dark - ダークテーマ
- **ProseMirror** - リッチテキスト処理補助

### Markdown処理
- **react-markdown** - Markdownレンダリング
- **remark-gfm** - GitHub Flavored Markdown
- **rehype-katex** + **katex** - 数式レンダリング
- **rehype-highlight** - シンタックスハイライト

## アーキテクチャ

### ディレクトリ構造
```
kyuubi-app/
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # レイアウトコンポーネント
│   └── page.tsx           # メインページ
├── components/            # Reactコンポーネント
│   └── ObsidianEditor.tsx # メインエディタコンポーネント
├── public/                # 静的ファイル
└── package.json           # 依存関係とスクリプト
```

### 主要コンポーネント
- **ObsidianEditor** - メインエディタコンポーネント
- **LivePreviewWidget** - Live Preview表示用ウィジェット
- **livePreviewPlugin** - CodeMirror用プラグイン

## 開発環境
- Node.js (推奨: LTS)
- npm (パッケージ管理)
- Darwin (macOS) システム