import { Request, Response } from "express";

import Content from "../../models/Content";
import { renderPageHTML } from "../../libs/template";

async function get(req: Request, res: Response) {
  const { id } = req.params;

  // Find the content in MongoDB
  let data = await Content.findOne({ type: "template", id: id });

  res.status(200).json({
    message: "Success",
    data,
  });
}

async function getHTML(req: Request, res: Response) {
  const { id } = req.params;

  // Find the content in MongoDB
  let data = await Content.findOne({ type: "page", id: id });

  // Turn the page content into HTML
  const html = await renderPageHTML(data);

  res.status(200).send(html);
}

export { get, getHTML };
