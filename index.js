const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var cors = require('cors');
const authSignupRouter = require('./routes/auth/singup');
const addProductRouter = require('./routes/admin/add-product');
const shopPageRouter = require('./routes/shop/index');
const todoRouter = require('./routes/todolist/todo');
const workspaseRouter = require("./routes/workspase/workspase");
const uploadProfileRouter = require('./routes/upload/profile')


const app = express();

app.use(express.static('images'))

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.use("/admin", addProductRouter);

app.use("/user", authSignupRouter);

app.use('/work', workspaseRouter)

app.use('/upload', uploadProfileRouter)

app.use('/', shopPageRouter);

app.use((req, res, next) => {
    res.status(404).send('<h1>404 - Not Found</h1>');
    next();
});

app.listen(5000, () => {
    console.log('server run port 5000 ...');
})

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
})

// mongoose.connect('mongodb://localhost:27017/todos')

mongoose.connection.on('open', () => {
    console.log('Datebase connected...');
})

