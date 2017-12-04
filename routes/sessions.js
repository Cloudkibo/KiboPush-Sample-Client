var express = require('express')
var request = require('request')
var router = express.Router()
var headers
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
    console.log('Response-Body', response)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var sessions = info.payload
      res.render('sessions', { title: 'Sessions', sessions: sessions })
    } else {
      console.log(error)
      res.render('sessions', { title: 'Sessions', sessions: '' })
    }
  }
  request.post(options, callback)
})

module.exports = router
