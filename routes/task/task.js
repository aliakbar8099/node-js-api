const express = require("express");
const Task = require("../../models/tasks");

const router = express.Router();

const auth = require("../../middleware/auth");

const path = "/task/:type"

router.post(path, auth, async (req, res) => {

    const { title, color } = req.body

    if (req.params.type == 0 || req.params.type == 1) {
        const newTask = new Task({
            userid: req.user.id,
            title,
            isForWorksapce: req.params.type == 1,
            color,
            progess: 0
        })

        await newTask.save();

        res.status(201).json({ message: "تسک جدید ساخته شد" })
    } else {
        res.status(400).json({ message: "داده های وارد شده اشتباه است" })
    }

})

router.delete(path + "/:id", auth, async (req, res) => {

    if (req.params.type == 0 || req.params.type == 1) {

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "تسک مورد نظر حذف شد" })
    } else {
        res.status(400).json({ message: "داده های وارد شده اشتباه است" })
    }

})

router.delete(path + "/:id", auth, async (req, res) => {
    const task = await Task.findById(req.params.id);
    const { title, color } = req.body

    if (req.params.type == 0 || req.params.type == 1) {

        await Task.findByIdAndUpdate(req.params.id, {
            title, color,
            userid: req.user.id,
            isForWorksapce: req.params.type == 1,
            progess: task.progess
        });

        res.status(200).json({ message: "تسک مورد نظر حذف شد" })
    } else {
        res.status(400).json({ message: "داده های وارد شده اشتباه است" })
    }

})


router.get("/task", auth, async (req, res) => {
    const tasks = await Task.find().exec();

    const filterGetTaskUser = tasks.filter(item => item.userid == req.user.id)

    res.status(200).json({ data: filterGetTaskUser })

})


module.exports = router
