// Filename : user.js
const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Tasks = require("../../models/tasks");

router.post(
  "/signup",
  [
    check("fullname", "نام کامل وارد کنید")
      .not()
      .isEmpty(),
    check("username", "نام کاربری را وارد کنید")
      .not()
      .isEmpty(),
    check("email", "ایمیل خود را وارد کنید").isEmail(),
    check("password", "پسورد خود را درست وارد کنید").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { username, email, password, fullname } = req.body;
    try {
      let id = (await User.find().exec()).length + 1
      let user = await User.findOne({
        email
      });

      if (user) {
        return res.status(400).json({
          msg: "ایمیل در سیستم وجود دارد"
        });
      }

      user = new User({
        userid: id,
        fullname: fullname,
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600 * 6
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.status(400).json({
          message: "کاربر وجود دارد!",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600 * 6
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      data: user
    });
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }

});

router.get('/todos/:task_id', auth, async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.task_id);
    const user = await User.findById(req.user.id).select('todos');
    const filterTodobyUser = user.todos.filter(item => item.task_id == req.params.task_id)

    res.json({
      task_title:task.title,
      color:task.color,
      isForWorksapce:task.isForWorksapce,
      progess:task.progess,
      todos: filterTodobyUser
    });
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }

});

router.post('/todos', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!req.body.task_id) {
      return res.status(400).send({ message: "Task_id وارد کن" })
    }

    user.todos.unshift({
      id: user.todos.length + 1,
      task_id: req.body.task_id,
      text: req.body.text,
      completed: req.body.completed,
      timeStart: req.body.timeStart,
      timeEnd: req.body.timeEnd,
      pointTime: req.body.pointTime
    });

    await user.save();
    res.json({
      message: "کار جدید با موفقیت ثبت شد"
    });
  } catch (e) {

    res.send({ message: "خطا در ارسال" });
  }
});

router.delete('/todos/:todosId', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('todos');

  const isUser = user.todos.filter(item => item.id == req.params.todosId)
  if (isUser.length === 0) {
    return res.status(400).json({ message: "این کار وجود ندارد" })
  }

  const updatedUser = await User.update(
    { _id: req.user.id },
    { $pull: { todos: { id: req.params.todosId } } },
    { multi: true }
  );
  res.send({ message: "کار مورد نظر با موفقیت حذف شد" });
});


router.put('/todos/:todosId', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const findTodoIndex = user.todos.indexOf(await user.todos.find(item => item.id == req.params.todosId));

  function updateArry(array, index, newValue) {
    array[index] = newValue;
    return array
  }

  const newUser = await User.update(
    { _id: req.user.id },
    {
      $set: {
        todos: updateArry(user.todos, findTodoIndex, {
          id: req.params.todosId,
          task_id: req.body.task_id,
          text: req.body.text,
          completed: req.body.completed,
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          pointTime: req.body.pointTime
        })
      },
    },
  );
  res.send({ message: "کار مورد نظر ابدیت شد" })
});



module.exports = router;