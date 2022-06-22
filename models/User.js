const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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
  todos: [ new Schema( {
      id: Number,
      text: String,
      completed: Boolean,
      timeStart: {
        type: Date,
        default: Date.now()
      },
      timeEnd:{
        type: String,
        default: Date.now()
      }
  }, { _id : false })]
});

module.exports = mongoose.model("users", UserSchema);