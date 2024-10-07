const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Content = new Schema({
  type: String,
  id: String,
  ref: String,
  name: String,
  content: Array,
  html: String,
  data: Object,
});

export default mongoose.model("Content", Content);
