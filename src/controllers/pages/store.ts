import { Request, Response } from "express";
import ULID from "ulid";
import Page from "../../models/Page";

async function store(req: Request, res: Response) {
  // Check that type is set to "page"
  if (req.body.type !== "page") {
    res.status(400).json({
      message: "Error",
      data: "Type must be set to 'page'",
    });
  }

  // Build component content
  const component = {
    id: ULID.ulid(),
    ...req.body,
  };

  // Save page to MongoDB
  await Page.create(component);

  res.status(200).json({
    message: "Success",
    data: component,
  });
}

async function update(req: Request, res: Response) {
  const { id } = req.params;

  // Find the page by ID
  const page = await Page.findOne({ id: id });

  if (!page) {
    res.status(404).json({
      message: "Error",
      error: "Page not found",
    });
  }

  // Update the page in MongoDB
  await Page.updateOne({ id: id }, req.body);

  res.status(200).json({
    message: "Success",
    data: req.body,
  });
}

export { store, update };
