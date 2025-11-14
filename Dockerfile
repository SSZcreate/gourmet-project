# ベースとなるNode.jsイメージを指定 (Alpine Linuxベースの軽量版)
FROM node:20-alpine

# コンテナ内の作業ディレクトリを指定
WORKDIR /app

# (注) package.json のコピーや npm install は、
# プロジェクト作成（後述）と docker-compose up 時の command で実行するため、
# Dockerfile内では実行しません。

# Next.jsが使用するポートを開放
EXPOSE 3000