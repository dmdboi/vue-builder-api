import { Request, Response } from "express";

import Content from "../../models/Content";
import Page from "../../models/Page";

import { getComponentsInTemplate, renderPageHTML, replaceComponentRefs } from "../../libs/template";

async function get(req: Request, res: Response) {
  const { id } = req.params;

  // Find the content in MongoDB
  let page = await Page.findOne({ id: id });

  const components = await getComponentsInTemplate(page);

  if (components.message === "Error") {
    res.status(404).json(components);
  }

  page = await replaceComponentRefs(page, components.components);

  // If the page has a template, get the template data
  if (page.template) {
    let template = await Content.findOne({ type: "template", ref: page.ref });

    // Get the components in the template
    const templateComponents = await getComponentsInTemplate(template);

    if (templateComponents.message === "Error") {
      res.status(404).json(templateComponents);
    }

    // Replace the component refs with the actual component data in template.content
    template = await replaceComponentRefs(template, templateComponents.components);

    // Merge the page data with the template data
    const mergedTemplate = template.content[0].map((block: any) => {
      if (block.placeholder && block.placeholder === page.slot) {
        block.content = page.content;
        delete (block as any).placeholder;
      }

      return block;
    });

    page.content = mergedTemplate;
  }

  res.status(200).json({
    message: "Success",
    data: page,
  });
}

async function getHTML(req: Request, res: Response) {
  const { id } = req.params;

  // Find the content in MongoDB
  let data = await Content.findOne({ type: "page", id: id });

  const components = await getComponentsInTemplate(data);

  if (components.message === "Error") {
    res.status(404).json(components);
  }

  data = await replaceComponentRefs(data, components.components);

  // Turn the page content into HTML
  const html = await renderPageHTML(data);

  res.status(200).send(html);
}

export { get, getHTML };
