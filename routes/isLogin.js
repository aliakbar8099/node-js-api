const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/islogin', auth, async (req, res) => {

    if(res.statusCode == 200){
        return res.status(200).send({ message: "کاربر معتبر است" })
    }
    if(res.statusCode == 401){
        return res.status(401).send({ message :"کاربر معتبر نیست"})
    }
})


module.exports = router;