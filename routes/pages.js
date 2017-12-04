var express = require('express')
var Promise = require('promise')
var request = Promise.denodeify(require('request').get)
var router = express.Router()
var otherPages
var errorOtherPages
var pages
/* GET users listing. */
router.get('/pages', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)

  var url = 'https://staging.kibopush.com/api/pages/allpages'
  var options = getOptions(req, url)
  function handlePages (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      pages = info.payload
      console.log('pages', info.payload)
      res.render('pages', { title: 'All Pages', pages: pages, otherPages: otherPages })
    } else {
      error = JSON.parse(response.body)
      pages = ''
      res.render('pages', { title: 'All Pages', pages: pages, otherPages: otherPages, errorOtherPages: errorOtherPages, error })
    }
  }
  request(options).then(
    callOtherPages(req, res)
  ).nodeify(handlePages)
})
function callOtherPages (req, res) {
  var url = 'https://staging.kibopush.com/api/pages/otherpages'
  var options = getOptions(req, url)
  function handleOtherPages (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      otherPages = info.payload
    } else {
      errorOtherPages = JSON.parse(response.body)
      otherPages = ''
    }
  }
  request(options).then().nodeify(handleOtherPages)
}

function getOptions (req, url) {
  var headers = {
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
