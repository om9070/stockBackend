var express = require("express")
var router = express.Router();
const controller=require("../controllers/index")



router.get("/",function(req,res,next){
    res.send('working data')
});

//fetch data form the DB,I have already insert stock data.
router.get("/stocks",controller.getStock)

module.exports = router;