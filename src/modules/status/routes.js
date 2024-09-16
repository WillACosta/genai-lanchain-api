const router = require('express').Router()

router.get('/', (_, res) => {
	res.status(200).send()
})

module.exports = router