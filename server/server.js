require('babel-register')({
  presets: ['es2015', 'react'],
})

const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const port = process.env.PORT || 3001
const compression = require('compression')
import renderReact from './renderReactApp.js'

app.use(
  compression({
    threshold: 0,
    filter: shouldCompress,
  })
)

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    return false
  }
  return compression.filter(req, res)
}

app.use(
  cors({
    origin: '*',
  })
)

app.use(express.static(path.join(__dirname)))

renderReact(app)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
