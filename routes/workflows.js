var express = require('express')
var request = require('request')
var router = express.Router()
var headers
/* GET users listing. */
router.get('/workflows', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)

  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/workflows/',
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var workflows = info.payload
      res.render('workflows', { title: 'Workflows', workflows: workflows })
    } else {
      error = JSON.parse(response.body)
      res.render('workflows', { title: 'Workflows', workflows: '', error: error })
    }
  }
  request.get(options, callback)
})
router.post('/workflows/createWorkflow', function (req, res, next) {
  var rule = req.body.rule
  var keywords = (req.body.keywords).split(',')
  var reply = req.body.reply
  var isActive = req.body.isActive
  var body = {condition: rule, keywords: keywords, reply: reply, isActive: isActive}
  console.log(body)
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/workflows/create',
    headers: headers,
    rejectUnauthorized: false,
    body: body,
    json: true
  }
  console.log(options)
  function callback (error, response, body) {
    console.log('Response-Body', body)
    if (body.status === 'success') {
      console.log('Response-Parse', body)
      res.redirect('/workflows')
    } else {
      console.log('error', body)
      error = body
      res.send(body)
    }
  }
  request.post(options, callback)
})
router.get('/newWorkflow', function (req, res, next) {
  res.render('createWorkflow', { title: 'Create Workflow' })
})

router.post('/workflows/enable', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)
  var id = req.body.id
  var isActive = req.body.isActive
  var url
  if (isActive === 'true') {
    url = 'https://staging.kibopush.com/api/workflows/disable'
  } else {
    url = 'https://staging.kibopush.com/api/workflows/enable'
  }
  console.log(url, isActive)
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }

  var options = {
    url: url,
    headers: headers,
    rejectUnauthorized: false,
    body: {_id: id},
    json: true
  }

  function callback (error, response, body) {
    console.log('Response-Body', body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', body)
      res.send(body)
    } else {
      console.log('error', body)
      error = body
      res.send(body)
    }
  }
  request.post(options, callback)
})

module.exports = router
