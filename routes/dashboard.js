var express = require('express')
var Promise = require('promise')
var request = Promise.denodeify(require('request').get)
var router = express.Router()
var sentVsSeen
var stats
var errorStats
/* GET users listing. */
router.get('/dashboard', function (req, res, next) {
  console.log(req.session.kiboappid)
  console.log(req.session.kiboappsecret)

  var url = 'https://staging.kibopush.com/api/dashboard/sentVsSeen'
  var options = getOptions(req, url)
  function handleSentVsSeen (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      sentVsSeen = info.payload
      res.render('dashboard', { title: 'Dashboard', sentVsSeen: sentVsSeen, broadcast: sentVsSeen.broadcast, poll: sentVsSeen.poll, survey: sentVsSeen.survey, stats: stats })
    } else {
      error = JSON.parse(response.body)
      res.render('dashboard', { title: 'Dashboard', sentVsSeen: '', broadcast: '', poll: '', survey: '', stats: stats, errorStats: errorStats, error: error })
    }
  }
  request(options).then(callDashboardStats(req, res)).nodeify(handleSentVsSeen)
})

function callDashboardStats (req, res) {
  var url = `https://staging.kibopush.com/api/dashboard/stats`
  var options = getOptions(req, url)
  function handleDashboardStats (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Response-Parse', JSON.parse(response.body))
      var info = JSON.parse(response.body)
      stats = info.payload
    } else {
      errorStats = JSON.parse(response.body)
      stats = ''
    }
  }
  request(options).then().nodeify(handleDashboardStats)
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
