const GenAIController = require('./GenAIController')
const router = require('express').Router()

router.post('/translate', GenAIController.translateText)

module.exports = router