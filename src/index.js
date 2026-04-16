import Express from 'express'
import Path from 'path'
import AppServer from './routes'

const app = new Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

// 画像の静的配信: /images/xxx.jpg でアクセス可能
app.use('/images', Express.static(Path.join(__dirname, '..', 'resources', 'images')))

// ルーティング
app.use('/', AppServer)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Instagram stub server listening. Port:${port}`)
})
