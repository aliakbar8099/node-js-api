// Filename : user.js
const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/user");

router.post(
  "/signup",
  [
    check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
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

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      user = new User({
        username,
        email,
        password
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
          expiresIn: 10000
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      console.log(err.message);
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
          message: "User Not Exist"
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
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      console.error(e);
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

router.get('/todos', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('todos');
    res.json({
      message: "لیست کارها",
      todos: user.todos
    });
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }

});

router.post('/todos', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    // const todos = new User({
    //   todos: req.body.todos
    // });

    user.todos.unshift({
      id: user.todos.length + 1,
      text: req.body.text,
      completed: req.body.completed,
      timeStart: req.body.timeStart,
      timeEnd: req.body.timeEnd,
    });

    await user.save();
    res.json({
      message: "کار جدید با موفقیت ثبت شد",
      todos: user.todos
    });
  } catch (e) {
    console.log(e)
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
    {},
    { $pull: { todos: { id: req.params.todosId } } },
    { multi: true }
  );
  res.send({ message: "کار مورد نظر با موفقیت حذف شد" });
});


router.put('/todos/:todosId', auth, async (req, res) => {
  const newUser = await User.updateOne(
    {todos :[{id: req.params.todosId}]},
    {
      $set: { todos: {
        text: req.body.text,
        completed: req.body.completed,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
      }},
    },
    {
      upsert: true,
      runValidators: true
    }
  );
  res.send({ message: "کار مورد ن"})
});



module.exports = router;