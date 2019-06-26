var express = require('express')
var request = require('request')
var router = express.Router()
var headers
router.get('/sendChat', function (req, res, next) {
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
      res.render('sendChat', {pages: pageArray})
    } else {
      error = JSON.parse(response.body)
      res.send(error)
    }
  }
  request(options, callback)
})
router.post('/chat/sendMessage', function (req, res, next) {
  var payload = {
    payload: {'text': req.body.text, 'componentType': 'text'},
    pageId: req.body.pages
  }
  if (req.body.subscriberIdButton === '' && req.body.subscriberId !== '') {
    payload.subscriberId = req.body.subscriberId
  } else if (req.body.refIdButton === '' && req.body.refId !== '') {
    payload.subscriberId = req.body.refId
  }
  headers = {
    'api_key': req.session.kiboappid,
    'api_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    headers: headers,
    rejectUnauthorized: false,
    body: payload,
    json: true
  }
  if (req.body.subscriberIdButton === '') {
    options.url = 'https://kiboapi.cloudkibo.com/api/livechat/sendMessage'
  } else if (req.body.refIdButton === '') {
    options.url = 'https://kiboapi.cloudkibo.com/api/livechat/sendMessageUsingRefId'
  }
  function callback (error, response, body) {
    if (body.status === 'success') {
      res.send('Chat sent successfully')
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
