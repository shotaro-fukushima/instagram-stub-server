# Instagram Stub Server

iOS研修用のInstagramクローン向けスタブサーバー。
YAMLでルートを宣言し、ルートごとに遅延・ステータスコード・レスポンスデータを設定できる。

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
| GET | `/posts` | 投稿一覧 |
| GET | `/posts/:id` | 投稿詳細 |
| GET | `/images/:filename` | 画像静的配信（`resources/images/` 配下） |
| GET | `/proxy-image?url=xxx` | 外部画像を遅延付きでプロキシ |

`/posts` と `/posts/:id` は `src/config/routes.yaml` で定義されている。新しいルートを足す場合は下記「ルートを追加する」を参照。

## 設定ファイル (`src/config/routes.yaml`)

ルートはYAMLで宣言的に定義する。

```yaml
imageDelay: 3000  # /proxy-image の遅延（ミリ秒）

routes:
  /posts:
    GET:
      statusCode: 200
      delay: 300
      fixture: posts.json
  /posts/:id:
    GET:
      statusCode: 200
      delay: 0
      fixture: posts.json
```

各ルートの設定項目:

| キー | 型 | 説明 |
|---|---|---|
| `statusCode` | number | レスポンスのHTTPステータスコード |
| `delay` | number | レスポンスを返すまでの待機時間（ミリ秒）。`0` で即時 |
| `fixture` | string | `src/fixtures/` 配下のJSONファイル名 |

**YAMLは毎リクエストで再読み込みされる**ので、サーバを再起動しなくても設定変更が即反映される。

## 遅延を変更する

`routes.yaml` の `delay` の値を書き換えるだけ。

- ローディング表示の確認 → `delay: 2000`
- タイムアウト挙動の検証 → `delay: 30000`
- 即座にレスポンス → `delay: 0`

画像プロキシの遅延は YAML トップレベルの `imageDelay` で別途設定する（ルート別の `delay` とは独立）。

## ルートを追加する

1. レスポンスにしたいJSONを `src/fixtures/users.json` のように配置
2. `routes.yaml` にエントリを追加

```yaml
routes:
  /users:
    GET:
      statusCode: 200
      delay: 0
      fixture: users.json
```

これだけで `GET /users` が `users.json` の中身を返すようになる。サーバ再起動不要。

## ステータスコードを変えてエラーを返す

エラー時のクライアント挙動を試したいときは `statusCode` を変えるだけ:

```yaml
/posts:
  GET:
    statusCode: 500
    delay: 0
    fixture: posts.json
```

## 画像について

初期のfixturesでは `picsum.photos` の画像URLを使用。
自前の画像を使う場合は `resources/images/` に配置し、`posts.json` の `imageUrl` を `http://localhost:3000/images/xxx.jpg` に書き換える。

外部画像の読み込み遅延を再現したい場合は `/proxy-image?url=<画像URL>` を使う。遅延は `routes.yaml` の `imageDelay` で制御。
