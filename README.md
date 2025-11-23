# グルメ検索アプリ

Next.js + Docker + ホットペッパーAPIを使用したレストラン検索アプリケーション

## 🎯 プロジェクト概要

現在地周辺のレストランを検索できるモバイルファーストのWebアプリケーションです。  
リクルートのホットペッパーグルメサーチAPIを使用して、実際の店舗データを取得・表示します。

### 主要機能

- 📍 **現在地取得**: Geolocation APIで自動的に現在地を取得
- 🔍 **範囲指定検索**: 300m〜3000mの範囲で検索可能
- 📱 **レスポンシブデザイン**: モバイルファーストで設計
- 📄 **ページネーション**: 検索結果を10件ずつ表示
- 🏪 **詳細情報表示**: 店舗の詳細情報（住所、営業時間、予算など）

## 🛠 技術スタック

- **フロントエンド**: Next.js 16.0.3 (App Router, Turbopack)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アイコン**: lucide-react
- **インフラ**: Docker / Docker Compose
- **API**: ホットペッパーグルメサーチAPI

## 📁 プロジェクト構成

```
gourmet-project/
├── app/                           # Next.jsアプリケーション
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # アプリ全体のレイアウト
│   │   │   ├── page.tsx          # メインページ（状態管理）
│   │   │   └── api/
│   │   │       └── search/
│   │   │           └── route.ts  # API Route（ホットペッパーAPI連携）
│   │   └── components/
│   │       ├── SearchScreen.tsx   # 検索画面
│   │       ├── ResultsScreen.tsx  # 結果一覧画面
│   │       ├── DetailScreen.tsx   # 詳細画面
│   │       └── InfoItem.tsx       # 情報表示コンポーネント
│   ├── .env.local                 # 環境変数（Gitignore対象）
│   └── package.json
├── docker-compose.yml             # Docker設定
├── Dockerfile                     # Dockerイメージ定義
├── .env                          # Docker Compose用環境変数
├── .gitignore
├── README.md                     # このファイル
├── HowtoCreateEnv.md            # 環境構築手順
└── HowtoCreateApp.md            # アプリ開発手順
```

## 🚀 クイックスタート

### 前提条件

- Docker Desktop がインストール済み
- ホットペッパーAPIキーを取得済み（[取得方法](#ホットペッパーapiキーの取得)）

### 1. リポジトリのクローン

```bash
git clone https://github.com/SSZcreate/gourmet-project.git
cd gourmet-project
```

### 2. 環境変数の設定

**app/.env.local を作成:**

```bash
NEXT_PUBLIC_HOTPEPPER_API_KEY=あなたのAPIキー
```

**docker-compose.yml を編集:**

```yaml
environment:
  - WATCHPACK_POLLING=true
  - NEXT_PUBLIC_HOTPEPPER_API_KEY=あなたのAPIキー
```

### 3. Docker コンテナの起動

```bash
docker-compose up -d
```

### 4. ブラウザでアクセス

http://localhost:3000

## 🔑 ホットペッパーAPIキーの取得

1. [リクルートWebサービス](https://webservice.recruit.co.jp/)にアクセス
2. アカウント登録・ログイン
3. 「新規APIキー発行」からホットペッパーグルメサーチAPIを選択
4. 発行されたAPIキーを`.env.local`と`docker-compose.yml`に設定

## 💻 開発コマンド

### コンテナの起動・停止

```bash
# 起動
docker-compose up -d

# 停止
docker-compose down

# 再起動
docker-compose restart next-app

# ログ確認
docker-compose logs -f next-app
```

### パッケージのインストール

```bash
# コンテナ内（実行用）
docker-compose exec next-app npm install パッケージ名

# ホスト側（型定義用）
cd app
npm install パッケージ名
```

### 環境変数の確認

```bash
docker-compose exec next-app printenv | Select-String "NEXT_PUBLIC"
```

## 🎨 画面構成

### 1. 検索画面（SearchScreen）

- 現在地取得ボタン
- 検索範囲選択（300m〜3000m）
- 検索実行ボタン

### 2. 結果一覧画面（ResultsScreen）

- 店舗カード表示（画像、ジャンル、店名、アクセス）
- ページネーション（10件/ページ）
- 検索範囲の表示

### 3. 詳細画面（DetailScreen）

- メイン画像
- 店舗情報（住所、アクセス、営業時間、予算）
- ホットペッパーへのリンク

## 🔧 トラブルシューティング

### ポート3000が使用中

```bash
# ポート3001を使用
http://localhost:3001
```

### 環境変数が反映されない

```bash
docker-compose down
docker-compose up -d
```

### TypeScriptエラーが出る

VS Codeで `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### 店舗が見つからない

- APIキーが正しく設定されているか確認
- 現在地が取得できているか確認（ブラウザのコンソールログ）
- 検索範囲を広げてみる

## 📝 開発のポイント

### アーキテクチャ

- **コンポーネント分割**: 機能ごとに独立したファイル構成
- **状態管理**: page.tsxで一元管理、各コンポーネントはPropsで受け取る
- **エラーハンドリング**: API失敗時にモックデータへフォールバック

### コード品質

- **TypeScript**: 型安全性の確保
- **Tailwind CSS**: ユーティリティファーストで保守性向上
- **コンポーネント再利用**: InfoItemなど共通部品を抽出

## 🚢 デプロイ

Vercelへのデプロイ手順は [HowToDeploy.md](./HowToDeploy.md) を参照してください。

### 環境変数の設定（Vercel）

Vercelのプロジェクト設定で以下を追加:

```
NEXT_PUBLIC_HOTPEPPER_API_KEY=あなたのAPIキー
```

## 📊 実装状況

| 機能 | 状態 |
|------|------|
| 現在地取得 | ✅ 完成 |
| 検索機能 | ✅ 完成 |
| 結果表示 | ✅ 完成 |
| ページネーション | ✅ 完成 |
| 詳細表示 | ✅ 完成 |
| API連携 | ✅ 完成 |
| エラーハンドリング | ✅ 完成 |
| レスポンシブ対応 | ✅ 完成 |

## 🔮 今後の拡張予定

- [ ] お気に入り機能
- [ ] 検索履歴
- [ ] Google Maps連携
- [ ] 詳細な絞り込み検索
- [ ] ソート機能
- [ ] 無限スクロール
- [ ] ユニットテスト
- [ ] E2Eテスト

## 📄 ライセンス

MIT License

## 👤 作成者

SSZcreate

## 🙏 謝辞

- [リクルート Webサービス](https://webservice.recruit.co.jp/) - ホットペッパーAPI提供
- [Next.js](https://nextjs.org/) - フレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [Lucide](https://lucide.dev/) - アイコンライブラリ
