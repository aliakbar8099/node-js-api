const express = require('express');
const auth = require('../../middleware/auth');
const Todo = require('../../controller/todo-list');

const router = express.Router();

const path = 'todolist'

router.get(path , auth , Todo.getAllTodos);

module.exports = router;