# Frontend

React + Vite 製 SPA。バックエンド APIと通信します。  
**Docker Compose で瞬時に立ち上げられる** よう最小構成にしてあります。

---

## ⚡ 使い方

```bash
# ① 環境変数サンプルをコピーし
cp .env.example .env

# ② バックエンドリポジトリClone後にバックエンドを起動（まだの場合）
docker compose up -d

# ③ フロントエンドを起動
docker compose up -d # 👉 http://localhost:3000 へアクセス

# ④ サンプルユーザーでログイン
SampleUser : 
    usernmae : testuser
    password : password