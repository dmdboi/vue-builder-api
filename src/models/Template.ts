const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/** Components */
const Template = new Schema({
  id: String,
  ref: String,
  name: String,
  content: Array,
  data: Object,

  // Slot to insert the page content into
  placeholder: String,
});

export default mongoose.model("Template", Template);
