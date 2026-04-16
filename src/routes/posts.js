import Express from 'express'
import Posts from '../fixtures/posts.json'

const router = Express.Router()

// GET /posts 一覧取得
router.get('/', (request, response) => {
    response.json(Posts)
})

// GET /posts/:id 詳細取得
router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id, 10)
    const post = Posts.find(p => p.id === id)
    if (!post) {
        return response.status(404).json({ message: 'post not found' })
    }
    response.json(post)
})

export default router
