const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userid: { type: Number, required: true },
  username: {
    type: String,
    required: true
  },
  fullname: { type: String, required: true },
  email: {
    type: String,
    required: true
  },
  roles: { type: String, default: "member" },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  workspase_list_id : [new Schema({
    id: Number,
  }, { _id: false })],
  todos: [new Schema({
    id: Number,
    task_id:{ type : String },
    text: String,
    completed: Boolean,
    timeStart: {
      type: Date,
      default: Date.now()
    },
    timeEnd: {
      type: String,
      default: Date.now()
    },
    pointTime: { type: String , default: null}
  }, { _id: false })]
});

module.exports = mongoose.model("users", UserSchema);