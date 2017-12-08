var express = require('express')
var request = require('request')
var router = express.Router()
var headers
/* GET users listing. */
router.get('/polls', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)
  var url = 'https://staging.kibopush.com/api/polls/'
  var options = getOptions(req, url)
  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var polls = []
      var pollPages = []
      var pollResponses = []
      polls = info.payload.polls
      pollPages = info.payload.pollpages
      pollResponses = info.payload.responsesCount
      res.render('polls', { title: 'Polls', polls: polls, pollPages: pollPages, pollResponses: pollResponses })
    } else {
      error = JSON.parse(response.body)
      res.render('polls', { title: 'Polls', polls: '', pollPages: pollPages, pollResponses: pollResponses, error: error })
    }
  }
  request.get(options, callback)
})
router.get('/newPoll', function (req, res, next) {
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
      res.render('newPoll', {title: 'New Poll', pages: pageArray})
    } else {
      error = JSON.parse(response.body)
      res.send(error)
    }
  }
  request(options, callback)
})

router.get('/polls/:id', function (req, res, next) {
  var id = req.params.id
  var url = `https://staging.kibopush.com/api/polls/responses/${id}`
  console.log(url)
  var options = getOptions(req, url)
  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var responses = []
      responses = info.payload
      res.render('pollResponses', { title: 'Poll Responses', responses: responses })
    } else {
      error = JSON.parse(response.body)
      res.render('pollResponses', { title: 'Poll Responses', responses: responses, error: error })
    }
  }
  request.get(options, callback)
})

router.post('/polls/sendPoll', function (req, res, next) {
  console.log(req.body.sendPollButton)
  var id = req.body.sendPollButton
  var poll = JSON.parse(req.body[id])
  var body = {id: poll._id, statement: poll.statement, options: poll.options, isSegemented: poll.isSegemented, segmentationPageIds: poll.segmentationPageIds, segmentationGender: poll.segmentationGender, segmentationLocale: poll.segmentationLocale}
  console.log(body)
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/polls/send',
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
      res.redirect('/polls')
    } else {
      console.log('error', body)
      error = body
      res.send(body)
    }
  }
  request.post(options, callback)
})

router.post('/polls/createPoll', function (req, res, next) {
  var statement = req.body.reply
  var response1 = req.body.responseOne
  var response2 = req.body.responseTwo
  var response3 = req.body.responseThree
  var options = []
  options.push(response1)
  options.push(response2)
  options.push(response3)
  var segmentationPageIds = (req.body.pages).split(',')
  var segmentationGender = (req.body.gender).split(',')
  var segmentationLocale = (req.body.locale).split(',')
  var isSegemented = false
  var body = {statement: statement, options: options, isSegemented: isSegemented, segmentationPageIds: segmentationPageIds, segmentationGender: segmentationGender, segmentationLocale: segmentationLocale}
  console.log(body)
  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  options = {
    url: 'https://staging.kibopush.com/api/polls/create',
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
      res.send(body.payload)
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
