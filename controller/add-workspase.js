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

const get_workspase = async (req, res) => {
    const listIdwork = []
    const user = await User.findById(req.user.id)
    const workspase = await WorkSapase.find().exec();
    const filterGetWorkFromCreateUser = workspase.filter(item => item.userCreate_id == user.userid)
    const filterByworkspase_list_id = user.workspase_list_id.map(item=> workspase.find(i => i.id == item.id))

    res.json({
        message: 'لیست میز کار کاربر ها',
        workspase: [
            ...filterGetWorkFromCreateUser,
            ...filterByworkspase_list_id
        ],
        totalCount: filterGetWorkFromCreateUser.length,
        roles: user.roles
    });

}


const get_User = async (req, res) => {
    let users = []
    const user = await User.find().exec();
    const edidUser = user.map(item => users.push({
        userid: item.userid,
        fullname: item.fullname,
        username: item.username,
        roles: item.roles,
        gender: item.gender
    }))

    res.json({
        message: 'لیست کاربر ها',
        users,
        totalCount: user.length,
    });

}

const getSingleWork = async (req, res) => {
    const user = await User.findById(req.user.id)
    const id = req.params.id;
    if (id.length != 24) {
        return res.status(404).json({ message: 'شناسه میز کار نادرست است' })
    }
    const workspase = await WorkSapase.findById(id);
    console.log(workspase)
    if (!workspase) {
        return res.status(404).json({ message: 'میز کار یافت نشد' })
    }
    res.json(workspase)
}

const get_todos = async (req, res) => {
    const user = await User.findById(req.user.id)


    const workspase = await WorkSapase.findById(req.body.workspase_id);

    const findUser = workspase.team_member.find(item => item.userid == user.userid)

    res.json({
        message: 'لیست روزانه شما',
        todos: findUser.todos,
        totalCount: findUser.todos.length,
    });

}

// post product
const postWork = async (req, res, next) => {
    try {
        const workspase = await WorkSapase.find().exec();
        const userFind = await User.findById(req.user.id)
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
            team_member: [{
                userid: userCreate_id,
                owner: true,
                username: userCreate_name,
                todos: []
            }]
        });

        await newWork.save()
        // await userFind.save()

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

const team_member = async (req, res) => {
    try {
        const user = await User.find().exec();
        const user_id = await User.findById(req.user.id)
        let isUser = user.find(item => item.userid == req.body.userid)


        if (req.body.workspase_id == undefined) {
            return res.status(400).json({ message: 'شناسه میز کار را وارد کنید', "endpoint": "workspase_id" });
        }
        if (!isUser) {
            return res.status(400).json({ message: 'کاربر مورد نظر یافت نشد' });
        }
        if (typeof req.body.workspase_id != "string") {
            return res.status(400).json({ message: 'شناسه فقط رشته است', "endpoint": "workspase_id" });
        }

        const workspase = await WorkSapase.findById(req.body.workspase_id)
        let isUserWorkSpase = workspase.team_member.filter(item => item.userid == req.body.userid)

        if (user_id.userid != workspase.userCreate_id) {
            return res.status(400).json({ message: 'فقط سازنده میزکار می تواند اعضا اضافه کند!' });
        }

        if (isUserWorkSpase.length !== 0) {
            return res.status(400).json({ message: 'کاربر مورد نظر درون تیم قبلا اضافه شده است' });
        }

        if (req.body.userid == undefined) {
            return res.status(400).json({ message: 'شناسه کاربری عضو جدید وارد کنید', "endpoint": "userid" });
        }
        if (req.body.userid == undefined) {
            return res.status(400).json({ message: 'شناسه کاربری عضو جدید وارد کنید', "endpoint": "userid" });
        }
        if (req.body.username == undefined) {
            return res.status(400).json({ message: 'نام کاربری عضو جدید وارد کنید', "endpoint": "username" });
        }

        const userFind = await User.findById(isUser._id)


        workspase.team_member.unshift({
            userid: req.body.userid,
            username: req.body.username,
            owner: false,
            todos: []
        });

        userFind.workspase_list_id.unshift({
            id: parseInt(workspase.id),
        });

        await workspase.save();
        await userFind.save();

        res.json({
            message: "اعضا جدید به تیم با موفقیت اضافه شد",
        });
    } catch (e) {
        console.log(e)
        res.send({ message: "خطا در ارسال" });
    }
}

const delete_team = async (req, res) => {
    const workspase = await WorkSapase.findById(req.body.workspase_id);
    const isWork = workspase.team_member.filter(item => item._id == req.params.member_id);

    if (isWork.length == 0) {
        return res.status(400).send({ message: "چنین عضوی وجود ندارد" })
    }

    const updateWorkspase = await WorkSapase.update(
        { workspase },
        { $pull: { team_member: { _id: req.params.member_id } } },
        { multi: true }
    );
    res.send({ message: "کاربر از تیم با موفقیت حذف شد" });

}

const team_member_todos = async (req, res) => {
    try {
        const workspase = await WorkSapase.findById(req.body.workspase_id);
        const fintTodo = workspase.team_member.find(item => item._id == req.body.user_id)

        let indexTodo = workspase.team_member.indexOf(fintTodo)

        workspase.team_member[indexTodo].todos.unshift({
            text: req.body.text,
            completed: req.body.completed,
            timeStart: req.body.timeStart,
            timeEnd: req.body.timeEnd,
        });

        await workspase.save();
        res.json({
            message: "لیست روزانه جدید با موفیقیت اضافه شد",
        });
    } catch (e) {
        console.log(e)
        res.send({ message: "خطا در ارسال" });
    }
}

const del_team_member_todos = async (req, res) => {
    try {

        const updateWorkspase = await WorkSapase.update(
            { _id: req.body.workspase_id, "team_member._id": req.body.user_id },
            { $pull: { "team_member.$.todos": { _id: req.params.todosId } } },
            { multi: true }
        );
        res.send({ message: "لیست کار مورد نظر با موفقیت حذف شد" });

    } catch (e) {
        console.log(e)
        res.send({ message: "خطا در ارسال" });
    }
}

const put_team_member_todos = async (req, res) => {
    try {

        const workspase = await WorkSapase.findById(req.body.workspase_id);
        const findUser = workspase.team_member.find(item => item._id == req.body.user_id)

        const findTodoIndex = findUser.todos.indexOf(findUser.todos.find(item => item._id == req.params.todosId));

        function updateArry(array, index, newValue) {
            array[index] = newValue;
            return array
        }


        const updateWorkspase = await WorkSapase.update(
            { _id: req.body.workspase_id, "team_member._id": req.body.user_id },
            {
                $set: {
                    'team_member.$.todos': updateArry(findUser.todos, findTodoIndex, {
                        _id: req.params.todosId,
                        text: req.body.text,
                        completed: req.body.completed,
                        timeStart: req.body.timeStart,
                        timeEnd: req.body.timeEnd
                    })
                }
            }
        );
        res.send({ message: "لیست کار مورد نظر با موفقیت بروز رسانی شد" });

    } catch (e) {
        console.log(e)
        res.send({ message: "خطا در ارسال" });
    }
}

exports.getAllWork = getAllWork //
exports.get_workspase = get_workspase //

exports.get_User = get_User

exports.getSingleWork = getSingleWork //
exports.postWork = postWork //

exports.get_todos = get_todos
exports.team_member = team_member
exports.team_member_todos = team_member_todos

exports.deleteWork = deleteWork //

exports.delete_team = delete_team
exports.del_team_member_todos = del_team_member_todos
exports.put_team_member_todos = put_team_member_todos