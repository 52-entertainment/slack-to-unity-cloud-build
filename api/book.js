var router = require('express').Router();


router.get('/', function (req, res, next) {
        return res.status(200).send({result: true, errorMessage: null, data: {"elements": 0}});

})
router.post('/', function (req, res, next) {
        console.log(req);
        res.send(200);
        return;
})


module.exports = router;
