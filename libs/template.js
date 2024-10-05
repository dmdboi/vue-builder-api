const { JSONToHTML } = require("html-to-json-parser");
const Content = require("../models/Content");
const ejs = require("ejs");

const getComponentsInTemplate = async data => {
  const componentRefs = data.content[0].content.filter(c => c.type === "component");

  const components = await Content.find({
    type: "component",
    ref: { $in: componentRefs.map(c => c.ref) },
  });

  // Check if each component exists
  const missingComponents = componentRefs.filter(c => !components.find(comp => comp.ref === c.ref));

  if (missingComponents.length > 0) {
    return { message: "Error", error: "Component not found", components: missingComponents };
  }

  return { message: "Success", components };
};

const replaceComponentRefs = async (data, components) => {
  // Replace the component refs with the actual component data in page.content
  data.content[0].content = await Promise.all(
    data.content[0].content.map(c => {
      if (c.type === "component") {
        const component = components.find(comp => comp.ref === c.ref);

        return component.content[0];
      }

      return c;
    })
  );

  return data;
};

const renderPageHTML = async data => {
  // Turn the page content into HTML
  const tempHTML = await JSONToHTML(data.content[0]);

  // Replace template variables with actual data
  const template = ejs.compile(tempHTML);
  return template(data.data);
};

module.exports = {
  getComponentsInTemplate,
  replaceComponentRefs,
  renderPageHTML,
};
