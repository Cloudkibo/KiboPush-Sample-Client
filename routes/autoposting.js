var express = require('express')
var request = require('request')
var router = express.Router()
var headers
/* GET users listing. */
router.get('/autoPosting', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)

  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/autoposting/',
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var autoPosting = info.payload
      res.render('autoposting', { title: 'AutoPosting', autoPosting: autoPosting })
    } else {
      error = JSON.parse(response.body)
      console.log(error)
      res.render('autoposting', { title: 'AutoPosting', autoPosting: '', error: error })
    }
  }
  request.get(options, callback)
})

module.exports = router
