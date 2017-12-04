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
