const express = require('express');

const User = require('../../models/User')
const Upload = require("../../models/upload")
const auth = require('../../middleware/auth')

const router = express.Router();

const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: path.join(__dirname,"..","..","public"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({ storage: storage })

router.post('/profile', auth, upload.single('avatar'), async (req, res) => {


    const users = await User.find().exec();


    const url = req.file.path.split('public\\')[1];

    const filteruser = users.find(item => item._id == req.user.id)

    const updatedUser = await User.updateOne(
        { filteruser },
        { $set: { avatar: req.headers.host + "/" + url } },
        { multi: true }
    );

    res.status(200).send({
        avatar: req.headers.host + "/" + url,
    })
    res.status(405).send({
        res,
        req
    })
})


module.exports = router;
