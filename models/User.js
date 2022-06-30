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
  todos: [new Schema({
    id: Number,
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
  }, { _id: false })]
});

module.exports = mongoose.model("users", UserSchema);