import Express from 'express'
import Fs from 'fs'
import Path from 'path'
import Yaml from 'js-yaml'

const router = Express.Router()

const configPath = Path.join(__dirname, 'config', 'routes.yaml')
const fixturesPath = Path.join(__dirname, 'fixtures')

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function loadRoutes() {
    const yamlContent = Fs.readFileSync(configPath, 'utf8')
    return Yaml.load(yamlContent).routes
}

function loadFixture(filename) {
    const filePath = Path.join(fixturesPath, filename)
    const content = Fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
}

function registerRoutes() {
    const routes = loadRoutes()

    for (const [path, methods] of Object.entries(routes)) {
        for (const [method, config] of Object.entries(methods)) {
            const httpMethod = method.toLowerCase()

            router[httpMethod](path, async (request, response) => {
                // YAMLを毎回読み込む（nodemonなしでもyaml変更が即反映）
                const currentRoutes = loadRoutes()
                const currentConfig = currentRoutes[path]?.[method]

                if (!currentConfig) {
                    return response.status(404).json({ message: 'route not found' })
                }

                if (currentConfig.delay > 0) {
                    await delay(currentConfig.delay)
                }

                const data = loadFixture(currentConfig.fixture)

                // /posts/:id の場合はIDでフィルタ
                if (request.params.id && Array.isArray(data)) {
                    const id = parseInt(request.params.id, 10)
                    const item = data.find(p => p.id === id)
                    if (!item) {
                        return response.status(404).json({ message: 'not found' })
                    }
                    return response.status(currentConfig.statusCode).json(item)
                }

                response.status(currentConfig.statusCode).json(data)
            })
        }
    }
}

registerRoutes()

// 画像プロキシ: /proxy-image?url=xxx で外部画像を遅延付きで返す
router.get('/proxy-image', async (request, response) => {
    const imageUrl = request.query.url
    if (!imageUrl) {
        return response.status(400).json({ message: 'url parameter required' })
    }

    const yamlContent = Fs.readFileSync(configPath, 'utf8')
    const config = Yaml.load(yamlContent)
    const imageDelay = config.imageDelay || 0

    if (imageDelay > 0) await delay(imageDelay)

    try {
        const imageResponse = await fetch(imageUrl, { redirect: 'follow' })
        const buffer = Buffer.from(await imageResponse.arrayBuffer())
        response.set('Content-Type', imageResponse.headers.get('content-type') || 'image/jpeg')
        response.send(buffer)
    } catch (error) {
        response.status(502).json({ message: 'image fetch failed' })
    }
})

export default router
