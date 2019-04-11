/* eslint-disable no-unused-vars */
// import api
const api = require('./api')
// import module to read file
const fs = require('fs')
// import module to resolve path
const path = require('path')
// import module to deal with post data
const bodyParser = require('body-parser')
// impot Express
const express = require('express')
const app = express()
//  const models = require('./db')

app.use(express.json())
app.use(api)

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))

// use static
// app.use(express.static(path.resolve(__dirname, './view')))
// single page app
app.get('/', function (req, res) {
  // const html = fs.readFileSync(path.resolve(__dirname, './view/index.html'), 'utf-8')
  // res.send(html)
  res.send('Helloword300')
})
// listen to port
const port = process.env.PORT || 3000
app.listen(port, () => console.log('server started on port', port))
