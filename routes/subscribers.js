var express = require('express')
var request = require('request')
var router = express.Router()
var headers
/* GET users listing. */
router.get('/subscribers', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)

  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/subscribers/',
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var subscribers = []
      subscribers = info
      res.render('subscribers', { title: 'Subscribers', subscribers: subscribers })
    } else {
      error = JSON.parse(response.body)
      res.render('subscribers', { title: 'Subscribers', subscribers: '', error: error })
    }
  }
  request.get(options, callback)
})

module.exports = router
