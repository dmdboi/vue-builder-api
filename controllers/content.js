const ULID = require("ulid");
const { JSONToHTML } = require("html-to-json-parser");
const Content = require("../models/Content");

const listContent = async (req, res) => {
  const type = req.params.type;

  // Find all content in MongoDB
  const data = await Content.find({ type: type });

  return res.status(200).json({ message: "Success", data });
};

const getContent = async (req, res) => {
  const type = req.params.type;
  const ref = req.params.ref;

  // Find all content in MongoDB
  const data = await Content.find({ type: type, ref: ref });

  return res.status(200).json({ message: "Success", data });
};

const getContentHTML = async (req, res) => {
  const type = req.params.type;
  const ref = req.params.ref;

  // Find all content in MongoDB
  const data = await Content.findOne({ type: type, ref: ref });
  const html = await JSONToHTML(data.content[0]);

  return res.status(200).send(html);
};

const postContent = async (req, res) => {
  const { name, content, type, data } = req.body;

  let componentData = {
    type: type,
    id: ULID.ulid(),
    ref: name.toLowerCase().replace(" ", "-"),
    name: name,
    content: content,
    data: data,
  };

  // Check for any "repeatable" content
  const repeatableContent = content.content.filter(c => c.repeatable);
  let newRepeatableContent = [];

  // If there is repeatable content, generate new content for each item from "data" field
  if (repeatableContent.length > 0) {
    repeatableContent.forEach(c => {
      // Get the repeatable data from componentData
      const repeatableData = componentData.data[c.repeatable];

      // For each repeatable item, generate new LI content
      repeatableData.forEach(d => {
        // Ensure content and content[0] exist before proceeding
        const baseElement = c;
        const anchorElement = c.content[0];

        if (!anchorElement || !anchorElement.attributes || !anchorElement.attributes.href) {
          console.error("The anchor element or its href attribute is missing.");
          return; // Skip this element if we can't find the href
        }

        // Clone the repeatable element and replace the placeholders
        const newElement = {
          ...baseElement, // clone the original LI template
          content: [
            {
              ...anchorElement, // clone the anchor tag template
              content: [d.name], // Replace the anchor text
              attributes: {
                ...anchorElement.attributes,
                href: anchorElement.attributes.href.replace(":item", d.slug), // Replace the href with the correct slug
              },
            },
          ],
        };

        // Push the new element into the content array
        newRepeatableContent.push(newElement);
      });
    });
  }

  // Replace the repeatable content in the component data
  componentData.content.content = newRepeatableContent;

  // Turn the JSON into HTML
  const html = await JSONToHTML(componentData.content);

  componentData.html = html;

  // // Save the HTML to MongoDB
  // await Content.create(componentData);

  return res.status(200).json({ message: "Success", componentData });
};

module.exports = {
  listContent,
  getContent,
  getContentHTML,
  postContent,
};
