const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workSapaseSchema = new Schema({
    id: { type: Number , required : true},
    userCreate_id: { type: Number , required : true},
    userCreate_name:{ type : String , required : true},
    name: { type : String , required: true},
    color: { type : String , required: true},
    team_member:[]
});

module.exports = mongoose.model("workspase", workSapaseSchema);
