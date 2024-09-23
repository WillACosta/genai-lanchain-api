import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import config from './config'

import GenAIRoutes from '@/modules/genai/application/routes'
import StatusRoutes from '@/modules/status/routes'

const app = express()
const port = process.env['PORT'] || config.port

dotenv.config()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/status', StatusRoutes)
app.use('/gen-ai', GenAIRoutes)

app.listen(port, () => {
	console.log(`Server listening to http://localhost:${port}`)
})
