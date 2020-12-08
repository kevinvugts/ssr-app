// require('babel-register')({
//   presets: ['es2015', 'react'],
// })

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

function setNoCache(res) {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 1)
  res.setHeader('Expires', date.toUTCString())
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Cache-Control', 'public, no-cache')
}

function setLongTermCache(res) {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  res.setHeader('Expires', date.toUTCString())
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
}

app.use(
  express.static(path.join(__dirname), {
    extensions: ['html'],
    setHeaders(res, path) {
      if (path.match(/(\.html|\/sw\.js)$/)) {
        setNoCache(res)
        return
      }

      if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|json|woff|woff2)$/)) {
        setLongTermCache(res)
      }
    },
  })
)

renderReact(app)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
