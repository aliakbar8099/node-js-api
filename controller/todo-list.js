// const User = require("../models/User");


const getAllTodos = async (req, res) => {
    const user = await User.findById(req.user.id).select("todos");

    res.json({
        message: "لیست کارها",
        todos: user.todos
    });
}

exports.getAllTodos = getAllTodos;