const router = require('express').Router()

router.get('/', async (req, res) => {
    let returnMessage = {
        message: 'Hello World'
    }

    return res.status(200).json(returnMessage)
})

module.exports = router