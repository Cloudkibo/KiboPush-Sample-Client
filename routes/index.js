var express = require('express')
var json2csv = require('json2csv')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  var credentials
  if (!req.session.kiboappid && !req.session.kiboappsecret) {
    credentials = {'kiboappid': '', 'kiboappsecret': ''}
    res.render('index', {title: 'KiboPush API Client', credentials: credentials})
  } else {
    credentials = {'kiboappid': req.session.kiboappid, 'kiboappsecret': req.session.kiboappsecret}
    res.render('index', { title: 'KiboPush API Client', credentials: credentials })
  }
})

router.post('/', function (req, res, next) {
  req.session.kiboappid = req.body.kiboappid
  req.session.kiboappsecret = req.body.kiboappsecret
  res.redirect('/userInformation')
})

router.post('/downloadcsv', function (req, res, next) {
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
