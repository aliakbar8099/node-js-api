const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    userid: { type: String },
    title: { type: String, required: true },
    isForWorksapce: Boolean,
    color: { type: String, required: true },
    progess: { type: Number, default: 0 }
});

module.exports = mongoose.model("Task", TaskSchema);