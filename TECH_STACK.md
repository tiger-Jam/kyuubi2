# Kyuubi 技術スタック

## 概要
個人/限定ユーザー向け知識管理システム「Kyuubi」の技術スタック仕様書

## 対応プラットフォーム
- Web (ブラウザ)
- Desktop (Mac, Windows, Linux)
- Mobile (iOS優先, Android将来対応)

## アーキテクチャ

```
┌─────────────────────────────────────────────┐
│         共通UIコンポーネント (React)          │
├─────────────────────────────────────────────┤
│            ビジネスロジック層                 │
│         (TypeScript, 状態管理)               │
├──────────┬──────────┬───────────────────────┤
│  Next.js │  Tauri   │    Capacitor         │
│  (Web)   │(Desktop) │   (iOS/Android)      │
└──────────┴──────────┴───────────────────────┘
```

## コア技術スタック

### フロントエンド共通
- **React 18** - UIフレームワーク
- **TypeScript 5.x** - 型安全性
- **TailwindCSS 3.x** - スタイリング、レスポンシブ対応
- **shadcn/ui** - アクセシブルなUIコンポーネントライブラリ
- **Radix UI** - プリミティブUIコンポーネント

### エディタ・Markdown処理
- **CodeMirror 6** - 高機能テキストエディタ
  - リアルタイムプレビュー
  - シンタックスハイライト
  - カスタム拡張対応
- **unified ecosystem**
  - remark (Markdown AST処理)
  - rehype (HTML変換)
  - カスタムプラグインでObsidian記法対応
- **KaTeX** - 数式レンダリング
- **Mermaid** - 図表生成

### 状態管理・データフェッチング
- **Zustand** - グローバル状態管理
- **TanStack Query (React Query)** - サーバー状態管理
- **tRPC** - 型安全なAPI通信

### バックエンド
- **Next.js 14 (App Router)** - フルスタックフレームワーク
  - API Routes
  - SSR/SSG対応
  - Edge Runtime対応
- **Prisma** - ORM、型安全なDB操作
- **Zod** - スキーマバリデーション

### データベース
- **SQLite** - ローカルストレージ（オフライン対応）
- **PostgreSQL** - クラウドデータベース（同期用）
- **Redis** (オプション) - キャッシュ、セッション管理

### 認証・セキュリティ
- **NextAuth.js v5** - 認証ライブラリ
  - Google OAuth対応
  - セッション管理
- **bcrypt** - パスワードハッシュ化
- **CORS設定** - クロスオリジン制御

### データ収集・AI機能
- **Playwright** - Webスクレイピング
- **Tesseract.js** - OCR機能
- **OpenAI API** - AI記事生成（深層記事）
- **Wikipedia API** - 知識ベース連携

## プラットフォーム別実装

### Web版 (Next.js)
```
デプロイ: Vercel / Netlify
CDN: Cloudflare
ストレージ: Vercel Blob / AWS S3
```

### Desktop版 (Tauri v2)
```
フレームワーク: Tauri 2.0
バックエンド: Rust
特徴:
- バンドルサイズ: ~10MB
- システムトレイ対応
- ファイルシステム直接アクセス
- ネイティブ通知
```

### iOS版 (Capacitor)
```
フレームワーク: Capacitor 6
ネイティブ連携: Swift
特徴:
- WebView最適化
- ネイティブAPI利用
- オフライン対応
- プッシュ通知
```

## 開発環境

### 必須ツール
- Node.js 20.x LTS
- pnpm (パッケージマネージャー)
- Rust (Tauri開発用)
- Xcode (iOS開発用)

### 開発用スクリプト
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:tauri": "tauri dev",
    "dev:ios": "cap run ios",
    "build": "next build",
    "build:tauri": "tauri build",
    "build:ios": "cap build ios"
  }
}
```

### テスト・品質管理
- **Vitest** - ユニットテスト
- **Playwright** - E2Eテスト
- **ESLint** - コード品質
- **Prettier** - コードフォーマット
- **Husky** - Git hooks

## フォルダ構造

```
kyuubi2/
├── apps/
│   ├── web/          # Next.js Webアプリ
│   ├── desktop/      # Tauri デスクトップアプリ
│   └── mobile/       # Capacitor モバイルアプリ
├── packages/
│   ├── ui/           # 共通UIコンポーネント
│   ├── core/         # ビジネスロジック
│   ├── markdown/     # Markdown処理
│   └── db/           # データベース層
├── prisma/           # Prismaスキーマ
└── docs/             # ドキュメント
```

## 実装優先順位

1. **Phase 1: MVP (Web版)**
   - 基本的なMarkdownエディタ
   - Obsidian基本記法対応
   - ローカルストレージ保存

2. **Phase 2: 機能拡張**
   - Google OAuth認証
   - クラウド同期
   - AI記事生成

3. **Phase 3: マルチプラットフォーム**
   - Tauri デスクトップ版
   - Capacitor iOS版

4. **Phase 4: 高度な機能**
   - Webスクレイピング
   - OCR機能
   - 記事評価システム

## パフォーマンス目標

- 初回ロード: < 3秒
- エディタ入力遅延: < 50ms
- Markdown変換: < 100ms
- バンドルサイズ: < 500KB (初期)

## セキュリティ考慮事項

- XSS対策: DOMPurify使用
- CSRF対策: トークン検証
- SQLインジェクション対策: Prisma使用
- 環境変数管理: .env.local
- HTTPS必須
- Content Security Policy設定

## 更新履歴

- 2025-09-07: 初版作成