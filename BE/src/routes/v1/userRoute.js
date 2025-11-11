import express from 'express'
import { userController } from '~/controllers/userController.js'
import { authMiddleware } from '~/middlewares/authMiddleware'
const router = express.Router()

router.post('/register', userController.register)

router.post('/login', userController.login)

router.route('/verify').get(authMiddleware, userController.validateToken)

router.post('/logout', authMiddleware, userController.logout)

router.post('/create', authMiddleware, userController.createUser)

router.get('/', authMiddleware, userController.listUsers)

router.get('/:id', authMiddleware, userController.getUserById)

router.patch('/:id', authMiddleware, userController.updateUser)

router.delete('/:id', authMiddleware, userController.deleteUser)

export default router
