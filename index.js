const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const authSignupRouter = require('./routes/auth/singup');
const addProductRouter = require('./routes/admin/add-product');
const shopPageRouter = require('./routes/shop/index');
const todoRouter = require('./routes/todolist/todo');

const app = express();

// Middleware
app.use(bodyParser.json());

app.use(express.json());

app.use("/admin", addProductRouter);


app.use("/user", authSignupRouter);

app.use('/' , shopPageRouter);

app.use((req, res, next) => {
    res.status(404).send('<h1>404 - Not Found</h1>');
    next();
});

mongoose
    .connect('mongodb://localhost:27017/shop')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
