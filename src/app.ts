import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import swaggerUi from 'swagger-ui-express'

import swaggerSpec from 'swagger'
import { appConfig } from './config'

import AuthRoutes from '@/modules/auth/application/routes'
import GenAIRoutes from '@/modules/genai/application/routes'
import ResourcesRoutes from '@/modules/resources/application/routes'
import StatusRoutes from '@/modules/status/application/routes'
import UserRoutes from '@/modules/users/application/routes'

import { appLogger } from './common/middlewares'

const app = express()
const port = process.env['PORT'] || appConfig.port

dotenv.config()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(appLogger)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/', AuthRoutes)
app.use('/status', StatusRoutes)
app.use('/users', UserRoutes)
app.use('/gen-ai', GenAIRoutes)
app.use('/resources', ResourcesRoutes)

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})
