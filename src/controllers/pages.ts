import { Request, Response } from "express";

import Content from "../models/Content";
import { getComponentsInTemplate, replaceComponentRefs, renderPageHTML } from "../libs/template";

const getPageByRef = async (req: Request, res: Response) => {
  const ref = req.params.ref;

  // Find the content in MongoDB
  let data = await Content.findOne({ type: "page", ref: ref });

  const components = await getComponentsInTemplate(data);

  if (components.message === "Error") {
    res.status(404).json(components);
  }

  data = await replaceComponentRefs(data, components.components);

  // Turn the page content into HTML
  const html = await renderPageHTML(data);

  res.status(200).json({
    message: "Success",
    data,
    html,
  });
};

const getPageHTMLByRef = async (req: Request, res: Response) => {
  const ref = req.params.ref;

  // Find the content in MongoDB
  let data = await Content.findOne({ type: "page", ref: ref });

  const components = await getComponentsInTemplate(data);

  if (components.message === "Error") {
    res.status(404).json(components);
  }

  data = await replaceComponentRefs(data, components.components);

  // Turn the page content into HTML
  const html = await renderPageHTML(data);

  res.status(200).send(html);
};

export { getPageByRef, getPageHTMLByRef };
