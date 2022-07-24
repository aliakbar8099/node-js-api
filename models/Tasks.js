const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: { type: Number, required: true },
    color: { type: String, required: true },
    progess: { type: Number, default: 0 }
});

module.exports = mongoose.model("Task", TaskSchema);