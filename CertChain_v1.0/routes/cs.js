var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cs',{
    email:req.session.email,
    pw:req.session.pw,
    name:req.session.name,
    loginState: req.session.loginState,
    dupState: req.session.dupState,
    dupEmail: req.session.dupEmail,
    account_page_state: req.session.account_page_state = false
  }); 
});

module.exports = router;