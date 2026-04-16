import Express from 'express'
import PostsRouter from './posts'

const router = Express.Router()

router.get('/', (request, response) => {
    response.json({ message: 'Instagram stub server is running' })
})

router.use('/posts', PostsRouter)

export default router
