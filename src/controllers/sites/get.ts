import { Request, Response } from "express";
import Site from "../../models/site";
import htmlTemplate from "../../libs/html";

async function get(req: Request, res: Response) {
  const { id } = req.params;

  // Find all content in MongoDB
  const data = await Site.findOne({ id: id });

  res.status(200).json({ message: "Success", data });
}

async function getHTML(req: Request, res: Response) {
  const { id } = req.params;

  // Find all content in MongoDB
  const data = await Site.findOne({ id: id });
  const html = htmlTemplate(data.name, "This is a body", data.meta);

  res.status(200).send(html);
}

export { get, getHTML };
