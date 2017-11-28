var express = require('express')
var request = require('request')
var router = express.Router()
var headers
/* GET users listing. */
router.get('/surveys', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)
  var url = 'https://staging.kibopush.com/api/surveys/'
  var options = getOptions(req, url)
  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var surveys = []
      surveys = info.payload.surveys
      res.render('surveys', { title: 'Surveys', mydata: surveys })
    } else {
      console.log(error)
      res.render('surveys', { title: 'Surveys', mydata: '', error: error })
    }
  }
  request.get(options, callback)
})

router.get('/surveys/:id', function (req, res, next) {
  var id = req.params.id
  var url = `https://staging.kibopush.com/api/surveys/${id}`
  console.log(url)
  var options = getOptions(req, url)
  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var questions = []
      var responses = []
      questions = info.payload.questions
      responses = info.payload.responses
      console.log(questions)
      res.render('surveyDetails', { title: 'Survey Details', mydata: info.payload, questions: questions, responses: responses })
    } else {
      console.log(error)
      res.render('surveyDetails', { title: 'Survey Details', mydata: '', error: error })
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
