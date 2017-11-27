var express = require('express')
var json2csv = require('json2csv')
var request = require('request')
var router = express.Router()
var headers
/* GET users listing. */
router.get('/pages', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)

  headers = {
    'app_id': req.session.kiboappid,
    'app_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'https://staging.kibopush.com/api/pages/',
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    console.log('Response-Body', response.body)
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      var array = []
      array = info.payload
      res.render('pages', { title: 'All Pages', mydata: array })
    } else {
      console.log(error)
      res.render('pages', { title: 'All Pages', mydata: '', error: error })
    }
  }
  request.get(options, callback)
})

router.post('/pages/downloadcsv', function (req, res, next) {
  res.set('Content-Type', 'application/octet-stream')
  var info = JSON.parse(req.body.dd)
  console.log(info)
  var keys = []
  var val = info[0]

  for (var j in val) {
    var subKey = j
    keys.push(subKey)
  }
  console.log(keys)
  json2csv({ data: info, fields: keys }, function (err, csv) {
    if (err) {
      console.log(err)
    }
    res.set({
      'Content-Disposition': 'attachment; filename=userInformation.csv',
      'Content-Type': 'text/csv'
    })
    res.send(csv)
  })
})

module.exports = router