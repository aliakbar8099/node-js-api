const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workSapaseSchema = new Schema({
    id: { type: Number, required: true },
    userCreate_id: { type: Number, required: true },
    userCreate_name: { type: String, required: true },
    name: { type: String, required: true },
    // destination: { type: String, required: true },
    color: { type: String, required: true },
    team_member: [new Schema({
        userid: { type: Number, required: true },
        owner: { type: Boolean, default: false },
        username: {
            type: String,
            required: true
        },
        todos: [new Schema({
            text: String,
            completed: Boolean,
            timeStart: {
                type: Date,
                default: Date.now()
            },
            timeEnd: {
                type: String,
                default: Date.now()
            }
        })]
    })]
});

module.exports = mongoose.model("workspase", workSapaseSchema);
