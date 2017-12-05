var express = require('express')
var request = require('request')
var router = express.Router()
var headers
var session
var chats = []
/* GET users listing. */
router.get('/sessions', function (req, res, next) {
  console.log(req.session.userId)
  var companyId = req.session.userId
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/sessions/',
    headers: headers,
    rejectUnauthorized: false,
    body: {company_id: companyId},
    json: true
  }

  function callback (error, response, body) {
    console.log('Response-Body', body)
    console.log(response.statusCode)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', body)
      var info = body
      var sessions = info.payload
      res.render('sessions', { title: 'Sessions', sessions: sessions })
    } else {
      console.log('Response-Parse', body)
      error = body
      res.render('sessions', { title: 'Sessions', sessions: '', error: error })
    }
  }
  request.post(options, callback)
})

router.get('/sessions/:id', function (req, res, next) {
  console.log(req.session.userId)
  var id = req.params.id
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: `https://staging.kibopush.com/api/sessions/${id}`,
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      session = info.payload
      chats = session.chats
      console.log(session)
      res.render('sessionDetails', { title: 'Sessions Details', session: session, chats: chats })
    } else {
      error = JSON.parse(response.body)
      res.render('sessionDetails', { title: 'Sessions Details', session: session, error: error })
    }
  }
  request.get(options, callback)
})

router.get('/sessions/markRead/:id', function (req, res, next) {
  console.log(req.session.userId)
  var id = req.params.id
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: `https://staging.kibopush.com/api/sessions/markread/${id}`,
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var chatSeen
      chatSeen = info.payload
      console.log(chatSeen)
      res.render('sessionDetails', { title: 'Sessions Details', session: session, chats: chats, chatSeen: chatSeen })
    } else {
      var errorChatSeen = JSON.parse(response.body)
      res.render('sessionDetails', { title: 'Sessions Details', session: session, chats: chats, chatSeen: chatSeen, errorChatSeen: errorChatSeen })
    }
  }
  request.get(options, callback)
})

router.get('/sessions/liveChat/:id', function (req, res, next) {
  console.log(req.session.userId)
  var id = req.params.id
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: `https://staging.kibopush.com/api/livechat/${id}`,
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var liveChat
      liveChat = info.payload
      console.log(liveChat)
      res.render('liveChat', { title: 'Live Chat', liveChat: liveChat })
    } else {
      error = JSON.parse(response.body)
      res.render('liveChat', {title: 'Live Chat', liveChat: liveChat, error: error})
    }
  }
  request.get(options, callback)
})

module.exports = router
