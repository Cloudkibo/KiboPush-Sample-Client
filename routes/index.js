var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'KiboPush API Client' })
})

router.post('/', function (req, res, next) {
  req.session.kiboappid = req.body.kiboappid
  req.session.kiboappsecret = req.body.kiboappsecret
  req.session.kiboclientid = req.body.kiboclientid

  res.render('index', {credentials: 'Session saved'})
})
module.exports = router
