const express = require('express');

const User = require('../../models/User')
const Upload = require("../../models/upload")
const auth = require('../../middleware/auth')

const router = express.Router();

router.post("/profile/image", auth, async (req, res) => {
    const listUpload = await Upload.find().exec();
    const user = await User.findById(req.user.id);

    const { base64Image } = req.body


    if(!base64Image){
        return res.status(400).send({ message:"عکس نفرستادید"})
    }

    const findUpload = listUpload.filter(item => item.userid == user.userid);
    const updateUpload = listUpload.find(item => item.userid == user.userid);

    if (findUpload.length > 0) {
        const updatedUser = await Upload.updateOne(
            { userid: user.userid },
            { $set: { userid: user.userid, base64Image } },
            { multi: true }
        );
        return res.status(201).send({ message: "ابدیت شد" })
    }

    const upload = new Upload({ userid, base64Image })

    upload.save();

    res.status(201).send({ message: "پروفایل جدید اپلود شد" })

});

router.post("/profile", auth, async (req, res) => {
    const listUpload = await Upload.find().exec();
    const user = await User.findById(req.user.id);
    const getUpload = listUpload.find(item => item.userid == user.userid);

    const { age, gender } = req.body

    const updatedUser = await User.updateOne(
        { userid: user.userid },
        {
            $set: {
                avatar: req.user.id,
                gender: (gender == 0 ? "خانم" : "آقا"),
                age
            }
        },
        { multi: true }
    );

    res.status(201).send({ message: "پروفایل بروز رسانی شد" })

});

router.get("/profile/image", auth, async (req, res) => {
    const listUpload = await Upload.find().exec();
    const user = await User.findById(req.user.id);
    const getUpload = listUpload.find(item => item.userid == user.userid);

    res.status(201).send({ data: getUpload.base64Image })

});

// const path = require('path');

// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public")
//     },
//     filename: (req, file, cb) => {
//         console.log(file)
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })


// const upload = multer({ storage: storage })

// router.post('/profile', auth, upload.single('avatar'), async (req, res) => {

//     const users = await User.find().exec();


//     const url = req.file.path.split('public\\')[1];

//     const filteruser = users.find(item => item._id == req.user.id)

//     const updatedUser = await User.updateOne(
//         { filteruser },
//         { $set: { avatar: req.headers.host + "/" + url } },
//         { multi: true }
//     );

//     res.send({
//         avatar: req.headers.host + "/" + url,
//     })
// })


module.exports = router;