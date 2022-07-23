const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    userid: { type: Number, required: true },
    base64Image: { type: String, required: true }
});

module.exports = mongoose.model("Task", uploadSchema);