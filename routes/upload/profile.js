const express = require('express');

const User = require('../../models/User')
const Upload = require("../../models/upload")
const auth = require('../../middleware/auth')

const router = express.Router();

const path = require('path');

const multer = require('multer');

// // const storage = multer.diskStorage({
// //     destination: path.join(__dirname, "..", "..", "public"),
// //     filename: (req, file, cb) => {
// //         cb(null, Date.now() + path.extname(file.originalname))
// //     }
// // })


// const upload = multer({ storage: storage })

// // router.post('/profile', auth, upload.single('avatar'), async (req, res) => {


// //     const users = await User.find().exec();


// //     const url = req.file.path.split('public\\')[1];

// //     const filteruser = users.find(item => item._id == req.user.id)

// //     const updatedUser = await User.updateOne(
// //         { filteruser },
// //         { $set: { avatar: req.headers.host + "/" + url } },
// //         { multi: true }
// //     );

// //     res.status(200).send({
// //         avatar: req.headers.host + "/" + url,
// //     })

// // })

router.post('/profile/image', auth, async (req, res) => {

    const user = await User.findById(req.user.id)
    const listUpload = await Upload.find().exec();
    let upload_userId = listUpload.find(item => item.userid == user.userid)
    const findUpload = await User.findOne(upload_userId._id);

    const { profile } = req.body

    if (!findUpload) {
        const upload = new Upload({
            userid: user.userid,
            base64Image: profile
        })
        await upload.save();

        res.status(201).send({ message: " عکس پروفایل با موفقیت قرار گرفت " })
    } else {
        const uploadUpdate = await Upload.update(
            { userid: user.userid },
            { $set: { base64Image: profile } },
            { multi: true }
        );
        res.status(200).send({ message: "عکس پروفایل ابدیت شد" })
    }


})

router.get('/profile/image', auth, async (req, res) => {
    const user = await User.findById(req.user.id)
    const listUpload = await Upload.find().exec();
    let upload_userId = listUpload.find(item => item.userid == user.userid)

    return res.status(200).send({ image: upload_userId.base64Image });
})    

module.exports = router;
