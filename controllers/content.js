const ULID = require("ulid");
const Content = require("../models/Content");

const getContent = async (req, res) => {
  const type = req.params.type;

  // Find all content in MongoDB
  const data = await Content.find({ type: type });

  return res.status(200).json({ message: "Success", data });
};

const postContent = async (req, res) => {
  const { name, content, type } = req.body;

  // Turn incoming data into HTML
  const html = await JSONToHTML(content);

  const data = {
    type: type,
    id: ULID.ulid(),
    ref: name.toLowerCase().replace(" ", "-"),
    name: name,
    content: content,
    html: html,
  };

  // Save the HTML to MongoDB
  await Content.create(data);

  return res.status(200).json({ message: "Success", html });
};

module.exports = {
  getContent,
  postContent,
};
