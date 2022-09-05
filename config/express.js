require('dotenv').config()

const express = require('express')
const bodyParse = require('body-parser')
const config = require('config')

const controllerMain = require('../api/controllers/main')
const controllerUser = require('../api/controllers/user')
const controllerEntry = require('../api/controllers/entry')
const mongoose = require('../api/database/config')
const cors = require("cors")

const app = express()

// getting config variable
app.set('port', process.env.PORT || config.get('server.port'))

// middlewares
app.use(cors())
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({ extended: false }))

// routes
app.use(controllerMain)
app.use('/user', controllerUser)
app.use('/entry', controllerEntry)

module.exports = app