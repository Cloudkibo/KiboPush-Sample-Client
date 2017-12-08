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
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)

  var url = 'https://staging.kibopush.com/api/pages/allpages'
  var options = getOptions(req, url)
  function callback (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var pages = info.payload
      var pageArray = []
      for (var i = 0; i < pages.length; i++) {
        var object = {id: pages[i]._id, name: pages[i].pageName}
        pageArray.push(object)
      }
      console.log(pageArray)
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
  var pages = []
  var gender = []
  var locale = []
  console.log(req.body)
  if (req.body.pages instanceof Array) {
    pages = req.body.pages
  } else if (req.body.pages !== '') {
    pages.push(req.body.pages)
  }

  if (req.body.gender instanceof Array) {
    gender = req.body.gender
  } else if (req.body.gender !== '') {
    gender.push(req.body.gender)
  }

  if (req.body.locale instanceof Array) {
    locale = req.body.locale
  } else if (req.body.locale !== '') {
    locale.push(req.body.locale)
  }
  var isSegemented = false
  if (req.body.pages !== '' || req.body.gender !== '' || req.body.locale !== '') {
    isSegemented = true
  }
  var type = ''
  var title = 'Broadcast Title'
  var text = ''
  var attachmentType = ''
  var fileurl = ''
  var payload = []
  var payloadBody = {'id': 0, 'text': req.body.text, 'componentType': 'text'}
  payload.push(payloadBody)
  var segmentationPageIds = pages
  var segmentationGender = gender
  var segmentationLocale = locale
  var body = {platform: 'facebook', payload: payload, type: type, title: title, text: text, attachmentType: attachmentType, fileurl: fileurl, isSegemented: isSegemented, segmentationPageIds: segmentationPageIds, segmentationGender: segmentationGender, segmentationLocale: segmentationLocale}
  console.log('Body', body)
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/broadcasts/sendConversation',
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
      res.redirect('/broadcasts')
    } else {
      console.log('error', body)
      error = body
      res.send(body)
    }
  }
  request.post(options, callback)
})

function getOptions (req, url) {
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
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
