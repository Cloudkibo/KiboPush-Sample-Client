var express = require('express')
var json2csv = require('json2csv')
var request = require('request')
var router = express.Router()
var headers
/* GET users listing. */
router.get('/userInformation', function (req, res, next) {
  headers = {
    'api_key': req.session.kiboappid,
    'api_secret': req.session.kiboappsecret,
    'content-type': 'application/json'
  }
  var options = {
    url: 'http://localhost:3023/api/user',
    headers: headers,
    rejectUnauthorized: false
  }

  function callback (error, response, body) {
    if (!error && response.statusCode === 200) {
      var info = JSON.parse(response.body)
      var array = info.payload
      // array.push(info.payload)
      req.session.userId = info.payload._id
      res.render('userInformation', { title: 'User Information', mydata: array })
    } else {
      error = JSON.parse(response.body)
      error = error.description ? error.description : error.payload ? error.payload : ''
      res.render('userInformation', { title: 'User Information', mydata: '', error: error })
    }
  }
  request.get(options, callback)
})

router.post('/userInformation/downloadcsv', function (req, res, next) {
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
