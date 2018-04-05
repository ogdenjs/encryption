require('dotenv').config({silent: true})

const express = require('express')
const bodyParser = require('body-parser')

const decryptValue = require('./decryptValue')
const encryptValue = require('./encryptValue')
const encryptEnvelope = require('./encryptEnvelope')
const decryptEnvelope = require('./decryptEnvelope')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/encrypt-value', encryptValue)
app.post('/decrypt-value', decryptValue)

app.post('/encrypt-envelope', encryptEnvelope)
app.post('/decrypt-envelope', decryptEnvelope)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
