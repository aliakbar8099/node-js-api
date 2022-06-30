const express = require('express');

const User = require('../../models/User')
const auth = require('../../middleware/auth')

const router = express.Router();
const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/profile")
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({ storage: storage })

router.post('/profile', auth, upload.single('avatar'), async (req, res) => {

    const users = await User.find().exec();
    const url = req.file.path.split('images');

    const filteruser = users.find(item => item._id == req.user.id)

    const updatedUser = await User.updateOne(
        { filteruser },
        { $set: { avatar: req.headers.host + url[1] } },
        { multi: true }
    );

    res.send({
        avatar: req.headers.host + url[1],
    })
})


module.exports = router;