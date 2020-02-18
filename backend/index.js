const express = require('express')

const server = express()

server.get('/teste', (req, res) => {
  return res.json('Helo world')
})

server.listen(3000)
