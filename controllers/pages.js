const Content = require("../models/Content");
const { getComponentsInTemplate, replaceComponentRefs, renderPageHTML } = require("../libs/template");

const getPageByRef = async (req, res) => {
  const ref = req.params.ref;

  // Find the content in MongoDB
  let data = await Content.findOne({ type: "page", ref: ref });

  const components = await getComponentsInTemplate(data);

  if (components.message === "Error") {
    return res.status(404).json(components);
  }

  data = await replaceComponentRefs(data, components.components);

  // Turn the page content into HTML
  const html = await renderPageHTML(data);

  return res.status(200).json({
    message: "Success",
    data,
    html,
  });
};

const getPageHTMLByRef = async (req, res) => {
  const ref = req.params.ref;

  // Find the content in MongoDB
  let data = await Content.findOne({ type: "page", ref: ref });

  const components = await getComponentsInTemplate(data);

  if (components.message === "Error") {
    return res.status(404).json(components);
  }

  data = await replaceComponentRefs(data, components.components);

  // Turn the page content into HTML
  const html = await renderPageHTML(data);

  console.log(html);

  return res.status(200).send(html);
};

module.exports = {
  getPageByRef,
  getPageHTMLByRef,
};
