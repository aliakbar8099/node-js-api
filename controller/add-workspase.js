// data models
const WorkSapase = require('../models/workspase');
const User = require("../models/User");

// get products
const getAllWork = async (req, res) => {
    const user = await User.findById(req.user.id)
    const workspase = await WorkSapase.find().exec();

    if (user.roles != "GOD") {
        res.status(503).json({ "message": "فقط دسترسی GOD به این APIدسترسی دارد!" })
    } else {
        res.json({
            message: 'لیست میز کار',
            workspase: workspase,
            totalCount: workspase.length,
            roles: user.roles
        });
    }

}

const getSingleWork = async (req, res) => {
    const id = req.params.id;
    const workspase = await WorkSapase.findById(id);

    workspase === undefined ? res.status(404).json({ message: 'میز کار مورد نظر یافت نشد' }) : res.json(workspase);
}

// post product
const postWork = async (req, res, next) => {
    try {
        const workspase = await WorkSapase.find().exec();
        const { userCreate_id, userCreate_name, name, color } = req.body;
        const user = await User.find().exec();
        let isUser = user.find(item => item.userid == userCreate_id)

        if (userCreate_id === undefined) {
            return res.status(400).json({ message: 'userCreate_id وارد کنید' });
        }

        if (!isUser) {
            return res.status(400).json({ message: 'کاربر مورد نظر یافت نشد' });
        }

        if (userCreate_name === undefined) {
            return res.status(400).json({ message: 'userCreate_name را وارد کنید' });
        }

        if (name === undefined) {
            return res.status(400).json({ message: 'نام میز کار را وارد کنید', "endpoint": "name" });
        }
        if (color === undefined) {
            return res.status(400).json({ message: 'رنگ میز کار را وارد کنید', "endpoint": "color" });
        }

        const newWork = new WorkSapase({
            id: workspase.length + 1,
            userCreate_id,
            userCreate_name,
            name,
            color,
            team_member: []
        });

        await newWork.save()

        res.status(201).json({ message: 'میز کار شما ایجاد شده است' });

    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
}

// delete product
const deleteWork = async (req, res) => {
    const id = req.params.id;
    const work = await WorkSapase.findByIdAndDelete(id);

    res.json({ message: `میز کار ${work.name} با موفیقیت حذف شد` });
}


exports.getAllWork = getAllWork
exports.getSingleWork = getSingleWork
exports.postWork = postWork
exports.deleteWork = deleteWork