var express = require('express')
var request = require('request')
var router = express.Router()
var headers
/* GET users listing. */
router.get('/broadcasts', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)

  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/broadcasts/',
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var broadcasts = info.payload.broadcasts
      var broadcastpages = info.payload.broadcastpages
      res.render('broadcasts', { title: 'Broadcasts', broadcasts: broadcasts, broadcastpages: broadcastpages })
    } else {
      error = JSON.parse(response.body)
      console.log(error)
      res.render('broadcasts', { title: 'Broadcasts', broadcasts: broadcasts, broadcastpages: broadcastpages, error: error })
    }
  }
  request.get(options, callback)
})
router.get('/newBroadcast', function (req, res, next) {
  var url = 'https://kiboapi.cloudkibo.com/api/pages'
  var options = getOptions(req, url)
  function callback (error, response, body) {
    if (!error && response.statusCode === 200) {
      var info = JSON.parse(response.body)
      var pages = info.payload
      var pageArray = []
      for (var i = 0; i < pages.length; i++) {
        var object = {id: pages[i]._id, name: pages[i].pageName}
        pageArray.push(object)
      }
      res.render('newBroadcast', {title: 'New Broadcast', pages: pageArray})
    } else {
      error = JSON.parse(response.body)
      res.send(error)
    }
  }
  request(options, callback)
})
router.get('/broadcasts/:id', function (req, res, next) {
  let id = req.params.id
  let url = `https://staging.kibopush.com/api/broadcasts/${id}`
  console.log(url)
  let options = getOptions(req, url)
  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var broadcast = info.payload
      res.render('broadcastDetail', { title: 'Broadcast Details', broadcast: broadcast })
    } else {
      error = JSON.parse(response.body)
      console.log(error)
      res.render('broadcastDetail', { title: 'Broadcast Details', broadcasts: '', error: error })
    }
  }
  request.get(options, callback)
})

router.post('/broadcasts/sendBroadcast', function (req, res, next) {
  var payload = []
  var payloadBody = {'text': req.body.text, 'componentType': 'text'}
  payload.push(payloadBody)
  var body = {
    payload: payload,
    title: req.body.broadcastTitle,
    pageId: req.body.pages
  }
  if (req.body.gender !== 'all') {
    body.segmentationGender = req.body.gender
  }
  headers = {
    'api_key': req.session.kiboappid,
    'api_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://kiboapi.cloudkibo.com/api/broadcasts/sendBroadcast',
    headers: headers,
    rejectUnauthorized: false,
    body: body,
    json: true
  }
  function callback (error, response, body) {
    if (body.status === 'success') {
      res.send('Broadcast sent successfully')
    } else {
      error = body
      res.send(body)
    }
  }
  request.post(options, callback)
})

function getOptions (req, url) {
  headers = {
    'api_key': req.session.kiboappid,
    'api_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: url,
    headers: headers,
    rejectUnauthorized: false
  }
  return options
}

module.exports = router
