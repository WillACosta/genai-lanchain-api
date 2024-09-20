import express from 'express'
import GenAIRoutes from './modules/gen-ai/routes'
import StatusRoutes from './modules/status/routes'

import cors from 'cors'
import dotenv from 'dotenv'
import config from './config'

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
