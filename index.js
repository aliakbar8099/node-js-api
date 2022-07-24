const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var cors = require('cors');
const authSignupRouter = require('./routes/auth/User');
const addProductRouter = require('./routes/admin/add-product');
const shopPageRouter = require('./routes/shop/index');
const todoRouter = require('./routes/todolist/todo');
const isLogin = require("./routes/isLoging")
const workspaseRouter = require("./routes/workspase/workspase");
const uploadProfileRouter = require('./routes/upload/profile')
const Upload = require("./models/upload")
const UploadModel = require("./models/upload")
const UserModel = require("./models/User")


const app = express();

app.use(express.static('public'))

// Middleware
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use("/admin", addProductRouter);

app.use("/user", authSignupRouter);

app.use('/work', workspaseRouter)

app.use('/upload', express.json({ limit: '0.1MB' }), uploadProfileRouter)

app.get('/list/:id', async (req, res) => {
    const listUpload = await Upload.find().exec();
    const find = listUpload.find(item => item.userid == req.params.id)

    console.log(find)

    res.send({ data: find });
})

app.post('/list/:id', async (req, res) => {
    const { profile } = req.body
    const listUpload = await UploadModel.find().exec();

    let upload_userId = listUpload.find(item => item.userid == req.params.id)

    if (!upload_userId) {
        const upload = new UploadModel({
            userid: req.params.id,
            base64Image: profile
        })
        await upload.save();

        return res.status(201).send({ message: " عکس پروفایل با موفقیت قرار گرفت " })
    }

    const findUpload = await UploadModel.findOne(upload_userId._id);


    const uploadUpdate = await UploadModel.update(
        { userid: req.params.id },
        { $set: { base64Image: profile } },
        { multi: true }
    );
    res.status(200).send({ message: "عکس پروفایل ابدیت شد" })

})

app.use('/', isLogin);

app.use((req, res, next) => {
    res.status(404).send('<h1>404 - Not Found</h1>');
    next();
});

app.listen(5000, () => {
    console.log('server run port 5000 ...');
})

// mongoose.connect(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     authSource: "admin",
// })

// mongoose.connect('mongodb://localhost:27017/todos')
// Declare a variable named option and assign optional settings

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect('mongodb+srv://aliakbar80:aamfh1380@cluster0.ejvs5.mongodb.net/?retryWrites=true&w=majority', options)

mongoose.connection.on('open', () => {
    console.log('Datebase connected...');
})

