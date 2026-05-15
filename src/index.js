import Express from 'express'
import Path from 'path'
import StubRouter from './stub'

const app = new Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

// 画像の静的配信
app.use('/images', Express.static(Path.join(__dirname, '..', 'resources', 'images')))

// YAMLベースのスタブルーティング
app.use('/', StubRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Instagram stub server listening. Port:${port}`)
})
