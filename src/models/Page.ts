const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/** Pages */
const Page = new Schema({
  // ID
  id: String,

  // Type
  name: String,

  // Slugified name
  ref: String,

  // Content array
  content: Array,

  // Data to populate the page with
  data: Object,

  // Meta data
  meta: Object,

  // Template ID
  template: String,

  // Slot to insert the page content into
  slot: String,
});

export default mongoose.model("Page", Page);
