require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const { port: defaultPort } = require('./config')
const port = process.env.PORT || defaultPort

// Routes Import
const GenAIRoutes = require('./modules/gen-ai/routes')
const StatusRoutes = require('./modules/status/routes')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Attaching routes to the app
app.use('/status', StatusRoutes)
app.use('/gen-ai', GenAIRoutes)

app.listen(port, () => {
	console.log(`Server listening to http://localhost:${port}`)
})
