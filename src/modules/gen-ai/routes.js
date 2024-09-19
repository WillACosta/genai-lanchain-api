const GenAIController = require('./GenAIController')
const router = require('express').Router()

router.post('/translate', GenAIController.translateText)
router.post('/searchInDocument', GenAIController.searchInDocument)

module.exports = router
