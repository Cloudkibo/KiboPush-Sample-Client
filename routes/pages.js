var express = require('express')
var request = require('request')
var router = express.Router()
var pages
/* GET users listing. */
router.get('/pages', function (req, res, next) {
  var url = 'http://localhost:3023/api/pages'
  var options = getOptions(req, url)
  function callback (error, response, body) {
    if (!error && response.statusCode === 200) {
      var info = JSON.parse(response.body)
      pages = info.payload
      res.render('pages', { title: 'All Pages', pages: pages })
    } else {
      error = JSON.parse(response.body)
      pages = ''
      error = error.description ? error.description : error.payload ? error.payload : ''
      res.render('pages', { title: 'All Pages', pages: undefined, error })
    }
  }
  request.get(options, callback)
})

function getOptions (req, url) {
  var headers = {
    'api_key': req.session.kiboappid,
    'api_secret': req.session.kiboappsecret,
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
