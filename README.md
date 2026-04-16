# Instagram Stub Server

iOS研修用のInstagramクローン向けスタブサーバー。

## セットアップ

```bash
npm install
```

## 起動

```bash
npm start
```

デフォルトで `http://localhost:3000` で起動します（aeon-stub-serverとの衝突を避けるため）。

## エンドポイント

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/` | ヘルスチェック |
| GET | `/posts` | 投稿一覧 |
| GET | `/posts/:id` | 投稿詳細 |
| GET | `/images/:filename` | 画像静的配信（`resources/images/` 配下） |

## 画像について

初期のfixturesでは `picsum.photos` の画像URLを使用。
自前の画像を使う場合は `resources/images/` に配置し、`posts.json` の `imageUrl` を `http://localhost:3000/images/xxx.jpg` に書き換える。
