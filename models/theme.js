const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ThemeSchema = new Schema({
    userid: { type: Number },
    base64Image: { type: String, required: true }
});

module.exports = mongoose.model("upload", uploadSchema);